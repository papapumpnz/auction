(function() {
  'use strict';

  angular.module('singApp.form.elements')
    .controller('FormElementsDemoController', FormElementsDemoController)
    .directive('summernoteFullscreenHelper', SummernoteFullscreenHelper)
    .run(summernoteConfigure)
  ;

  FormElementsDemoController.$inject = ['$scope', '$window', 'jQuery'];
  function FormElementsDemoController ($scope, $window, jQuery) {
    $scope.dtChanged = function(dt){
      $window.alert('Angular model changed to: ' + dt);
    };

    jQuery('#datetimepicker2').datetimepicker();
  }

  SummernoteFullscreenHelper.$inject = ['jQuery'];
  function SummernoteFullscreenHelper(jQuery) {
    return {
      link: function (scope, $el, attrs) {
        $el.on('click', '[data-event="fullscreen"]', function () {
          jQuery('.page-controls').css('z-index',
            $el.find('.note-editor.fullscreen').length ? 0 : ''
          );
        })
      }
    }
  }

  summernoteConfigure.$inject = ['jQuery'];
  function summernoteConfigure (jQuery) {
    // replace summernot dialog to make awesome-bootstrap-checkbox work
    jQuery.summernote.renderer.addDialogInfo('link', function (lang, options) {
      var body = '<div class="form-group">' +
                   '<label>' + lang.link.textToDisplay + '</label>' +
                   '<input class="note-link-text form-control" type="text" />' +
                 '</div>' +
                 '<div class="form-group">' +
                   '<label>' + lang.link.url + '</label>' +
                   '<input class="note-link-url form-control" type="text" value="http://" />' +
                 '</div>' +
                 (!options.disableLinkTarget ?
                   '<div class="checkbox">' +
                     '<input type="checkbox" checked id="summernoteLinkTargetCheckbox"> ' +
                     '<label for="summernoteLinkTargetCheckbox">' +
                     lang.link.openInNewWindow +
                     '</label>' +
                   '</div>' : ''
                 );
      var footer = '<button class="btn btn-primary note-link-btn disabled" disabled>' + lang.link.insert + '</button>';
      return tplDialog('note-link-dialog', lang.link.insert, body, footer);
    });

    var tplDialog = function (className, title, body, footer) {
      return '<div class="' + className + ' modal" aria-hidden="false">' +
          '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            (title ?
              '<div class="modal-header">' +
                '<button type="button" class="close" aria-hidden="true" tabindex="-1">&times;</button>' +
                '<h4 class="modal-title">' + title + '</h4>' +
              '</div>' : ''
            ) +
            '<div class="modal-body">' + body + '</div>' +
            (footer ?
              '<div class="modal-footer">' + footer + '</div>' : ''
            ) +
            '</div>' +
          '</div>' +
        '</div>';
    }
  }

})();
