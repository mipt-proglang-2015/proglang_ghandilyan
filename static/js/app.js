var MESSAGE = {
	NEW_USER: 'new_user',
	START_GAME: 'start_game',
	NEW_POINT: 'new_point',
	NEW_GAME: 'new_game'
}

function setLoggedMode() {
	$("#app-join-form").addClass("hidden");
	$("#app-link-leave").removeClass("hidden");	
	$("#game-matrix").removeClass("hidden");
	$("#game-message").removeClass("hidden");
}

function setUnloggedMode() {
	$("#app-join-form").removeClass("hidden");
	$("#app-link-leave").addClass("hidden");	
	$("#game-matrix").addClass("hidden");
	$("#game-message").addClass("hidden");
}

function send(msg) {
	var packed = $.stringify(msg);
	window.ws_connection.send(packed);
}

function recieve(data) {
	console.log("Received: " + data);
	var msg = $.parseJSON(data);
	if (msg) {	
		switch(msg.type) {
			case MESSAGE.NEW_USER:
				if(game.isWaitSecondGamer() && game.getFirstUser().id != msg.user.id) {
					game.setSecondUser(msg.user);
					game.setActiveMode(true);
					$('#message').text('Внимание игрок ' + msg.user.name + ' подключился к игре. Ваш ход.');
					var msg = {
						'type': MESSAGE.START_GAME,
						'to': msg.user.id,
						'from': game.getFirstUser()
					};
					send(msg);
				}
				break;
			case MESSAGE.START_GAME:
				if(game.isWaitSecondGamer()) {
					if(game.getFirstUser().id == msg.to) {
						game.setSecondUser(msg.from);
						game.setActiveMode(false);
						$('#message').text('Вы играйте с игроком ' + msg.from.name + '. Ожидайте хода соперника.');
					}
				}
				break;
			case MESSAGE.NEW_POINT:
				if(msg.to == game.getFirstUser().id && msg.from == game.getSecondUser().id) {
					game.addO(msg.id, msg.i, msg.j);
				}
				break;
			case MESSAGE.NEW_GAME:
				if(msg.to.id == game.getFirstUser().id && msg.from.id == game.getSecondUser().id) {
					game.clearMatrix();
					game.setActiveMode(true);
					$('#message').text(msg.from.name + ' хочет играть ещё. Ваш ход.');
				}
		}

	}
}

function startGame() {
	setLoggedMode();
	var name = $("#app-join-name").val();

	var user = {
		id: createId(),
		name: name
	}
	
	game.setFirstUser(user);
	
	var msg = {
		'type': MESSAGE.NEW_USER,
		'user': user
	};

	send(msg);
}

function startAgain() {
	game.clearMatrix();
	var msg = {
		'type': MESSAGE.NEW_GAME,
		'from': game.getFirstUser(),
		'to': game.getSecondUser()
	};

	send(msg);
}

function createId() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 13);
}

$(document).ready(function() {
	"use strict";
	$.material.init();
	
	$("#app-join-submit").on("click", startGame);
	$('#start-again').on("click", startAgain);
});
