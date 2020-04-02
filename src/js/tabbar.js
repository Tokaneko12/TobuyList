Module.controller('TabbarController', ['$scope', function($scope) {
  var $ctrl = this;
  $ctrl.buyItems = localStorage.getItem('buyItems') ? JSON.parse(localStorage.getItem('buyItems')) : [];
  $ctrl.itemName = "";
  $ctrl.modifyMode = false;

  if(ons.platform.isIOS()) $ctrl.isIOS = true;

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
      title: buyItem.name,
      cancelable: true,
      buttons: [
        '編集',
        {
          label: '削除',
          modifier: 'destructive'
        },
        'カードに追加',
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
      if(index == 2) {
        ons.notification.confirm({
          title: '',
          message: 'カードに追加しますか？',
          cancelable: true,
          callback: function(inx) {
            if(inx == 1) { // OKを押したときの処理
              loadModal.show();
              buyItem.uid = authUser.uid;
              buyItem.docId = db.collection("cardItems").doc().id;
              db.collection("cardItems").doc(buyItem.docId).set(buyItem)
              .then(function(){
                $scope.$apply();
                loadModal.hide();
                ons.notification.alert({
                  title: '',
                  message: 'カードの追加が完了しました',
                  cancelable: false,
                })
              }).catch(function(error) {
                console.log(error);
              });
            }
          }
        });
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
          loadModal.show();
          buyList.docId = db.collection("buyItems").doc().id;
          db.collection("buyItems").doc(buyList.docId).set(buyList)
          .then(function(){
            $ctrl.buyItems = [];
            localStorage.setItem('buyItems', JSON.stringify($ctrl.buyItems));
            $scope.$apply();
            loadModal.hide();
            ons.notification.alert({
              title: '',
              message: '手帳に項目が追加されました',
              cancelable: false,
            })
          }).catch(function(error) {
            console.log(error);
          });
        }
      }
    });
  }

  $ctrl.openShare = function() {
    var message = '買い物をお願いします。' + '\n';
    for(var i = 0; i < $ctrl.buyItems.length; i++) {
      var str = $ctrl.buyItems[i].name + ($ctrl.buyItems[i].number ? ':\t' + $ctrl.buyItems[i].number : '') + '\n';
      message += str;
    }
    if(window.plugins) {
      var options = {
        message: message, // デフォルトメッセージ (Instagram, facebookは対応外)
        subject: '', // メールのデフォルト副題
        files: [], // 画像データ(配列形式必須)
        chooserTitle: '共有するアプリケーションを選択', // Androidのシェアシートapp選択タイトル,
        appPackageName: 'com.apple.social.facebook' // Android only, you can provide id of the App you want to share with
      };

      var onSuccess = function(result) {
        if(!result.completed) return;
        ons.notification.confirm({
          title: '',
          message: '投稿をシェアしました',
          buttonLabel: 'OK',
          animation: 'default',
        });
      };

      var onError = function(msg) {
        console.log("Sharing failed with message: " + msg);
      };

      window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    }
  }

  // 項目リセット処理
  $ctrl.resetVal = function() {
    $ctrl.modifyIdx = -1;
    $ctrl.modifyMode = false;
    $ctrl.itemName = "";
    $ctrl.itemNum = "";
  }
}]);
