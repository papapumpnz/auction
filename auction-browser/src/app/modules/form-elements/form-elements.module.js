

(function() {
  'use strict';

  var module = angular.module('singApp.form.elements', [
    'ui.router',
    'ui.jq',
    'ui.event',
    'ngResource',
    'singApp.components.dropzone',
    'singApp.components.switchery',
    'singApp.components.holderjs',
    'angular-bootstrap-select',
    'summernote'
  ]);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.form-elements', {
        url: '/form/elements',
        templateUrl: 'app/modules/form-elements/form-elements.html'
      })
  }
})();
