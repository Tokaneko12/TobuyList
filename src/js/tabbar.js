Module.controller('TabbarController', ['$scope', function($scope) {
  var $ctrl = this;
  $ctrl.selectedModifier = "buyList";
  var noteName = $ctrl.selectedModifier;
  localStorage.setItem('selected', JSON.stringify($ctrl.selectedModifier));
  $ctrl.notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
  $ctrl.buyItems = localStorage.getItem($ctrl.selectedModifier) ? JSON.parse(localStorage.getItem($ctrl.selectedModifier)) : [];
  $ctrl.itemNum = "";
  $ctrl.noteName = "";
  $ctrl.modifyMode = false;
  $ctrl.disaCheckItem = localStorage.getItem('disaCheckAllow') == 'チェック項目のみ追加' ? true : false;

  if(ons.platform.isIOS()) $ctrl.isIOS = true;

  $scope.$on('updateSetting', function(){
    $ctrl.disaCheckItem = localStorage.getItem('disaCheckAllow') == 'チェック項目のみ追加' ? true : false;
  });

  $scope.$on('updateItems', function(){
    $ctrl.notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
    $ctrl.buyItems = localStorage.getItem($ctrl.selectedModifier) ? JSON.parse(localStorage.getItem($ctrl.selectedModifier)) : [];
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
    localStorage.setItem('notes', JSON.stringify($ctrl.notes));
    localStorage.setItem($ctrl.selectedModifier, JSON.stringify($ctrl.buyItems));
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
        localStorage.setItem($ctrl.selectedModifier, JSON.stringify($ctrl.buyItems));
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
    var remainItems = [];
    var listItems = $ctrl.buyItems;
    var plusMessage = '';

    if($ctrl.disaCheckItem) {
      listItems = $ctrl.buyItems.filter(function(item) {
        if(!item.check) remainItems.push(item);
        return item.check == true;
      });
      if(listItems.length < 1) {
        ons.notification.alert({
          title: '',
          message: '項目をチェックしてください。',
          cancelable: false,
        });
        return;
      }
    }

    var buyList = {
      createAt: new Date().getTime(),
      items: listItems,
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
            $ctrl.buyItems = remainItems;
            localStorage.setItem($ctrl.selectedModifier, []);
            $scope.$apply();
            loadModal.hide();
            ons.notification.alert({
              title: '',
              message: '手帳に履歴が追加されました',
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
          message: '操作が完了しました',
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
    $ctrl.memoName = "";
  }

  // メモを追加
  $ctrl.editSelects = function() {
    if($ctrl.selectedModifier == 'addMemo') {
      noteInputDialog.show();
    }
    if($ctrl.selectedModifier == 'deleteMemo') {
      ons.notification.confirm({
        title: '',
        message: '現在のメモを削除してもよろしいですか？',
        cancelable: true,
        callback: function(inx) {
          if(inx == 1) { // OKを押したときの処理
            loadModal.show();
            for(var i = 0; i < $ctrl.notes.length; i++) {
              if($ctrl.notes[i].name = noteName) {
                $ctrl.notes.splice(i,1);
              }
            }
            localStorage.setItem('notes', JSON.stringify($ctrl.notes));
            $ctrl.selectedModifier = 'buyList';
            $ctrl.buyItems = localStorage.getItem($ctrl.selectedModifier) ? JSON.parse(localStorage.getItem($ctrl.selectedModifier)) : [];
            $scope.$apply();
            loadModal.hide();
            ons.notification.alert({
              title: '',
              message: '削除が完了しました。',
              cancelable: false,
            })
          }
        }
      });
    }
    noteName = $ctrl.selectedModifier;
    localStorage.setItem('selected', JSON.stringify($ctrl.selectedModifier));
    $ctrl.buyItems = localStorage.getItem($ctrl.selectedModifier) ? JSON.parse(localStorage.getItem($ctrl.selectedModifier)) : [];
    $scope.$apply();
  }

  $ctrl.addMemo = function() {
    var buyNote = {
      name: $ctrl.memoName,
    };
    $ctrl.notes.push(buyNote);
    localStorage.setItem('notes', JSON.stringify($ctrl.notes));
    $ctrl.selectedModifier = 'buyList';
    localStorage.setItem('selected', JSON.stringify($ctrl.selectedModifier));
    $ctrl.buyItems = localStorage.getItem($ctrl.selectedModifier) ? JSON.parse(localStorage.getItem($ctrl.selectedModifier)) : [];
    $ctrl.memoName = "";
    noteInputDialog.hide();
  }
}]);
