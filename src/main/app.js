var express = require('express')
var app = express();
var boards = require('./boards');
boards(app);

app.use(express.static('webapp'));

app.get('/yaks', function(req, res){
  res.send('Welcome to yaks!');
});

app.listen(80);
