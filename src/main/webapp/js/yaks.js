var yaksApp = angular.module('yaks',['boards']);

yaksApp.controller('MainController', ['$scope', 'Boards', '$window', function($scope, Boards, $window) {
	$scope.boards = Boards.list();
	$scope.selectedBoard = $scope.boards[0];
}]);

yaksApp.directive('ykBoard', ['$window', 'Boards', function($window, Boards) {
	return {
		restrict: 'E',
		templateUrl: 'templates/board-template.html',
		scope: {
			board: '=board'
		},

		controller: ['$scope', 'Boards', '$window', function($scope, Boards, $window) {
			$scope.showEditCard = false;
			$scope.newCardName = "";
			$scope.newCardText = "";

			function editCard(laneIndex, cardIndex) {
				$scope.selectedLane = $scope.board.lanes[laneIndex];
				$scope.selectedCard = $scope.selectedLane.cards[cardIndex];
				$scope.selectedIndex = cardIndex;
				$scope.showEditCard = true;
			}

			this.editCard = editCard;

			this.moveCard = function(toLaneIndex) {
				Boards.moveCard($scope.board, $scope.dragOrigin.laneIndex, toLaneIndex, $scope.dragOrigin.cardIndex);
			}

			this.setDraggedCard = function(laneIndex, cardIndex) {
				$scope.dragOrigin = {
					laneIndex: laneIndex,
					cardIndex: cardIndex
				};
			}

			$scope.addCard = function(laneIndex) {
				$scope.selectedCard = {name: '', description: ''};
				var lane = $scope.board.lanes[laneIndex];
				lane.cards.push($scope.selectedCard);
				editCard(laneIndex, lane.cards.length - 1);
			}

			$scope.saveCard = function() {
				if($scope.selectedCard.name == null || $scope.selectedCard.name.trim().length == 0 || $scope.selectedCard.description == null || $scope.selectedCard.description.trim().length == 0) {
					$window.alert("Please inform the card name and a starting text before proceeding.");
					return;
				}

				$scope.selectedCard = null;
				$scope.showEditCard = false;
				$scope.editCardForm.$setPristine(true);
				$scope.editCardForm.$setUntouched(true);
			}

			$scope.deleteSelectedCard = function() {
				if($window.confirm('Are you sure you want to remove this card?')) {
					$scope.selectedLane.cards.splice($scope.selectedIndex, 1);
					$scope.showEditCard = false;
				}
			}
		}]
	}
}]);

yaksApp.directive('ykCardDropTarget', [function() {
	return {
		restrict: 'A',
		scope: {
			toLaneIndex: "=laneIndex"
		},
		transclude: true,
		require: '^ykBoard',
		link: function(scope, element, attrs, ykBoard) {
			element.on('dragover', function(event) {
				event.preventDefault();
			});
			element.on('drop', function(event) {
				scope.$apply(function() {
					ykBoard.moveCard(scope.toLaneIndex);
				});
			});
		},

	}
}]);

yaksApp.directive('ykCard', [function(){
	return {
		restrict: 'E',
		templateUrl: 'templates/card-template.html',
		require: '^ykBoard',
		scope: {
			card: '=card',
			cardIndex: '=cardIndex',
			laneIndex: '=laneIndex'
		},

		link: function(scope, element, attrs, ykBoard) {
			scope.edit = function() {
				ykBoard.editCard(scope.laneIndex, scope.cardIndex);
			}

			element.on('drag', function(event) {
				ykBoard.setDraggedCard(scope.laneIndex, scope.cardIndex);
			});
		}
	}
}]);

yaksApp.directive('editInPlace', function() {
	return {
			restrict: 'E',
			scope: {
				value: "="
			},
			template: '<span ng-bind="value" title="Double click to edit" ng-dblclick="edit()"></span><input type="text" ng-model="value"></input>',
			link: function($scope, element, attrs) {
				var spanElement = angular.element(element.children()[0]);
				var inputElement = angular.element(element.children()[1]);
				inputElement.css("display", "none");
				inputElement.css({
					borderRadius: "15px",
					height: "30px",
					fontSize: "1.1rem",
					verticalAlign: "middle",
					padding: "2px 10px",
					zIndex: "10"
				});

				$scope.edit = function() {
					inputElement.css("display", "inline-block");
					spanElement.css("display", "none");
					inputElement[0].focus();
				}

				inputElement.on('blur', function(e) {
					if(inputElement.val().trim() == '') {
						inputElement.css("border-color", "red");
						inputElement[0].focus();
					} else {
						inputElement.css("display", "none");
						spanElement.css("display", "inline-block");
					}
				});
			}
	}
});
