package routers

import (
	"gowebapp/controllers"
	"github.com/astaxie/beego"
)

func init() {
	beego.SetStaticPath("/js", "static/js")
	beego.SetStaticPath("/css", "static/css")
	beego.SetStaticPath("/fonts", "static/fonts")
	beego.SetStaticPath("/img", "static/img")
    beego.Router("/", &controllers.MainController{})
	beego.Router("/ws", &controllers.WSController{})
}
