<!DOCTYPE html>

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">  
	<title>XO Game</title>
	<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css"/>
	<link rel="stylesheet" type="text/css" href="css/roboto.min.css"/>
	<link rel="stylesheet" type="text/css" href="css/material.min.css"/>
	<link rel="stylesheet" type="text/css" href="css/ripples.min.css"/>
	<link rel="stylesheet" type="text/css" href="css/game.css"/>
	<script type="text/javascript" src="js/jquery-2.1.4.min.js"></script>
	<script type="text/javascript" src="js/jQuery.stringify.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/ripples.min.js"></script>
	<script type="text/javascript" src="js/material.min.js"></script>
	<script type="text/javascript" src="js/game.js"></script>
	<script type="text/javascript" src="js/app.js"></script>
</head>	
<body> 
	
	<div class="navbar navbar-default navbar-fixed-top">
		<div class="container-fluid">
		    <div class="navbar-header">
				<span class="navbar-brand">Игра XO на WebSockets</span>
			</div>
		    <div class="collapse navbar-collapse">
		      <ul class="nav navbar-nav navbar-right">
		        <li class="hidden" id="app-link-leave"><a href="javascript:setUnloggedMode()">Выйти</a></li>
		      </ul>
		    </div>
	  	</div>
	</div>

	<div class="container" id="app-join-form" style="margin-top:4cm">
      <div class="form-signin">
        <label for="app-join-name" class="sr-only">Имя</label>
        <input type="text" id="app-join-name" class="form-control" placeholder="Имя" required="" autofocus="" autocomplete="off">
        <button class="btn btn-lg btn-primary btn-block" id="app-join-submit">Присоединиться к игре</button>
      </div>
    </div>

	<div class="container" style="margin-top:2cm;">
		<div id="game-message" class="hidden">
			Сообщение: 
			<span class="glyphicon glyphicon-arrow-right"></span>
			<span class="message" id="message">Ожидаем подключения второго игрока</span>
			<span class="message-start-again hidden" id="start-again">Играть ещё</span>
		</div>
		<div id="game-matrix" class="hidden"></div>
	</div>

	<script type="text/javascript">
	function openWSConnection() {
		window.ws_connection = new WebSocket("ws://{{.host}}/ws");
		window.ws_connection.onclose = function(event) {
			console.log("WS connection closed: " + event);
			openWSConnection();
		}
		window.ws_connection.onmessage = function(event) {
			recieve(event.data);
		}
	}
	$(document).ready(function() {
		game = new Game();
		openWSConnection();
	});
	</script>
</body>
</html>
