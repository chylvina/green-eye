(function () {
  $(function () {
    return $("#color_label").text(chrome.i18n.getMessage("foreground_color")), $("#background_color_label").text(chrome.i18n.getMessage("background_color")), $("#toggle_btn").click(function () {
      return window.disabled ? (window.disabled = !1, $("#toggle_btn").text(chrome.i18n.getMessage("disable")), chrome.storage.sync.set({disabled: !1}), chrome.browserAction.setIcon({path: "img/icons/icon19.png"}), chrome.tabs.getSelected(null, function (o) {
        return chrome.tabs.sendMessage(o.id, {color: window.color, background_color: window.background_color})
      })) : (window.disabled = !0, $("#toggle_btn").text(chrome.i18n.getMessage("enable")), chrome.storage.sync.set({disabled: !0}), chrome.browserAction.setIcon({path: "img/icons/icon19_gray.png"}), chrome.tabs.getSelected(null, function (o) {
        return chrome.tabs.sendMessage(o.id, {color: "", background_color: ""})
      }))
    }), chrome.storage.sync.get(["color", "background_color", "disabled"], function (o) {
      return o.color || (o.color = "#000000"), o.background_color || (o.background_color = "#cce8cf"), window.color = o.color, window.background_color = o.background_color, o.disabled ? (window.disabled = !0, $("#toggle_btn").text(chrome.i18n.getMessage("enable"))) : (window.disabled = !1, $("#toggle_btn").text(chrome.i18n.getMessage("disable"))), $("#color").colorPicker({colors: ["000000"], pickerDefault: o.color, onColorChange: function (o, e) {
        return"color" !== o || (window.color = e, chrome.storage.sync.set({color: e}), window.disabled) ? void 0 : chrome.tabs.getSelected(null, function (o) {
          return chrome.tabs.sendMessage(o.id, {color: e})
        })
      }}), $("#background_color").colorPicker({colors: ["cce8cf"], pickerDefault: o.background_color, onColorChange: function (o, e) {
        return"background_color" !== o || (window.background_color = e, chrome.storage.sync.set({background_color: e}), window.disabled) ? void 0 : chrome.tabs.getSelected(null, function (o) {
          return chrome.tabs.sendMessage(o.id, {background_color: e})
        })
      }})
    })
  })
}).call(this);