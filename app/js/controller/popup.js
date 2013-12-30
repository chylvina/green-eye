angular.module('popup', [
    'filter.i18n',
    'service.storage',
    'service.setting'
  ])
  .config(function() {

  })
  .controller('popupController', function($rootScope, $scope, appSetting) {
    var init = function() {
      $scope.toggle = function(type) {
        if(appSetting.get('type') == type) {
          _gaq.push(['_trackEvent', type, 'disable']);

          appSetting.set({
            type: appSetting.TYPE_NONE
          })
            .then(function() {
              chrome.tabs.sendMessage(tab.id, {msg: 'app-setting-updated'});
              //chrome.tabs.reload(tab.id);
            });
        }
        else {
          _gaq.push(['_trackEvent', type, 'enable']);

          appSetting.set({
            type: type
          })
            .then(function() {
              chrome.tabs.sendMessage(tab.id, {msg: 'app-setting-updated'});
              //chrome.tabs.reload(tab.id);
            });
        }

        window.close();
      };

      $scope.goSetting = function() {
        _gaq.push(['_trackEvent', 'config', 'clicked']);
        chrome.tabs.create({ url:'options.html'});
        window.close();
      };

      $scope.appSetting = appSetting;

      appSetting.bind('ready', function() {
        if(!$rootScope.$$phase) {
          $scope.$digest();
        }
      });
    };

    chrome.tabs.getSelected(null, function (tab) {
      $scope.tip = '';

      // special chrome pages
      if (tab.url.indexOf('chrome') == 0) {
        $scope.tip = chrome.i18n.getMessage('tip1');
        return;
      }
      // chrome gallery
      if (tab.url.indexOf('https://chrome.google.com/webstore') == 0) {
        $scope.tip = chrome.i18n.getMessage('tip2');
        return;
      }

      init();

      setTimeout(function () {
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-46763746-1', 'green-eye.com');
        ga('send', 'pageview');
      }, 500);
    });
  })
  .run(function() {

  });
