(function() {
  'use strict';

  angular.module('singApp.components.tile')
    .directive('liveTile', liveTile)
  ;

  liveTile.$inject = [];
  function liveTile(){
    return {
      restrict: 'EAC',
      link: function (scope, $el, attrs){
        $el.css('height', attrs.height).liveTile();

        // remove onResize timeouts if present
        scope.$on('$stateChangeStart', function(){
          $el.liveTile('destroy', true);
        });
      }
    }
  }



})();
