var boardsModule = angular.module('boards', []);

boardsModule.service('Boards', [function() {
	var boards = [
	              	{
						name: 'Yaks Development', 
						lanes: [
							{name: 'Unprioritized', cards:[{name: 'Create card component', description: 'Reusable component to edit a card whenever needed.'}]}, 
							{name: 'Pending', cards: []}, 
							{name: 'Doing', cards:[{name: 'This card has a huge name that goes on and on and on. For real! No kidding!', description: 'Add cards to each lane when they are present.'},
							                       {name: 'Add cards to lanes', description: 'Add cards to each lane when they are present.'},
							                       {name: 'Add cards to lanes', description: 'Add cards to each lane when they are present.'},
							                       {name: 'Add cards to lanes', description: 'Add cards to each lane when they are present really long text goes here anytime i want! Anything else?'},
							                       {name: 'Add cards to lanes', description: 'Add cards to each lane when they are present.'},
							                       {name: 'Add cards to lanes', description: 'Add cards to each lane when they are present.'},
							                       {name: 'Add cards to lanes', description: 'Add cards to each lane when they are present.'},
							                       {name: 'Add cards to lanes', description: 'Add cards to each lane when they are present.'},
							                       {name: 'Add cards to lanes', description: 'Add cards to each lane when they are present.'}]},
							{name: 'Done', cards: []},
							{name: 'Deployed', cards: []}
					]},
					{
						name: 'Cervejas',
						lanes: [
						    {name: 'Receitas', cards: [{name: 'Bittervet', description: 'Malte, Água, lúpulo!'},
						                               {name: 'HoneyWheat', description: 'Malte, malte mel, água, lúpulo.'}]},
						    {name: 'Fermentação', cards: []},
						    {name: 'Maturação', cards: []},
						    {name: 'Refermentação na garrafa', cards: [{name: 'Bittervet', description: 'Meh...'}]},
						    {name: 'Prontas e em estoque', cards: []},
						    {name: 'Arquivo morto', cards:[]}
					]}];
	
	this.list = function() {
		return boards;
	}
	
	this.saveCard = function(board, lane, card) {
//		lane.cards.push(card);
	}
}])