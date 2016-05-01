(function() {
  'use strict';

  angular.module('singApp.components.rickshaw')
    .directive('rickshawChart', rickshawChart)
    .factory('Rickshaw', rickshawFactory)
  ;

  rickshawChart.$inject = ['$window', '$interval', 'Rickshaw','jQuery'];
  function rickshawChart($window, $interval, Rickshaw, jQuery){
    return {
      scope: {
        height: '@',
        series: '=',

        realtime: '=',
        seriesData: '=',
        random: '=',
        configureProps: '='
      },
      link: function (scope, $el, attrs){
        function render(){
          var graph = new Rickshaw.Graph({
            element: $el[0],
            height: scope.height,
            renderer: attrs.renderer || 'area',
            series: scope.series
          });

          function onResize(){
            var configureProperties = jQuery.extend({
              width: $el.width(),
              height: scope.height
            }, scope.configureProps);
            graph.configure(configureProperties);
            graph.render();

            $el.find('svg').css({height: scope.height})
          }

          jQuery($window).on('sn:resize', onResize);
          onResize();


          var hoverDetail = new Rickshaw.Graph.HoverDetail( {
            graph: graph,
            xFormatter: function(x) {
              return new Date(x * 1000).toString();
            }
          } );

          if (scope.realtime){
            $interval( function() {
              scope.random.removeData(scope.seriesData);
              scope.random.addData(scope.seriesData);
              graph.update();

            }, 1000 );
          }
        }
        scope.$watch('series', function(val, oldVal){
          if (!angular.isDefined(val)) return;
          render();
        })
      }
    }
  }

  rickshawFactory.$inject = ['$window'];

  function rickshawFactory($window) {
    return $window.Rickshaw;
  }

})();
