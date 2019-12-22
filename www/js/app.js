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

Module.controller('SplitterController', function() {
  console.log("aaa");
});

Module.controller('TabbarController', function() {
  console.log("bbb");
  var $ctrl = this;
  $ctrl.buyItems = [];
  $ctrl.itemName = "";

  $ctrl.addItem = function() {
    $ctrl.buyItems.push({
      name: $ctrl.itemName,
      check: false
    });
    $ctrl.itemName = "";
    itemInputDialog.hide();
  }

  $ctrl.compBuy = function() {
    $ctrl.buyItems = [];

    // db.collection("buyItems").add({
    //   name: "Los Angeles",
    //   state: "CA",
    //   country: "USA"
    // })
  }
});
