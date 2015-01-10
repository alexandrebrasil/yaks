var boardsModule = angular.module('boards', ['ngResource']);
boardsModule.factory('boards', ['$resource',
	function($resource) {
		return $resource('/boards/:boardId', {boardId: '@_id'}, {
			query: {method: 'GET', isArray:true},
			get: {method: 'GET', isArray: false},
			save: {method: 'PUT'},
			add: {method: 'POST'}
		});
	}
]);

boardsModule.service('Boards', ['boards', function(boards) {
	this.addBoard = function(board, callback) {
		boards.add(board, function(newBoard, responseHeaders) {
			callback(newBoard);
		});
	}

	this.moveCard = function(board, fromLaneIndex, toLaneIndex, cardIndex) {
		var card = board.lanes[fromLaneIndex].cards.splice(cardIndex, 1)[0];
		board.lanes[toLaneIndex].cards.push(card);
		this.saveBoard(board);
	}

	this.saveBoard = function(board) {
		boards.save(board);
	}

	this.addNewLane = function(board, newLaneName) {
		var lane = {
			name: newLaneName,
			cards: []
		};

		board.lanes.push(lane);
		this.saveBoard(board);
	}

	this.moveLane = function(board, fromIndex, toIndex) {
		var lane = board.lanes.splice(fromIndex, 1)[0];
		board.lanes.splice(toIndex, 0, lane);
		this.saveBoard(board);
	}
}])
