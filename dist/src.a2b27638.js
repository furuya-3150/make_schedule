// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }
  return bundleURL;
}
function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }
  return '/';
}
function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');
function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }
  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }
    cssTimeout = null;
  }, 50);
}
module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

require("./styles.css");
var weeks = ["日", "月", "火", "水", "木", "金", "土"];
var onClickAdd = function onClickAdd() {
  //　日時フィールドの値を取得
  var inputDate = document.getElementById("vacant-date").value;
  var inputStartTime = document.getElementById("start-time").value;
  var inputEndTime = document.getElementById("end-time").value;

  //　バリデーション
  if (inputDate === "" || inputStartTime === "" || inputEndTime === "") {
    alert("全て入力してください");
    return;
  }
  if (inputStartTime >= inputEndTime) {
    alert("正しい時刻を入力してください");
    return;
  }

  //　フィールドを空にする
  document.getElementById("vacant-date").value = "";
  document.getElementById("start-time").value = "";
  document.getElementById("end-time").value = "";

  // 入力された日程をDate型に変更
  var date = new Date(inputDate);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var putDate = date.toLocaleDateString();

  // 日にちから曜日を炙る

  var week = weeks[date.getDay()];
  //フォマットの値を取得
  var selectFormatIndex = document.getElementById("select-format").selectedIndex;
  var text = "";
  var weekTimeTemp = " (" + week + ") " + inputStartTime + "〜" + inputEndTime + "\n";
  if (selectFormatIndex === 0) {
    text = month + "月" + day + "日" + weekTimeTemp;
  }
  if (selectFormatIndex === 1) {
    text = year + "年" + month + "月" + day + "日" + weekTimeTemp;
  }
  if (selectFormatIndex === 2) {
    text = month + "/" + day + weekTimeTemp;
  }
  if (selectFormatIndex === 3) {
    text = putDate + weekTimeTemp;
  }

  // divタグの子要素に各種

  var textarea = document.getElementById("schedule-content").value;
  if (textarea === "") {
    document.getElementById("schedule-content").value = text;
  } else {
    document.getElementById("schedule-content").value += text;
  }
};

// textarea内を削除する
var onClickCopy = function onClickCopy() {
  var copyTarget = document.getElementById("schedule-content");
  copyTarget.select();
  document.execCommand("copy");
};

//　スケジュールの整理をする
var onClickArrangement = function onClickArrangement() {
  var arrangementTarget = document.getElementById("schedule-content");
  if (arrangementTarget.value === "") return;

  // 選択されたフォーマットを取得
  var selectFormatIndex = document.getElementById("select-format").selectedIndex;

  //　改行ごとに配列に挿入
  var arrangement = arrangementTarget.value.split(/\n/);

  // 配列内の空白は削除
  arrangement = arrangement.filter(function (val) {
    return val !== "";
  });
  var year = "";
  var month = "";
  var day = "";
  var startTime = "";
  var endTime = "";
  var nowDate = new Date();
  var thisYear = nowDate.getFullYear();
  var thisMonth = nowDate.getMonth() + 1;
  var arrangemented = [];

  // 配列に入った日程を昇順にするために配列の要素をDate型に変更する
  arrangement.forEach(function (element) {
    startTime = element.substring(element.indexOf(")") + 2, element.indexOf("〜"));
    endTime = element.substring(element.indexOf("〜") + 1, element.length);
    if (selectFormatIndex === 0) {
      month = element.substring(0, element.indexOf("月"));
      if (thisMonth === 12 && month === "1") {
        year = thisYear + 1;
      } else {
        year = thisYear;
      }
      day = element.substring(element.indexOf("月") + 1, element.indexOf("日"));
    } else if (selectFormatIndex === 1) {
      year = element.substring(0, element.indexOf("年"));
      month = element.substring(element.indexOf("年") + 1, element.indexOf("月"));
      day = element.substring(element.indexOf("月") + 1, element.indexOf("日"));
    } else if (selectFormatIndex === 2) {
      month = element.substring(0, element.indexOf("/"));
      if (thisMonth === 12 && month === "1") {
        year = thisYear + 1;
      } else {
        year = thisYear;
      }
      day = element.substring(element.indexOf("/") + 1, element.indexOf("(") - 1);
    } else if (selectFormatIndex === 3) {
      year = element.substring(0, element.indexOf("/"));
      month = element.substring(element.indexOf("/") + 1, element.lastIndexOf("/"));
      day = element.substring(element.lastIndexOf("/") + 1, element.indexOf("(") - 1);
    }
    arrangemented.push([new Date(year + "/" + month + "/" + day + " " + startTime + ":00"), endTime]);
  });

  // Data型の配列をソートする
  arrangemented.sort(function (a, b) {
    return a[0] - b[0];
  });
  var year = "";
  var month = "";
  var day = "";
  var dayOfWeek = "";
  var text = "";
  var hour = "";
  var min = "";

  // Date型にした配列の要素を選択されたテンプレートに従い、出力
  arrangemented.forEach(function (element, index) {
    year = element[0].getFullYear();
    month = element[0].getMonth() + 1;
    day = element[0].getDate();
    dayOfWeek = weeks[element[0].getDay()];
    hour = element[0].getHours();
    min = element[0].getMinutes();
    if (selectFormatIndex === 0) {
      text = month + "月" + day + "日" + " (" + dayOfWeek + ") " + hour + ":" + min + "〜" + element[1];
      if (index === 0) {
        arrangementTarget.value = text + "\n";
      } else {
        arrangementTarget.value += text + "\n";
      }
    } else if (selectFormatIndex === 1) {
      text = year + "年" + month + "月" + day + "日" + " (" + dayOfWeek + ") " + hour + ":" + min + "〜" + element[1];
      if (index === 0) {
        arrangementTarget.value = text + "\n";
      } else {
        arrangementTarget.value += text + "\n";
      }
    } else if (selectFormatIndex === 2) {
      text = month + "/" + day + " (" + dayOfWeek + ") " + hour + ":" + min + "〜" + element[1];
      if (index === 0) {
        arrangementTarget.value = text + "\n";
      } else {
        arrangementTarget.value += text + "\n";
      }
    } else if (selectFormatIndex === 3) {
      text = year + "/" + month + "/" + day + " (" + dayOfWeek + ") " + hour + ":" + min + "〜" + element[1];
      if (index === 0) {
        arrangementTarget.value = text + "\n";
      } else {
        arrangementTarget.value += text + "\n";
      }
    }
  });
};

