(function() {
  'use strict';

  angular.module('singApp.components.dropzone')
    .directive('dropzone', dropzone)
    .factory('Dropzone', DropzoneFactory)
  ;

  /* ========================================================================
   * Handle no-border input groups focus
   * ========================================================================
   */

  dropzone.$inject = ['Dropzone'];
  function dropzone(Dropzone){
    return function (scope, element, attrs) {
      var config, dropzone;

      config = angular.extend({}, scope[attrs.dropzone]);

      // create a Dropzone for the element with the given options
      dropzone = new Dropzone(element[0], config.options);

      // bind the given event handlers
      angular.forEach(config.eventHandlers, function (handler, event) {
        dropzone.on(event, handler);
      });
    };
  }

  DropzoneFactory.$inject = ['$window'];
  function DropzoneFactory($window){
    return $window.Dropzone;
  }

})();
