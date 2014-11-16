var yaksApp = angular.module('yaks',['boards']);

yaksApp.controller('MainController', ['$scope', 'Boards', function($scope, Boards) {
	$scope.boards = Boards.list();
	$scope.selectedBoard = $scope.boards[0];
	
}]);
