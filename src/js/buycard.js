Module.controller('buyCardController', ['$scope', '$rootScope', function($scope, $rootScope) {
  var $ctrl = this;
  if(ons.platform.isIOS()) $ctrl.isIOS = true;
  $ctrl.firstOpen = true;
  $ctrl.selectedModifier = localStorage.getItem('selected') ? JSON.parse(localStorage.getItem('selected')) : [];
  $ctrl.buyItems = localStorage.getItem($ctrl.selectedModifier) ? JSON.parse(localStorage.getItem($ctrl.selectedModifier)) : [];
  $ctrl.buyItemsCopy = localStorage.getItem('buyItems') ? angular.copy(JSON.parse(localStorage.getItem('buyItems'))) : [];
  $ctrl.cardNum = '';

  // 初期処理
  $ctrl.initialize = function() {
    $ctrl.allBuyCard = [];
    var cardItemsRef = db.collection("cardItems");
    cardItemsRef.where("uid", "==", authUser.uid).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var cardData = doc.data();
        cardData.docId = doc.id;
        cardData.checked = $ctrl.buyItems.some(function(item){
          if(item.docId == cardData.docId) return true;
        });
        $ctrl.allBuyCard.push(cardData);
        $scope.$apply();
      });
    })
  }

  // 戻るボタン処理
  $ctrl.backPage = function() {
    localStorage.setItem($ctrl.selectedModifier, JSON.stringify($ctrl.buyItems));
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
      uid: authUser.uid,
    };

    ons.notification.confirm({
      title: '',
      message: 'カードを作成しますか？',
      cancelable: true,
      callback: function(inx) {
        if(inx == 1) { // OKを押したときの処理
          loadModal.show();
          cardItem.docId = db.collection("cardItems").doc().id;
          db.collection("cardItems").doc(cardItem.docId).set(cardItem)
          .then(function(){
            $ctrl.allBuyCard.push(cardItem);
            cardInputDialog.hide();
            $scope.$apply();
            loadModal.hide();
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
        docId: card.docId,
      };

      $ctrl.buyItems.push(buyObj);
      card.checked = true;
    } else { // カードからチェックを外すとき
      $ctrl.buyItems = $ctrl.buyItems.filter(function(item){
        return item.docId != card.docId;
      });
    }
  }

  // 買い物カードマイナスボタンタップ時処理
  $ctrl.deleteCard = function(card) {
    ons.notification.confirm({
      title: '',
      message: '「' + card.name + '」' + 'のカードを削除しますか？',
      cancelable: true,
      callback: function(inx) {
        if(inx == 1) { // OKを押したときの処理]
          loadModal.show();
          db.collection("cardItems").doc(card.docId).delete()
          .then(function() {
            if(card.checked) {
              $ctrl.buyItems = $ctrl.buyItems.filter(function(item){
                return item.docId != card.docId;
              });
            }
            $ctrl.allBuyCard.splice($ctrl.allBuyCard.indexOf(card), 1);
            cardInputDialog.hide();
            $scope.$apply();
            loadModal.hide();
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
