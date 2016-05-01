(function() {
  'use strict';

  angular.module('singApp.components.gmap')
    .directive('snGmap', snGmap)
  ;

  snGmap.$inject = ['$rootScope', '$timeout', 'jQuery', '$window'];
  function snGmap($rootScope, $timeout, jQuery, $window){

    if (!angular.isDefined($window.GMaps)){
      // loading google maps synamically to be able to use their callback method
      var script = $window.document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'http://maps.google.com/maps/api/js?sensor=true&callback=googleMapsLoaded';
      $window.document.body.appendChild(script);

      // a small trick to ensure google api was loaded
      // googleMapsLoaded function gets called by google script script after
      $rootScope.gmapsLoaded = false;
      window.googleMapsLoaded = function(){
        var script = $window.document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'vendor/gmaps/gmaps.js';
        script.onload = function(){
          $rootScope.$apply(function(){
            $rootScope.gmapsLoaded = true;
          })
        };
        $window.document.body.appendChild(script);
      };
    }


    return {
      link: function(scope, $el, attrs){
        function render(){
          var map = new $window.GMaps({
            el: $el[0],
            lat: -37.813179,
            lng: 144.950259,
            zoomControl : false,
            panControl : false,
            streetViewControl : false,
            mapTypeControl: false,
            overviewMapControl: false
          });

          if (attrs.contextMenu){
            map.setContextMenu({
              control: 'map',
              options: [{
                title: 'Add marker',
                name: 'add_marker',
                action: function(e){
                  this.addMarker({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                    animation: $window.google.maps.Animation.DROP,
                    draggable:true,
                    title: 'New Marker'
                  });
                  this.hideContextMenu();
                }
              }, {
                title: 'Center here',
                name: 'center_here',
                action: function(e){
                  this.setCenter(e.latLng.lat(), e.latLng.lng());
                }
              }]
            });
            map.setContextMenu({
              control: 'marker',
              options: [{
                title: 'Center here',
                name: 'center_here',
                action: function(e){
                  this.setCenter(e.latLng.lat(), e.latLng.lng());
                }
              }]
            });
          }

          jQuery('[data-gmap-zoom-in]').on('click', function() {
            map.zoomIn(1);
          });
          jQuery('[data-gmap-zoom-out]').on('click', function() {
            map.zoomOut(1);
          });

          $timeout( function(){
            map.addMarker({
              lat: -37.813179,
              lng: 144.950259,
              animation: google.maps.Animation.DROP,
              draggable: true,
              title: 'Here we are'
            });
          }, 3000);
        }
        if ($rootScope.gmapsLoaded || angular.isDefined(window.GMaps)){
          render()
        } else {
          $rootScope.$watch('gmapsLoaded', function(val){
            (val === true) && render();
          });
        }
      }
    }
  }


})();
