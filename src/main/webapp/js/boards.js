var boardsModule = angular.module('boards', []);

boardsModule.service('Boards', [function() {
	var boards = [
	              	{
						name: 'Yaks Development', 
						lanes: [
							{name: 'Unprioritized', cards:[]}, 
							{name: 'Pending', cards: []}, 
							{name: 'Doing', cards:[]},
							{name: 'Done', cards: []},
							{name: 'Deployed', cards: []}
					]},
					{
						name: 'Cervejas',
						lanes: [
						    {name: 'Receitas', cards: []},
						    {name: 'Fermentação', cards: []},
						    {name: 'Maturação', cards: []},
						    {name: 'Refermentação na garrafa longo longo', cards: []},
						    {name: 'Prontas e em estoque', cards: []},
						    {name: 'Arquivo morto', cards:[]}
					]}];
	
	this.list = function() {
		return boards;
	}
}])