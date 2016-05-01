(function() {
  'use strict';

  var module = angular.module('singApp.maps.vector', [
    'ui.router',
    'ui.jq'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.maps-vector', {
        url: '/maps/vector',
        templateUrl: 'app/modules/maps-vector/maps-vector.html'
      })
  }
})();
