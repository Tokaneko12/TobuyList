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
