var fs          = require('fs');
var $           = require('jquery');
var _           = require('underscore');
var Backbone    = require('backbone');
var Participant = require('../models/Participant');

var feedback = fs.readFileSync(
    __dirname + '/../templates/feedback.html', 'utf-8');


var Feedback = Backbone.View.extend({

  el: '.page',
  participant: Participant,
  template: _.template(feedback),

  events: {
    'click .give-feedback': 'feedback'
  },

  render: function() {
    this.$el.html(this.template);
    return this;
  },

  feedback: function(ev) {
    var fb = { 'feedback': $('textarea').val() };
    var update = _.extend(this.participant.get('exp'), fb);
    this.participant.save(update);
    Backbone.history.navigate('debriefing', { trigger: true });
  }

});

module.exports = Feedback;
