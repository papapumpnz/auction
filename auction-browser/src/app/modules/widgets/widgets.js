(function() {
  'use strict';

  angular.module('singApp.widgets')
    .controller('YearsMapDemoController', YearsMapDemoController)
    .controller('FlotChartDemoController', FlotChartDemoController)
    .controller('NasdaqSparklineDemoController', NasdaqSparklineDemoController)
    .controller('RealtimeTrafficWidgetDemoController', RealtimeTrafficWidgetDemoController)
    .controller('ChangesChartWidgetDemoController', ChangesChartWidgetDemoController)
  ;

  YearsMapDemoController.$inject = ['$scope', 'fakeWorldData', 'jQuery'];
  function YearsMapDemoController ($scope, fakeWorldData, jQuery) {
    $scope.applyToScope = function(){
      $scope.selectedYear = 2009;

      $scope.$watch('selectedYear', function(year, oldYear){
        if (year === oldYear) return;
        $scope.$map.trigger('update', [fakeWorldData[year], {}, {}, {animDuration : 300}]);
      });

      $scope.data = {
        map:{
          name : 'world_countries',
          defaultArea : {
            attrs : {
              fill: $scope.app.settings.colors['gray-lighter'],
              stroke : $scope.app.settings.colors['gray'],
              "stroke-width" :.1
            },
            attrsHover : {
              fill : $scope.app.settings.colors['gray-light'],
              animDuration : 100
            }
          },
          defaultPlot:{
            size: 17,
            attrs : {
              fill : $scope.app.settings.colors['brand-warning'],
              stroke : '#fff',
              "stroke-width" : 0,
              "stroke-linejoin" : 'round'
            },
            attrsHover : {
              "stroke-width" : 1,
              animDuration : 100
            }
          },
          zoom : {
            enabled : true,
            step : 1,
            maxLevel: 10
          }
        }
        ,legend : {
          area : {
            display : false,
            slices : [
              {
                max :5000000,
                attrs : {
                  fill : $scope.app.helpers.lightenColor('#ebeff1',.04)
                },
                label :'Less than 5M'
              },
              {
                min :5000000,
                max :10000000,
                attrs : {
                  fill : '#ebeff1'
                },
                label :'Between 5M and 10M'
              },
              {
                min :10000000,
                max :50000000,
                attrs : {
                  fill : $scope.app.settings.colors['gray-lighter']
                },
                label :'Between 10M and 50M'
              },
              {
                min :50000000,
                attrs : {
                  fill : $scope.app.helpers.darkenColor('#ebeff1',.1)
                },
                label :'More than 50M'
              }
            ]
          }
        },
        areas: fakeWorldData[$scope.selectedYear]['areas']
      };
      var coords = jQuery.fn.mapael.maps['world_countries'].getCoords(59.599254, 8.863224);
      $scope.zoom = [6, coords.x, coords.y];
    };

    $scope.applyToScope();
  }

  FlotChartDemoController.$inject = ['$scope'];
  function FlotChartDemoController ($scope) {
    $scope.generateRandomData = function(labels){
      function random() {
        return (Math.floor(Math.random() * 30)) + 10;
      }

      var data = [],
        maxValueIndex = 5;

      for (var i = 0; i < labels.length; i++){
        var randomSeries = [];
        for (var j = 0; j < 25; j++){
          randomSeries.push([j, Math.floor(maxValueIndex * j) + random()])
        }
        maxValueIndex--;
        data.push({
          data: randomSeries, showLabels: true, label: labels[i].label, labelPlacement: 'below', canvasRender: true, cColor: 'red', color: labels[i].color
        })
      }
      return data;
    };
  }

  NasdaqSparklineDemoController.$inject = ['$scope', 'jQuery'];
  function NasdaqSparklineDemoController ($scope, jQuery) {
    $scope.applyToScope = function(){
      $scope.data = [4,6,5,7,5];
      $scope.options = {
        type: 'line',
        width: '100%',
        height: '60',
        lineColor: $scope.app.settings.colors['gray'],
        fillColor: 'transparent',
        spotRadius: 5,
        spotColor: $scope.app.settings.colors['gray'],
        valueSpots: {'0:':$scope.app.settings.colors['gray']},
        highlightSpotColor: $scope.app.settings.colors['white'],
        highlightLineColor: $scope.app.settings.colors['gray'],
        minSpotColor: $scope.app.settings.colors['gray'],
        maxSpotColor: $scope.app.settings.colors['brand-danger'],
        tooltipFormat: new jQuery.SPFormatClass('<span style="color: white">&#9679;</span> {{prefix}}{{y}}{{suffix}}'),
        chartRangeMin: $scope.app.helpers.min($scope.data)  - 1
      };
    };

    $scope.applyToScope()
  }

  RealtimeTrafficWidgetDemoController.$inject = ['$scope', 'Rickshaw'];
  function RealtimeTrafficWidgetDemoController ($scope, Rickshaw) {
    $scope.applyToScope = function(){
      $scope.seriesData = [ [], [] ];
      $scope.random = new Rickshaw.Fixtures.RandomData(30);

      for (var i = 0; i < 30; i++) {
        $scope.random.addData($scope.seriesData);
      }
      $scope.series = [
        {
          color: $scope.app.settings.colors['gray-dark'],
          data: $scope.seriesData[0],
          name: 'Uploads'
        }, {
          color: $scope.app.settings.colors['gray'],
          data: $scope.seriesData[1],
          name: 'Downloads'
        }
      ]
    };

    $scope.applyToScope();
  }

  ChangesChartWidgetDemoController.$inject = ['$scope', 'jQuery', 'Rickshaw'];
  function ChangesChartWidgetDemoController ($scope, jQuery, Rickshaw) {
    $scope.applyRickshawData = function(){
      var seriesData = [ [], [] ];
      var random = new Rickshaw.Fixtures.RandomData(10000);

      for (var i = 0; i < 32; i++) {
        random.addData(seriesData);
      }

      $scope.series = [{
        name: 'pop',
        data: seriesData.shift().map(function(d) { return { x: d.x, y: d.y } }),
        color: $scope.app.helpers.lightenColor($scope.app.settings.colors['brand-success'], .09),
        renderer: 'bar'
      }, {
        name: 'humidity',
        data: seriesData.shift().map(function(d) { return { x: d.x, y: d.y * (Math.random()*0.1 + 1.1) } }),
        renderer: 'line',
        color: $scope.app.settings.colors['white']
      }];
    };

    $scope.applySparklineData = function(){
      var data = [3,6,2,4,5,8,6,8],
        dataMax = $scope.app.helpers.max(data),
        backgroundData = data.map(function(){return dataMax});

      $scope.sparklineData = [backgroundData, data];
      $scope.sparklineOptions = [{
        type: 'bar',
        height: 26,
        barColor: $scope.app.settings.colors['gray-lighter'],
        barWidth: 7,
        barSpacing: 5,
        chartRangeMin: $scope.app.helpers.min(data),
        tooltipFormat: new jQuery.SPFormatClass('')
      },{
        composite: true,
        type: 'bar',
        barColor: $scope.app.settings.colors['brand-success'],
        barWidth: 7,
        barSpacing: 5
      }];
    };
    $scope.applyRickshawData();

    $scope.applySparklineData();
  }

})();
