(function() {
  'use strict';

  angular.module('singApp.core')
    .directive('snNotificationsMenu', snNotificationsMenu)
  ;

  /* ========================================================================
   * Sing Notifications Menu. Moved to a sidebar for small screens
   * ========================================================================
   */
  snNotificationsMenu.$inject = ['jQuery'];
  function snNotificationsMenu(jQuery){
    return {
      link: function(scope, $el){
        /**
         * Move notifications dropdown to sidebar when/if screen is xs
         * and back when leaves xs
         */
        function moveNotificationsDropdown(){
          // todo extract selectors to scope attributes probably for more flexibility?
          jQuery('.sidebar-status .dropdown-toggle').after($el.detach());
        }

        function moveBackNotificationsDropdown(){
          jQuery('#notifications-dropdown-toggle').after($el.detach());
        }
        scope.app.helpers.onScreenSize('xs', moveNotificationsDropdown);
        scope.app.helpers.onScreenSize('xs', moveBackNotificationsDropdown, false);

        scope.app.helpers.isScreen('xs') && moveNotificationsDropdown();

        /**
         * Set Sidebar zindex higher than .content and .page-controls so the notifications dropdown is seen
         */
        jQuery('.sidebar-status').on('show.bs.dropdown', function(){
          jQuery('#sidebar').css('z-index', 2);
        }).on('hidden.bs.dropdown', function(){
          jQuery('#sidebar').css('z-index', '');
        });
      },
      templateUrl: 'app/modules/core/notifications/notifications.html'
    }
  }
})();
