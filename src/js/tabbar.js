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
