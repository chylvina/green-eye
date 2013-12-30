"use strict";

angular.module('service.setting', [
    'service.storage'
  ])
  .factory('appSetting', function ($chromeStorage) {
    var s = angular.createBaseService();

    s.TYPE_NONE = 0;
    s.TYPE_SIMPLE = 1;
    s.TYPE_ENTIRE = 2;
    s.TYPE_SMART = 3;

    s.default = {
      color: '#000',
      borderColor: '#ccc',
      bgColor: '#cce8cf',
      type: s.TYPE_SMART,
      hotKeyEnabled: true,
      hotKeySimple: 'S',
      hotKeyEntire: 'E',
      hotKeySmart: 'M'
    };

    s.data = {};

    s.get = function(key) {
      return s.data[key];
    };

    s.set = function(items) {
      return $chromeStorage.set(items);
    };

    // init
    s.init = function () {
      // build default
      var arr = [];
      for (var i in s.default) {
        if (Object.prototype.hasOwnProperty.call(s.default, i)) {
          arr.push(i);
        }
      }
      if (arr.length == 0) {
        return;
      }
      $chromeStorage.get(arr)
        .then(function (result) {
          var obj = {};
          for (var i in s.default) {
            if (result[i] === undefined) {
              obj[i] = s.default[i];
              s.data[i] = s.default[i];
            }
            else {
              s.data[i] = result[i];
            }
          }
          $chromeStorage.set(obj);

          s.emit('ready');
        });
    };

    $chromeStorage.bind('changed', function (changes) {
      for (var key in changes) {
        s.data[key] = changes[key].newValue;
      }

      s.emit('update');
    });

    s.init();

    return s;
  });
