Module.controller('buyDiaryController', ['$scope', function($scope) {
  var $ctrl = this;

  // 日記データ読み込み
  $ctrl.initialize = function() {
    $ctrl.allBuyRecord = [];
    var buyItemsRef = db.collection("buyItems");
    console.log(authUser.uid);
    buyItemsRef.where("uid", "==", authUser.uid).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        $ctrl.allBuyRecord.push(doc.data());
        $scope.$apply();
      });
    })
  }
}]);
