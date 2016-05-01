(function() {
  'use strict';

  var module = angular.module('singApp.tables.basic', [
    'ui.router'

  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.tables-basic', {
        url: '/tables/basic',
        templateUrl: 'app/modules/tables-basic/tables-basic.html'
      })
  }
})();
