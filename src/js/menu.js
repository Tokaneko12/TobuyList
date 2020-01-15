Module.controller('MenuController', function() {
  var $ctrl = this;

  // 日記画面を開く
  $ctrl.openDialy = function() {
    splitterNav.pushPage('html/buy_diary.html');
  }

  // 買い物カードを開く
  $ctrl.openBuyItem = function() {
    splitterNav.pushPage('html/buy_card.html');
  }

});
