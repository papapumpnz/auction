

(function() {
  'use strict';

  var module = angular.module('singApp.extra.calendar', [
    'ui.router',
    'ui.bootstrap',
    'ui.calendar'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.extra-calendar', {
        url: '/extra/calendar',
        templateUrl: 'app/modules/extra-calendar/extra-calendar.html',
        controller: 'CalendarAppController'
      })
  }
})();
