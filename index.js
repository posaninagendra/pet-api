var express = require('express');
var app = express();
var pg = require('pg');

app.get('/pets', function(req, res) {
  pg.connect(process.env.DATABASE_URL + '?sslmode=require', function(err, client, done) {
    if ( err ) {
      throw err;
    }
    console.log('connected to db');
    client.query('SELECT * FROM pets', function(err, result) {
      done();
      if (err) {
        console.error(err);
        response.send("Error " + err);
      } else {
        response.send( result.rows );
      }
    });
  });
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
