(function() {
  'use strict';

  angular.module('singApp.extra.invoice')
    .controller('InvoiceCtrl', InvoiceCtrl)
  ;

  InvoiceCtrl.$inject = ['$scope', '$window'];
  function InvoiceCtrl ($scope, $window) {
    $scope.print = function(){
      $window.print();
    };
  }

})();
