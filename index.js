var express = require('express');
var app = express();
var pg = require('pg');
pg.defaults.ssl = true;

app.get('/pets', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if ( err ) {
      throw err;
    }
    client.query('SELECT * FROM pets', function(err, result) {
      done();
      if (err) {
        console.error(err);
        res.send("Error " + err);
      } else {
        res.send( result.rows );
      }
    });
  });
});

app.get('/pets/:petId', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if ( err ) {
      throw err;
    }
    client.query('SELECT * FROM pets where id=$1::numeric', [req.params.petId], function(err, result) {
      done();
      if (err) {
        console.error(err);
        res.send("Error " + err);
      } else {
        res.send( result.rows );
      }
    });
  });
});

app.post('/pets', function(req, res) {
  console.log('Adding: ' + req);
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if ( err ) {
      throw err;
    }
    client.query('insert into pets values (DEFAULT,$1::text,$2::text,$3::text,$4::text,$5::numeric,$6::numeric);',
        [req.params.name, req.params.type, req.params.breed, req.params.location, req.params.latitude, req.params.longitude],
        function(err, result) {
      done();
      if (err) {
        console.error(err);
        res.send("Error " + err);
      } else {
        res.send( result );
      }
    });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000));
});
