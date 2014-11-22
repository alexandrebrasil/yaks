var yaksApp = angular.module('yaks',['boards']);

yaksApp.controller('MainController', ['$scope', 'Boards', '$window', function($scope, Boards, $window) {
	$scope.boards = Boards.list();
	$scope.selectedBoard = $scope.boards[0];

	$scope.showEditCard = false;
	$scope.newCardName = "";
	$scope.newCardText = "";
	
	$scope.addCard = function(lane) {
		$scope.selectedCard = {name: '', description: ''};
		lane.cards.push($scope.selectedCard);
		$scope.editCard(lane, lane.cards.length - 1);
	}
	
	$scope.saveCard = function() {
		if($scope.selectedCard.name == null || $scope.selectedCard.name.trim().length == 0 || $scope.selectedCard.description == null || $scope.selectedCard.description.trim().length == 0) {
			$window.alert("Please inform the card name and a starting text before proceeding.");
			return;
		}
		
		reset();
	}
	
	function reset() {
		$scope.selectedCard = null;
		$scope.showEditCard = false;
		$scope.editCardForm.$setPristine(true);
		$scope.editCardForm.$setUntouched(true);
	}
	
	$scope.editCard = function(lane, index) {
		$scope.selectedLane = lane;
		$scope.selectedCard = $scope.selectedLane.cards[index];
		$scope.selectedIndex = index;
		$scope.showEditCard = true;
	}
	
	$scope.deleteSelectedCard = function() {
		if($window.confirm('Are you sure you want to remove this card?')) {
			$scope.selectedLane.cards.splice($scope.selectedIndex, 1);
			$scope.showEditCard = false;
		}
	}
}]);
