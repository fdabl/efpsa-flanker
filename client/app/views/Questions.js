var fs          = require('fs');
var $           = require('jquery');
var _           = require('underscore');
var Backbone    = require('backbone');
var Participant = require('../models/Participant');

var questions = fs.readFileSync(
    __dirname + '/../templates/questions.html', 'utf-8');


var Questions = Backbone.View.extend({

  el: '.page',
  participant: Participant,
  template: _.template(questions),

  events: {
    'submit .create-new-participant': 'saveAnswers'
  },

  render: function() {
    this.$el.html(this.template);
    return this;
  },

  checkAnswers: function(ev) {
    ev.preventDefault();
    var data = $(ev.currentTarget).serializeObject();
    if (!(data.sex && data.country && data.age)) {
      alert('Upps, you forgot to answer one or more questions!');
      return false;
    }
    if (_.isNaN(parseInt(data.age, 10))) {
      alert('Age must be a digit!');
      return false;
    }
    return true;
  },

  getInfo: function() {
    return {
      userAgent: navigator.userAgent,
      userTime: new Date().toString(),
      windowSize: [window.innerWidth, window.innerHeight]
    };
  },

  saveAnswers: function(ev) {
    if (this.checkAnswers(ev)) {
      var browserInfo = this.getInfo();

      var details = $(ev.currentTarget).serializeObject();
      _.extend(details, browserInfo);
      this.participant.save(details, {
        success: function(user) {
          Backbone.history.navigate('exp', { trigger: true });
        }
      });
    }
  }

});

module.exports = Questions;
