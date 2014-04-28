var _        = require('underscore');
var Backbone = require('backbone');

var Router = Backbone.Router.extend({

  routes: {
    ''            : 'instruction',
    'explanation' : 'explanation',
    'questions'   : 'questions',
    'exp'         : 'exp',
    'feedback'    : 'feedback',
    'debriefing'  : 'debriefing'
  },

});

module.exports = new Router();
