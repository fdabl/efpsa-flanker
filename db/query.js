var url  = process.env.CLOUDANT_URL || 'http://localhost:5984';
var _    = require('underscore');
var nano = require('nano')(url);
var db   = nano.use('bakk');

var get = function(cb) {
  db.list({ include_docs: true }, function(err, body) {

    var congr = [];
    var incongr = [];

    var exp = body.rows.map(function(obj) {
      return obj.doc;
    });

    _.each(exp, function(part) {
      var main = part.exp.trials[1].main;
      congr.push(_.where(main, { type: 'congruent' }));
      incongr.push(_.where(main, { type: 'incongruent' }));
    });

    return cb([congr, incongr]);

  });
};

get(console.log);
