(function() {
  'use strict';

  var module = angular.module('singApp.charts', [
    'ui.router',
    'ui.jq',
    'singApp.components.sparkline',
    'singApp.components.nvd3',
    'singApp.components.morris'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.charts', {
        url: '/charts',
        templateUrl: 'app/modules/charts/charts.html'
      })
  }
})();
