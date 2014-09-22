var util = require('util');

exports.extend = util._extend;

exports.rndstr = function() {
  return (+new Date()).toString(36);
};

exports.getuid = function() {
  return ('' + Math.random()).replace(/\D/g, '');
};
