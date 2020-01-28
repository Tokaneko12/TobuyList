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

Module.controller('buyCardController', function() {
  var $ctrl = this;
  $ctrl.plusCard = function() {
    console.log('カード追加');
  }
});

Module.controller('buyDiaryController', function() {
  var $ctrl = this;
});

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
<<<<<<< HEAD
  var $ctrl = this;
  $ctrl.aaa = function() {
    console.log("aaa");
  }
=======
>>>>>>> localstorage追加
});

Module.controller('TabbarController', ['$scope' ,function($scope) {
  var $ctrl = this;
  $ctrl.buyItems = localStorage.getItem('buyItems') ? JSON.parse(localStorage.getItem('buyItems')) : [];
  console.log($ctrl.buyItems);
  $ctrl.itemName = "";
  $ctrl.modifyMode = false;

  // 買いものアイテムの追加
  $ctrl.addItem = function() {
    var buyObj = {
      name: $ctrl.itemName,
      check: false,
      number: $ctrl.itemNum,
      uid: authUser.uid,
    };
    if($ctrl.modifyIdx >= 0) {
      $ctrl.buyItems.splice($ctrl.modifyIdx, 1, buyObj);
    } else if($ctrl.itemName.length > 0) {
      $ctrl.buyItems.push(buyObj);
    }
    localStorage.setItem('buyItems', JSON.stringify($ctrl.buyItems));
    console.log($ctrl.buyItems);
    console.log(localStorage.getItem('buyItems'));
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

    ons.notification.confirm({
      title: '',
      message: '買い物を完了しますか？',
      cancelable: true,
      callback: function(inx) {
        if(inx == 1) { // OKを押したときの処理
          $ctrl.buyItems = [];
          localStorage.setItem('buyItems', JSON.stringify($ctrl.buyItems));
          $scope.$apply();
        }
      }
    });

    // db.collection("buyItems").add({
    //   name: "Los Angeles",
    //   state: "CA",
    //   country: "USA"
    // })
  }

  $ctrl.resetVal = function() {
    $ctrl.modifyIdx = -1;
    $ctrl.modifyMode = false;
    $ctrl.itemName = "";
    $ctrl.itemNum = "";
  }
}]);
