// Temporary repository
var boards = [{
         id: 1,
         name: 'Yaks Development',
         lanes: [
               {id: 1, name: 'Unprioritized', cards:[{id: 1, name: 'Create card component', description: 'Reusable component to edit a card whenever needed.'}]},
               {id: 2, name: 'Pending', cards: []},
               {id: 3, name: 'Doing', cards:[{id: 1, name: 'This card has a huge name that goes on and on and on. For real! No kidding!', description: 'Add cards to each lane when they are present.'},
               {id: 4, name: 'Add cards to lanes', description: 'Add cards to each lane when they are present.'},
               {id: 5, name: 'Add cards to lanes', description: 'Add cards to each lane when they are present.'},
               {id: 6, name: 'Add cards to lanes', description: 'Add cards to each lane when they are present really long text goes here anytime i want! Anything else?'},
               {id: 7, name: 'Add cards to lanes', description: 'Add cards to each lane when they are present.'},
               {id: 8, name: 'Add cards to lanes', description: 'Add cards to each lane when they are present.'},
               {id: 9, name: 'Add cards to lanes', description: 'Add cards to each lane when they are present.'},
               {id: 10, name: 'Add cards to lanes', description: 'Add cards to each lane when they are present.'},
               {id: 11, name: 'Add cards to lanes', description: 'Add cards to each lane when they are present.'}]},
               {id: 12, name: 'Done', cards: []},
               {id: 13, name: 'Deployed', cards: []}]
        },
        {
           id: 2,
           name: 'Cervejas',
           lanes: [
               {id: 1, name: 'Receitas', cards: [{id: 1, name: 'Bittervet', description: 'Malte, água, lúpulo!'},
               {id: 2, name: 'HoneyWheat', description: 'Malte, malte mel, água, lúpulo.'}]},
               {id: 3, name: 'Fermentação', cards: []},
               {id: 4, name: 'Maturação', cards: []},
               {id: 5, name: 'Refermentação na garrafa', cards: [{id: 1, name: 'Bittervet', description: 'Meh...'}]},
               {id: 6, name: 'Prontas e em estoque', cards: []},
               {id: 7, name: 'Arquivo morto', cards:[]}]
    }];

var bodyParser = require('body-parser');

module.exports = function(app) {
   app.use(bodyParser.json());

   app.get('/boards/:id?', function(req, res){
      if(typeof req.params.id === 'undefined') {
         res.send(boards);
      } else {
         found = false;
         for(i in boards) {
            if(boards[i].id == req.params.id) {
               res.send(boards[i]);
               found = true;
               break;
            }
         }

         if(! found) {
            res.send({});
         }
      }
   })

   app.put('/boards/:id', function(req, res){
      console.log('Saving board ' + req.params.id);
      var board = req.body;

      for(i = 0; i < boards.length; i++) {
         if(boards[i].id == board.id) {
            boards.splice(i, 1, board);
         }
      }

      res.send(board);
   })

   app.put('/boards', function(req, res) {

   })

   console.log('/boards registered');
}
