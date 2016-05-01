(function() {
  'use strict';

  angular.module('singApp.components.morris')
    .directive('morrisChart', morrisChart)
  ;

  morrisChart.$inject = ['$window'];
  function morrisChart($window){
    function capitalise(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    return {
      link: function (scope, $el, attrs){
        function render(){
          $el.css({height: attrs.height}); //safari svg height fix
          $window.Morris[capitalise(attrs.type)](angular.extend({
            element: $el[0]
          }, scope[attrs.options]));
        }

        render();
      }
    }
  }



})();
