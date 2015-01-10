var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/yaks');
var Schema = mongoose.Schema;
var CardSchema = new Schema({
   name: {type: String, required: true},
   description: {type: String, required: true}
});

var LaneSchema = new Schema({
   name: {type: String, required: true},
   cards: [CardSchema]
});

var BoardSchema = new Schema({
   name: {type: String, required: true},
   lanes: [LaneSchema]
});

var Board = mongoose.model('board', BoardSchema);

module.exports = function(app) {
   app.use(bodyParser.json());

   app.get('/boards/:id?', function(req, res){
      if(typeof req.params.id === 'undefined') {
         Board.find(function(err, boards) {
            if(err) {
               console.log("Error recovering boards");
               res.status(500);
            } else {
               res.send(boards);
            }
         })
      } else {
         Board.find({_id: req.params.id}, function(err, board) {
            if(err) {
               console.log("Error finding board " + req.params.id);
               res.status(500);
            } else if(board) {
               res.send(board);
            } else {
               res.status(404);
            }
         });
      }
   })

   app.put('/boards/:id', function(req, res){
      console.log('Saving board ' + req.params.id);
      var board = req.body;
      Board.update({_id: board._id}, board, function (err, numberAffected, raw){
         if(err) {
            console.log('Error saving board');
         } else if(numberAffected == 0) {
            console.log('No board was saved');
         } else {
            console.log('Board saved')
         }
      });

      res.send(board);
   })

   app.post('/boards', function(req, res) {
      Board.create({
         name: req.body.name,
         lanes: req.body.lanes
      }, function(err, board) {
         if(err) {
            res.status(500);
         } else {
            res.send(board);
         }
      });
   })

   console.log('/boards registered');
}
