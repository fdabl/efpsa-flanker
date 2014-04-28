var $     = require('jquery');
var _     = require('underscore');
var utils = require('../utils');

function ExperimentTemplate() {
  // no private stuff
}

ExperimentTemplate.prototype = {

  data: {
    trials       : [],
    block        : [],
    quitter      : false,
    changedTab   : false,
    changedSize  : false,
    start        : undefined,
    correct      : undefined,
    duration     : undefined,
  },

  stimuli      : 'please override',
  feedback     : 'please override',
  fixCross     : 'please override',
  participant  : 'please override',
  responseKeys : 'please override',


  initialize: function() {
    this.userKeyPress = _.partial(this.onKeyPress, this.responseKeys);
  },


  extend: function(func, context, obj) {
    var args = obj ? obj.args : null;
    ExperimentTemplate.prototype[func].call(context, args);
  },


  delay: function(func, time) {
    return setTimeout(_.bind(func, this), time);
  },


  startExperiment: function() {
    this.initialize();
    this.addTabCheck();
    this.addWindowCheck();
    this.leftExperiment();
    this.set('duration', +new Date());
  },

  /***********************************
   * Methods that should be overriden 
   * by the specific Experiment
   **********************************/

  startTrial: function() {
    this.addKeyEvents();
    this.startRecording();
  },


  prepareStim: function() {},
  showfixCross: function() {},
  checkAnswer: function() {},
  changeStim: function(file) {},

  /********************************************
   * Methods for recording the Reaction Time and
   * computation of the feedback - mean RT, error count
   ********************************************/

  startRecording: function() {
    this.set('start', +new Date());
  },


  endRecording: function(pressed, start, meta) {
    var response = pressed || 'too slow';
    var time     = pressed ? +new Date() - start : 1500;
    var correct  = pressed ? this.get('correct') : false;
    var save     = { time: time,
                     response: response,
                     correct: correct };

    this.get('block').push(_.extend(save, meta));
  },


  computeFeedback: function() {
    var block      = this.get('block');
    var rTimes     = _.pluck(block, 'time');
    var meanRT     = this.sum(rTimes) / rTimes.length;
    var errorCount = _.where(block, { correct: false }).length;

    return {
      errorCount: errorCount,
      meanRT: Math.round(meanRT)
    };
  },

  /**********************************************************************
   * Methods that are important for Participant Tracking:
   *
   * - onKeyPress:
   *   provided a resp-code map, checks if user has given the right answer
   *
   * - addTabCheck: checks if the User has switchted tabs
   * - addWindowCheck: checks if the User has changed the window size
   * - leftExperiment: checks if the User has left the experiment, warn her
   ***********************************************************************/

  onKeyPress: function(responseKeys, ev) {
    var code    = ev.keyCode || ev.which;
    var pressed = _.invert(responseKeys)[code];
    if (pressed) { this.checkAnswer(pressed); }
  },


  addTabCheck: function() {
    var vendor     = utils.hidden();
    var hasChanged = function() { this.set('changedTab', true); };
    var changeVis  = (vendor == 'hidden' ? '' : vendor) + 'visibilitychange';
    $(document).on(changeVis, _.bind(hasChanged, this));
  },


  addWindowCheck: function() {
    var hasChanged = function() { this.set('changedSize', true); };
    $(window).on('resize', _.bind(hasChanged, this));
  },


  leftExperiment: function() {
    var msg = 'By leaving, you opt out of the Experiment, are you sure?';
    var hasQuit = function() {
      this.set('quitter', true);
      this.finish('quit');
      return msg;
    };
    $(window).on('beforeunload', _.bind(hasQuit, this));
  },


  addKeyEvents: function() {
    $(window).on('keyup', _.bind(this.userKeyPress, this));
  },


  removeKeyEvents: function() {
    $(window).unbind('keyup');
  },


  finish: function(quit) {
    $(window).unbind('beforeunload');

    var duration = this.expduration();
    var exp = _.omit(this.get('all'), ['start', 'correct', 'block']);

    if (quit || !quit && !this.practice) {
      this.participant.save({ exp: _.extend(exp, duration) });
    }
  },


  expduration: function() {
    var duration = +new Date() - this.get('duration');
    return { duration: duration };
  },


  get: function(key) {
    return key === 'all' ? this.data : this.data[key];
  },


  set: function(key, val) {
    this.data[key] = val;
  },


  sum: function(array) {
    return _.reduce(array, function(a, b) {
      return a + b;
    }, 0);
  },

};

module.exports = ExperimentTemplate;
