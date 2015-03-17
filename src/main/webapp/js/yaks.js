var yaksApp = angular.module('yaks',['boards', 'ngMaterial', 'ngSanitize']);

yaksApp.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.primaryPalette('indigo')
		.accentPalette('blue');
});

yaksApp.filter('lineBreaks', function() {
	return function(input) {
		return input.replace(/\n/g, '<br/>');
	}
})

yaksApp.value('dragOrigin', {cardIndex: -1, laneIndex: -1});

yaksApp.controller('MainController', ['$scope', 'Boards', '$window', '$mdDialog', 'dragOrigin', function($scope, Boards, $window, $mdDialog, dragOrigin) {
	function deleteSelectedCard() {
		$scope.selectedLane.cards.splice($scope.selectedIndex, 1);
		Boards.saveBoard($scope.selectedBoard);
	}

	$scope.moveCard = function(toLaneIndex) {
		Boards.moveCard($scope.selectedBoard, dragOrigin.laneIndex, toLaneIndex, dragOrigin.cardIndex);
	}

	$scope.moveLane = function(toLaneIndex) {
		Boards.moveLane($scope.selectedBoard, dragOrigin.laneIndex, toLaneIndex);
	}

	function saveCard() {
		if($scope.selectedCard.name == null || $scope.selectedCard.name.trim().length == 0
			|| $scope.selectedCard.description == null || $scope.selectedCard.description.trim().length == 0) {
				$window.alert("Please inform the card name and a starting text before proceeding.");
				return;
			}

			$scope.selectedCard = null;
			Boards.saveBoard($scope.selectedBoard);
		}

		$scope.boards = Boards.getBoards(function(boards){
		$scope.selectedBoard = boards[0];
	});

	$scope.createNewBoard = function() {
		var newBoard = {
			name: '<New board>',
			lanes: [{id: 1, name:'<New lane>'}]
		}

		Boards.addBoard(newBoard, function(board){
			$scope.boards.push(board);
			$scope.selectedBoard = $scope.boards[$scope.boards.length - 1];
		})
	}

	$scope.editCard = function(event, laneIndex, cardIndex) {
		$scope.selectedLane = $scope.selectedBoard.lanes[laneIndex];
		$scope.selectedCard = $scope.selectedLane.cards[cardIndex];
		$scope.selectedIndex = cardIndex;

		$mdDialog.show({
			targetEvent: event,
			templateUrl: 'templates/card-dialog-template.html',
			clickOutsideToClose: false,
			locals: {
				card: $scope.selectedCard
			},
			controller: function (scope, $mdDialog, card) {
				scope.card = {name: card.name, description: card.description};
				scope.save = function() {
					$mdDialog.hide();
					card.name = scope.card.name;
					card.description = scope.card.description;
				}

				scope.cancel = function() {
					$mdDialog.cancel();
				}

				scope.delete = function() {
					var confirmDlg = $mdDialog.confirm();
					confirmDlg.title('Delete card')
								 .content('Are you sure you want to remove the card \'' + card.name + '\'? This can\'t be undone.')
								 .ariaLabel('Confirm card deletion')
								 .ok('Yes')
								 .cancel('No')
								 .theme('default');
					$mdDialog.show(confirmDlg).then(deleteSelectedCard);
				}
			}
		}).then(
			function() {
				//FIXME: save the card, not the board
				$scope.saveBoard();
			});
	}

	$scope.addNewCard = function(event) {
		$scope.selectedCard = {name: 'New card', description: 'Card description'};
		var lane = $scope.selectedBoard.lanes[0];
		lane.cards.push($scope.selectedCard);
		$scope.editCard(event, 0, lane.cards.length - 1);
		//TODO: if card edition gets cancelled we should drop the new card from lane
	}

	$scope.saveBoard = function() {
		//FIXME: called from edit-in-place when lane or board title changes. Should call specific functions instead of saving entire board.
		Boards.saveBoard($scope.selectedBoard);
	}

	$scope.addNewLane = function() {
		Boards.addNewLane($scope.selectedBoard, '<New lane>');
	}
}]);


///////////////////////////////////////////////////////////////////////////////
//
//                               DIRECTIVES
//
///////////////////////////////////////////////////////////////////////////////

yaksApp.directive('ykLaneDragDrop', ["dragOrigin", function(dragOrigin) {
	return {
		restrict: 'A',
		scope: {
			laneIndex: "=laneIndex",
			onDrop: "&"
		},
		transclude: true,
		link: function(scope, element, attrs) {
			attrs.$set('draggable', true);
			element.on('dragover', function(event) {
				if(dragOrigin.cardIndex == -1 && dragOrigin.laneIndex != scope.laneIndex)
					event.preventDefault();
			});
			element.on('drop', function(event) {
				scope.$apply(scope.onDrop);
			});
			element.on('drag', function(event) {
				dragOrigin.laneIndex = scope.laneIndex;
				dragOrigin.cardIndex = -1;
			});
		},
	}
}]);

yaksApp.directive('ykCardDropTarget', ['dragOrigin', function(dragOrigin) {
	return {
		restrict: 'A',
		scope: {
			onDrop: "&"
		},
		transclude: true,
		link: function(scope, element, attrs) {
			element.on('dragover', function(event) {
				if(dragOrigin.cardIndex >= 0){
					event.preventDefault();
				}
			});
			element.on('drop', function(event) {
				scope.$apply(scope.onDrop);
			});
		}
	}
}]);

yaksApp.directive('ykCard', ['dragOrigin', function(dragOrigin){
	console.log('ykCard activating');
	return {
		restrict: 'A',
		scope: {
			laneIndex: '=laneIndex',
			cardIndex: '=cardIndex'
		},
		link: function(scope, element, attrs) {
			element.on('drag', function(event) {
				dragOrigin.laneIndex = scope.laneIndex;
				dragOrigin.cardIndex = scope.cardIndex;
			});
		}
	}
}]);

yaksApp.directive('editInPlace', ['Boards', function(Boards) {
	return {
			restrict: 'E',
			scope: {
				value: "=value",
				label: "@label",
				onChange: "&"
			},
			templateUrl: 'templates/edit-in-place.html',
			link: function($scope, element, attrs) {
				var spanElement = angular.element(element.children()[0]);
				var inputContainer = angular.element(element.children()[1]);
				inputContainer.css("display", "none");
				inputContainer.css({
					fontSize: "1.1rem",
					verticalAlign: "middle",
					padding: "2px 10px",
					zIndex: "10"
				});

				var inputElement = angular.element(inputContainer.children()[1]);

				$scope.edit = function() {
					inputContainer.css("display", "inline-block");
					spanElement.css("display", "none");
					inputElement.focus();
				}

				inputElement.on('blur', function(e) {
					if(inputElement.val().trim() == '') {
						inputElement.focus();
					} else {
						inputContainer.css("display", "none");
						spanElement.css("display", "inline-block");
						$scope.onChange();
					}
				});
			}
	}
}]);
