(function() {
  'use strict';

  angular.module('singApp.components.gallery')
    .directive('snGallery', snGallery)
  ;

  snGallery.$inject = ['$timeout', '$window', 'jQuery'];
  function snGallery($timeout, $window, jQuery){
    return {
      link: function(scope, $el, attrs){
        var $sizer = $el.find('.js-shuffle-sizer');

        $timeout(function() {
          // instantiate the plugin
          $el.shuffle(angular.extend({ sizer: $sizer }, scope.$eval(attrs.options)));
          $timeout(function(){
            $el.shuffle( 'shuffle', 'all' );
          })
        });

        jQuery($window).on('sn:resize', function(){
          $el.shuffle('update');
        });

        scope.$grid = $el;
      }
    }
  }


})();
