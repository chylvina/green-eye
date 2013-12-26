// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-45056740-1']);
_gaq.push(['_trackPageview']);
var bgPage = chrome.extension.getBackgroundPage();

function enableAll() {
  $("#tips").hide();
}

function showTip(tip) {
  $("#tips").show().html(tip);
}

function i18nReplace(id, messageKey) {
  return $('#' + id + ' .title').text(chrome.i18n.getMessage(messageKey));
}

function init() {
  // UI
  chrome.i18n.getAcceptLanguages(function (languageList) {
    switch (window.navigator.language.substr(0, 2)) {
      case "zh":
        //document.body.style.width = "212px";
        break;
    }
  });

  // Update hot key.
  if (HotKey.isEnabled() && HotKey.get('colorpicker') != '@')
    $('#colorpicker .shortcut').text('Ctrl+Alt+' + HotKey.get('colorpicker'));

  // localization
  i18nReplace("colorpicker", "colorpicker");
  i18nReplace("config", "setting");

  // event listener
  $('#config').click(function() {
    _gaq.push(['_trackEvent', 'config', 'clicked']);
    chrome.tabs.create({ url:'options.html'});
    window.close();
  });
  $('#colorpicker').click(function() {
    _gaq.push(['_trackEvent', 'color picker', 'clicked']);
    bgPage.bg.pickActivate();
    window.close();
  });

  // check is capturable
  chrome.tabs.getSelected(null, function (tab) {
    var insertScript = function () {
      // Google Analytics
      var ga = document.createElement('script');
      ga.type = 'text/javascript';
      ga.async = true;
      ga.src = 'https://ssl.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(ga, s);
    };

    // special chrome pages
    if (tab.url.indexOf('chrome') == 0) {
      showTip(chrome.i18n.getMessage('tip1'));
      return;
    }
    // chrome gallery
    if (tab.url.indexOf('https://chrome.google.com/webstore') == 0) {
      showTip(chrome.i18n.getMessage('tip2'));
      return;
    }
    // local pages
    if (tab.url.indexOf('file') == 0) {
      showTip(chrome.i18n.getMessage('tip3'));
      chrome.tabs.sendMessage(tab.id, {msg:'is_helper_load'},
        function (response) {
          if (response && response.msg == 'helper_loaded') {
            enableAll();
            setTimeout(insertScript, 500);
            bgPage.bg.useTab(tab);
          }
        });
      return;
    }

    setTimeout(insertScript, 500);
    bgPage.bg.useTab(tab);
  });
}

$(document).ready(function() {
  init();
});