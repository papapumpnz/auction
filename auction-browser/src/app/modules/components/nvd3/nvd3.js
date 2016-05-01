(function() {
  'use strict';

  angular.module('singApp.components.nvd3')
    .directive('nvd3Chart', nvd3Chart)
    .factory('nv', nvFactory)
    .factory('d3', d3Factory)
  ;

  nvd3Chart.$inject = ['$window', 'jQuery', 'nv', 'd3'];
  function nvd3Chart($window, jQuery, nv, d3){
    return {
      link: function (scope, $el, attrs){
        function render(){
          nv.addGraph(function() {
            var chart = scope[attrs.chart];
            d3.select($el.find('svg')[0])
              .style('height', attrs.height || '300px')
              .datum(scope[attrs.datum])
              .transition().duration(500)
              .call(chart)
            ;

            jQuery($window).on('sn:resize', chart.update);

            return chart;
          });
        }


        render();
      }
    }
  }

  nvFactory.$inject = ['$window'];
  function nvFactory($window) {
    return $window.nv;
  }

  d3Factory.$inject = ['$window'];
  function d3Factory($window) {
    return $window.d3;
  }



})();
