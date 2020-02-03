Module.controller('buyCardController', ['$scope', function($scope) {
  var $ctrl = this;
  if(ons.platform.isIOS) $ctrl.isIOS = true;

  // 初期処理
  $ctrl.initialize = function() {
    $ctrl.allBuyCard = [];
    var cardItemsRef = db.collection("cardItems");
    cardItemsRef.where("uid", "==", authUser.uid).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        $ctrl.allBuyCard.push(doc.data());
        $scope.$apply();
      });
    })
  }

  $ctrl.initialize();

  // 買い物カード追加処理
  $ctrl.plusCard = function() {
    var cardItem = {
      createAt: new Date().getTime(),
      name: $ctrl.cardName,
      number: $ctrl.cardNum,
      uid: authUser.uid
    };

    ons.notification.confirm({
      title: '',
      message: 'カードを作成しますか？',
      cancelable: true,
      callback: function(inx) {
        if(inx == 1) { // OKを押したときの処理
          db.collection("cardItems").add(cardItem)
          .then(function(){
            $ctrl.allBuyCard.push(cardItem);
            cardInputDialog.hide();
            $scope.$apply();
          }).catch(function(error) {
            console.log(error);
          });
        }
      }
    });
  }

  // 買い物カードタップ時のチェック処理
  $ctrl.checkCard = function(card, idx) {
    $ctrl.buyItems = localStorage.getItem('buyItems') ? JSON.parse(localStorage.getItem('buyItems')) : [];
    console.log(card);

    if(!card.checked) { // カードにチェックを付けるとき
      var buyObj = {
        name: card.name,
        check: false,
        number: card.number,
        cardIdx: idx,
      };

      // $ctrl.buyItems.push(buyObj);
      // localStorage.setItem('buyItems', JSON.stringify($ctrl.buyItems));
      card.checked = true;
    } else { // カードからチェックを外すとき
      console.log($ctrl.buyItems);
    }

  }

  // ダイアログが隠れる際、各値をリセット
  $ctrl.resetVal = function() {
    $ctrl.cardName = '';
    $ctrl.cardNum = '';
  }
}]);
