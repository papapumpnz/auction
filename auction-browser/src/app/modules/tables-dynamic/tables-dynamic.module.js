(function() {
  'use strict';

  var module = angular.module('singApp.tables.dynamic', [
    'ui.router',
    'ngResource',
    'datatables',
    'datatables.bootstrap'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.tables-dynamic', {
        url: '/tables/dynamic',
        templateUrl: 'app/modules/tables-dynamic/tables-dynamic.html',
        controller: 'AngularWayCtrl'
      })
  }
})();
