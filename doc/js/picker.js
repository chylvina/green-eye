(function () {
  var enabled = false, none = '{display: none !important;}';
  // notice
  var notice = document.createElement("div");
  notice.id = "quickmarkup-c1";
  notice.innerHTML = '<div id="quickmarkup-c2"><div id="quickmarkup-c3">' +
    '<span id="quickmarkup-tip">' + chrome.i18n.getMessage('clear_element_tip') +
    '</span><span id="quickmarkup-esc">' + chrome.i18n.getMessage('clear_esc') + '</span>' +
    '</div></div>';

  $("body").before('<div id="designertools-c1">' +
    '<div id="designertools-c2"><div id="designertools-c3">' +
    '<span id="designertools-tip">' +
    '</span><span id="designertools-esc"></span>' +
    '</div><img id="designertools-close" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALFJREFUeNqMkk0OAUEQhSvE2PgNzmVOYCEWbkTib2QwiMS1LIkDjNe8SiqlJV7yLebVT1dXj8hHYzADDflWC+RgqsYI3EEJdkxQdcCJsQcby4KGEroloA72LrbWLrkLbIn1jqCrRzdB5hIsZ5usqvJIn1xwvLcqpiD5saUy4kkfXP8daRBJ3oBVpKgnvL0NHDheLbK9ZSiYgCeNi9tG2zS8gaGYXyPjm3gFbw7S8PESYACUf0fkQ53xHwAAAABJRU5ErkJggg=="></div></div>');

  var blockEle = function () {
    if (enabled) return;
    var ele = '', outline = '', border = '', bgColor = '', title = '', reObjects = /^(iframe|object|embed)$/i, gObjects = /^(html|body|head)$/i;

    var remove = function () {
      document.removeEventListener('mouseover', over, false);
      document.removeEventListener('keyup', press, false);
      enabled = false;
      document.body.removeChild(notice);
    };
    var over = function (ev) {
      if (ev.target.id.indexOf("quickmarkup") >= 0) // 不能删除 quickmarkup element
        return;

      if (gObjects.test(ev.target.nodeName)) { // 不能删除 gObjects
        return;
      }

      ele = ev.target;
      title = ele.title;
      ele.title = 'Tag: ' + ele.nodeName + (ele.id ? ', ID: ' + ele.id : '') + (ele.className ? ', Class: ' + ele.className : '');
      if (reObjects.test(ele.nodeName)) {
        border = ele.style.border;
        ele.style.border = '1px solid #306EFF';
      }
      else {
        outline = ele.style.outline;
        ele.style.outline = '1px solid #306EFF';
        bgColor = ele.style.backgroundColor;
        ele.style.backgroundColor = '#C6DEFF';
      }

      //
      ele.addEventListener('mouseout', out, false);
      ele.addEventListener('click', click, false);
    };
    var out = function () {
      if (ele) {
        ele.title = title;
        if (reObjects.test(ele.nodeName)) {
          ele.style.border = border;
        }
        else {
          ele.style.outline = outline;
          ele.style.backgroundColor = bgColor;
        }

        //
        ele.removeEventListener('mouseout', out, false);
        ele.removeEventListener('click', click, false);
      }
    };
    var click = function (ev) {
      if (ele) {
        if (ev)
          ev.preventDefault();
        out();

        //ele.style.display = "none";
        ele.style.visibility = "hidden";
      }
    };
    var press = function (ev) {
      if (ev.keyCode == 27) {   // ESC
        exit();
      }
      else if (ev.keyCode == 46) {  // DELETE
        click();
      }
    };
    var exit = function () {
      out();
      remove();
    };

    enabled = true;
    document.body.appendChild(notice);
    document.addEventListener('mouseover', over, false);
    document.addEventListener('keyup', press, false);
    document.getElementById("quickmarkup-esc").addEventListener('click', exit);
  };

  // Non html
  if (!(document.documentElement instanceof HTMLHtmlElement)) return;

  chrome.extension.onRequest.addListener(
    function (data) {
      if (top == self) {
        switch (data.command) {
          case 'Block':
            blockEle();
            break;
        }
      }
    }
  );






  var o, c;
  c = function (o) {
    return $("html").css("color", o), $("body").css("color", o)
  }, o = function (o) {
    return $("html").css("background-color", o), $("body").css("background-color", o)
  }, chrome.storage.sync.get(["color", "background_color", "disabled"], function (r) {
    return r.disabled ? void 0 : (r.color || (r.color = "#000000"), r.background_color || (r.background_color = "#cce8cf"), c(r.color), o(r.background_color))
  }), chrome.extension.onMessage.addListener(function (r) {
    return(r.color || "" === r.color) && c(r.color), r.background_color || "" === r.background_color ? o(r.background_color) : void 0
  })

})();