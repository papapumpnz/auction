(function() {
  'use strict';

  angular.module('singApp.components.flot')
    .directive('flotChart', flotChart)
  ;

  flotChart.$inject = ['jQuery'];
  function flotChart(jQuery){
    return {
      link: function (scope, $el, attrs){
        jQuery.plot($el, scope[attrs.ngModel], scope[attrs.options] || {
            series: {
              lines: {
                show: true,
                lineWidth: 1,
                fill: false,
                fillColor: { colors: [{ opacity: .001 }, { opacity: .5}] }
              },
              points: {
                show: false,
                fill: true
              },
              shadowSize: 0
            },
            legend: false,
            grid: {
              show:false,
              margin: 0,
              labelMargin: 0,
              axisMargin: 0,
              hoverable: true,
              clickable: true,
              tickColor: 'rgba(255,255,255,1)',
              borderWidth: 0
            }
          });
      }
    }
  }



})();
