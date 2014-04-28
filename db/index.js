var url  = process.env.CLOUDANT_URL || 'http://localhost:5984';
var nano = require('nano')(url);
var db   = nano.use('bakk');

exports.createUser = function(req, res, next) {
  db.insert(req.body, function(err, body) {
    if (err) return next(err);
    res.send(body);
  });
};

exports.updateUser = function(req, res, next) {
  var id = req.params.id;

  // Get the document with the specific ID
  db.get(id, function(err, doc) {
    if (err) return next(err);

    // Update the old Document
    doc.exp = req.body.exp;

    // Insert the updated document
    db.insert(doc, doc.id, function(err, body) {
      if (err) return next(err);
      res.send(body);
    });
  });
};
