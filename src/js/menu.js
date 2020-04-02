Module.controller('MenuController', function() {
  var $ctrl = this;

  if(ons.platform.isIOS()) $ctrl.isIOS = true;

  // 手帳画面を開く
  $ctrl.openDialy = function() {
    splitterNav.pushPage('html/buy_diary.html');
  }

  // 買い物カードを開く
  $ctrl.openBuyItem = function() {
    splitterNav.pushPage('html/buy_card.html');
  }

  // 利用規約を開く
  $ctrl.openServiceTerms = function() {
    splitterNav.pushPage('html/service_terms.html');
  }

});
