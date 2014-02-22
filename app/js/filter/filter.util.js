angular.module('filter.util', [])
  .filter('getDomain', function () {
    return function (url) {
      if(!url)
        return '';
      var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      return matches && matches[1];
    }
  });