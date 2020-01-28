Module.controller('TabbarController', ['$scope' ,function($scope) {
  var $ctrl = this;
  $ctrl.buyItems = localStorage.getItem('buyItems') ? JSON.parse(localStorage.getItem('buyItems')) : [];
  console.log($ctrl.buyItems);
  $ctrl.itemName = "";
  $ctrl.modifyMode = false;

  // 買いものアイテムの追加
  $ctrl.addItem = function() {
    var buyObj = {
      name: $ctrl.itemName,
      check: false,
      number: $ctrl.itemNum,
      uid: authUser.uid,
    };
    if($ctrl.modifyIdx >= 0) {
      $ctrl.buyItems.splice($ctrl.modifyIdx, 1, buyObj);
    } else if($ctrl.itemName.length > 0) {
      $ctrl.buyItems.push(buyObj);
    }
    localStorage.setItem('buyItems', JSON.stringify($ctrl.buyItems));
    console.log($ctrl.buyItems);
    console.log(localStorage.getItem('buyItems'));
    itemInputDialog.hide();
  }

  // 買い物アイテムメニューを開く
  $ctrl.openItemMenu = function(buyItem, buyIdx) {
    ons.openActionSheet({
      title: '項目メニュー',
      cancelable: true,
      buttons: [
        '編集',
        {
          label: '削除',
          modifier: 'destructive'
        },
        {
          label: 'キャンセル',
          icon: 'md-close'
        }
      ]
    }).then(function(index) {
      if(index == 0) {
        $ctrl.modifyIdx = buyIdx;
        $ctrl.modifyMode = true;
        $ctrl.itemName = buyItem.name;
        $ctrl.itemNum = buyItem.number;
        $scope.$apply();
        itemInputDialog.show();
      }
      if(index == 1) {
        $ctrl.buyItems.splice(buyIdx, 1);
        localStorage.setItem('buyItems', JSON.stringify($ctrl.buyItems));
        $scope.$apply();
      }
    })
  }

  // 買い物完了
  $ctrl.compBuy = function() {

    ons.notification.confirm({
      title: '',
      message: '買い物を完了しますか？',
      cancelable: true,
      callback: function(inx) {
        if(inx == 1) { // OKを押したときの処理
          $ctrl.buyItems = [];
          localStorage.setItem('buyItems', JSON.stringify($ctrl.buyItems));
          $scope.$apply();
        }
      }
    });

    // db.collection("buyItems").add({
    //   name: "Los Angeles",
    //   state: "CA",
    //   country: "USA"
    // })
  }

  $ctrl.resetVal = function() {
    $ctrl.modifyIdx = -1;
    $ctrl.modifyMode = false;
    $ctrl.itemName = "";
    $ctrl.itemNum = "";
  }
}]);
