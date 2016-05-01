(function() {
  'use strict';

  angular.module('singApp.core.utils', [])
    .directive('inputGroupNoBorder', inputGroupNoBorder)
    .directive('inputGroupTransparent', inputGroupNoBorder)
    .directive('ajaxLoad', ajaxLoad)
    .directive('snDemo', snDemo)
    .directive('snProgressAnimate', snProgressAnimate)
    .directive('animateNumber', animateNumber)
    .directive('checkAll', checkAll)
    .directive('body', body)
  ;

  /* ========================================================================
   * Handle transparent input groups focus
   * ========================================================================
   */
  inputGroupNoBorder.$inject = ['jQuery'];
  function inputGroupNoBorder(jQuery){
    return {
      restrict: 'C',
      link: function (scope, el){
        jQuery(el).find('.input-group-addon + .form-control').on('blur focus', function(e){
          jQuery(this).parents('.input-group')[e.type==='focus' ? 'addClass' : 'removeClass']('focus');
        });
      }
    }
  }

  /* ========================================================================
   * Handle transparent input groups focus
   * ========================================================================
   */
  inputGroupTransparent.$inject = ['jQuery'];
  function inputGroupTransparent(jQuery){
    return {
      restrict: 'C',
      link: function (scope, el){
        jQuery(el).find('.input-group-addon + .form-control').on('blur focus', function(e){
          jQuery(this).parents('.input-group')[e.type==='focus' ? 'addClass' : 'removeClass']('focus');
        });
      }
    }
  }

  /* ========================================================================
   * Ajax Load micro-plugin
   * ========================================================================
   */

  ajaxLoad.$inject = ['jQuery', '$window'];
  function ajaxLoad(jQuery, $window){
    return {
      restrict: 'A',
      link: function(scope, $el, attrs){
        $el.on('click change', function(e){
          var $this = jQuery(this),
            $target = jQuery($this.data('ajax-target'));
          if ($target.length > 0 ){
            e = jQuery.Event('ajax-load:start', {originalEvent: e});
            $this.trigger(e);

            !e.isDefaultPrevented() && $target.load($this.data('ajax-load'), function(){
              $this.trigger('ajax-load:end');
            });
          }
          return false;
        });

        /**
         * Change to loading state if loading text present
         */
        if (attrs.loadingText){
          $el.on('ajax-load:start', function () {
            $el.button('loading');
          });
          $el.on('ajax-load:end', function () {
            $el.button('reset');
          });
        }

        jQuery($window.document).on('click', '[data-toggle^=button]', function (e) {
          return jQuery(e.target).find('input').data('ajax-trigger') !== 'change';
        });
      }
    }
  }

  /* ========================================================================
   * Sing Demo functions directive. Demo-only functions. Does not affect the core Sing functionality.
   * Should be removed when used in real app.
   * ========================================================================
   */
  snDemo.$inject = ['jQuery', '$timeout', '$document'];
  function snDemo (jQuery, $timeout, $document){
    return {
      link: function(){
        jQuery($document).on('ajax-load:end', '#load-notifications-btn', function () {
          $timeout(function(){
            jQuery('#notifications-list').find('.bg-attention').removeClass('bg-attention');
          }, 10000)
        });
        jQuery($document).on('ajax-load:end', '#notifications-toggle input', function(){
          jQuery('#notifications-list').find('[data-toggle=tooltip]').tooltip();
        });

        $timeout(function(){
          var $chatNotification = jQuery('#chat-notification');
          $chatNotification.removeClass('hide').addClass('animated fadeIn')
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
              $chatNotification.removeClass('animated fadeIn');
              $timeout(function(){
                $chatNotification.addClass('animated fadeOut')
                  .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $chatNotification.addClass('hide');
                  });
              }, 4000);
            });
          $chatNotification.siblings('[data-sn-action="toggle-chat-sidebar-state"]').append('<i class="chat-notification-sing animated bounceIn"></i>')
        }, 4000)
      }
    }
  }

  /* ========================================================================
   * Animate Progress Bars
   * ========================================================================
   */
  snProgressAnimate.$inject = ['$timeout'];
  function snProgressAnimate($timeout){
    return {
      link: function (scope, $el){
        var value = $el.data('value'),
          $bar = $el.find('.progress-bar');
        $bar.css('opacity', 0);
        $timeout(function(){
          $bar.css({
            transition: 'none',
            width: 0,
            opacity: 1
          });
          $timeout(function(){
            $bar.css('transition', '').css('width', value + '%');
          })
        })
      }
    }
  }

  /* ========================================================================
   * Animate Number jQuery plugin customized wrapper
   * ========================================================================
   */
  animateNumber.$inject = ['jQuery'];
  function animateNumber(jQuery){
    return {
      link: function (scope, $el){
        $el.animateNumber({
          number: $el.text().replace(/ /gi, ''),
          numberStep: jQuery.animateNumber.numberStepFactories.separator(' '),
          easing: 'easeInQuad'
        }, 1000);
      }
    }
  }
  checkAll.$inject = ['jQuery'];
  function checkAll(jQuery){
    return {
      restrict: 'A',
      link: function (scope, $el){
        $el.on('click', function() {
          $el.closest('table').find('input[type=checkbox]')
            .not(this).prop('checked', jQuery(this).prop('checked'));
        });
      }
    }
  }

  body.$inject = [];
  function body () {
    return {
      restrict: 'E',
      link: function(scope, $element) {
        // prevent unwanted navigation
        $element.on('click', 'a[href=#]', function(e) {
          e.preventDefault();
        })
      }
    }
  }

})();
