var express = require('express');
var app = express();

app.get('/pets', function(req, res) {
  res.send('pets');
});

app.get('/pets/:petId', function(req, res) {
  res.send('get pet ' + req.params.petId);
});

app.post('/pets/add', function(req, res) {
  res.send('add pet');
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
