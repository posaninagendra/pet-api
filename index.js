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
        res.jsonp(createError(err));
      } else {
        res.jsonp(createResponse(result.rows));
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
        res.jsonp(createError(err));
      } else {
        if ( result.rows[0] ) {
          res.jsonp(createResponse(result.rows[0]));
        } else {
          res.jsonp(createError('Id ' + req.params.petId + ' not found'));
        }
      }
    });
  });
});

app.post('/pets', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if ( err ) {
      throw err;
    }
    var latitude = req.body.latitude;
    if ( !validLatitude(latitude) ) {
      res.json(createError('Invalid latitude ' + latitude));
      return;
    }
    var longitude = req.body.longitude;
    if ( !validLongitude(longitude) ) {
      res.json(createError('Invalid longitude ' + longitude));
      return;
    }
    var name = req.body.name;
    var type = req.body.type;
    client.query('select id from pets where name=$1::text and type=$2::text',
      [name, type],
      function(err, result) {
        if (err) {
          console.error(err);
          res.json(createError(err));
        } else if ( result.rows[0] ) {
          res.json(createError('A ' + type + ' named ' + name + ' already exists'));
        } else {
          client.query('insert into pets values (DEFAULT,$1::text,$2::text,$3::text,$4::text,$5::numeric,$6::numeric);',
              [name, type, req.body.breed, req.body.location, latitude, longitude],
              function(err, result) {
            if (err) {
              console.error(err);
              res.json(createError(err));
            } else {
              client.query('select last_value from pet_id_seq', function(err, result) {
                done();
                if (err) {
                  console.error(err);
                  res.json(createError(err));
                } else {
                  res.json(createResponse({'id': result.rows[0].last_value }));
                }
              });
            }
          });
        }
      });
    });
});

function createResponse(data) {
  return { 'success': true, 'data': data };
}

function createError(err) {
  return { 'success': false, 'error': err};
}

function validLongitude(x) {
  return -180 <= x && x <= 180;
}

function validLatitude(x) {
  return -90 <= x && x <= 90;
}

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000));
});
