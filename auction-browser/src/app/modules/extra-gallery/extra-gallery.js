(function() {
  'use strict';

  angular.module('singApp.extra.gallery')
    .controller('GalleryAppController', GalleryAppController)
  ;

  GalleryAppController.$inject = ['$scope'];
  function GalleryAppController ($scope) {
    $scope.items = [
      {
        'name':'Mountains',
        'groups':[
          'nature'
        ],
        'src':'assets/images/pictures/1.jpg',
        'date':'10 mins'
      },
      {
        'name':'Empire State Pigeon',
        'groups':[
          'people'
        ],
        'src':'assets/images/pictures/2.jpg',
        'date':'1 hour',
        'like': true
      },
      {
        'name':'Big Lake',
        'groups':[
          'nature'
        ],
        'src':'assets/images/pictures/3.jpg',
        'date':'2 mins',
        'like': true
      },
      {
        'name':'Forest',
        'groups':[
          'nature'
        ],
        'src':'assets/images/pictures/4.jpg',
        'date':'2 mins',
        'like': true
      },
      {
        'name':'Smile',
        'groups':[
          'people'
        ],
        'src':'assets/images/pictures/5.jpg',
        'date':'2 mins'
      },
      {
        'name':'Smile',
        'groups':[
          'people'
        ],
        'src':'assets/images/pictures/6.jpg',
        'date':'1 hour',
        'like': true
      },
      {
        'name':'Fog',
        'groups':[
          'nature'
        ],
        'src':'assets/images/pictures/8.jpg',
        'date':'2 mins',
        'like': true
      },
      {
        'name':'Beach',
        'groups':[
          'people'
        ],
        'src':'assets/images/pictures/9.jpg',
        'date':'2 mins'
      },
      {
        'name':'Pause',
        'groups':[
          'people'
        ],
        'src':'assets/images/pictures/10.jpg',
        'date':'3 hour',
        'like': true
      },
      {
        'name':'Space',
        'groups':[
          'space'
        ],
        'src':'assets/images/pictures/11.jpg',
        'date':'3 hour',
        'like': true
      },
      {
        'name':'Shuttle',
        'groups':[
          'space'
        ],
        'src':'assets/images/pictures/13.jpg',
        'date':'35 mins',
        'like': true
      },
      {
        'name':'Sky',
        'groups':[
          'space'
        ],
        'src':'assets/images/pictures/14.jpg',
        'date':'2 mins'
      }
    ];

    $scope.activeGroup = 'all';

    $scope.order = 'asc';

    $scope.$watch('activeGroup', function(newVal, oldVal){
      if (newVal === oldVal) return;
      $scope.$grid.shuffle( 'shuffle', newVal );
    });

    $scope.$watch('order', function(newVal, oldVal){
      if (newVal === oldVal) return;
      $scope.$grid.shuffle('sort', {
        reverse: newVal === 'desc',
        by: function($el) {
          return $el.data('title').toLowerCase();
        }
      });
    })
  }

})();
