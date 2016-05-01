(function() {
  'use strict';

  angular.module('singApp.ui.components')
    .controller('UiComponentsDemoController', UiComponentsDemoController)
    .controller('ModalDemoCtrl', ModalDemoCtrl)
    .controller('ModalInstanceCtrl', ModalInstanceCtrl)
  ;

  UiComponentsDemoController.$inject = ['$scope', '$sce'];
  function UiComponentsDemoController ($scope, $sce) {
    $scope.alerts = [
      { type: 'success', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Success:</span> You successfully read this important alert message.') },
      { type: 'info', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Info:</span> This alert needs your attention, but it\'s not super important.') },
      { type: 'warning', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Warning:</span> Best check yo self, you\'re not looking too good.') },
      { type: 'danger', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Danger:</span> Change this and that and try again.  ' +
        '<a class="btn btn-default btn-xs pull-right mr" href="#">Ignore</a>  ' +
        '<a class="btn btn-danger btn-xs pull-right mr-xs" href="#">Take this action</a>') }
    ];

    $scope.addAlert = function() {
      $scope.alerts.push({type: 'warning', msg: $sce.trustAsHtml('Another alert!')});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }



  ModalDemoCtrl.$inject = ['$scope', '$modal', '$log'];
  function ModalDemoCtrl ($scope, $modal) {
    $scope.open = function () {

      $modal.open({
        templateUrl: 'my-modal18-content.html',
        controller: 'ModalInstanceCtrl'
      });
    };
  }

  ModalInstanceCtrl.$inject = ['$scope', '$modalInstance'];
  function ModalInstanceCtrl ($scope, $modalInstance) {
    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
})();
