var yaksApp = angular.module('yaks',['boards']);

yaksApp.controller('MainController', ['$scope', 'Boards', '$window', function($scope, Boards, $window) {
	$scope.boards = Boards.list();
	$scope.selectedBoard = $scope.boards[0];
	$scope.showNewCard = false;
	$scope.showEditCard = false;
	$scope.newCardName = "";
	$scope.newCardText = "";
	
	$scope.addCard = function(lane) {
		$scope.showNewCard = true;
		$scope.selectedLane = lane;
	}
	
	$scope.saveCard = function() {
		if($scope.newCardName == null || $scope.newCardName.trim().length == 0 || $scope.newCardText == null || $scope.newCardText.trim().length == 0) {
			$window.alert("Please inform the card name and a starting text before proceeding.");
			return;
		}
		
		var card = {
						name: $scope.newCardName,
						description: $scope.newCardText
				   }
		Boards.addCard($scope.selectedLane, card);
		reset();
	}
	
	function reset() {
		$scope.showNewCard = false;
		$scope.newCardName = '';
		$scope.newCardText = '';
		$scope.newCardForm.$setPristine(true);
		$scope.newCardForm.$setUntouched(true);
	}
	
	$scope.cancelNewCard = function() {
		reset();
	}
	
	$scope.editCard = function(card) {
		$scope.selectedCard = card;
		$scope.showEditCard = true;
	}
}]);
