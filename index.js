var db      = require('./db');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app    = express();
var files  = 'client/static';
var port   = process.env.PORT || 4000;

app.use(express.static(files));
app.use(bodyParser());
app.use(methodOverride());

app.post('/api/participant', db.createUser);
app.put('/api/participant/:id', db.updateUser);

app.listen(port, function() {
  console.log('Listening on port ' + port);
});
