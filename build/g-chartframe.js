(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.gChartframe = global.gChartframe || {})));
}(this, function (exports) { 'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var saveSvgAsPng = createCommonjsModule(function (module, exports) {
	(function() {
	  var out$ = 'object' != 'undefined' && exports || typeof undefined != 'undefined' && {} || this;

	  var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [<!ENTITY nbsp "&#160;">]>';

	  function isElement(obj) {
	    return obj instanceof HTMLElement || obj instanceof SVGElement;
	  }

	  function requireDomNode(el) {
	    if (!isElement(el)) {
	      throw new Error('an HTMLElement or SVGElement is required; got ' + el);
	    }
	  }

	  function isExternal(url) {
	    return url && url.lastIndexOf('http',0) == 0 && url.lastIndexOf(window.location.host) == -1;
	  }

	  function inlineImages(el, callback) {
	    requireDomNode(el);

	    var images = el.querySelectorAll('image'),
	        left = images.length,
	        checkDone = function() {
	          if (left === 0) {
	            callback();
	          }
	        };

	    checkDone();
	    for (var i = 0; i < images.length; i++) {
	      (function(image) {
	        var href = image.getAttributeNS("http://www.w3.org/1999/xlink", "href");
	        if (href) {
	          if (isExternal(href.value)) {
	            console.warn("Cannot render embedded images linking to external hosts: "+href.value);
	            return;
	          }
	        }
	        var canvas = document.createElement('canvas');
	        var ctx = canvas.getContext('2d');
	        var img = new Image();
	        img.crossOrigin="anonymous";
	        href = href || image.getAttribute('href');
	        if (href) {
	          img.src = href;
	          img.onload = function() {
	            canvas.width = img.width;
	            canvas.height = img.height;
	            ctx.drawImage(img, 0, 0);
	            image.setAttributeNS("http://www.w3.org/1999/xlink", "href", canvas.toDataURL('image/png'));
	            left--;
	            checkDone();
	          }
	          img.onerror = function() {
	            console.log("Could not load "+href);
	            left--;
	            checkDone();
	          }
	        } else {
	          left--;
	          checkDone();
	        }
	      })(images[i]);
	    }
	  }

	  function styles(el, options, cssLoadedCallback) {
	    var selectorRemap = options.selectorRemap;
	    var modifyStyle = options.modifyStyle;
	    var css = "";
	    // each font that has extranl link is saved into queue, and processed
	    // asynchronously
	    var fontsQueue = [];
	    var sheets = document.styleSheets;
	    for (var i = 0; i < sheets.length; i++) {
	      try {
	        var rules = sheets[i].cssRules;
	      } catch (e) {
	        console.warn("Stylesheet could not be loaded: "+sheets[i].href);
	        continue;
	      }

	      if (rules != null) {
	        for (var j = 0, match; j < rules.length; j++, match = null) {
	          var rule = rules[j];
	          if (typeof(rule.style) != "undefined") {
	            var selectorText;

	            try {
	              selectorText = rule.selectorText;
	            } catch(err) {
	              console.warn('The following CSS rule has an invalid selector: "' + rule + '"', err);
	            }

	            try {
	              if (selectorText) {
	                match = el.querySelector(selectorText) || el.parentNode.querySelector(selectorText);
	              }
	            } catch(err) {
	              console.warn('Invalid CSS selector "' + selectorText + '"', err);
	            }

	            if (match) {
	              var selector = selectorRemap ? selectorRemap(rule.selectorText) : rule.selectorText;
	              var cssText = modifyStyle ? modifyStyle(rule.style.cssText) : rule.style.cssText;
	              css += selector + " { " + cssText + " }\n";
	            } else if(rule.cssText.match(/^@font-face/)) {
	              // below we are trying to find matches to external link. E.g.
	              // @font-face {
	              //   // ...
	              //   src: local('Abel'), url(https://fonts.gstatic.com/s/abel/v6/UzN-iejR1VoXU2Oc-7LsbvesZW2xOQ-xsNqO47m55DA.woff2);
	              // }
	              //
	              // This regex will save extrnal link into first capture group
	              var fontUrlRegexp = /url\(["']?(.+?)["']?\)/;
	              // TODO: This needs to be changed to support multiple url declarations per font.
	              var fontUrlMatch = rule.cssText.match(fontUrlRegexp);

	              var externalFontUrl = (fontUrlMatch && fontUrlMatch[1]) || '';
	              var fontUrlIsDataURI = externalFontUrl.match(/^data:/);
	              if (fontUrlIsDataURI) {
	                // We should ignore data uri - they are already embedded
	                externalFontUrl = '';
	              }

	              if (externalFontUrl) {
	                // okay, we are lucky. We can fetch this font later

	                //handle url if relative
	                if (externalFontUrl.startsWith('../')) {
	                  externalFontUrl = sheets[i].href + '/../' + externalFontUrl
	                } else if (externalFontUrl.startsWith('./')) {
	                  externalFontUrl = sheets[i].href + '/.' + externalFontUrl
	                }

	                fontsQueue.push({
	                  text: rule.cssText,
	                  // Pass url regex, so that once font is downladed, we can run `replace()` on it
	                  fontUrlRegexp: fontUrlRegexp,
	                  format: getFontMimeTypeFromUrl(externalFontUrl),
	                  url: externalFontUrl
	                });
	              } else {
	                // otherwise, use previous logic
	                css += rule.cssText + '\n';
	              }
	            }
	          }
	        }
	      }
	    }

	    // Now all css is processed, it's time to handle scheduled fonts
	    processFontQueue(fontsQueue);

	    function getFontMimeTypeFromUrl(fontUrl) {
	      var supportedFormats = {
	        'woff2': 'font/woff2',
	        'woff': 'font/woff',
	        'otf': 'application/x-font-opentype',
	        'ttf': 'application/x-font-ttf',
	        'eot': 'application/vnd.ms-fontobject',
	        'sfnt': 'application/font-sfnt',
	        'svg': 'image/svg+xml'
	      };
	      var extensions = Object.keys(supportedFormats);
	      for (var i = 0; i < extensions.length; ++i) {
	        var extension = extensions[i];
	        // TODO: This is not bullet proof, it needs to handle edge cases...
	        if (fontUrl.indexOf('.' + extension) > 0) {
	          return supportedFormats[extension];
	        }
	      }

	      // If you see this error message, you probably need to update code above.
	      console.error('Unknown font format for ' + fontUrl+ '; Fonts may not be working correctly');
	      return 'application/octet-stream';
	    }

	    function processFontQueue(queue) {
	      if (queue.length > 0) {
	        // load fonts one by one until we have anything in the queue:
	        var font = queue.pop();
	        processNext(font);
	      } else {
	        // no more fonts to load.
	        cssLoadedCallback(css);
	      }

	      function processNext(font) {
	        // TODO: This could benefit from caching.
	        var oReq = new XMLHttpRequest();
	        oReq.addEventListener('load', fontLoaded);
	        oReq.addEventListener('error', transferFailed);
	        oReq.addEventListener('abort', transferFailed);
	        oReq.open('GET', font.url);
	        oReq.responseType = 'arraybuffer';
	        oReq.send();

	        function fontLoaded() {
	          // TODO: it may be also worth to wait until fonts are fully loaded before
	          // attempting to rasterize them. (e.g. use https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet )
	          var fontBits = oReq.response;
	          var fontInBase64 = arrayBufferToBase64(fontBits);
	          updateFontStyle(font, fontInBase64);
	        }

	        function transferFailed(e) {
	          console.warn('Failed to load font from: ' + font.url);
	          console.warn(e)
	          css += font.text + '\n';
	          processFontQueue();
	        }

	        function updateFontStyle(font, fontInBase64) {
	          var dataUrl = 'url("data:' + font.format + ';base64,' + fontInBase64 + '")';
	          css += font.text.replace(font.fontUrlRegexp, dataUrl) + '\n';

	          // schedule next font download on next tick.
	          setTimeout(function() {
	            processFontQueue(queue)
	          }, 0);
	        }

	      }
	    }

	    function arrayBufferToBase64(buffer) {
	      var binary = '';
	      var bytes = new Uint8Array(buffer);
	      var len = bytes.byteLength;

	      for (var i = 0; i < len; i++) {
	          binary += String.fromCharCode(bytes[i]);
	      }

	      return window.btoa(binary);
	    }
	  }

	  function getDimension(el, clone, dim) {
	    var v = (el.viewBox && el.viewBox.baseVal && el.viewBox.baseVal[dim]) ||
	      (clone.getAttribute(dim) !== null && !clone.getAttribute(dim).match(/%$/) && parseInt(clone.getAttribute(dim))) ||
	      el.getBoundingClientRect()[dim] ||
	      parseInt(clone.style[dim]) ||
	      parseInt(window.getComputedStyle(el).getPropertyValue(dim));
	    return (typeof v === 'undefined' || v === null || isNaN(parseFloat(v))) ? 0 : v;
	  }

	  function reEncode(data) {
	    data = encodeURIComponent(data);
	    data = data.replace(/%([0-9A-F]{2})/g, function(match, p1) {
	      var c = String.fromCharCode('0x'+p1);
	      return c === '%' ? '%25' : c;
	    });
	    return decodeURIComponent(data);
	  }

	  out$.prepareSvg = function(el, options, cb) {
	    requireDomNode(el);

	    options = options || {};
	    options.scale = options.scale || 1;
	    options.responsive = options.responsive || false;
	    var xmlns = "http://www.w3.org/2000/xmlns/";

	    inlineImages(el, function() {
	      var outer = document.createElement("div");
	      var clone = el.cloneNode(true);
	      var width, height;
	      if(el.tagName == 'svg') {
	        width = options.width || getDimension(el, clone, 'width');
	        height = options.height || getDimension(el, clone, 'height');
	      } else if(el.getBBox) {
	        var box = el.getBBox();
	        width = box.x + box.width;
	        height = box.y + box.height;
	        clone.setAttribute('transform', clone.getAttribute('transform').replace(/translate\(.*?\)/, ''));

	        var svg = document.createElementNS('http://www.w3.org/2000/svg','svg')
	        svg.appendChild(clone)
	        clone = svg;
	      } else {
	        console.error('Attempted to render non-SVG element', el);
	        return;
	      }

	      clone.setAttribute("version", "1.1");
	      if (!clone.getAttribute('xmlns')) {
	        clone.setAttributeNS(xmlns, "xmlns", "http://www.w3.org/2000/svg");
	      }
	      if (!clone.getAttribute('xmlns:xlink')) {
	        clone.setAttributeNS(xmlns, "xmlns:xlink", "http://www.w3.org/1999/xlink");
	      }

	      if (options.responsive) {
	        clone.removeAttribute('width');
	        clone.removeAttribute('height');
	        clone.setAttribute('preserveAspectRatio', 'xMinYMin meet');
	      } else {
	        clone.setAttribute("width", width * options.scale);
	        clone.setAttribute("height", height * options.scale);
	      }

	      clone.setAttribute("viewBox", [
	        options.left || 0,
	        options.top || 0,
	        width,
	        height
	      ].join(" "));

	      var fos = clone.querySelectorAll('foreignObject > *');
	      for (var i = 0; i < fos.length; i++) {
	        if (!fos[i].getAttribute('xmlns')) {
	          fos[i].setAttributeNS(xmlns, "xmlns", "http://www.w3.org/1999/xhtml");
	        }
	      }

	      outer.appendChild(clone);

	      // In case of custom fonts we need to fetch font first, and then inline
	      // its url into data-uri format (encode as base64). That's why style
	      // processing is done asynchonously. Once all inlining is finshed
	      // cssLoadedCallback() is called.
	      styles(el, options, cssLoadedCallback);

	      function cssLoadedCallback(css) {
	        // here all fonts are inlined, so that we can render them properly.
	        var s = document.createElement('style');
	        s.setAttribute('type', 'text/css');
	        s.innerHTML = "<![CDATA[\n" + css + "\n]]>";
	        var defs = document.createElement('defs');
	        defs.appendChild(s);
	        clone.insertBefore(defs, clone.firstChild);

	        if (cb) {
	          var outHtml = outer.innerHTML;
	          outHtml = outHtml.replace(/NS\d+:href/gi, 'xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href');
	          cb(outHtml, width, height);
	        }
	      }
	    });
	  }

	  out$.svgAsDataUri = function(el, options, cb) {
	    out$.prepareSvg(el, options, function(svg) {
	      var uri = 'data:image/svg+xml;base64,' + window.btoa(reEncode(doctype + svg));
	      if (cb) {
	        cb(uri);
	      }
	    });
	  }

	  out$.svgAsPngUri = function(el, options, cb) {
	    requireDomNode(el);

	    options = options || {};
	    options.encoderType = options.encoderType || 'image/png';
	    options.encoderOptions = options.encoderOptions || 0.8;

	    var convertToPng = function(src, w, h) {
	      var canvas = document.createElement('canvas');
	      var context = canvas.getContext('2d');
	      canvas.width = w;
	      canvas.height = h;

	      if(options.canvg) {
	        options.canvg(canvas, src);
	      } else {
	        context.drawImage(src, 0, 0);
	      }

	      if(options.backgroundColor){
	        context.globalCompositeOperation = 'destination-over';
	        context.fillStyle = options.backgroundColor;
	        context.fillRect(0, 0, canvas.width, canvas.height);
	      }

	      var png;
	      try {
	        png = canvas.toDataURL(options.encoderType, options.encoderOptions);
	      } catch (e) {
	        if ((typeof SecurityError !== 'undefined' && e instanceof SecurityError) || e.name == "SecurityError") {
	          console.error("Rendered SVG images cannot be downloaded in this browser.");
	          return;
	        } else {
	          throw e;
	        }
	      }
	      cb(png);
	    }

	    if(options.canvg) {
	      out$.prepareSvg(el, options, convertToPng);
	    } else {
	      out$.svgAsDataUri(el, options, function(uri) {
	        var image = new Image();

	        image.onload = function() {
	          convertToPng(image, image.width, image.height);
	        }

	        image.onerror = function() {
	          console.error(
	            'There was an error loading the data URI as an image on the following SVG\n',
	            window.atob(uri.slice(26)), '\n',
	            "Open the following link to see browser's diagnosis\n",
	            uri);
	        }

	        image.src = uri;
	      });
	    }
	  }

	  out$.download = function(name, uri) {
	    if (navigator.msSaveOrOpenBlob) {
	      navigator.msSaveOrOpenBlob(uriToBlob(uri), name);
	    } else {
	      var saveLink = document.createElement('a');
	      var downloadSupported = 'download' in saveLink;
	      if (downloadSupported) {
	        saveLink.download = name;
	        saveLink.style.display = 'none';
	        document.body.appendChild(saveLink);
	        try {
	          var blob = uriToBlob(uri);
	          var url = URL.createObjectURL(blob);
	          saveLink.href = url;
	          saveLink.onclick = function() {
	            requestAnimationFrame(function() {
	              URL.revokeObjectURL(url);
	            })
	          };
	        } catch (e) {
	          console.warn('This browser does not support object URLs. Falling back to string URL.');
	          saveLink.href = uri;
	        }
	        saveLink.click();
	        document.body.removeChild(saveLink);
	      }
	      else {
	        window.open(uri, '_temp', 'menubar=no,toolbar=no,status=no');
	      }
	    }
	  }

	  function uriToBlob(uri) {
	    var byteString = window.atob(uri.split(',')[1]);
	    var mimeString = uri.split(',')[0].split(':')[1].split(';')[0]
	    var buffer = new ArrayBuffer(byteString.length);
	    var intArray = new Uint8Array(buffer);
	    for (var i = 0; i < byteString.length; i++) {
	      intArray[i] = byteString.charCodeAt(i);
	    }
	    return new Blob([buffer], {type: mimeString});
	  }

	  out$.saveSvg = function(el, name, options) {
	    requireDomNode(el);

	    options = options || {};
	    out$.svgAsDataUri(el, options, function(uri) {
	      out$.download(name, uri);
	    });
	  }

	  out$.saveSvgAsPng = function(el, name, options) {
	    requireDomNode(el);

	    options = options || {};
	    out$.svgAsPngUri(el, options, function(uri) {
	      out$.download(name, uri);
	    });
	  }

	  // if define is defined create as an AMD module
	  if (typeof undefined !== 'undefined') {
	    undefined(function() {
	      return out$;
	    });
	  }

	})();
	});

	var saveSvgAsPng_1 = saveSvgAsPng.saveSvgAsPng;

	var xhtml = "http://www.w3.org/1999/xhtml";

	var namespaces = {
	  svg: "http://www.w3.org/2000/svg",
	  xhtml: xhtml,
	  xlink: "http://www.w3.org/1999/xlink",
	  xml: "http://www.w3.org/XML/1998/namespace",
	  xmlns: "http://www.w3.org/2000/xmlns/"
	};

	function namespace(name) {
	  var prefix = name += "", i = prefix.indexOf(":");
	  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
	}

	function creatorInherit(name) {
	  return function() {
	    var document = this.ownerDocument,
	        uri = this.namespaceURI;
	    return uri === xhtml && document.documentElement.namespaceURI === xhtml
	        ? document.createElement(name)
	        : document.createElementNS(uri, name);
	  };
	}

	function creatorFixed(fullname) {
	  return function() {
	    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
	  };
	}

	function creator(name) {
	  var fullname = namespace(name);
	  return (fullname.local
	      ? creatorFixed
	      : creatorInherit)(fullname);
	}

	var matcher = function(selector) {
	  return function() {
	    return this.matches(selector);
	  };
	};

	if (typeof document !== "undefined") {
	  var element = document.documentElement;
	  if (!element.matches) {
	    var vendorMatches = element.webkitMatchesSelector
	        || element.msMatchesSelector
	        || element.mozMatchesSelector
	        || element.oMatchesSelector;
	    matcher = function(selector) {
	      return function() {
	        return vendorMatches.call(this, selector);
	      };
	    };
	  }
	}

	var matcher$1 = matcher;

	var filterEvents = {};

	var event = null;

	if (typeof document !== "undefined") {
	  var element$1 = document.documentElement;
	  if (!("onmouseenter" in element$1)) {
	    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
	  }
	}

	function filterContextListener(listener, index, group) {
	  listener = contextListener(listener, index, group);
	  return function(event) {
	    var related = event.relatedTarget;
	    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
	      listener.call(this, event);
	    }
	  };
	}

	function contextListener(listener, index, group) {
	  return function(event1) {
	    var event0 = event; // Events can be reentrant (e.g., focus).
	    event = event1;
	    try {
	      listener.call(this, this.__data__, index, group);
	    } finally {
	      event = event0;
	    }
	  };
	}

	function parseTypenames(typenames) {
	  return typenames.trim().split(/^|\s+/).map(function(t) {
	    var name = "", i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    return {type: t, name: name};
	  });
	}

	function onRemove(typename) {
	  return function() {
	    var on = this.__on;
	    if (!on) return;
	    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
	      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.capture);
	      } else {
	        on[++i] = o;
	      }
	    }
	    if (++i) on.length = i;
	    else delete this.__on;
	  };
	}

	function onAdd(typename, value, capture) {
	  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
	  return function(d, i, group) {
	    var on = this.__on, o, listener = wrap(value, i, group);
	    if (on) for (var j = 0, m = on.length; j < m; ++j) {
	      if ((o = on[j]).type === typename.type && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.capture);
	        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
	        o.value = value;
	        return;
	      }
	    }
	    this.addEventListener(typename.type, listener, capture);
	    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
	    if (!on) this.__on = [o];
	    else on.push(o);
	  };
	}

	function selection_on(typename, value, capture) {
	  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

	  if (arguments.length < 2) {
	    var on = this.node().__on;
	    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
	      for (i = 0, o = on[j]; i < n; ++i) {
	        if ((t = typenames[i]).type === o.type && t.name === o.name) {
	          return o.value;
	        }
	      }
	    }
	    return;
	  }

	  on = value ? onAdd : onRemove;
	  if (capture == null) capture = false;
	  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
	  return this;
	}

	function none() {}

	function selector(selector) {
	  return selector == null ? none : function() {
	    return this.querySelector(selector);
	  };
	}

	function selection_select(select) {
	  if (typeof select !== "function") select = selector(select);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	        if ("__data__" in node) subnode.__data__ = node.__data__;
	        subgroup[i] = subnode;
	      }
	    }
	  }

	  return new Selection(subgroups, this._parents);
	}

	function empty() {
	  return [];
	}

	function selectorAll(selector) {
	  return selector == null ? empty : function() {
	    return this.querySelectorAll(selector);
	  };
	}

	function selection_selectAll(select) {
	  if (typeof select !== "function") select = selectorAll(select);

	  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        subgroups.push(select.call(node, node.__data__, i, group));
	        parents.push(node);
	      }
	    }
	  }

	  return new Selection(subgroups, parents);
	}

	function selection_filter(match) {
	  if (typeof match !== "function") match = matcher$1(match);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	        subgroup.push(node);
	      }
	    }
	  }

	  return new Selection(subgroups, this._parents);
	}

	function sparse(update) {
	  return new Array(update.length);
	}

	function selection_enter() {
	  return new Selection(this._enter || this._groups.map(sparse), this._parents);
	}

	function EnterNode(parent, datum) {
	  this.ownerDocument = parent.ownerDocument;
	  this.namespaceURI = parent.namespaceURI;
	  this._next = null;
	  this._parent = parent;
	  this.__data__ = datum;
	}

	EnterNode.prototype = {
	  constructor: EnterNode,
	  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
	  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
	  querySelector: function(selector) { return this._parent.querySelector(selector); },
	  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
	};

	function constant(x) {
	  return function() {
	    return x;
	  };
	}

	var keyPrefix = "$"; // Protect against keys like “__proto__”.

	function bindIndex(parent, group, enter, update, exit, data) {
	  var i = 0,
	      node,
	      groupLength = group.length,
	      dataLength = data.length;

	  // Put any non-null nodes that fit into update.
	  // Put any null nodes into enter.
	  // Put any remaining data into enter.
	  for (; i < dataLength; ++i) {
	    if (node = group[i]) {
	      node.__data__ = data[i];
	      update[i] = node;
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  }

	  // Put any non-null nodes that don’t fit into exit.
	  for (; i < groupLength; ++i) {
	    if (node = group[i]) {
	      exit[i] = node;
	    }
	  }
	}

	function bindKey(parent, group, enter, update, exit, data, key) {
	  var i,
	      node,
	      nodeByKeyValue = {},
	      groupLength = group.length,
	      dataLength = data.length,
	      keyValues = new Array(groupLength),
	      keyValue;

	  // Compute the key for each node.
	  // If multiple nodes have the same key, the duplicates are added to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if (node = group[i]) {
	      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
	      if (keyValue in nodeByKeyValue) {
	        exit[i] = node;
	      } else {
	        nodeByKeyValue[keyValue] = node;
	      }
	    }
	  }

	  // Compute the key for each datum.
	  // If there a node associated with this key, join and add it to update.
	  // If there is not (or the key is a duplicate), add it to enter.
	  for (i = 0; i < dataLength; ++i) {
	    keyValue = keyPrefix + key.call(parent, data[i], i, data);
	    if (node = nodeByKeyValue[keyValue]) {
	      update[i] = node;
	      node.__data__ = data[i];
	      nodeByKeyValue[keyValue] = null;
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  }

	  // Add any remaining nodes that were not bound to data to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
	      exit[i] = node;
	    }
	  }
	}

	function selection_data(value, key) {
	  if (!value) {
	    data = new Array(this.size()), j = -1;
	    this.each(function(d) { data[++j] = d; });
	    return data;
	  }

	  var bind = key ? bindKey : bindIndex,
	      parents = this._parents,
	      groups = this._groups;

	  if (typeof value !== "function") value = constant(value);

	  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
	    var parent = parents[j],
	        group = groups[j],
	        groupLength = group.length,
	        data = value.call(parent, parent && parent.__data__, j, parents),
	        dataLength = data.length,
	        enterGroup = enter[j] = new Array(dataLength),
	        updateGroup = update[j] = new Array(dataLength),
	        exitGroup = exit[j] = new Array(groupLength);

	    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

	    // Now connect the enter nodes to their following update node, such that
	    // appendChild can insert the materialized enter node before this node,
	    // rather than at the end of the parent node.
	    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
	      if (previous = enterGroup[i0]) {
	        if (i0 >= i1) i1 = i0 + 1;
	        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
	        previous._next = next || null;
	      }
	    }
	  }

	  update = new Selection(update, parents);
	  update._enter = enter;
	  update._exit = exit;
	  return update;
	}

	function selection_exit() {
	  return new Selection(this._exit || this._groups.map(sparse), this._parents);
	}

	function selection_merge(selection) {

	  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group0[i] || group1[i]) {
	        merge[i] = node;
	      }
	    }
	  }

	  for (; j < m0; ++j) {
	    merges[j] = groups0[j];
	  }

	  return new Selection(merges, this._parents);
	}

	function selection_order() {

	  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
	    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
	      if (node = group[i]) {
	        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
	        next = node;
	      }
	    }
	  }

	  return this;
	}

	function selection_sort(compare) {
	  if (!compare) compare = ascending;

	  function compareNode(a, b) {
	    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
	  }

	  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        sortgroup[i] = node;
	      }
	    }
	    sortgroup.sort(compareNode);
	  }

	  return new Selection(sortgroups, this._parents).order();
	}

	function ascending(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function selection_call() {
	  var callback = arguments[0];
	  arguments[0] = this;
	  callback.apply(null, arguments);
	  return this;
	}

	function selection_nodes() {
	  var nodes = new Array(this.size()), i = -1;
	  this.each(function() { nodes[++i] = this; });
	  return nodes;
	}

	function selection_node() {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
	      var node = group[i];
	      if (node) return node;
	    }
	  }

	  return null;
	}

	function selection_size() {
	  var size = 0;
	  this.each(function() { ++size; });
	  return size;
	}

	function selection_empty() {
	  return !this.node();
	}

	function selection_each(callback) {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
	      if (node = group[i]) callback.call(node, node.__data__, i, group);
	    }
	  }

	  return this;
	}

	function attrRemove(name) {
	  return function() {
	    this.removeAttribute(name);
	  };
	}

	function attrRemoveNS(fullname) {
	  return function() {
	    this.removeAttributeNS(fullname.space, fullname.local);
	  };
	}

	function attrConstant(name, value) {
	  return function() {
	    this.setAttribute(name, value);
	  };
	}

	function attrConstantNS(fullname, value) {
	  return function() {
	    this.setAttributeNS(fullname.space, fullname.local, value);
	  };
	}

	function attrFunction(name, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttribute(name);
	    else this.setAttribute(name, v);
	  };
	}

	function attrFunctionNS(fullname, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
	    else this.setAttributeNS(fullname.space, fullname.local, v);
	  };
	}

	function selection_attr(name, value) {
	  var fullname = namespace(name);

	  if (arguments.length < 2) {
	    var node = this.node();
	    return fullname.local
	        ? node.getAttributeNS(fullname.space, fullname.local)
	        : node.getAttribute(fullname);
	  }

	  return this.each((value == null
	      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
	      ? (fullname.local ? attrFunctionNS : attrFunction)
	      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
	}

	function defaultView(node) {
	  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
	      || (node.document && node) // node is a Window
	      || node.defaultView; // node is a Document
	}

	function styleRemove(name) {
	  return function() {
	    this.style.removeProperty(name);
	  };
	}

	function styleConstant(name, value, priority) {
	  return function() {
	    this.style.setProperty(name, value, priority);
	  };
	}

	function styleFunction(name, value, priority) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.style.removeProperty(name);
	    else this.style.setProperty(name, v, priority);
	  };
	}

	function selection_style(name, value, priority) {
	  return arguments.length > 1
	      ? this.each((value == null
	            ? styleRemove : typeof value === "function"
	            ? styleFunction
	            : styleConstant)(name, value, priority == null ? "" : priority))
	      : styleValue(this.node(), name);
	}

	function styleValue(node, name) {
	  return node.style.getPropertyValue(name)
	      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
	}

	function propertyRemove(name) {
	  return function() {
	    delete this[name];
	  };
	}

	function propertyConstant(name, value) {
	  return function() {
	    this[name] = value;
	  };
	}

	function propertyFunction(name, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) delete this[name];
	    else this[name] = v;
	  };
	}

	function selection_property(name, value) {
	  return arguments.length > 1
	      ? this.each((value == null
	          ? propertyRemove : typeof value === "function"
	          ? propertyFunction
	          : propertyConstant)(name, value))
	      : this.node()[name];
	}

	function classArray(string) {
	  return string.trim().split(/^|\s+/);
	}

	function classList(node) {
	  return node.classList || new ClassList(node);
	}

	function ClassList(node) {
	  this._node = node;
	  this._names = classArray(node.getAttribute("class") || "");
	}

	ClassList.prototype = {
	  add: function(name) {
	    var i = this._names.indexOf(name);
	    if (i < 0) {
	      this._names.push(name);
	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  remove: function(name) {
	    var i = this._names.indexOf(name);
	    if (i >= 0) {
	      this._names.splice(i, 1);
	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  contains: function(name) {
	    return this._names.indexOf(name) >= 0;
	  }
	};

	function classedAdd(node, names) {
	  var list = classList(node), i = -1, n = names.length;
	  while (++i < n) list.add(names[i]);
	}

	function classedRemove(node, names) {
	  var list = classList(node), i = -1, n = names.length;
	  while (++i < n) list.remove(names[i]);
	}

	function classedTrue(names) {
	  return function() {
	    classedAdd(this, names);
	  };
	}

	function classedFalse(names) {
	  return function() {
	    classedRemove(this, names);
	  };
	}

	function classedFunction(names, value) {
	  return function() {
	    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
	  };
	}

	function selection_classed(name, value) {
	  var names = classArray(name + "");

	  if (arguments.length < 2) {
	    var list = classList(this.node()), i = -1, n = names.length;
	    while (++i < n) if (!list.contains(names[i])) return false;
	    return true;
	  }

	  return this.each((typeof value === "function"
	      ? classedFunction : value
	      ? classedTrue
	      : classedFalse)(names, value));
	}

	function textRemove() {
	  this.textContent = "";
	}

	function textConstant(value) {
	  return function() {
	    this.textContent = value;
	  };
	}

	function textFunction(value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    this.textContent = v == null ? "" : v;
	  };
	}

	function selection_text(value) {
	  return arguments.length
	      ? this.each(value == null
	          ? textRemove : (typeof value === "function"
	          ? textFunction
	          : textConstant)(value))
	      : this.node().textContent;
	}

	function htmlRemove() {
	  this.innerHTML = "";
	}

	function htmlConstant(value) {
	  return function() {
	    this.innerHTML = value;
	  };
	}

	function htmlFunction(value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    this.innerHTML = v == null ? "" : v;
	  };
	}

	function selection_html(value) {
	  return arguments.length
	      ? this.each(value == null
	          ? htmlRemove : (typeof value === "function"
	          ? htmlFunction
	          : htmlConstant)(value))
	      : this.node().innerHTML;
	}

	function raise() {
	  if (this.nextSibling) this.parentNode.appendChild(this);
	}

	function selection_raise() {
	  return this.each(raise);
	}

	function lower() {
	  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
	}

	function selection_lower() {
	  return this.each(lower);
	}

	function selection_append(name) {
	  var create = typeof name === "function" ? name : creator(name);
	  return this.select(function() {
	    return this.appendChild(create.apply(this, arguments));
	  });
	}

	function constantNull() {
	  return null;
	}

	function selection_insert(name, before) {
	  var create = typeof name === "function" ? name : creator(name),
	      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
	  return this.select(function() {
	    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
	  });
	}

	function remove() {
	  var parent = this.parentNode;
	  if (parent) parent.removeChild(this);
	}

	function selection_remove() {
	  return this.each(remove);
	}

	function selection_datum(value) {
	  return arguments.length
	      ? this.property("__data__", value)
	      : this.node().__data__;
	}

	function dispatchEvent(node, type, params) {
	  var window = defaultView(node),
	      event = window.CustomEvent;

	  if (typeof event === "function") {
	    event = new event(type, params);
	  } else {
	    event = window.document.createEvent("Event");
	    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
	    else event.initEvent(type, false, false);
	  }

	  node.dispatchEvent(event);
	}

	function dispatchConstant(type, params) {
	  return function() {
	    return dispatchEvent(this, type, params);
	  };
	}

	function dispatchFunction(type, params) {
	  return function() {
	    return dispatchEvent(this, type, params.apply(this, arguments));
	  };
	}

	function selection_dispatch(type, params) {
	  return this.each((typeof params === "function"
	      ? dispatchFunction
	      : dispatchConstant)(type, params));
	}

	var root = [null];

	function Selection(groups, parents) {
	  this._groups = groups;
	  this._parents = parents;
	}

	function selection() {
	  return new Selection([[document.documentElement]], root);
	}

	Selection.prototype = selection.prototype = {
	  constructor: Selection,
	  select: selection_select,
	  selectAll: selection_selectAll,
	  filter: selection_filter,
	  data: selection_data,
	  enter: selection_enter,
	  exit: selection_exit,
	  merge: selection_merge,
	  order: selection_order,
	  sort: selection_sort,
	  call: selection_call,
	  nodes: selection_nodes,
	  node: selection_node,
	  size: selection_size,
	  empty: selection_empty,
	  each: selection_each,
	  attr: selection_attr,
	  style: selection_style,
	  property: selection_property,
	  classed: selection_classed,
	  text: selection_text,
	  html: selection_html,
	  raise: selection_raise,
	  lower: selection_lower,
	  append: selection_append,
	  insert: selection_insert,
	  remove: selection_remove,
	  datum: selection_datum,
	  on: selection_on,
	  dispatch: selection_dispatch
	};

	function select(selector) {
	  return typeof selector === "string"
	      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
	      : new Selection([[selector]], root);
	}

	function chartFrame(configObject) {
	    let autoPosition = false;
	    let backgroundColour;
	    let containerClass = 'g-chartframe';
	    let copyright = '© FT';
	    let copyrightStyle = false;
	    let goalposts = false; // goalpost is the bit at the top and bottom of pritn charts
	    let blackbar = false; // blackbar the short black bar above web graphics
	    let fullYear = false;
	    let showDownloadPngButtons = true;
	    let graphicHeight = 400;
	    let graphicWidth = 500;
	    let plot;
	    let plotAdjuster = 0;
	    let rem = 18;
	    let subtitle = 'some supporting information, units perhaps';
	    let subtitleLineHeight = 20;
	    let subtitleStyle = {};
	    let source = 'Source: research|FT Graphic Tom Pearson';
	    let sourceLineHeight = 16;
	    let sourcePlotYOffset = 46;
	    let sourceStyle = {};
	    let title = 'Title: A description of the charts purpose';
	    let titleLineHeight = 32;
	    let titleStyle = {};
	    let watermarkLocation = 'icons.svg#ft-logo';
	    let watermarkMarkup = '';
	    let watermarkOffset = 0;
	    let watermarkSize = 58;
	    let units = 'px';

	    const margin = {
	        top: 100,
	        left: 1,
	        bottom: 20,
	        right: 20,
	    };
	    const subtitlePosition = { x: 1, y: 67 };
	    const sourcePosition = { x: 1 };
	    const titlePosition = { x: 1, y: 30 };
	    const transition = 0.2;
	    const convertFrom = {
	        mm(x) { return (x * 2.83464480558843); },
	        px(x) { return x; },
	    };
	    const custom = {};

	    function attributeStyle(parent, style) {
	        Object.keys(style).forEach((attribute) => {
	            parent.attr(attribute, style[attribute]);
	        });
	    }

	    function frame(p) {
	        // overall graphic properties
	        p.attr('class', containerClass)
	            .attr('font-family', 'MetricWeb,sans-serif');
	        if (p.node().nodeName.toLowerCase() === 'svg') {
	            p.transition(transition)
	                .attr('width', graphicWidth)
	                .attr('height', graphicHeight)
	                .attr('viewBox', ['0 0', graphicWidth, graphicHeight].join(' '));

	            p.selectAll('title')
	                .data([title])
	                .enter()
	                .append('title');

	            p.selectAll('title').text(title);
	        }

	        // background
	        if (backgroundColour !== undefined) {
	            p.selectAll('rect.chart-background')
	                .data([backgroundColour])
	                .enter()
	                .append('rect')
	                .attr('id', 'chart-background')
	                .attr('class', 'chart-background');

	            p.selectAll('rect.chart-background')
	                .transition(transition)
	                .attr('x', 0)
	                .attr('y', 0)
	                .attr('width', graphicWidth)
	                .attr('height', graphicHeight)
	                .attr('fill', backgroundColour);
	        }

	        // 'blackbar' (the short black bar above web graphics)
	        if (blackbar) {
	            p.append('rect')
	                .attr('width', 60)
	                .attr('height', 4)
	                .style('fill', blackbar);
	        }

	        // 'goalposts' (the bit at the top and the bottom of print charts)
	        if (goalposts) {
	            const goalpostPaths = [
	                `M 0, ${graphicHeight} L ${graphicWidth}, ${graphicHeight}`,
	                `M 0, 15 L 0, 0 L ${graphicWidth}, 0 L ${graphicWidth}, 15`,
	            ];

	            p.selectAll('path.chart-goalposts')
	                .data(goalpostPaths)
	                .enter()
	                .append('path')
	                .attr('class', 'chart-goalposts');

	            p.selectAll('path.chart-goalposts')
	                .transition(transition)
	                .attr('d', d => d)
	                .attr('stroke-width', 0.3)
	                .attr('fill', 'none')
	                .attr('stroke', goalposts);
	        }

	        // title
	        const titleLineCount = title.split('|').length;
	        p.selectAll('text.chart-title')
	            .data([title])
	            .enter()
	            .append('text')
	            .attr('class', 'chart-title')
	            .attr('id', `${containerClass}title`)
	            .call((titleText) => {
	                titleText.selectAll('tspan')
	                    .data(title.split('|'))
	                    .enter()
	                    .append('tspan')
	                    .html(d => d)
	                    .attr('y', (d, i) => (titlePosition.y + (i * titleLineHeight)))
	                    .attr('x', titlePosition.x)
	                    .call(attributeStyle, titleStyle);
	            });

	        p.selectAll('text.chart-title tspan')
	            .html(d => d)
	            .transition(transition)
	            .attr('y', (d, i) => (titlePosition.y + (i * titleLineHeight)))
	            .attr('x', titlePosition.x)
	            .call(attributeStyle, titleStyle);

	        const subtitleLineCount = subtitle.split('|').length;
	        // subtitle
	        p.selectAll('text.chart-subtitle')
	            .data([subtitle])
	            .enter()
	            .append('text')
	            .attr('id', `${containerClass}subtitle`)
	            .attr('class', 'chart-subtitle')
	            .call((subtitleText) => {
	                subtitleText.selectAll('tspan')
	                    .data(subtitle.split('|'))
	                    .enter()
	                    .append('tspan')
	                    .html(d => d)
	                    .attr('id', `${containerClass}subtitle`)
	                    .attr('y', (d, i) => {
	                        if (titleLineCount > 1) {
	                            return (titlePosition.y + (titleLineCount * titleLineHeight) + (subtitleLineHeight * i));
	                        }
	                        return (subtitlePosition.y + (i * subtitleLineHeight));
	                    })

	                    .attr('x', subtitlePosition.x)
	                    .call(attributeStyle, subtitleStyle);
	            });

	        p.selectAll('text.chart-subtitle tspan')
	            .html(d => d)
	            .transition(transition)
	            .attr('y', (d, i) => {
	                if (titleLineCount > 1) {
	                    return (titlePosition.y + (titleLineCount * titleLineHeight) + (subtitleLineHeight * i));
	                }
	                return (subtitlePosition.y + (i * subtitleLineHeight));
	            })
	            .attr('x', subtitlePosition.x)
	            .call(attributeStyle, subtitleStyle);

	        // source
	        p.selectAll('text.chart-source')
	            .data([source])
	            .enter()
	            .append('text')
	            .attr('class', 'chart-source')
	            .attr('id', `${containerClass}source`)
	            .call((sourceText) => {
	                sourceText.selectAll('tspan')
	                    .data(source.split('|'))
	                    .enter()
	                    .append('tspan')
	                    .html(d => d)
	                    .attr('id', `${containerClass}source`)
	                    .attr('y', (d, i) => {
	                        if (sourcePosition.y) {
	                            return (sourcePosition.y + (i * sourceLineHeight));
	                        }
	                        return ((graphicHeight - (margin.bottom - sourcePlotYOffset) + sourceLineHeight * 1.5) + ((i) * sourceLineHeight)); // eslint-disable-line
	                    })
	                    .attr('x', subtitlePosition.x)
	                    .call(attributeStyle, subtitleStyle);
	            });

	        p.selectAll('text.chart-source tspan')
	            .html(d => d)
	            .transition(transition)
	            .attr('y', (d, i) => {
	                if (sourcePosition.y) {
	                    return (sourcePosition.y + (i * sourceLineHeight));
	                }
	                return ((graphicHeight - (margin.bottom - sourcePlotYOffset) + sourceLineHeight * 1.5) + ((i) * sourceLineHeight)); // eslint-disable-line
	            })
	            .attr('x', sourcePosition.x)
	            .call(attributeStyle, sourceStyle);

	        const sourceLineCount = source.split('|').length;
	        // copyright
	        if (copyrightStyle) {
	            p.selectAll('text.chart-copyright')
	                .data([copyright])
	                .enter()
	                .append('text')
	                .attr('class', 'chart-copyright')
	                .append('tspan')
	                .html(d => d)
	                .attr('x', sourcePosition.x)
	                .attr('y', () => {
	                    if (sourceLineCount > 1) {
	                        return (graphicHeight - (margin.bottom - sourcePlotYOffset) + (sourceLineHeight * 1.125) + (sourceLineCount * sourceLineHeight * 1.2)); // eslint-disable-line
	                    }
	                    return (graphicHeight - (margin.bottom - sourcePlotYOffset) + (sourceLineHeight * 2.5)); // eslint-disable-line
	                })


	                .call(attributeStyle, copyrightStyle);
	        }


	        // TODO figure out a way to improve this autoPosition stuff, needs ot be configurable so we don't have to reference specific classes
	        if (autoPosition && (containerClass === 'ft-printgraphic' || containerClass === 'ft-socialgraphic' || containerClass === 'ft-videographic')) {
	            margin.top = (titlePosition.y + (titleLineCount * titleLineHeight) + (subtitleLineCount * subtitleLineHeight) + (rem / 3));
	        } else if (autoPosition) {
	            margin.top = (titlePosition.y + (titleLineCount * titleLineHeight) + (subtitleLineCount * subtitleLineHeight) + 28 - plotAdjuster); // eslint-disable-line
	        }

	        // watermark

	        p.selectAll('g.chart-watermark')
	            .data([0])
	            .enter()
	            .append('g')
	            .attr('class', 'chart-watermark')
	            .html(watermarkMarkup)
	            .attr('transform', `translate(${graphicWidth - watermarkSize - watermarkOffset},${graphicHeight - watermarkSize - watermarkOffset}) scale(${watermarkSize / 100}) `);

	        p.selectAll('g.chart-watermark')
	            .html(watermarkMarkup)
	            .transition()
	            .attr('transform', `translate(${graphicWidth - watermarkSize - watermarkOffset},${graphicHeight - watermarkSize - watermarkOffset}) scale(${watermarkSize / 100}) `);

	        // plot area (where you put the chart itself)
	        p.selectAll('g.chart-plot')
	            .data([0])
	            .enter()
	            .append('g')
	            .attr('class', 'chart-plot')
	            .attr('transform', `translate(${margin.left},${margin.top})`);

	        plot = p.selectAll('g.chart-plot');

	        plot.transition(transition)
	            .duration(0)
	            .attr('transform', `translate(${margin.left},${margin.top})`);

	        if (showDownloadPngButtons) {
	            let parent;
	            if (p.node().nodeName.toLowerCase() === 'svg') {
	                parent = select(p.node().parentNode);
	            } else {
	                parent = select(p.node());
	            }

	            // Prevent this from being rendered twice
	            if (parent.selectAll('.button-holder').size() === 0) {
	                const holder = parent.append('div').attr('class', 'button-holder');
	                holder.append('button')
	                    .attr('class', 'save-png-button save-png-button__1x')
	                    .text('Save as .png')
	                    .style('float', 'left')
	                    .style('opacity', 0.6)
	                    .on('click', () => savePNG(p, 1));

	                holder.append('button')
	                    .attr('class', 'save-png-button save-png-button__2x')
	                    .style('float', 'left')
	                    .style('opacity', 0.6)
	                    .text('Save as double size .png')
	                    .on('click', () => savePNG(p, 2));
	            }
	        }
	    }


	    // Setters and getters

	    frame.autoPosition = (x) => {
	        if (x === undefined) return autoPosition;
	        autoPosition = x;
	        return frame;
	    };

	    frame.backgroundColour = (x) => {
	        if (x === undefined) return backgroundColour;
	        backgroundColour = x;
	        return frame;
	    };

	    frame.blackbar = (x) => {
	        if (x === undefined) return blackbar;
	        blackbar = x;
	        return frame;
	    };

	    frame.containerClass = (x) => {
	        if (x === undefined) return containerClass;
	        containerClass = x;
	        return frame;
	    };

	    frame.copyright = (x) => {
	        if (x === undefined) return copyright;
	        copyright = x;
	        return frame;
	    };

	    frame.copyrightStyle = (x) => {
	        if (x === undefined) return copyrightStyle;
	        copyrightStyle = x;
	        return frame;
	    };

	    frame.dimension = () => ({
	        width: graphicWidth - (margin.left + margin.right),
	        height: graphicHeight - (margin.top + margin.bottom),
	    });

	    frame.extend = (key, value) => {
	        custom[key] = value;
	        frame[key] = (d) => {
	            if (d === undefined) return custom[key];
	            custom[key] = d;
	            return frame;
	        };

	        return frame;
	    };

	    frame.fullYear = (x) => {
	        if (x === undefined) return fullYear;
	        fullYear = x;
	        return frame;
	    };

	    frame.goalposts = (x) => {
	        if (x === undefined) return goalposts;
	        goalposts = x;
	        return frame;
	    };

	    frame.height = (x) => {
	        if (x === undefined) return graphicHeight;
	        graphicHeight = convertFrom[units](x);
	        return frame;
	    };

	    frame.margin = (x) => {
	        if (x === undefined) return margin;
	        Object.keys(x).forEach((k) => {
	            margin[k] = x[k];
	        });
	        return frame;
	    };

	    frame.plot = () => plot;

	    frame.plotAdjuster = (x) => {
	        if (x === undefined) return plotAdjuster;
	        plotAdjuster = x;
	        return frame;
	    };

	    frame.rem = (x) => {
	        if (x === undefined) return rem;
	        rem = x;
	        return frame;
	    };

	    frame.showDownloadPngButtons = (d) => {
	        if (typeof d === 'undefined') return showDownloadPngButtons;
	        showDownloadPngButtons = d;

	        return frame;
	    };

	    frame.source = (x) => {
	        if (x === undefined) return source;
	        source = x;
	        return frame;
	    };

	    frame.sourceLineHeight = (x) => {
	        if (x === undefined) return sourceLineHeight;
	        sourceLineHeight = x;
	        return frame;
	    };

	    frame.sourcePlotYOffset = (x) => {
	        if (x === undefined) return sourcePlotYOffset;
	        sourcePlotYOffset = x;
	        return frame;
	    };

	    frame.sourceStyle = (x) => {
	        if (x === undefined) return sourceStyle;
	        sourceStyle = x;
	        return frame;
	    };

	    frame.sourceX = (x) => {
	        if (x === undefined) return sourcePosition.x;
	        sourcePosition.x = x;
	        return frame;
	    };

	    frame.sourceY = (x) => {
	        if (x === undefined) return sourcePosition.y;
	        sourcePosition.y = x;
	        return frame;
	    };

	    frame.subtitle = (x) => {
	        if (x === undefined) return subtitle;
	        subtitle = x;
	        return frame;
	    };

	    frame.subtitleLineHeight = (x) => {
	        if (x === undefined) return subtitleLineHeight;
	        subtitleLineHeight = x;
	        return frame;
	    };

	    frame.subtitleStyle = (x) => {
	        if (x === undefined) return subtitleStyle;
	        subtitleStyle = x;
	        return frame;
	    };

	    frame.subtitleX = (x) => {
	        if (x === undefined) return subtitlePosition.x;
	        subtitlePosition.x = x;
	        return frame;
	    };

	    frame.subtitleY = (x) => {
	        if (x === undefined) return subtitlePosition.y;
	        subtitlePosition.y = x;
	        return frame;
	    };

	    frame.title = (x) => {
	        if (x === undefined) return title;
	        title = x;
	        return frame;
	    };

	    frame.titleStyle = (x) => {
	        if (x === undefined) return titleStyle;
	        titleStyle = x;
	        return frame;
	    };

	    frame.titleLineHeight = (x) => {
	        if (x === undefined) return titleLineHeight;
	        titleLineHeight = x;
	        return frame;
	    };

	    frame.titleX = (x) => {
	        if (x === undefined) return titlePosition.x;
	        titlePosition.x = x;
	        return frame;
	    };

	    frame.titleY = (x) => {
	        if (x === undefined) return titlePosition.y;
	        titlePosition.y = x;
	        return frame;
	    };

	    frame.units = (x) => {
	        if (x === undefined) return units;
	        units = x;
	        return frame;
	    };

	    frame.watermark = (x) => {
	        if (x === undefined) return watermarkMarkup;
	        watermarkLocation = '';
	        watermarkMarkup = x;
	        return frame;
	    };

	    frame.watermarkOffset = (x) => {
	        if (x === undefined) return watermarkOffset;
	        watermarkOffset = x;
	        return frame;
	    };

	    frame.watermarkLocation = (x) => {
	        if (x === undefined) return watermarkLocation;
	        watermarkMarkup = '';
	        watermarkLocation = x;
	        return frame;
	    };

	    frame.watermarkSize = (x) => {
	        if (x === undefined) return watermarkSize;
	        watermarkSize = x;
	        return frame;
	    };

	    frame.width = (x) => {
	        if (!x) return graphicWidth;
	        graphicWidth = convertFrom[units](x);
	        return frame;
	    };

	    frame.attrs = (x) => {
	        if (x === undefined) {
	            return Object.assign({}, {
	                autoPosition,
	                // axisAlign, // @FIX This is undef?
	                containerClass,
	                copyright,
	                copyrightStyle,
	                blackbar,
	                goalposts,
	                graphicHeight,
	                graphicWidth,
	                margin,
	                plot,
	                plotAdjuster,
	                rem,
	                subtitle,
	                subtitleLineHeight,
	                subtitlePosition,
	                subtitleStyle,
	                source,
	                sourceLineHeight,
	                sourcePosition,
	                sourceStyle,
	                title,
	                titleLineHeight,
	                titlePosition,
	                titleStyle,
	                watermarkLocation,
	                watermarkMarkup,
	                watermarkOffset,
	                watermarkSize,
	                units,
	            }, custom);
	        }

	        Object.keys(x).forEach((setterName) => {
	            const value = x[setterName];
	            if (isFunction(frame[setterName])) {
	                frame[setterName](value);
	            }
	        });
	        return frame;
	    };

	    if (configObject !== undefined) {
	        frame.attrs(configObject);
	    }

	    return frame;
	}

	function isFunction(functionToCheck) {
	    const getType = {};
	    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}

	const classes = [
	    '.annotation',
	    '.lines',
	    '.highlights',
	    '.axis path',
	    '.axis text',
	    '.axis line',
	    '.axis',
	    '.baseline',
	    '.baseline line',
	    '.legend',
	    '.legend text',
	    '.chart-goalposts',
	    '.chart-title',
	    '.chart-subtitle',
	    '.chart-source',
	    '.chart-copyright',
	    '.chart-watermark',
	    '.annotations-holder',
	    '.lines highlighlines',
	    '.highlights',
	    '.annotation',
	    '.annotations-holder line',
	    '.annotations-holder text',
	    '.line path',
	];

	function savePNG(svg, scaleFactor) {
	    svg.selectAll(classes.join(', '))
	        .each(function inlineProps() {
	            const element = this;
	            const computedStyle = getComputedStyle(element, null);

	            // loop through and compute inline svg styles
	            for (let i = 0; i < computedStyle.length; i += 1) {
	                const property = computedStyle.item(i);
	                const value = computedStyle.getPropertyValue(property);
	                element.style[property] = value;
	            }
	        });

	    saveSvgAsPng_1(svg.node(), `${svg.select('title').text().replace(/\s/g, '-').toLowerCase()}.png`, { scale: scaleFactor });
	}

	function webFrameS(configObject) {
	    const f = chartFrame()
	        .autoPosition(true)
	        .containerClass('ft-webgraphic-s')
	        .backgroundColour('#FFF1E0')
	        .blackbar('#000')
	        .width(300)
	        // .watermark(watermarkPathDark)
	        // .watermarkSize(80)
	        // .watermarkOffset(-28)
	        .margin({ bottom: 90, right: 5, left: 15 })
	        .rem(14)
	        .plotAdjuster(0)
	        .titleStyle({
	            'font-size': 20,
	            'font-family': 'MetricWeb,sans-serif',
	            'font-weight': 400,
	            fill: '#000',
	        })
	        .titleY(32)
	        .titleLineHeight(24)
	        .subtitleLineHeight(20)
	        .subtitleStyle({
	            'font-size': 18,
	            'font-family': 'MetricWeb,sans-serif',
	            fill: '#66605C',
	        })
	        .subtitleY(64)
	        .sourceLineHeight(12)
	        .sourcePlotYOffset(38)
	        .sourceStyle({
	            'font-size': '12px',
	            'font-family': 'MetricWeb,sans-serif',
	            fill: '#66605C',
	        })
	        .copyrightStyle({
	            'font-size': '12px',
	            'font-style': 'italic',
	            'font-family': 'MetricWeb,sans-serif',
	            fill: '#66605C',
	        });

	    if (configObject !== undefined) f.attrs(configObject);
	    return f;
	}

	function webFrameM(configObject) {
	    const f = chartFrame()
	        .autoPosition(true)
	        .containerClass('ft-webgraphic-m')
	        .backgroundColour('#FFF1E0')
	        .blackbar('#000')
	        .width(700)
	        .height(500)
	        // .watermark(watermarkPathDark)
	        // .watermarkSize(80)
	        // .watermarkOffset(-28)
	        .margin({ bottom: 104, right: 5, left: 20 })
	        .rem(16)
	        .plotAdjuster(4)
	        .titleY(32)
	        .titleStyle({
	            'font-size': 24,
	            'font-family': 'MetricWeb,sans-serif',
	            'font-weight': 400,
	            fill: '#000',
	        })
	        .titleLineHeight(28)
	        .subtitleLineHeight(20)
	        .subtitleStyle({
	            'font-size': 18,
	            'font-family': 'MetricWeb,sans-serif',
	            fill: '#66605C',
	        })
	        .subtitleY(64)
	        .sourceLineHeight(16)
	        .sourcePlotYOffset(44)
	        .sourceStyle({
	            'font-size': '14px',
	            'font-family': 'MetricWeb,sans-serif',
	            fill: '#66605C',
	        })
	        .copyrightStyle({
	            'font-size': '14px',
	            'font-style': 'italic',
	            'font-family': 'MetricWeb,sans-serif',
	            fill: '#66605C',
	        });

	    if (configObject !== undefined) f.attrs(configObject);
	    return f;
	}

	function webFrameMDefault(configObject) {
	    const f = chartFrame()
	        .autoPosition(true)
	        .containerClass('ft-webgraphic-m-default')
	        .backgroundColour('#FFF1E0')
	        .blackbar('#000')
	        .width(700)
	        .height(500)
	        // .watermark(watermarkPathDark)
	        // .watermarkSize(80)
	        // .watermarkOffset(-28)
	        .margin({ bottom: 115, right: 5, left: 20 })
	        .rem(20)
	        .plotAdjuster(8)
	        .titleY(32)
	        .titleStyle({
	            'font-size': 28,
	            'font-family': 'MetricWeb,sans-serif',
	            'font-weight': 400,
	            fill: '#000',
	        })
	        .titleLineHeight(28)
	        .subtitleLineHeight(28)
	        .subtitleStyle({
	            'font-size': 24,
	            'font-family': 'MetricWeb,sans-serif',
	            fill: '#66605C',
	        })
	        .subtitleY(68)
	        .sourceLineHeight(18)
	        .sourcePlotYOffset(34)
	        .sourceStyle({
	            'font-size': '16px',
	            'font-family': 'MetricWeb,sans-serif',
	            fill: '#66605C',
	        })
	        .copyrightStyle({
	            'font-size': '14px',
	            'font-style': 'italic',
	            'font-family': 'MetricWeb,sans-serif',
	            fill: '#66605C',
	        });

	    if (configObject !== undefined) f.attrs(configObject);
	    return f;
	}

	function webFrameL(configObject) {
	    const f = chartFrame()
	        .autoPosition(true)
	        .containerClass('ft-webgraphic-l')
	        .backgroundColour('#FFF1E0')
	        .width(1180)
	        .height(700)
	        .blackbar('#000')
	        .fullYear(true)
	        // .watermark(watermarkPathDark)
	        // .watermarkSize(80)
	        // .watermarkOffset(-28)
	        .margin({ bottom: 105, right: 5, left: 20 })
	        .rem(18)
	        .plotAdjuster(8)
	        .titleY(32)
	        .titleStyle({
	            'font-size': 28,
	            'font-family': 'MetricWeb,sans-serif',
	            'font-weight': 400,
	            fill: '#000',
	        })
	        .titleLineHeight(32)
	        .subtitleLineHeight(20)
	        .subtitleY(64)
	        .subtitleStyle({
	            'font-size': 18,
	            'font-family': 'MetricWeb,sans-serif',
	            fill: '#66605C',
	        })
	        .sourceLineHeight(16)
	        .sourcePlotYOffset(44)
	        .sourceStyle({
	            'font-size': '16px',
	            'font-family': 'MetricWeb,sans-serif',
	            fill: '#66605C',
	        })
	        .copyrightStyle({
	            'font-size': '16px',
	            'font-style': 'italic',
	            'font-family': 'MetricWeb,sans-serif',
	            fill: '#66605C',
	        });

	    if (configObject !== undefined) f.attrs(configObject);
	    return f;
	}

	const watermarkPathDark = '<path fill="#000" fill-opacity="0.2" id="logo" d="M12,57h11.9v-0.9c-0.8,0-1.4,0-1.9-0.2c-0.5,0-0.8-0.2-1.1-0.5c-0.3-0.2-0.5-0.5-0.6-0.9c-0.2-0.3-0.2-0.9-0.2-1.6v-8.1H22c1.7,0,3,0.3,3.6,0.8c0.8,0.5,1.2,1.4,1.6,3h0.9v-8.8h-0.8c-0.2,0.9-0.5,1.6-0.8,2s-0.8,0.8-1.6,0.9c-0.6,0.2-1.6,0.3-2.8,0.3h-1.9v-8c0-0.5,0.2-0.8,0.3-1.1c0.2-0.2,0.5-0.3,1.1-0.3h3.8c1.3,0,2.2,0,3,0.2s1.4,0.3,1.9,0.6s0.9,0.6,1.1,1.1c0.3,0.5,0.5,1.1,0.8,1.7h1.1L32.9,32H12v0.9c0.6,0,1.2,0.2,1.6,0.2s0.6,0.2,0.9,0.5c0.3,0.2,0.5,0.5,0.6,0.8s0.2,0.9,0.2,1.6v17c0,0.6,0,1.2-0.2,1.6s-0.3,0.6-0.6,0.9c-0.3,0.2-0.6,0.3-0.9,0.5c-0.3,0-0.9,0.2-1.6,0.2V57z M34.2,37.5h1.2c0.5-1.4,0.9-2.3,1.6-2.8c0.6-0.6,1.7-0.8,3-0.8h3.1v19.2c0,0.6,0,1.2-0.2,1.6s-0.3,0.6-0.6,0.9c-0.3,0.2-0.6,0.3-1.1,0.5c-0.5,0-0.9,0.2-1.7,0.2V57h12v-0.9c-0.8,0-1.4,0-1.7-0.2c-0.5,0-0.8-0.2-1.1-0.5c-0.3-0.2-0.5-0.5-0.6-0.9c-0.2-0.3-0.2-0.9-0.2-1.6V33.9h3.1c1.2,0,2.3,0.3,3,0.8c0.6,0.6,1.2,1.6,1.6,2.8h1.2L56.5,32H34.8L34.2,37.5z"/>';

	const watermarkPathLight = '<path fill="#FFF" fill-opacity="0.2" id="logo" d="M1.502 1.5h97.996v98h-97.996v-98zm46.127 23.686h1.866l-.287-9.762h-36.988v1.675c1.18.063 2.074.151 2.68.263.606.112 1.148.359 1.627.742s.797.909.957 1.579c.159.67.239 1.595.239 2.775v30.193c0 1.18-.08 2.097-.239 2.747-.16.654-.479 1.181-.957 1.562-.479.383-1.037.639-1.675.766-.638.128-1.547.208-2.728.239v1.723h20.958v-1.723c-1.468-.031-2.568-.111-3.302-.239-.734-.127-1.372-.383-1.914-.766-.542-.382-.893-.908-1.053-1.562-.16-.65-.239-1.567-.239-2.747v-14.451h3.302c2.967 0 5.136.454 6.507 1.364 1.372.908 2.281 2.623 2.728 5.144h1.675v-15.647h-1.675c-.287 1.627-.71 2.84-1.268 3.637-.558.798-1.443 1.372-2.656 1.723-1.212.352-2.982.527-5.311.527h-3.302v-14.021c0-.894.16-1.491.479-1.794.319-.304.973-.455 1.962-.455h6.699c2.201 0 3.972.096 5.312.287s2.448.566 3.326 1.125c.877.558 1.539 1.212 1.985 1.961.447.75.877 1.795 1.292 3.135zm42.107 0h2.249l-.909-9.762h-38.805l-.909 9.762h2.249c.702-2.393 1.658-4.075 2.871-5.049 1.212-.973 2.982-1.459 5.312-1.459h5.454v33.974c0 1.18-.079 2.097-.239 2.747-.159.654-.502 1.181-1.028 1.562-.526.383-1.141.639-1.843.766-.701.128-1.738.208-3.109.239v1.723h21.341v-1.723c-1.372-.031-2.417-.111-3.135-.239-.718-.127-1.34-.383-1.866-.766-.526-.382-.869-.908-1.028-1.562-.159-.65-.239-1.567-.239-2.747v-33.974h5.455c2.328 0 4.099.486 5.311 1.459 1.21.973 2.167 2.656 2.868 5.049z"/>';

	var watermarkPath = {
	    dark: watermarkPathDark,
	    light: watermarkPathLight,
	};

	function printFrame(configObject) {
	    const f = chartFrame()
	        .containerClass('ft-printgraphic')
	        .autoPosition(true)
	        .backgroundColour('#FFF')
	        .goalposts('#000')
	        .units('mm')
	        .width(112.25) // these are after the units are set so they are converted from mm to px
	        .height(68)
	        .margin({ top: 40, left: 15, bottom: 35, right: 7 })
	        .watermark(watermarkPath.dark)
	        .rem(9.6)
	        .titleStyle({
	            'font-size': '12px',
	            fill: '#000000',
	            'font-weight': '600',
	            'font-family': 'MetricWeb,sans-serif',
	        })
	        .titleX(7)
	        .titleY(15)
	        .titleLineHeight(13)
	        .subtitleStyle({
	            fill: '#000000',
	            'font-size': '9.6px',
	            'font-weight': 400,
	            'font-family': 'MetricWeb,sans-serif',
	        })
	        .subtitleLineHeight(10)
	        .subtitleX(7)
	        .subtitleY(27)
	        .sourceStyle({
	            fill: '#000000',
	            'font-size': '7.2px',
	            'font-weight': 400,
	            'font-family': 'MetricWeb,sans-serif',
	        })
	        .sourceX(7)
	        .sourcePlotYOffset(18)
	        .sourceLineHeight(8)
	        .watermark('');

	    if (configObject !== undefined) f.attrs(configObject);
	    return f;
	}

	function socialFrame(configObject) {
	    const f = chartFrame()
	        .autoPosition(true)
	        .containerClass('ft-socialgraphic')
	        .backgroundColour('#212121')
	        .width(560)
	        .height(750)
	        .watermark(watermarkPath.light)
	        .watermarkOffset(25)
	        .margin({ left: 50, right: 40, bottom: 138, top: 140 })
	        .rem(28)
	        .titleX(50)
	        .titleY(72)
	        .titleLineHeight(38)
	        .titleStyle({
	            'font-size': '38px',
	            fill: '#ffffff',
	            'font-weight': 600,
	            opacity: 0.9,
	            'font-family': 'MetricWeb,sans-serif',
	        })
	        .subtitleX(50)
	        .subtitleY(110)
	        .subtitleLineHeight(28)
	        .subtitleStyle({
	            'font-size': '28px',
	            fill: '#ffffff',
	            'font-weight': 400,
	            opacity: 0.7,
	            'font-family': 'MetricWeb,sans-serif',
	        })
	        .sourceX(50)
	        .sourceLineHeight(25)
	        .sourceStyle({
	            'font-size': '25px',
	            fill: '#ffffff',
	            'font-weight': 400,
	            opacity: 0.5,
	            'font-family': 'MetricWeb,sans-serif',
	        });

	    if (configObject !== undefined) f.attrs(configObject);
	    return f;
	}

	function videoFrame(configObject) {
	    const f = chartFrame()
	        .autoPosition(true)
	        .backgroundColour('#212121')
	        .containerClass('ft-videographic')
	        .width(1920)
	        .height(1080)
	        .watermark('')
	        .margin({ left: 207, right: 207, bottom: 210, top: 233 })
	        .rem(48)
	        .titleX(207)
	        .titleY(130)
	        .titleLineHeight(68)
	        .titleStyle({
	            'font-size': '68px',
	            fill: '#ffffff',
	            'font-weight': 600,
	            opacity: 0.9,
	            'font-family': 'MetricWeb,sans-serif',
	        })
	        .subtitleX(207)
	        .subtitleY(200)
	        .subtitleLineHeight(48)
	        .subtitleStyle({
	            'font-size': '48px',
	            fill: '#ffffff',
	            'font-weight': 400,
	            opacity: 0.7,
	            'font-family': 'MetricWeb,sans-serif',
	        })
	        .sourceX(207)
	        .sourcePlotYOffset(60)
	        .sourceLineHeight(38)
	        .sourceStyle({
	            'font-size': '36px',
	            fill: '#ffffff',
	            'font-weight': 400,
	            opacity: 0.5,
	            'font-family': 'MetricWeb,sans-serif',
	        });

	    if (configObject !== undefined) f.attrs(configObject);
	    return f;
	}

	exports.frame = chartFrame;
	exports.webFrameS = webFrameS;
	exports.webFrameM = webFrameM;
	exports.webFrameMDefault = webFrameMDefault;
	exports.webFrameL = webFrameL;
	exports.printFrame = printFrame;
	exports.socialFrame = socialFrame;
	exports.videoFrame = videoFrame;

}));