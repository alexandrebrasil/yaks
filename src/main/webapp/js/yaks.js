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
			this.dragOrigin = {
				laneIndex: -1,
				cardIndex: -1
			};

			$scope.showEditCard = false;
			$scope.showNewLaneForm = false;
			$scope.newLaneName = "";
			$scope.newCardName = "";
			$scope.newCardText = "";

			function editCard(laneIndex, cardIndex) {
				$scope.selectedLane = $scope.board.lanes[laneIndex];
				$scope.selectedCard = $scope.selectedLane.cards[cardIndex];
				$scope.selectedIndex = cardIndex;
				$scope.showEditCard = true;
			}

			$scope.newLane = function() {
				$scope.showNewLaneForm = true;
			}

			$scope.cancelNewLane = function() {
				$scope.showNewLaneForm = false;
				$scope.newLaneName = "";
			}

			$scope.addNewLane = function() {
				if($scope.newLaneName  == null || $scope.newLaneName.trim().length == 0) {
					$window.alert("Please inform the lane name before proceeding.");
					return;
				}

				Boards.addNewLane($scope.board, $scope.newLaneName);

				$scope.showNewLaneForm = false;
				$scope.newLaneName = "";
				$scope.editCardForm.$setPristine(true);
				$scope.editCardForm.$setUntouched(true);
			}

			this.editCard = editCard;

			this.moveCard = function(toLaneIndex) {
				Boards.moveCard($scope.board, this.dragOrigin.laneIndex, toLaneIndex, this.dragOrigin.cardIndex);
			}

			this.moveLane = function(toLaneIndex) {
				Boards.moveLane($scope.board, this.dragOrigin.laneIndex, toLaneIndex);
			}

			this.setDragOrigin = function(laneIndex, cardIndex) {
				this.dragOrigin.laneIndex = laneIndex;
				this.dragOrigin.cardIndex = cardIndex;
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

yaksApp.directive('ykLaneDragDrop', function() {
	return {
		restrict: 'A',
		scope: {
			laneIndex: "=laneIndex"
		},
		transclude: true,
		require: '^ykBoard',
		link: function(scope, element, attrs, ykBoard) {
			attrs.$set('draggable', true);
			element.on('dragover', function(event) {
				if(ykBoard.dragOrigin.cardIndex == -1 && ykBoard.dragOrigin.laneIndex != scope.laneIndex)
					event.preventDefault();
			});
			element.on('drop', function(event) {
				scope.$apply(function() {
					ykBoard.moveLane(scope.laneIndex);
				});
			});
			element.on('drag', function(event) {
				ykBoard.setDragOrigin(scope.laneIndex, -1);
			});
		},
	}
});

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
				if(ykBoard.dragOrigin.cardIndex >= 0)
					event.preventDefault();
			});
			element.on('drop', function(event) {
				scope.$apply(function() {
					ykBoard.moveCard(scope.toLaneIndex);
				});
			});
		}
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
				ykBoard.setDragOrigin(scope.laneIndex, scope.cardIndex);
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
