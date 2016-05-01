

(function() {
  'use strict';

  var module = angular.module('singApp.maps.google', [
    'ui.router',
    'singApp.components.gmap'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.maps-google', {
        url: '/maps/google',
        templateUrl: 'app/modules/maps-google/maps-google.html'
      })
  }
})();
