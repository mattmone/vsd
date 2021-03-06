// Load Module Dependencies
require('../db');
require('../router');

var mod = require('./module');

mod.config([
  '$stateProvider',
  require('./config')
]);

mod.service('SessionService', [
  require('./services/session')
]);

mod.controller('FsCtrl', [
  '$scope',
  require('./controllers')
]);

mod.controller('FsFinderCtrl', [
  '$scope',
  '$state',
  '$log',
  '$modal',
  '$q',
  'DialogService',
  'FileService',
  'ResponseHandler',
  require('./controllers/finder')
]);

mod.controller('FsFileCtrl', [
  '$scope',
  '$state',
  'session',
  'FileService',
  require('./controllers/file')
]);

mod.controller('FsSearchCtrl', [
  '$scope',
  '$state',
  require('./controllers/search')
]);

mod.controller('FsTreeCtrl', [
  '$scope',
  '$modal',
  '$log',
  'DialogService',
  'ResponseHandler',
  require('./controllers/tree')
]);

module.exports = mod;
