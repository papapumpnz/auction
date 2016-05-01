(function() {
  'use strict';

  angular.module('singApp.core')
    .directive('snChatSidebar', snChatSidebar)
    .directive('snChatArea', snChatArea)
    .controller('ChatSidebarController', ChatSidebarController)
  ;

  /* ========================================================================
   * Sing Chat Sidebar
   * ========================================================================
   */
  snChatSidebar.$inject = ['$rootScope', 'jQuery', '$window', '$document'];
  function snChatSidebar($rootScope, jQuery, $window, $document){
    return {
      replace: true,
      templateUrl: 'app/modules/core/chat/chat.html',
      controller: 'ChatSidebarController',
      link: function(scope, $el){
        //.chat-sidebar-container contains all needed styles so we don't pollute body{ }
        var $chatContainer = jQuery('body').addClass('chat-sidebar-container');
        $rootScope.toggleChatSidebarState = function(){
          $chatContainer.toggleClass('chat-sidebar-opened');
        };

        /*
         * Open chat on swipe left but first check if navigation is collapsed
         * otherwise do nothing
         */
        jQuery($document).on('swipeLeft','.content-wrap', function(){
          if ($chatContainer.is('.nav-collapsed')){
            $chatContainer.addClass('chat-sidebar-opened');
          }
        })
          /*
           * Hide chat on swipe right but first check if navigation is collapsed
           * otherwise do nothing
           */
          .on('swipeRight', function(){
            if ($chatContainer.is('.nav-collapsed.chat-sidebar-opened')){
              $chatContainer.removeClass('chat-sidebar-opened')
                // as there is no way to cancel swipeLeft handlers attached to
                // .content making this hack with temporary class which will be
                // used by snNavigation directive to check whether it is permitted to open navigation
                // on swipeRight
                .addClass('nav-busy').one(jQuery.support.transition.end, function () {
                  jQuery('body').removeClass('nav-busy');
                }).emulateTransitionEnd(300);
            }
          });

        scope.deactivateLink = function (e) {
          jQuery(e.currentTarget).removeClass('active').find('.badge').remove();
        };

        function initChatSidebarScroll(){
          var $sidebarContent = jQuery('.chat-sidebar-contacts', $el);
          if ($el.find('.slimScrollDiv').length !== 0){
            $sidebarContent.slimscroll({
              destroy: true
            })
          }
          $sidebarContent.slimscroll({
            height: $window.innerHeight,
            width: '',
            size: '4px'
          });
        }

        jQuery($window).on('sn:resize', initChatSidebarScroll);
        initChatSidebarScroll();
      }
    }
  }

  ChatSidebarController.$inject = ['$scope'];
  function ChatSidebarController ($scope) {
    $scope.todayConversations = [{
      name: 'Chris Gray',
      status: 'success',
      lastMessage: 'Hey! What\'s up? So many times since we',
      image: 'assets/images/people/a2.jpg',
      messages: [{
        text: 'Hey! What\'s up?'
      },{
        text: 'Are you there?'
      },{
        text: 'Let me know when you come back.'
      },{
        text: 'I am here!',
        fromMe: true
      }]
    },{
      name: 'Jamey Brownlow',
      status: 'gray-light',
      lastMessage: 'Good news coming tonight. Seems they agreed to proceed',
      image: 'assets/images/avatar.png'
    },{
      name: 'Livia Walsh',
      status: 'danger',
      lastMessage: 'Check out my latest email plz!',
      image: 'assets/images/people/a1.jpg'
    },{
      name: 'Jaron Fitzroy',
      status: 'gray-light',
      lastMessage: 'What about summer break?',
      image: 'assets/images/avatar.png'
    },{
      name: 'Mike Lewis',
      status: 'success',
      lastMessage: 'Just ain\'t sure about the weekend now. 90% I\'ll make it.',
      image: 'assets/images/people/a4.jpg'
    }];

    $scope.lastWeekConversations = [{
      name: 'Freda Edison',
      status: 'gray-light',
      lastMessage: 'Hey what\'s up? Me and Monica going for a lunch somewhere. Wanna join?',
      image: 'assets/images/people/a6.jpg'
    },{
      name: 'Livia Walsh',
      status: 'success',
      lastMessage: 'Check out my latest email plz!',
      image: 'assets/images/people/a5.jpg'
    },{
      name: 'Jaron Fitzroy',
      status: 'warning',
      lastMessage: 'What about summer break?',
      image: 'assets/images/people/a3.jpg'
    },{
      name: 'Mike Lewis',
      status: 'gray-light',
      lastMessage: 'Just ain\'t sure about the weekend now. 90% I\'ll make it.',
      image: 'assets/images/avatar.png'
    }];

    $scope.newMessage = '';
    $scope.activeConversation = $scope.todayConversations[0];
    $scope.chatAreaOpened = false;

    $scope.openConversation= function(conversation) {
      $scope.activeConversation = conversation;
      $scope.chatAreaOpened = true;
    };

    $scope.addMessage = function (message) {
      if ($scope.newMessage) {
        ($scope.activeConversation.messages || ($scope.activeConversation.messages = [])).push({
          text: $scope.newMessage,
          fromMe: true
        });
      }
      $scope.newMessage = '';
    }
  }

  snChatArea.$inject = [];
  function snChatArea () {
    return {
      replace: true,
      templateUrl: 'app/modules/core/chat/chatArea.html',
      scope: {
        conversation: '=snChatArea',
        open: '=',
        filter: '='
      },
      link: function (scope, $el, attrs) {
        scope.$watch('open', function(newVal) {
          $el.toggleClass('open', newVal);
          $el.closest('.chat-sidebar-content').find('.chat-sidebar-contacts').toggleClass('open', !newVal);
          $el.closest('.chat-sidebar-content').find('.chat-sidebar-footer').toggleClass('open', newVal);
          newVal && $el.find('.message-list').slimscroll({
            height: $el.height() - $el.find('.title').height() - 10
            - parseInt($el.css('margin-top'))
            - parseInt($el.css('margin-bottom')),
            width: '',
            size: '4px'
          });
        });
      }
    }
  }
})();
