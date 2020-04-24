Module.controller('settingController', ['$scope', '$rootScope', function($scope, $rootScope) {
  var $ctrl = this;
  $ctrl.disaCheckItem = localStorage.getItem('disaCheckAllow') == '許可しない' ? false : true;

  if(ons.platform.isIOS()) $ctrl.isIOS = true;

  $ctrl.backPage = function() {
    splitterNav.popPage();
  }

  $ctrl.updCheck = function() {
    var permWord = $ctrl.disaCheckItem ? '許可' : '許可しない';
    localStorage.setItem('disaCheckAllow', permWord);
    $rootScope.$broadcast('updateSetting');
    ons.notification.alert({
      title: '',
      message: '「' + permWord + '」に変更しました。',
      cancelable: false
    })
  }

}]);
