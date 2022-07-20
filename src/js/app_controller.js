Module.controller('appController', ['$scope',function($scope) {
 var $app = this;

 if(ons.platform.isIOS() || ons.platform.isIPhoneX()) {
   $app.dispSafeTop = ons.platform.isIPhoneX() ? true : false;
   $app.dispSafeBtm = true;
 }

 if (ons.platform.isIPhoneX()) { // iPhone X であるか否かを判定
    // <html> 要素に属性を追加（値として空文字列を設定）
    document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
  }

}]);
