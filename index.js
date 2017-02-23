var express = require('express');
var app = express();
var pg = require('pg');
pg.defaults.ssl = true;

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/pets', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if ( err ) {
      throw err;
    }
    client.query('SELECT * FROM pets', function(err, result) {
      done();
      if (err) {
        console.error(err);
        res.send({ 'success': false, 'error': err});
      } else {
        res.send({ 'success': true, 'data': result.rows });
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
        res.send({ 'success': false, 'error': err});
      } else {
        res.send({ 'success': true, 'data': result.rows });
      }
    });
  });
});

app.post('/pets', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if ( err ) {
      throw err;
    }
    client.query('insert into pets values (DEFAULT,$1::text,$2::text,$3::text,$4::text,$5::numeric,$6::numeric);',
        [req.body.name, req.body.type, req.body.breed, req.body.location, req.body.latitude, req.body.longitude],
        function(err, result) {
      done();
      if (err) {
        console.error(err);
        res.send({ 'success': false, 'error': err});
      } else {
        res.send({ 'success': true });
      }
    });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000));
});
