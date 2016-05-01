(function() {
  'use strict';

  angular.module('singApp.form.wizard')
    .directive('bootstrapApplicationWizard', bootstrapApplicationWizard)
  ;

  bootstrapApplicationWizard.$inject = ['$window', '$timeout', '$log', 'jQuery'];
  function bootstrapApplicationWizard($window, $timeout, $log, jQuery){
    $window.validateServerLabel = function(el) {
      var name = el.val();
      var retValue = {};

      if (name === '') {
        retValue.status = false;
        retValue.msg = 'Please enter a label';
      } else {
        retValue.status = true;
      }

      return retValue;
    };

    $window.validateFQDN = function(el) {
      var $this = jQuery(el);
      var retValue = {};

      if ($this.is(':disabled')) {
        // FQDN Disabled
        retValue.status = true;
      } else {
        if ($this.data('lookup') === 0) {
          retValue.status = false;
          retValue.msg = 'Preform lookup first';
        } else {
          if ($this.data('is-valid') === 0) {
            retValue.status = false;
            retValue.msg = 'Lookup Failed';
          } else {
            retValue.status = true;
          }
        }
      }

      return retValue;
    };

    function lookup() {
      // Normally a ajax call to the server to preform a lookup
      jQuery('#fqdn').data('lookup', 1);
      jQuery('#fqdn').data('is-valid', 1);
      jQuery('#ip').val('127.0.0.1');
    }
    return {
      link: function (scope, $el, attrs){
        function render(){
          var wizard = $el.wizard({
            keyboard : false,
            contentHeight : 400,
            contentWidth : 700,
            backdrop: 'static'
          });

          jQuery('#fqdn').on('input', function() {
            if (jQuery(this).val().length !== 0) {
              jQuery('#ip').val('').attr('disabled', 'disabled');
              jQuery('#fqdn, #ip').parents('.form-group').removeClass('has-error has-success');
            } else {
              jQuery('#ip').val('').removeAttr('disabled');
            }
          });

          jQuery('#btn-fqdn').find('button').on('click', lookup);

          var pattern = /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
          var x = 46;

          jQuery('#ip').on('input', function() {
            if (jQuery(this).val().length !== 0) {
              jQuery('#fqdn').val('').attr('disabled', 'disabled');
            } else {
              jQuery('#fqdn').val('').removeAttr('disabled');
            }
          }).keypress(function(e) {
            if (e.which !== 8 && e.which !== 0 && e.which !== x && (e.which < 48 || e.which > 57)) {
              $log.log(e.which);
              return false;
            }
          }).keyup(function() {
            var $this = jQuery(this);
            if (!pattern.test($this.val())) {
              //jQuery('#validate_ip').text('Not Valid IP');
              $log.log('Not Valid IP');
              $this.parents('.form-group').removeClass('has-error has-success').addClass('has-error');
              while ($this.val().indexOf('..') !== -1) {
                $this.val($this.val().replace('..', '.'));
              }
              x = 46;
            } else {
              x = 0;
              var lastChar = $this.val().substr($this.val().length - 1);
              if (lastChar === '.') {
                $this.val($this.val().slice(0, -1));
              }
              var ip = $this.val().split('.');
              if (ip.length === 4) {
                //jQuery('#validate_ip').text('Valid IP');
                $log.log('Valid IP');
                $this.parents('.form-group').removeClass('has-error').addClass('has-success');
              }
            }
          });

          wizard.on('closed', function() {
            wizard.reset();
          });

          wizard.on('reset', function() {
            wizard.modal.find(':input').val('').removeAttr('disabled');
            wizard.modal.find('.form-group').removeClass('has-error').removeClass('has-succes');
            wizard.modal.find('#fqdn').data('is-valid', 0).data('lookup', 0);
          });

          wizard.on('submit', function(wizard) {
            var submit = {
              'hostname': jQuery('#new-server-fqdn').val()
            };

            this.log('seralize()');
            this.log(this.serialize());
            this.log('serializeArray()');
            this.log(this.serializeArray());

            $timeout(function() {
              wizard.trigger('success');
              wizard.hideButtons();
              wizard._submitting = false;
              wizard.showSubmitCard('success');
              wizard.updateProgressBar(0);
            }, 2000);
          });

          wizard.el.find('.wizard-success .im-done').click(function() {
            wizard.hide();
            $timeout(function() {
              wizard.reset();
            }, 250);

          });

          wizard.el.find('.wizard-success .create-another-server').click(function() {
            wizard.reset();
          });

          wizard.el.find('.wizard-progress-container .progress').removeClass('progress-striped')
            .addClass('progress-xs');

          jQuery('.wizard-group-list').click(function() {
            $window.alert('Disabled for demo.');
          });

          jQuery('#open-wizard').click(function(e) {
            e.preventDefault();
            wizard.show();
          });
        }
        render();
      }
    }
  }



})();
