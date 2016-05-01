(function() {
  'use strict';

  var module = angular.module('singApp.profile', [
    'ui.router'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.profile', {
        url: '/profile',
        templateUrl: 'app/modules/profile/profile.html'
      })
  }
})();
