(function() {
  'use strict';

  var module = angular.module('singApp.ui.components', [
    'ui.router',
    'ui.bootstrap'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.ui-components', {
        url: '/ui/components',
        templateUrl: 'app/modules/ui-components/ui-components.html',
        controller: 'UiComponentsDemoController'
      })
  }
})();
