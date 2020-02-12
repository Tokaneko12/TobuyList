Module.controller('TabbarController', ['$scope', function($scope) {
  var $ctrl = this;
  $ctrl.buyItems = localStorage.getItem('buyItems') ? JSON.parse(localStorage.getItem('buyItems')) : [];
  $ctrl.itemName = "";
  $ctrl.modifyMode = false;

  if(ons.platform.isIOS) $ctrl.isIOS = true;

  $scope.$on('updateItems', function(){
    $ctrl.buyItems = localStorage.getItem('buyItems') ? JSON.parse(localStorage.getItem('buyItems')) : [];
  });

  // 買いものアイテムの追加
  $ctrl.addItem = function() {
    var buyObj = {
      name: $ctrl.itemName,
      check: false,
      number: $ctrl.itemNum,
    };
    if($ctrl.modifyIdx >= 0) {
      $ctrl.buyItems.splice($ctrl.modifyIdx, 1, buyObj);
    } else if($ctrl.itemName.length > 0) {
      $ctrl.buyItems.push(buyObj);
    }
    localStorage.setItem('buyItems', JSON.stringify($ctrl.buyItems));
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
    var buyList = {
      createAt: new Date().getTime(),
      items: $ctrl.buyItems,
      uid: authUser.uid
    }

    ons.notification.confirm({
      title: '',
      message: '買い物を完了しますか？',
      cancelable: true,
      callback: function(inx) {
        if(inx == 1) { // OKを押したときの処理
          db.collection("buyItems").add(buyList)
          .then(function(){
            $ctrl.buyItems = [];
            localStorage.setItem('buyItems', JSON.stringify($ctrl.buyItems));
            $scope.$apply();
          }).catch(function(error) {
            console.log(error);
          });
        }
      }
    });
  }

  $ctrl.resetVal = function() {
    $ctrl.modifyIdx = -1;
    $ctrl.modifyMode = false;
    $ctrl.itemName = "";
    $ctrl.itemNum = "";
  }
}]);
