(function() {
  'use strict';

  angular.module('singApp.dashboard')
    .controller('DashboardController', DashboardController)
    .controller('GeoLocationsWidgetDemoController', GeoLocationsWidgetDemoController)
    .controller('MarketStatsWidgetDemoController', MarketStatsWidgetDemoController)
    .controller('BootstrapCalendarDemoController', BootstrapCalendarDemoController)
    .directive('bootstrapCalendar', bootstrapCalendar)
  ;

  DashboardController.$inject = ['$scope'];
  function DashboardController ($scope) {

  }






  GeoLocationsWidgetDemoController.$inject = ['$scope', 'config'];
  function GeoLocationsWidgetDemoController ($scope, config) {
    var state;
    $scope.mapData = {
      map:{
        name : 'usa_states',
        defaultArea : {
          attrsHover : {
            fill : '#242424',
            animDuration : 100
          },
          tooltip: {
            content: function(){
              return '<strong>' + state + '</strong>';
            }
          },
          eventHandlers: {
            mouseover: function(e, id){
              state = id;
            }
          }
        },
        defaultPlot:{
          size: 17,
          attrs : {
            fill : config.settings.colors['brand-warning'],
            stroke : '#fff',
            'stroke-width' : 0,
            'stroke-linejoin' : 'round'
          },
          attrsHover : {
            'stroke-width' : 1,
            animDuration : 100
          }
        },
        zoom : {
          enabled : true,
          step : 0.75,
          mousewheel: false
        }
      },
      plots:{
        'ny' : {
          latitude: 40.717079,
          longitude: -74.00116,
          tooltip: {content : 'New York'}
        },
        'on' : {
          latitude: 33.145235,
          longitude: -83.811834,
          size: 18,
          tooltip: {content : 'Oconee National Forest'}
        },
        'sf' : {
          latitude: 37.792032,
          longitude: -122.394613,
          size: 12,
          tooltip: {content : 'San Francisco'}
        },
        'la' : {
          latitude: 26.935080,
          longitude: -80.851766,
          size: 26,
          tooltip: {content : 'Lake Okeechobee'}
        },
        'gc' : {
          latitude: 36.331308,
          longitude: -83.336050,
          size: 10,
          tooltip: {content : 'Grainger County'}
        },
        'cc' : {
          latitude: 36.269356,
          longitude: -76.587477,
          size: 22,
          tooltip: {content : 'Chowan County'}
        },
        'll' : {
          latitude: 30.700644,
          longitude: -95.145249,
          tooltip: {content : 'Lake Livingston'}
        },
        'tc' : {
          latitude: 34.546708,
          longitude: -90.211471,
          size: 14,
          tooltip: {content : 'Tunica County'}
        },
        'lc' : {
          latitude: 32.628599,
          longitude: -103.675115,
          tooltip: {content : 'Lea County'}
        },
        'uc' : {
          latitude: 40.456692,
          longitude: -83.522688,
          size: 11,
          tooltip: {content : 'Union County'}
        },
        'lm' : {
          latitude: 33.844630,
          longitude: -118.157483,
          tooltip: {content : 'Lakewood Mutual'}
        }
      }
    };
  }

  MarketStatsWidgetDemoController.$inject = ['$scope', 'Rickshaw'];
  function MarketStatsWidgetDemoController ($scope, Rickshaw) {

    $scope.seriesData = [ [], [] ];
    $scope.random = new Rickshaw.Fixtures.RandomData(30);

    for (var i = 0; i < 30; i++) {
      $scope.random.addData($scope.seriesData);
    }
    $scope.series = [
      {
        color: '#F7653F',
        data: $scope.seriesData[0],
        name: 'Uploads'
      }, {
        color: '#F7D9C5',
        data: $scope.seriesData[1],
        name: 'Downloads'
      }
    ]

  }

  BootstrapCalendarDemoController.$inject = ['$scope'];
  function BootstrapCalendarDemoController ($scope) {
    var now = new Date();
    $scope.month = now.getMonth() + 1;
    $scope.year = now.getFullYear();
  }

  bootstrapCalendar.$inject = ['jQuery'];
  function bootstrapCalendar(jQuery){
    return {
      restrict: 'A',
      link: function(scope, $el, attrs){
        function render(){
          var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',  'July', 'August', 'September', 'October', 'November', 'December'];

          var dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

          var events = scope.$eval(attrs.events);
          var $calendar = $el;
          $calendar.calendar({
            months: monthNames,
            days: dayNames,
            events: events,
            popover_options:{
              placement: 'top',
              html: true
            }
          });
          $calendar.find('.icon-arrow-left').addClass('fa fa-arrow-left');
          $calendar.find('.icon-arrow-right').addClass('fa fa-arrow-right');
          function restyleCalendar(){
            $calendar.find('.event').each(function(){
              var $this = jQuery(this),
                $eventIndicator = jQuery('<span></span>');
              $eventIndicator.css('background-color', $this.css('background-color')).appendTo($this.find('a'));
              $this.css('background-color', '');
            })
          }
          $calendar.find('.icon-arrow-left, .icon-arrow-right').parent().on('click', restyleCalendar);
          restyleCalendar();
        }

        attrs.$observe('events', function(){
          render();
        })
      }
    }
  }
})();
