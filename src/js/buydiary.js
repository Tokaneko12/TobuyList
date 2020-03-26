Module.controller('buyDiaryController', ['$scope', function($scope) {
  var $ctrl = this;
  $ctrl.totalMonthMoney = 0;

  // 日記データ読み込み
  $ctrl.initialize = function() {
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

  // 日記詳細画面を開く
  $ctrl.openRecord = function(record) {
    diaryDialog.show();
    $ctrl.recordItems = record;
  }

  // 日記に金額を登録
  $ctrl.registMoney = function() {
    var targetRef = db.collection("buyItems").doc($ctrl.recordItems.docId);
    targetRef.update({
      money: $ctrl.recordItems.money
    })
    .then(function(){
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
