angular.module('popup', [
    'filter.i18n',
    'filter.util',
    'service.storage',
    'service.setting',
    'ui.bootstrap.bindHtml'
  ])
  .config(function() {

  })
  .controller('popupController', function($rootScope, $scope, appSetting, $filter) {
    appSetting.bind('ready', function() {
      chrome.tabs.getSelected(null, function (tab) {

        $scope.tip = '';
        var tabDomain = $filter('getDomain')(tab.url);

        // special chrome pages
        if (tab.url.indexOf('chrome') == 0) {
          $scope.tip = chrome.i18n.getMessage('tip1');
          if(!$rootScope.$$phase) {
            $scope.$digest();
          }
          return;
        }
        // chrome gallery
        if (tab.url.indexOf('https://chrome.google.com/webstore') == 0) {
          $scope.tip = chrome.i18n.getMessage('tip2');
          if(!$rootScope.$$phase) {
            $scope.$digest();
          }
          return;
        }

        // local pages
        if (tab.url.indexOf('file') == 0) {
          $scope.tip = chrome.i18n.getMessage('tip3');
          chrome.tabs.sendMessage(tab.id, {msg:'is_green_eye_load'},
            function (response) {
              if (response && response.msg == 'green_eye_loaded') {
                $scope.tip = '';
                if(!$rootScope.$$phase) {
                  $scope.$digest();
                }
              }
            });
        }


        setTimeout(function () {
          // init
          $scope.toggle = function(type) {
            if(!tabDomain)
              return;

            var sites = appSetting.get('ignoredSites');

            if(type == appSetting.TYPE_IGNORE) {
              ga('send', 'event', 'popup', 'analysis', 'disable', tabDomain);

              sites[tabDomain] = true;

              appSetting.set({
                ignoredSites: sites
              })
                .then(function() {
                  chrome.tabs.sendMessage(tab.id, {msg: 'app-setting-updated'});
                  //chrome.tabs.reload(tab.id);
                  window.close();
                });
            }
            else if(appSetting.get('type') == type) {
              if(sites[tabDomain] == true) {
                delete sites[tabDomain];
                
                appSetting.set({
                  ignoredSites: sites
                })
                .then(function() {
                  chrome.tabs.sendMessage(tab.id, {msg: 'app-setting-updated'});
                  //chrome.tabs.reload(tab.id);
                  window.close();
                });
                return;
              }
              
              // do nothing
              window.close();
            }
            else {
              ga('send', 'event', 'popup', 'analysis', 'enable', type);

              delete sites[tabDomain];

              appSetting.set({
                type: type,
                ignoredSites: sites
              })
                .then(function() {
                  chrome.tabs.sendMessage(tab.id, {msg: 'app-setting-updated'});
                  //chrome.tabs.reload(tab.id);
                  window.close();
                });
            }
          };

          $scope.goSetting = function() {
            ga('send', 'event', 'popup', 'click', 'option');

            chrome.tabs.create({ url:'options.html'});
            window.close();
          };

          $scope.appSetting = appSetting;

          $scope.isDomainIgnored = appSetting.get('ignoredSites')[tabDomain];

          if(!$rootScope.$$phase) {
            $scope.$digest();
          }

          setTimeout(function() {
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-46763746-1', 'green-eye.com');
            ga('send', 'event', 'popup', 'analysis', 'type', appSetting.type);
          }, 500);
        }, 0);
      });
    });
  })
  .run(function() {

  });
