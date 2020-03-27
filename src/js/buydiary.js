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

  // 日記詳細画面を開く
  $ctrl.openRecord = function(record) {
    diaryDialog.show();
    $ctrl.recordItems = angular.copy(record);
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
