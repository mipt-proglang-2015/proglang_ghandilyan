function Game() {
	var self = this;

	self.firstUser;
	self.secondUser;
	self.n = 5;
	self.w = 15;
	self.h = 15;
	self.matrix = createMatrix(self.w, self.h);
	self.activeMode = false;
	

	self.setFirstUser = setFirstUser;
	self.getFirstUser = getFirstUser;
	self.setSecondUser = setSecondUser;
	self.getSecondUser = getSecondUser;
	self.isWaitSecondGamer = isWaitSecondGamer;
	self.setActiveMode = setActiveMode;
	self.addX = addX;
	self.addO = addO;
	self.clearMatrix = clearMatrix;


	function createMatrix(width, height) {
		var array= [];
		var matrix = $('#game-matrix');
		var column, cell, id;

		for(var i = 0; i < width; i++) {
			column = $('<div class="column"></div>');
			array.push([]);
			matrix.append(column);
			for(var j = 0; j < height; j++) {
				id = 'cell-' + i + '' + j;
				cell = $('<div class="cell" id="' + id + '" i="' + i + '" j="' + j + '"></div>');

				cell.click(function() {
					if(!isWaitSecondGamer() && self.activeMode) {
						var cell = $(this);
						var id = cell.attr('id');
						var i = Number(cell.attr('i'));
						var j = Number(cell.attr('j'));
						self.addX(id, i, j);
					} else {
						alert('Wait second player');
					}					
				});

				array[i].push(0);
				column.append(cell);	
			}
		}

		return array;
	}

	function setActiveMode(mode) {
		self.activeMode = mode;
	}

	function setFirstUser(user) {
		self.firstUser = user;
	}

	function getFirstUser(user) {
		return self.firstUser;
	}

	function setSecondUser(user) {
		self.secondUser = user;
	}

	function getSecondUser(user) {
		return self.secondUser;
	}

	function addX(id, i, j) {
		$('#' + id).addClass('green');
		self.matrix[i][j] = 1;
		synch(id, i, j);
		self.activeMode = false;

		if(check(i, j, 1)) {
			$('#message').text('Вы выиграли.');
			$('#start-again').removeClass('hidden');
		} else {	
			$('#message').text('Ожидайте хода соперника.');
		}
	}

	function addO(id, i, j) {
		$('#' + id).addClass('red');
		self.matrix[i][j] = 2;
		
		if(check(i, j, 2)) {
			$('#message').text('Вы проиграли.');
			$('#start-again').removeClass('hidden');
		} else {
			self.activeMode = true;
			$('#message').text('Ваш ход.');
		}
	}

	function clearMatrix() {
		var cells = $('.cell');
		for(var i = 0; i < cells.length; i++) {
			cells[i].className = "cell";
		}
		$('#start-again').addClass('hidden');
		$('#message').text('Ожидайте согласия соперника.');
	}

	function isWaitSecondGamer() {
		return self.firstUser && !self.secondUser;
	}

	function synch(id, i, j) {
		var msg = {
			'type': MESSAGE.NEW_POINT,
			'from': self.firstUser.id,
			'to': self.secondUser.id,
			'id': id,
			'i': i,
			'j': j
		};

		send(msg);
	}

	function check(i, j, sign) {
		return checkHorizontal(i, j, sign) || checkVertical(i, j, sign) || checkDiagonal(i, j, sign);
	}

	function checkHorizontal(i, j, sign) {
		var start = j - (self.n - 1) > 0 ? j - (self.n - 1) : 0;
		var end = j + (self.n - 1) < self.w ? j + (self.n - 1) : (self.w - 1);

		var count = 0;
		for(var k = start; k <= end; k++) {
			if(self.matrix[i][k] == sign) {
				count++;
			} else {
				count = 0;
			}

			if(count == self.n) {
				return true;
			}
		}

		return false;
	}

	function checkVertical(i, j, sign) {
		var start = i - (self.n - 1) > 0 ? i - (self.n - 1) : 0;
		var end = i + (self.n - 1) < self.h ? i + (self.n - 1) : (self.h - 1);

		var count = 0;
		for(var k = start; k <= end; k++) {
			if(self.matrix[k][j] == sign) {
				count++;
			} else {
				count = 0;
			}

			if(count == self.n) {
				return true;
			}
		}

		return false;
	}

	function checkDiagonal(i, j, sign) {
		var startX = j - (self.n - 1) > 0 ? j - (self.n - 1) : 0;
		var endX = j + (self.n - 1) < self.w ? j + (self.n - 1) : (self.w - 1);

		var startY = i - (self.n - 1) > 0 ? i - (self.n - 1) : 0;
		var endY = i + (self.n - 1) < self.h ? i + (self.n - 1) : (self.h - 1);

		var count = 0;
		for(var k = startX, q = startY; k <= endX && q <= endY; k++, q++) {
			if(self.matrix[q][k] == sign) {
				count++;
			} else {
				count = 0;
			}

			if(count == self.n) {
				return true;
			}
		}

		var count = 0;
		for(var k = endX, q = startY; k >= startX && q <= endY; k--, q++) {
			if(self.matrix[q][k] == sign) {
				count++;
			} else {
				count = 0;
			}

			if(count == self.n) {
				return true;
			}
		}

		return false;
	}
}