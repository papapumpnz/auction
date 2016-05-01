(function() {
  'use strict';

  angular.module('singApp.components.mapael')
    .directive('snMapaelLayersMap', snMapaelLayersMap)
  ;

  snMapaelLayersMap.$inject = [];
  function snMapaelLayersMap(){
    return {
      require: 'ngModel',
      link: function (scope, $el, attrs, ngModel) {
        function render(){
          scope.$watch(attrs.ngModel, function(data, oldData){
            if (!angular.isDefined(data)) return;
            var $map = $el;
            $map.css('height', attrs.height || 394).css('margin-bottom', attrs.marginBottom || (-15));
            if ($map.parents('.widget')[0]){
              $map.find('.map').css('height', parseInt($map.parents('.widget').css('height')) - 40);
            }
            $map.mapael(data);

            if (scope[attrs.zoom]){
              $map.trigger('zoom', scope[attrs.zoom]);
            }

            scope.$map = $map;
          })
        }

        render();
      }
    }
  }


})();
