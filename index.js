var express = require('express');
var app = express();
var pg = require('pg');
pg.defaults.ssl = true;

app.get('/pets', function(req, res) {
  console.log('URL = ' + process.env.DATABASE_URL);
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
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
        response.send( result || 'nothing' );
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

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000));
});
