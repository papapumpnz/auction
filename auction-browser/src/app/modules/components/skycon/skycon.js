(function() {
  'use strict';

  angular.module('singApp.components.skycon')
    .directive('skyCon', skyCon)
    .factory('Skycons', SkyconsFactory)
  ;

  skyCon.$inject = ['Skycons'];
  function skyCon(Skycons){
    return {
      link: function (scope, $el, attrs){
        var icons = new Skycons({"color": scope.$eval(attrs.color)});
        icons.set($el[0], attrs.skyCon);
        icons.play();
      }
    }
  }

  SkyconsFactory.$inject = ['$window'];
  function SkyconsFactory ($window) {
    return $window.Skycons;
  }



})();
