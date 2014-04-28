var fs = require('fs');
var $  = require('jquery');
var _  = require('underscore');


exports.hidden = function() {
  if ('hidden' in document) { return 'hidden'; }

  var vendors = ['webkit', 'moz', 'ms', 'o'];
  return _.first(_.filter(vendors, function(vendor) {
    return (vendor + 'Hidden') in document;
  }));
};


$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};