//　フォーマットを選択した時の処理
var onChangeSelectFormat = function onChangeSelectFormat() {
  var changeFormat = document.getElementById("schedule-content");
  if (changeFormat.value === "") return;

  //　textareaに入力されているものを配列に入れる
  var changeFormatTarget = changeFormat.value.split(/\n/);

  //配列に空白が含まれていれば、配列から削除する
  changeFormatTarget = changeFormatTarget.filter(function (val) {
    return val !== "";
  });
  var year = "";
  var month = "";
  var day = "";
  var dayOfWeek = "";
  var startTime = "";
  var endTime = "";
  var nowDate = new Date();
  var thisYear = nowDate.getFullYear();
  var thisMonth = nowDate.getMonth() + 1;
  var newFormat = [];

  // 配列の要素がどのフォーマットなのかわからないので、場合わけをして、指定の順序で日時などを新しい配列に挿入する
  changeFormatTarget.forEach(function (element) {
    dayOfWeek = element.substring(element.indexOf("(") + 1, element.indexOf(")"));
    startTime = element.substring(element.indexOf(")") + 2, element.indexOf("〜"));
    endTime = element.substring(element.indexOf("〜") + 1, element.length);
    if (element.match(/年/)) {
      year = element.substring(0, element.indexOf("年"));
      month = element.substring(element.indexOf("年") + 1, element.indexOf("月"));
      day = element.substring(element.indexOf("月") + 1, element.indexOf("日"));
    } else if (!element.includes("/")) {
      month = element.substring(0, element.indexOf("月"));

      //　今月が12月で日程として1月が入力された場合来年の1月として扱う
      if (thisMonth === 12 && month === "1") {
        year = thisYear + 1;
      } else {
        year = thisYear;
      }
      day = element.substring(element.indexOf("月") + 1, element.indexOf("日"));
    } else if (element.substring(0, element.indexOf("/")).length > 3) {
      year = element.substring(0, element.indexOf("/"));
      month = element.substring(element.indexOf("/") + 1, element.lastIndexOf("/"));
      day = element.substring(element.lastIndexOf("/") + 1, element.indexOf("(") - 1);
    } else if (element.substring(0, element.indexOf("/")).length < 3) {
      month = element.substring(0, element.indexOf("/"));

      //　今月が12月で日程として1月が入力された場合来年の1月として扱う
      if (thisMonth === 12 && month === "1") {
        year = thisYear + 1;
      } else {
        year = thisYear;
      }
      day = element.substring(element.indexOf("/") + 1, element.indexOf("(") - 1);
    }
    newFormat.push([year, month, day, dayOfWeek, startTime, endTime]);
  });

  // どのフォーマットを選んだのかを
  var selectFormatIndex = document.getElementById("select-format").selectedIndex;
  changeFormat.value = "";
  var weekAndTime = "";
  var text = "";

  // 新しい配列の要素を選択されたフォーマット別に出力していく
  newFormat.forEach(function (element) {
    weekAndTime = " (" + element[3] + ") " + element[4] + "〜" + element[5];
    if (selectFormatIndex === 0) {
      text = element[1] + "月" + element[2] + "日" + weekAndTime;
    } else if (selectFormatIndex === 1) {
      text = element[0] + "年" + element[1] + "月" + element[2] + "日" + weekAndTime;
    } else if (selectFormatIndex === 2) {
      text = element[1] + "/" + element[2] + weekAndTime;
    } else if (selectFormatIndex === 3) {
      text = element[0] + "/" + element[1] + "/" + element[2] + weekAndTime;
    }
    if (changeFormat.value === "") {
      changeFormat.value = text + "\n";
    } else {
      changeFormat.value += text + "\n";
    }
  });
};
document.getElementById("add-datetime").addEventListener("click", function () {
  return onClickAdd();
});
document.getElementById("copy-button").addEventListener("click", function () {
  return onClickCopy();
});
if (document.getElementById("arrangement-button")) {
  document.getElementById("arrangement-button").addEventListener("click", function () {
    return onClickArrangement();
  });
}
document.getElementById("select-format").addEventListener("change", function () {
  return onChangeSelectFormat();
});
},{"./styles.css":"src/styles.css"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "41835" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map