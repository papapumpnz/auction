(function() {
  'use strict';

  var module = angular.module('singApp.form.wizard', [
    'ui.router',
    'ui.jq',
    'singApp.components.wizard'

  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.form-wizard', {
        url: '/form/wizard',
        templateUrl: 'app/modules/form-wizard/form-wizard.html'
      })
  }
})();
