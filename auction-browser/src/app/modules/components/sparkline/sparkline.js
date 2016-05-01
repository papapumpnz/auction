(function() {
  'use strict';

  angular.module('singApp.components.sparkline')
    .directive('jqSparkline', jqSparkline)
  ;

  jqSparkline.$inject = ['jQuery'];
  function jqSparkline(jQuery){
    return {
      // pass model & options as arrays to enable composite sparklines
      require: 'ngModel',
      link: function (scope, $el, attrs, ngModel) {
        function render(){
          var model = angular.isString(ngModel.$viewValue) ? ngModel.$viewValue.replace(/(^,)|(,$)/g, '') : ngModel.$viewValue,
            options = scope[attrs.options];

          // enabling composite chart if array passed
          if (angular.isArray(model) && angular.isArray(options)){
            options.forEach(function(singleOptions, i){
              if (i === 0){
                $el.sparkline(model[i], singleOptions);
              } else { // set composite for next calls
                $el.sparkline(model[i], jQuery.extend({composite: true}, singleOptions));
              }
            });
          } else {
            var data;
            // Make sure we have an array of numbers
            angular.isArray(model) ? data = model : data = model.split(',');
            $el.sparkline(data, options);
          }
        }

        scope.$watch(attrs.ngModel, function() {
          render();
        });
      }
    }
  }



})();
