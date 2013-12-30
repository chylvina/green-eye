angular.module('option', [
    'filter.i18n',
    'service.storage',
    'service.setting'
  ])
  .config(function() {

  })
  .controller('optionController', function($rootScope, $scope, appSetting) {
    appSetting.bind('ready', function() {
      $("#spectrum").spectrum({
        showInput: true,
        color: localStorage['THEME_COLOR'],
        chooseText: chrome.i18n.getMessage('spectrumChoose'),
        cancelText: chrome.i18n.getMessage('spectrumCancel'),
        change: function (color) {
          localStorage['THEME_COLOR'] = color.toHexString();
        }
      });
    });
  })
  .run(function() {

  });
