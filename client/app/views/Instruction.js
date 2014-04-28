var fs       = require('fs');
var $        = require('jquery');
var _        = require('underscore');
var Backbone = require('backbone');

var instruction = fs.readFileSync(
    __dirname + '/../templates/instruction.html', 'utf-8');


var Instruction = Backbone.View.extend({

  el: '.page',
  template: _.template(instruction),

  initialize: function() {
    this.width  = window.innerWidth;
    this.height = window.innerHeight;
    $(window).on('keyup', _.bind(this.checkClick, this));
    $(window).on('resize', _.bind(this.checkResize, this));
  },

  events: {
    'click .agree': 'participate'
  },

  checkResize: function(ev) {
    var fullscreen = (window.innerWidth > this.width &&
                      window.innerHeight > this.height);
    if (fullscreen) { this.showButton(); }
  },

  checkClick: function(ev) {
    var code = ev.which || ev.keyCode;
    if (code == 122) { this.showButton(); }
  },

  render: function() {
    this.$el.html(this.template);
    this.$el.find('.listened').hide();
    return this;
  },

  showButton: function() {
    this.$el.find('.listened').fadeIn(2400);
  },

  participate: function(ev) {
    Backbone.history.navigate('explanation', { trigger: true });
  }

});

module.exports = Instruction;
