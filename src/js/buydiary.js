Module.controller('buyDiaryController', ['$scope', function($scope) {
  var $ctrl = this;

  // 日記データ読み込み
  $ctrl.initialize = function() {
    $ctrl.totalMonthMoney = 0;
    $ctrl.allBuyRecord = [];
    var buyItemsRef = db.collection("buyItems");
    buyItemsRef.where("uid", "==", authUser.uid).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        $ctrl.allBuyRecord.push(doc.data());
        if(doc.data().money) $ctrl.totalMonthMoney += doc.data().money;
        $scope.$apply();
      });
    })
  }

  // 編集/削除モード変更
  $ctrl.modeChange = function() {
    $ctrl.deleteMode = !$ctrl.deleteMode ? true : false;
  }

  // 買い物日記削除処理
  $ctrl.deleteDiary = function(record) {
    var recordDate = new Date(record.createAt).getDate();
    var recordHours = new Date(record.createAt).getHours();
    var recordMinutes = new Date(record.createAt).getMinutes();
    ons.notification.confirm({
      title: '',
      message: '「' + recordDate + '日' + recordHours + '時' + recordMinutes + '分' + '」' + 'の日記を削除しますか？',
      cancelable: true,
      callback: function(inx) {
        if(inx == 1) { // OKを押したときの処理
          db.collection("buyItems").doc(record.docId).delete()
          .then(function() {
            $ctrl.allBuyRecord.splice($ctrl.allBuyRecord.indexOf(record), 1);
            $ctrl.initialize();
          }).catch(function(error) {
            console.log(error);
          });
        }
      }
    });
  }

  // 日記詳細画面を開く
  $ctrl.openRecord = function(record) {
    if($ctrl.deleteMode) {
      $ctrl.deleteDiary(record);
    } else {
      diaryDialog.show();
      $ctrl.recordItems = angular.copy(record);
    }
  }

  // 日記に金額を登録
  $ctrl.registMoney = function() {
    loadModal.show();
    var targetRef = db.collection("buyItems").doc($ctrl.recordItems.docId);
    targetRef.update({
      money: $ctrl.recordItems.money
    })
    .then(function(){
      $ctrl.initialize();
      loadModal.hide();
      ons.notification.alert({
        title: '',
        message: '金額の登録が完了しました',
        cancelable: false,
        callback: function() {
          diaryDialog.hide();
        }
      })
    }).catch(function(error) {
      console.log(error);
    });
  }
}]);
