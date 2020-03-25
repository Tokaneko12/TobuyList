Module.controller('SplitterController', function() {
  var $ctrl = this;

  if(ons.platform.isIOS() || ons.platform.isIPhoneX()) {
    $ctrl.dispSafeTop = ons.platform.isIPhoneX() ? true : false;
    $ctrl.dispSafeBtm = true;
  }

  $ctrl.aaa = function() {
    console.log("aaa");
  }
});
