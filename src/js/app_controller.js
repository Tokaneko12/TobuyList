Module.controller('appController', ['$scope',function($scope) {
 var $app = this;

 if(ons.platform.isIOS() || ons.platform.isIPhoneX()) {
   $app.dispSafeTop = ons.platform.isIPhoneX() ? true : false;
   $app.dispSafeBtm = true;
 }

}]);
