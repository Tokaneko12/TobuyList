Module.factory('Calendar', function() {

  // コンストラクタ
  var Calendar = function(target) {
    if(target === undefined) {
      var now = new Date();
      target = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    var y = target.getFullYear();
    var m = target.getMonth();
    this.target = target;
    this.prev = new Date(y, m-1, 1);
    this.next = new Date(y, m+1, 1);
  };

  return Calendar;
});
