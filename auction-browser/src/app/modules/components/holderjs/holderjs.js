(function() {
  'use strict';

  angular.module('singApp.components.holderjs')
    .directive('holderjs', holderjs)
  ;

  holderjs.$inject = ['$window'];
  function holderjs($window){
    return {
      link: function (scope, $el) {
        $window.Holder.run({
          images: $el[0]
        })
      }
    }
  }


})();
