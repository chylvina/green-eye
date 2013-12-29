"use strict";

angular.module('service.setting', [
    'service.storage'
  ])
  .factory('appSetting', function($chromeStorage) {
    var s = angular.createBaseService();

    s.default = {
      color: '#000',
      borderColor: '#ccc',
      bgColor: '#cce8cf',
      type: ''
    };

    s.setColor = function() {

    };

    // init
    var init = function() {
      // build default
      var arr = [];
      for (var i in s.default) {
        if (Object.prototype.hasOwnProperty.call(s.default, i)) {
          arr.push(i);
        }
      }
      if(arr.length == 0) {
        return;
      }
      $chromeStorage.get(arr)
        .then(function(result) {
          for (var i in s.default) {
            if (Object.prototype.hasOwnProperty.call(s.default, i)) {
              if(result[i] === undefined) {
                result[i] = s.default[i];
              }
            }
          }
        });
    };

    return s;
  });
