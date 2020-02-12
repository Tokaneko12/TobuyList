// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCAOHjxIIAOzg9J4kXSXvAn4LZlrD-oqcM",
  authDomain: "tobuy-86979.firebaseapp.com",
  databaseURL: "https://tobuy-86979.firebaseio.com",
  projectId: "tobuy-86979",
  storageBucket: "tobuy-86979.appspot.com",
  messagingSenderId: "244020507559",
  appId: "1:244020507559:web:b991b6dfb50faf62007c82",
  measurementId: "G-1SM05G4STM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore();
var authUser;

// 匿名ユーザを生成
firebase.auth().signInAnonymously().then(function(authUser) {
  var localAuth = {
    uid: authUser.user.uid
  }
  localStorage.setItem('localAuth', JSON.stringify(localAuth));
})

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    authUser = user;
  } else {
    // User is signed out.
    console.log('認証切れ');
    authUser = localStorage.getItem('localAuth', JSON.parse(localAuth));
  }
});

var Module = ons.bootstrap();

ons.ready(function() {
});

// 日本語入力確定前に入力をng-modelに反映させるdirective
Module.directive('jpInput', ['$parse', function($parse) {
  return {
    priority: 2,
    restrict: 'A',
    compile: function(element) {
      element.on('compositionstart', function(e) {
        e.stopImmediatePropagation();
      });
    },
  };
}]);

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
        console.log(cardData);
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
    console.log($ctrl.buyItems);
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

Module.controller('buyDiaryController', ['$scope', function($scope) {
  var $ctrl = this;

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
}]);

Module.controller('MenuController', function() {
  var $ctrl = this;

  // 日記画面を開く
  $ctrl.openDialy = function() {
    splitterNav.pushPage('html/buy_diary.html');
  }

  // 買い物カードを開く
  $ctrl.openBuyItem = function() {
    splitterNav.pushPage('html/buy_card.html');
  }

});

Module.controller('SplitterController', function() {
  var $ctrl = this;
  $ctrl.aaa = function() {
    console.log("aaa");
  }
});

Module.controller('TabbarController', ['$scope', function($scope) {
  var $ctrl = this;
  $ctrl.buyItems = localStorage.getItem('buyItems') ? JSON.parse(localStorage.getItem('buyItems')) : [];
  $ctrl.itemName = "";
  $ctrl.modifyMode = false;

  if(ons.platform.isIOS) $ctrl.isIOS = true;

  $scope.$on('updateItems', function(){
    $ctrl.buyItems = localStorage.getItem('buyItems') ? JSON.parse(localStorage.getItem('buyItems')) : [];
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
    localStorage.setItem('buyItems', JSON.stringify($ctrl.buyItems));
    itemInputDialog.hide();
  }

  // 買い物アイテムメニューを開く
  $ctrl.openItemMenu = function(buyItem, buyIdx) {
    ons.openActionSheet({
      title: '項目メニュー',
      cancelable: true,
      buttons: [
        '編集',
        {
          label: '削除',
          modifier: 'destructive'
        },
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
        localStorage.setItem('buyItems', JSON.stringify($ctrl.buyItems));
        $scope.$apply();
      }
    })
  }

  // 買い物完了
  $ctrl.compBuy = function() {
    var buyList = {
      createAt: new Date().getTime(),
      items: $ctrl.buyItems,
      uid: authUser.uid
    }

    ons.notification.confirm({
      title: '',
      message: '買い物を完了しますか？',
      cancelable: true,
      callback: function(inx) {
        if(inx == 1) { // OKを押したときの処理
          db.collection("buyItems").add(buyList)
          .then(function(){
            $ctrl.buyItems = [];
            localStorage.setItem('buyItems', JSON.stringify($ctrl.buyItems));
            $scope.$apply();
          }).catch(function(error) {
            console.log(error);
          });
        }
      }
    });
  }

  $ctrl.resetVal = function() {
    $ctrl.modifyIdx = -1;
    $ctrl.modifyMode = false;
    $ctrl.itemName = "";
    $ctrl.itemNum = "";
  }
}]);
