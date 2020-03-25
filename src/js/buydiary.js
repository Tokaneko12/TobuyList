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
        // doc.data() is never undefined for query doc snapshots
        $ctrl.allBuyRecord.push(doc.data());
        $scope.$apply();
      });
    })
  }

  // 日記詳細画面を開く
  $ctrl.openRecord = function(record) {
    diaryDialog.show();
    console.log(record);
    $ctrl.recordItems = record.items;
  }

  // 日記に金額を登録
  $ctrl.registMoney = function() {
    console.log($ctrl.recordItems.money);
    ons.notification.alert({
      title: '',
      message: '金額の登録が完了しました',
      cancelable: false,
    })
  }
}]);
