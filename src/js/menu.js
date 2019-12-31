Module.controller('MenuController', function() {
  var $ctrl = this;

  // 日記画面を開く
  $ctrl.openDialy = function() {
    splitterNav.pushPage('html/new_task.html');
  }

  $ctrl.openBuyItem = function() {
    splitterNav.pushPage('html/details_task.html');
  }

});
