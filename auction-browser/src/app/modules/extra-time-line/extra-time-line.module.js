(function() {
  'use strict';

  var module = angular.module('singApp.extra.timeline', [
    'ui.router'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.extra-timeline', {
        url: '/extra/timeline',
        templateUrl: 'app/modules/extra-time-line/extra-time-line.html'
      })
  }
})();
