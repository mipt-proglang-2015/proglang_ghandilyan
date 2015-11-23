package controllers

import (
	"io/ioutil"
	"time"

	"github.com/astaxie/beego"
	"github.com/gorilla/websocket"
)

const (
	writeWait = 10 * time.Second
	readWait = 60 * time.Second
	pingPeriod = (readWait * 9) / 10
	maxMessageSize = 512
)

func init() {
	go h.run()
}

type connection struct {
	ws *websocket.Conn
	send chan []byte
}

func (c *connection) readPump() {
	defer func() {
		h.unregister <- c
		c.ws.Close()
	}()
	c.ws.SetReadLimit(maxMessageSize)
	c.ws.SetReadDeadline(time.Now().Add(readWait))
	for {
		op, r, err := c.ws.NextReader()
		if err != nil {
			break
		}
		switch op {
		case websocket.PongMessage:
			c.ws.SetReadDeadline(time.Now().Add(readWait))
		case websocket.TextMessage:
			message, err := ioutil.ReadAll(r)
			if err != nil {
				break
			}			
			if err != nil {
				break
			}
			h.broadcast <- []byte(string(message))
		}
	}
}

func (c *connection) write(opCode int, payload []byte) error {
	c.ws.SetWriteDeadline(time.Now().Add(writeWait))
	return c.ws.WriteMessage(opCode, payload)
}

func (c *connection) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.ws.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				c.write(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.write(websocket.TextMessage, message); err != nil {
				return
			}
		case <-ticker.C:
			if err := c.write(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}

type hub struct {
	connections map[*connection]bool
	broadcast chan []byte
	register chan *connection
	unregister chan *connection
}

var h = &hub{
	broadcast:   make(chan []byte, maxMessageSize),
	register:    make(chan *connection, 1),
	unregister:  make(chan *connection, 1),
	connections: make(map[*connection]bool),
}

func (h *hub) run() {
	for {
		select {
		case c := <-h.register:
			h.connections[c] = true
		case c := <-h.unregister:
			delete(h.connections, c)
			close(c.send)
		case m := <-h.broadcast:
			for c := range h.connections {
				select {
				case c.send <- m:
					// OK, message sent
				default:
					close(c.send)
					delete(h.connections, c)
				}
			}
		}
	}
}

type WSController struct {
	beego.Controller
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
}

func (w *WSController) Get() {
	ws, err := upgrader.Upgrade(w.Ctx.ResponseWriter, w.Ctx.Request, nil)	
	if err != nil {
		return
	}
	c := &connection{send: make(chan []byte, 1024), ws: ws}
	h.register <- c
	go c.writePump()
	c.readPump()
}
