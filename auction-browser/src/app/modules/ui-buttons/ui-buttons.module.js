(function() {
  'use strict';

  var module = angular.module('singApp.ui.buttons', [
    'ui.router'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.ui-buttons', {
        url: '/ui/buttons',
        templateUrl: 'app/modules/ui-buttons/ui-buttons.html'
      })
  }
})();
