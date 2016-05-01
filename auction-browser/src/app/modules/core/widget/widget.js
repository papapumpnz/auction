(function() {
  'use strict';

  angular.module('singApp.core')
    .directive('widget', widget)
  ;

  /* ========================================================================
   * Widgster Wrapper. Triggered for all .widget's
   * ========================================================================
   */
  widget.$inject = ['jQuery', '$document'];
  function widget(jQuery, $document){
    /**
     * Setting Widgster's body selector to theme specific
     * @type {string}
     */
    jQuery.fn.widgster.Constructor.DEFAULTS.bodySelector = '.widget-body';

    /*
     When widget is closed remove its parent if it is .col-*
     */
    jQuery($document).on('close.widgster', function(e){
      var $colWrap = jQuery(e.target).closest('.content > .row > [class*="col-"]:not(.widget-container)');

      // remove colWrap only if there are no more widgets inside
      if (!$colWrap.find('.widget').not(e.target).length){
        $colWrap.remove();
      }
    });
    return {
      restrict: 'CEA',
      link: function(scope, $el, attrs){
        if (attrs.postProcessing === 'true') return;
        $el.widgster();
      }
    }
  }

})();
