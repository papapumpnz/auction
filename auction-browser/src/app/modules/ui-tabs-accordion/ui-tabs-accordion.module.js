(function() {
  'use strict';

  var module = angular.module('singApp.ui.tabs-accordion', [
    'ui.router'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.ui-tabs-accordion', {
        url: '/ui/tabs-accordion',
        templateUrl: 'app/modules/ui-tabs-accordion/ui-tabs-accordion.html'
      })
  }
})();
