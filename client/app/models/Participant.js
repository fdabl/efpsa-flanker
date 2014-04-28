var _        = require('underscore');
var Backbone = require('backbone');

var Participant = Backbone.Model.extend({

  urlRoot: '/api/participant',

  defaults: {
    'age': 0,
    'sex': '',
    'country': '',
    'userTime': '',
    'userAgent': '',
    'windowSize': ''
  }

});

module.exports = new Participant();
