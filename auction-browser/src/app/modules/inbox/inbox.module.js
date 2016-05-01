(function() {
  'use strict';

  var module = angular.module('singApp.inbox', [
    'ui.router',
    'ui.bootstrap'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.inbox', {
        url: '/inbox',
        templateUrl: 'app/modules/inbox/inbox.html'
      })
  }
})();
