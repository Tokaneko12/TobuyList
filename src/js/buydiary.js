Module.controller('buyDiaryController', ['$scope', 'Calendar', function($scope, Calendar) {
  var $ctrl = this;
  $ctrl.nowDate = new Date();
  $ctrl.calendar = new Calendar();
  if(ons.platform.isIOS()) $ctrl.isIOS = true;

  // 手帳データ読み込み
  $ctrl.initialize = function() {
    var targetMonthTime = $ctrl.calendar.target.getTime();
    var nextMonthTime = $ctrl.calendar.next.getTime();
    $ctrl.totalMonthMoney = 0;
    $ctrl.allBuyRecord = [];
    var buyItemsRef = db.collection("buyItems");
    buyItemsRef.where("uid", "==", authUser.uid).where("createAt", ">=", targetMonthTime).where("createAt", "<", nextMonthTime).get()
    .then(function(querySnapshot) {
      var cnt = 0;
      if(querySnapshot.docs.length == 0) loadModal.hide();
      querySnapshot.forEach(function(doc) {
        cnt++;
        $ctrl.allBuyRecord.push(doc.data());
        if(doc.data().money) $ctrl.totalMonthMoney += doc.data().money;
        if(querySnapshot.docs.length == cnt) {
          $scope.$apply();
          loadModal.hide();
        }
      });
    })
  }

  // 編集/削除モード変更
  $ctrl.modeChange = function() {
    $ctrl.deleteMode = !$ctrl.deleteMode ? true : false;
  }

  // 買い物手帳削除処理
  $ctrl.deleteDiary = function(record) {
    var recordDate = new Date(record.createAt).getDate();
    var recordHours = new Date(record.createAt).getHours();
    var recordMinutes = new Date(record.createAt).getMinutes();
    ons.notification.confirm({
      title: '',
      message: '「' + recordDate + '日' + recordHours + '時' + recordMinutes + '分' + '」' + 'の手帳を削除しますか？',
      cancelable: true,
      callback: function(inx) {
        if(inx == 1) { // OKを押したときの処理
          loadModal.show();
          db.collection("buyItems").doc(record.docId).delete()
          .then(function() {
            $ctrl.allBuyRecord.splice($ctrl.allBuyRecord.indexOf(record), 1);
            $ctrl.initialize();
            $scope.$apply();
          }).catch(function(error) {
            console.log(error);
          });
        }
      }
    });
  }

  // 手帳詳細画面を開く
  $ctrl.openRecord = function(record) {
    if($ctrl.deleteMode) {
      $ctrl.deleteDiary(record);
    } else {
      diaryDialog.show();
      $ctrl.recordItems = angular.copy(record);
    }
  }

  // 手帳に金額を登録
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

  // 前の月の戻る
  $ctrl.chgMonth = function(nextFlag){
    var target = (nextFlag) ? $ctrl.calendar.next : $ctrl.calendar.prev;
    $ctrl.calendar = new Calendar(target);
    $ctrl.initialize();
  };

}]);
