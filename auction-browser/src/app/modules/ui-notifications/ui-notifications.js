(function() {
  'use strict';

  angular.module('singApp.ui.notifications')
    .directive('messengerDemo', messengerDemo)
    .factory('Messenger', MessengerFactory)
  ;

  messengerDemo.$inject = ['$window', 'jQuery', 'Messenger'];
  function messengerDemo($window, jQuery, Messenger){
    function initializationCode(){
      (function() {
        var $, FlatMessage, spinner_template,
          __hasProp = {}.hasOwnProperty,
          __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

        $ = jQuery;

        spinner_template = '<div class="messenger-spinner">\n    <span class="messenger-spinner-side messenger-spinner-side-left">\n        <span class="messenger-spinner-fill"></span>\n    </span>\n    <span class="messenger-spinner-side messenger-spinner-side-right">\n        <span class="messenger-spinner-fill"></span>\n    </span>\n</div>';

        FlatMessage = (function(_super) {

          __extends(FlatMessage, _super);

          function FlatMessage() {
            return FlatMessage.__super__.constructor.apply(this, arguments);
          }

          FlatMessage.prototype.template = function(opts) {
            var $message;
            $message = FlatMessage.__super__.template.apply(this, arguments);
            $message.append(jQuery(spinner_template));
            return $message;
          };

          return FlatMessage;

        })($window.Messenger.Message);

        $window.Messenger.themes.air = {
          Message: FlatMessage
        };

      }).call($window);
    }
    return {
      link: function(scope, $el){
        function render(){
          initializationCode();
          var theme = 'air';

          jQuery.globalMessenger({ theme: theme });
          Messenger.options = { theme: theme  };

          Messenger().post('Thanks for checking out Messenger!');


          var loc = ['bottom', 'right'];

          var $lsel = jQuery('.location-selector');

          var update = function(){
            var classes = 'messenger-fixed';

            for (var i=0; i < loc.length; i++)
              classes += ' messenger-on-' + loc[i];

            jQuery.globalMessenger({ extraClasses: classes, theme: theme  });
            Messenger.options = { extraClasses: classes, theme: theme };
          };

          update();

          $lsel.locationSelector()
            .on('update', function(pos){
              loc = pos;

              update();
            });

          jQuery('#show-error-message').on('click', function(){
            var i;

            i = 0;

            Messenger().run({
              errorMessage: 'Error destroying alien planet',
              successMessage: 'Alien planet destroyed!',
              action: function(opts) {
                if (++i < 3) {
                  return opts.error({
                    status: 500,
                    readyState: 0,
                    responseText: 0
                  });
                } else {
                  return opts.success();
                }
              }
            });

            return false;
          });

          jQuery('#show-info-message').on('click', function(){
            var msg = Messenger().post({
              message: 'Launching thermonuclear war...',
              actions: {
                cancel: {
                  label: 'cancel launch',
                  action: function() {
                    return msg.update({
                      message: 'Thermonuclear war averted',
                      type: 'success',
                      actions: false
                    });
                  }
                }
              }
            });

            return false;
          });

          jQuery('#show-success-message').on('click', function(){
            Messenger().post({
              message: 'Showing success message was successful!',
              type: 'success',
              showCloseButton: true
            });

            return false;
          });
        }

        render()
      }
    }
  }

  MessengerFactory.$inject = ['$window'];
  function MessengerFactory ($window) {
    return $window.Messenger;
  }

})();
