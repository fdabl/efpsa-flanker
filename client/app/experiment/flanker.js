var $ = require('jquery');
var _ = require('underscore');
var ExperimentTemplate = require('./template');


function Flanker(config, callback) {

  this.ISI          = config.ISI || 500;
  this.timeout      = config.timeout || 1500;
  this.pauseTime    = config.pauseTime || 500;
  this.trialCount   = config.trialCount || 100;
  this.practice     = config.practice || false;
  this.feedbackTime = config.feedbackTime || 600;

  this.stimuli       = config.stimuli;
  this.fixCross      = config.fixCross;
  this.participant   = config.participant;
  this.blockFeedback = config.blockFeedback;
  this.negFeedback   = config.negFeedback || 'X';
  this.posFeedback   = config.posFeedback || 'O';

  this.blockCount   = 0;
  this.blockStart   = 0;
  this.corrAns      = undefined;
  this.responseKeys = config.responseKeys || { 's': 83, 'h': 72 };


  this.prepareStimuli = function(stimuli) {
    if (!this.practice) {
      var self = this;
      return _.reduce(stimuli.trials, function(block, trial) {
        var times = self.trialCount / 4;
        _.each(_.range(times), function() {
          block.push(trial);
        });
        return block;
      }, []);
    }

    else { return stimuli.trials; }
  };


  this.prepareBlock = function() {
    var trials = this.prepareStimuli(this.stimuli);
    this.block = _.shuffle(trials);
  };


  this.prepareTrial = function() {
    var stim     = this.block.shift();
    this.corrAns = _.contains(stim, 'H') ? 'h' : 's';
    var type     = stim[0] == 'i' ? 'incongruent' : 'congruent';

    this.trialCount = this.trialCount - 1;
    this.trial = {
      type: type,
      flanker: this.stimuli[stim]
    };
  };


  this.startExperiment = function() {
    this.extend('startExperiment', this);
    this.prepareBlock();
    this.pause();
  },


  this.pause = function() {
    this.changeStim('');
    this.pauseTimeout = this.delay(this.showFixCross, this.pauseTime);
  },


  this.showFixCross = function() {
    clearTimeout(this.fbTimeout);
    if (this.experimentHasEnded()) {
      this.endBlock();
    }
    else {
      this.prepareTrial();
      this.changeStim(this.fixCross);
      this.delay(this.startFlanker, this.ISI);
    }
  };


  this.startFlanker = function() {
    this.extend('startTrial', this);
    this.checkTooSlow();
    this.changeStim(this.trial.flanker, true);
  };



  this.checkAnswer = function(answer) {
    var correct = (answer === this.corrAns);
    this.set('correct', correct);

    this.endRecording(answer, this.get('start'), { type: this.trial.type });
    clearTimeout(this.tooSlowTimeout);
    this.removeKeyEvents();

    correct ? this.drawFeedback('positive') :
              this.drawFeedback('negative');
  };


  this.drawFeedback = function(type) {
    var pos      = (type === 'positive');
    var color    = pos ? 'green' : 'red';
    var feedback = pos ? this.posFeedback : this.negFeedback;

    this.changeStim(feedback);
    this.changeStimColor(color);
    this.fbTimeout = this.delay(this.pause, this.feedbackTime);
  };


  this.endBlock = function() {
    clearTimeout(this.tooSlowTimeout);
    this.removeKeyEvents();
    this.blockStart = +new Date();

    if (this.practice) {
      this.changeStim(this.blockFeedback);
      $(window).on('keyup', _.bind(this.onBlockEnd, this));
    }

    else {
      this.saveBlockData();
      this.finish();
    }
  };


  this.onBlockEnd = function(ev) {
    var code = ev.keyCode || ev.which;
    if (code === 32) {
      this.removeKeyEvents();
      this.saveBlockData();
      this.finish();
    }
  };


  this.saveBlockData = function() {
    var block  = {};
    var key    = this.practice ? 'practice' : 'main';
    block[key] = this.get('block');
    block.time = +new Date() - this.blockStart;
    var save   = this.get('trials').concat(block);

    this.set('trials', save);
    this.set('block', []);
  };

  this.hasTimedOut = function() {
    clearTimeout(this.tooSlowTimeout);
    this.removeKeyEvents();
    this.endRecording(null, null, { type: this.trial.type });
    this.drawFeedback('negative');
  };


  this.finish = function(quit) {
    this.extend('finish', this, { args: quit });
    if (!quit) {
      clearTimeout(this.fbTimeout);
      clearTimeout(this.pauseTimeout);
      clearTimeout(this.tooSlowTimeout);
      callback();
    }
  };


  this.changeStim = function(file, flanker) {
    $('.page').html(file);

    if (flanker && this.practice)  {
      var fb = $('<p id="practice-press">Press {key}</p>'
                .replace('{key}', this.corrAns.toUpperCase()));
      $('.page').append(fb);
    }
  };


  this.checkTooSlow = function() {
    this.tooSlowTimeout = this.delay(this.hasTimedOut, this.timeout);
  };


  this.changeStimColor = function(color) {
    $('.feedback').css('color', color);
  };

  this.experimentHasEnded = function() {
    return this.trialCount === 0;
  };

}

Flanker.prototype = new ExperimentTemplate();
module.exports = Flanker;
