var fs          = require('fs');
var $           = require('jquery');
var _           = require('underscore');
var Backbone    = require('backbone');
var Flanker     = require('../experiment/flanker');
var Participant = require('../models/Participant');

var flanker  = fs.readFileSync(
    __dirname + '/../experiment/stimuli/flanker.html', 'utf-8');

var blockFeedback = fs.readFileSync(
    __dirname + '/../experiment/stimuli/blockFeedback.html', 'utf-8');


var ExperimentView = Backbone.View.extend({

  initialize: function() {
    this.stimuli = {
      congruentS   : _.template(flanker, { stim: 'SSSSSSS', color: 'white' }),
      congruentH   : _.template(flanker, { stim: 'HHHHHHH', color: 'white' }),
      incongruentS : _.template(flanker, { stim: 'HHHSHHH', color: 'white' }),
      incongruentH : _.template(flanker, { stim: 'SSSHSSS', color: 'white' }),

      trials: ['congruentS', 'congruentH', 'incongruentS', 'incongruentH'],

    };

    this.config = {
      practice      : false,
      participant   : Participant,
      stimuli       : this.stimuli,
      blockFeedback : _.template(blockFeedback),
      fixCross      : _.template(flanker, { stim : '+', color : 'white' }),
      posFeedback   : _.template(flanker, { stim : 'o', color : 'green' }),
      negFeedback   : _.template(flanker, { stim : 'x', color : 'red' }),
    };
  },

  render: function() {
    this.hideCursor();
    this.startPractice();
  },

  startPractice: function() {
    var config  = _.clone(this.config);

    config.trialCount = 4;
    config.practice   = true;
    config.timeout    = 99999999;

    var practice = new Flanker(config, _.bind(this.startExperiment, this));
    practice.startExperiment();
  },

  startExperiment: function() {
    var experiment = new Flanker(this.config, _.bind(this.onExpEnd, this));
    experiment.startExperiment();
  },

  onExpEnd: function() {
    this.showCursor();
    Backbone.history.navigate('feedback', { trigger: true });
  },

  showCursor: function() {
    $('.container').css('width', $(window).width() * 0.6)
                   .removeClass('hideCursor');
  },

  hideCursor: function() {
    $('.container').css('width', $(window).width())
                   .css('height', $(window).height() - 1)
                   .addClass('hideCursor');
  },

});

module.exports = ExperimentView;
