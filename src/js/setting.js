Module.controller('settingController', ['$scope', '$rootScope', function($scope, $rootScope) {
  var $ctrl = this;
  $ctrl.disaCheckItem = localStorage.getItem('disaCheckAllow') == 'チェック項目のみ追加' ? true : false;

  if(ons.platform.isIOS()) $ctrl.isIOS = true;

  $ctrl.backPage = function() {
    splitterNav.popPage();
  }

  $ctrl.updCheck = function() {
    var permWord = $ctrl.disaCheckItem ? 'チェック項目のみ追加' : '通常設定';
    localStorage.setItem('disaCheckAllow', permWord);
    $rootScope.$broadcast('updateSetting');
    ons.notification.alert({
      title: '',
      message: '「' + permWord + '」に変更しました。',
      cancelable: false
    })
  }

}]);
