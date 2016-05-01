(function() {
  'use strict';

  var module = angular.module('singApp.ui.list-groups', [
    'ui.router',
    'ui.jq'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.ui-list-groups', {
        url: '/ui/list-groups',
        templateUrl: 'app/modules/ui-list-groups/ui-list-groups.html'
      })
  }
})();
