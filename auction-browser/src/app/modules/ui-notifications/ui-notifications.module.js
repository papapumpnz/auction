(function() {
  'use strict';

  var module = angular.module('singApp.ui.notifications', [
    'ui.router'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.ui-notifications', {
        url: '/ui/notifications',
        templateUrl: 'app/modules/ui-notifications/ui-notifications.html'
      })
  }
})();
