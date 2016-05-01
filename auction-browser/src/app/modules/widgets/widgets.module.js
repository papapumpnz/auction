(function() {
  'use strict';

  var module = angular.module('singApp.widgets', [
    'ui.router',
    'ui.bootstrap',
    'singApp.components.mapael',
    'singApp.components.tile',
    'singApp.components.flot',
    'singApp.components.skycon',
    'singApp.components.sparkline',
    'ui.jq'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.widgets', {
        url: '/widgets',
        templateUrl: 'app/modules/widgets/widgets.html'
      })
  }
})();
