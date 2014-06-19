var url  = process.env.CLOUDANT_URL || 'http://localhost:5984';
var nano = require('nano')(url);

nano.db.create('flanker', function(err, body) {
  if (err) return err;
  console.log('created flanker database');
});
