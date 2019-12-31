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

console.log(db);

var Module = ons.bootstrap();

ons.ready(function() {
});

Module.controller('MenuController', function() {
  var $ctrl = this;

  // 日記画面を開く
  $ctrl.openDialy = function() {
    splitterNav.pushPage('html/new_task.html');
  }

  $ctrl.openBuyItem = function() {
    splitterNav.pushPage('html/details_task.html');
  }

});

Module.controller('SplitterController', function() {
  console.log(splitterNav);
});

Module.controller('TabbarController', ['$scope' ,function($scope) {
  var $ctrl = this;
  $ctrl.buyItems = [];
  $ctrl.itemName = "";
  $ctrl.modifyMode = false;

  // 買いものアイテムの追加
  $ctrl.addItem = function() {
    var buyObj = {
      name: $ctrl.itemName,
      check: false,
      number: $ctrl.itemNum
    };
    if($ctrl.modifyIdx >= 0) {
      $ctrl.buyItems.splice($ctrl.modifyIdx, 1, buyObj);
    } else if($ctrl.itemName.length > 0) {
      $ctrl.buyItems.push(buyObj);
    }
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
        console.log($ctrl.modifyIdx);
        $ctrl.itemName = buyItem.name;
        $ctrl.itemNum = buyItem.number;
        $scope.$apply();
        itemInputDialog.show();
      }
      if(index == 1) {
        $ctrl.buyItems.splice(buyIdx, 1);
        $scope.$apply();
      }
    })
  }

  // 買い物完了
  $ctrl.compBuy = function() {
    $ctrl.buyItems = [];

    ons.notification.confirm({
      title: '',
      message: '買い物を完了しますか？',
      cancelable: true,
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
