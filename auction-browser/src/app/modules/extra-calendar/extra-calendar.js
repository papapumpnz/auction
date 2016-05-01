(function() {
  'use strict';

  angular.module('singApp.extra.calendar')
    .controller('CalendarAppController', CalendarAppController)
    .controller('CreateEventModalInstanceCtrl', CreateEventModalInstanceCtrl)
    .controller('ShowEventModalInstanceCtrl', ShowEventModalInstanceCtrl)
    .factory('moment', momentService)
  ;

  CalendarAppController.$inject = ['$scope', '$modal', 'uiCalendarConfig', 'jQuery', 'moment'];
  function CalendarAppController ($scope, $modal, uiCalendarConfig, jQuery, moment) {


    $scope.uiConfig = {
      calendar: {
        header: {
          left: '',
          center: '',
          right: ''
        },
        selectable: true,
        selectHelper: true,
        select: function (start, end, allDay) {
          var modal = $modal.open({
            templateUrl: 'create-event-modal.html',
            controller: 'CreateEventModalInstanceCtrl',
            size: 'sm',
            resolve: {
              event: function () {
                return {
                  start: start,
                  end: end,
                  allDay: allDay
                }
              }
            }
          });

          modal.result.then($scope.addEvent, angular.noop);
        },
        editable: true,
        droppable: true,

        drop: function (date, event) { // this function is called when something is dropped
          // retrieve the dropped element's stored Event Object
          var originalEventObject = {
            title: jQuery.trim(jQuery(event.target).text()) // use the element's text as the event title
          };

          // we need to copy it, so that multiple events don't have a reference to the same object
          var copiedEventObject = jQuery.extend({}, originalEventObject);

          // assign it the date that was reported
          copiedEventObject.start = date;
          copiedEventObject.allDay = !date.hasTime();

          var $categoryClass = jQuery(event.target).data('event-class');
          if ($categoryClass)
            copiedEventObject['className'] = [$categoryClass];

          // render the event on the calendar
          // the last `true` argument determines if the event 'sticks' (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
          uiCalendarConfig.calendars.eventsCalendar.fullCalendar('renderEvent', copiedEventObject, true);

          jQuery(event.target).remove();

        },

        eventClick: function (event) {
          // opens events in a popup window
          $modal.open({
            templateUrl: 'show-event-modal.html',
            controller: 'ShowEventModalInstanceCtrl',
            size: 'sm',
            resolve: {
              event: function () {
                return event;
              }
            }
          })
        }
      }
    };

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $scope.events = [
      {
        title: 'All Day Event',
        start: new Date(y, m, 1),
        backgroundColor: '#79A5F0',
        textColor: '#fff',
        description: 'Will be busy throughout the whole day'
      },
      {
        title: 'Long Event',
        start: new Date(y, m, d + 5),
        end: new Date(y, m, d + 7),
        description: 'This conference should be worse visiting'
      },
      {
        id: 999,
        title: 'Blah Blah Car',
        start: new Date(y, m, d - 3, 16, 0),
        allDay: false,
        description: 'Agree with this guy on arrival time'
      },
      {
        id: 1000,
        title: 'Buy this template',
        start: new Date(y, m, d + 3, 12, 0),
        allDay: false,
        backgroundColor: '#555',
        textColor: '#fff',
        description: 'Make sure everything is consistent first'
      },
      {
        title: 'Study some Node',
        start: new Date(y, m, d + 18, 12, 0),
        end: new Date(y, m, d + 18, 13, 0),
        backgroundColor: '#79A5F0',
        textColor: '#fff',
        description: 'Node.js is a platform built on Chrome\'s JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.'
      },
      {
        title: 'Got to school',
        start: new Date(y, m, d + 16, 12, 0),
        end: new Date(y, m, d + 16, 13, 0),
        backgroundColor: '#64bd63',
        textColor: '#fff',
        description: 'Time to go back'
      },
      {
        title: 'Click for Flatlogic',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        url: 'http://flatlogic.com/',
        backgroundColor: '#e5603b',
        textColor: '#fff',
        description: 'Creative solutions'
      }
    ];

    $scope.eventSources = [$scope.events];

    $scope.addEvent = function (event) {
      $scope.events.push(event);
    };

    $scope.changeView = function (view) {
      uiCalendarConfig.calendars.eventsCalendar.fullCalendar('changeView', view)
    };

    $scope.currentMonth = function () {
      if (uiCalendarConfig.calendars.eventsCalendar) {
        return moment(uiCalendarConfig.calendars.eventsCalendar.fullCalendar('getDate')).format('MMM YYYY')
      }
    };

    $scope.currentDay = function () {
      if (uiCalendarConfig.calendars.eventsCalendar) {
        return moment(uiCalendarConfig.calendars.eventsCalendar.fullCalendar('getDate')).format('dddd');
      }
    };

    $scope.prev = function () {
      uiCalendarConfig.calendars.eventsCalendar.fullCalendar('prev');
    };

    $scope.next = function () {
      uiCalendarConfig.calendars.eventsCalendar.fullCalendar('next');
    };
  }


  CreateEventModalInstanceCtrl.$inject = ['$scope', '$modalInstance', 'event'];
  function CreateEventModalInstanceCtrl ($scope, $modalInstance, event) {
    $scope.event = event;

    $scope.ok = function () {
      $modalInstance.close($scope.event);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  ShowEventModalInstanceCtrl.$inject = ['$scope', '$modalInstance', 'event'];
  function ShowEventModalInstanceCtrl ($scope, $modalInstance, event) {
    $scope.event = event;

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  momentService.$inject = ['$window'];
  function momentService($window) {
    return $window.moment;
  }



})();
