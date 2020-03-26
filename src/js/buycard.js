Module.controller('buyCardController', ['$scope', '$rootScope', function($scope, $rootScope) {
  var $ctrl = this;
  if(ons.platform.isIOS) $ctrl.isIOS = true;
  $ctrl.firstOpen = true;
  $ctrl.buyItems = localStorage.getItem('buyItems') ? JSON.parse(localStorage.getItem('buyItems')) : [];
  $ctrl.buyItemsCopy = localStorage.getItem('buyItems') ? angular.copy(JSON.parse(localStorage.getItem('buyItems'))) : [];

  // 初期処理
  $ctrl.initialize = function() {
    $ctrl.allBuyCard = [];
    var cardItemsRef = db.collection("cardItems");
    cardItemsRef.where("uid", "==", authUser.uid).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var cardData = doc.data();
        cardData.cId = doc.id;
        cardData.checked = $ctrl.buyItems.some(function(item){
          if(item.cId == cardData.cId) return true;
        });
        $ctrl.allBuyCard.push(cardData);
        $scope.$apply();
      });
    })
  }

  // 戻るボタン処理
  $ctrl.backPage = function() {
    localStorage.setItem('buyItems', JSON.stringify($ctrl.buyItems));
    $rootScope.$broadcast('updateItems');
    splitterNav.popPage();
  }

  $ctrl.modeChange = function() {
    $ctrl.deleteMode = !$ctrl.deleteMode ? true : false;
  }

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
          cardItem.docId = db.collection("cardItems").doc().id;
          db.collection("cardItems").doc(cardItem.docId).set(cardItem)
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
  $ctrl.checkCard = function(card) {
    if(!card.checked) { // カードにチェックを付けるとき
      var buyObj = {
        name: card.name,
        check: false,
        number: card.number,
        cId: card.cId,
      };

      $ctrl.buyItems.push(buyObj);
      card.checked = true;
    } else { // カードからチェックを外すとき
      $ctrl.buyItems = $ctrl.buyItems.filter(function(item){
        return item.cId != card.cId;
      });
    }
  }

  // 買い物カードマイナスボタンタップ時処理
  $ctrl.deleteCard = function(card) {
    ons.notification.confirm({
      title: '',
      message: 'カードを削除しますか？',
      cancelable: true,
      callback: function(inx) {
        if(inx == 1) { // OKを押したときの処理
          db.collection("cardItems").doc(card.cId).delete()
          .then(function() {
            if(card.checked) {
              $ctrl.buyItems = $ctrl.buyItems.filter(function(item){
                return item.cId != card.cId;
              });
            }
            $ctrl.allBuyCard.splice($ctrl.allBuyCard.indexOf(card), 1);
            cardInputDialog.hide();
            $scope.$apply();
          }).catch(function(error) {
            console.log(error);
          });
        }
      }
    });
  }

  // ダイアログが隠れる際、各値をリセット
  $ctrl.resetVal = function() {
    $ctrl.cardName = '';
    $ctrl.cardNum = '';
  }
}]);
