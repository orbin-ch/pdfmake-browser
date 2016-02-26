(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("stream"), require("zlib"), require("events"), require("unicode-trie"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash", "stream", "zlib", "events", "unicode-trie"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("lodash"), require("stream"), require("zlib"), require("events"), require("unicode-trie")) : factory(root["lodash"], root["stream"], root["zlib"], root["events"], root["unicode-trie"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_19__, __WEBPACK_EXTERNAL_MODULE_23__, __WEBPACK_EXTERNAL_MODULE_51__, __WEBPACK_EXTERNAL_MODULE_53__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _pdfmake = __webpack_require__(1);

	var _pdfmake2 = _interopRequireDefault(_pdfmake);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var defaultFonts = {};

	var Pdf = function () {
	  function Pdf(definition, fonts) {
	    _classCallCheck(this, Pdf);

	    this.definition = definition;
	    this.fonts = fonts || defaultFonts;
	  }

	  _createClass(Pdf, [{
	    key: "getPdfKitDoc",
	    value: function getPdfKitDoc(options) {
	      var printer = new _pdfmake2.default(this.fonts);
	      return printer.createPdfKitDocument(this.definition, options);
	    }
	  }, {
	    key: "getBuffer",
	    value: function getBuffer(options, done) {
	      var doc = this.getPdfKitDoc(options);

	      var chunks = [];
	      doc.on("data", function (chunk) {
	        chunks.push(chunk);
	      });

	      doc.on("end", function () {
	        done(Buffer.concat(chunks));
	      });

	      doc.end();
	    }
	  }, {
	    key: "getBase64",
	    value: function getBase64(options, done) {
	      this.getBuffer(options, function (buffer) {
	        done(buffer.toString("base64"));
	      });
	    }
	  }, {
	    key: "getDataUrl",
	    value: function getDataUrl(options, done) {
	      this.getBase64(options, function (data) {
	        done("data:application/pdf;base64," + data);
	      });
	    }
	  }, {
	    key: "print",
	    value: function print(filename) {
	      filename = filename || "download.pdf";

	      if (window.cordova && window.plugins.PrintPDF) {
	        this.getBase64(function (data) {
	          window.plugins.PrintPDF.print({
	            data: data
	          });
	        });
	      } else {
	        this.getBuffer(function (data) {
	          var blob = new Blob([data], {
	            type: "application/pdf"
	          });

	          if (window.navigator.msSaveOrOpenBlob) {
	            window.navigator.msSaveBlob(blob, filename);
	          } else {
	            var element = window.document.createElement("a");
	            element.href = window.URL.createObjectURL(blob);
	            element.download = filename;
	            element.style.display = "none";
	            document.body.appendChild(element);
	            element.click();
	            document.body.removeChild(element);
	          }
	        });
	      }
	    }
	  }]);

	  return Pdf;
	}();

	exports.default = Pdf;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* jslint node: true */
	/* global window */
	'use strict';

	var _ = __webpack_require__(2);
	var FontProvider = __webpack_require__(3);
	var LayoutBuilder = __webpack_require__(5);
	var PdfKit = __webpack_require__(18);
	var PDFReference = __webpack_require__(22);
	var sizes = __webpack_require__(63);
	var ImageMeasure = __webpack_require__(64);
	var textDecorator = __webpack_require__(65);
	var FontProvider = __webpack_require__(3);

	////////////////////////////////////////
	// PdfPrinter

	/**
	 * @class Creates an instance of a PdfPrinter which turns document definition into a pdf
	 *
	 * @param {Object} fontDescriptors font definition dictionary
	 *
	 * @example
	 * var fontDescriptors = {
	 *	Roboto: {
	 *		normal: 'fonts/Roboto-Regular.ttf',
	 *		bold: 'fonts/Roboto-Medium.ttf',
	 *		italics: 'fonts/Roboto-Italic.ttf',
	 *		bolditalics: 'fonts/Roboto-Italic.ttf'
	 *	}
	 * };
	 *
	 * var printer = new PdfPrinter(fontDescriptors);
	 */
	function PdfPrinter(fontDescriptors) {
		this.fontDescriptors = fontDescriptors;
	}

	/**
	 * Executes layout engine for the specified document and renders it into a pdfkit document
	 * ready to be saved.
	 *
	 * @param {Object} docDefinition document definition
	 * @param {Object} docDefinition.content an array describing the pdf structure (for more information take a look at the examples in the /examples folder)
	 * @param {Object} [docDefinition.defaultStyle] default (implicit) style definition
	 * @param {Object} [docDefinition.styles] dictionary defining all styles which can be used in the document
	 * @param {Object} [docDefinition.pageSize] page size (pdfkit units, A4 dimensions by default)
	 * @param {Number} docDefinition.pageSize.width width
	 * @param {Number} docDefinition.pageSize.height height
	 * @param {Object} [docDefinition.pageMargins] page margins (pdfkit units)
	 *
	 * @example
	 *
	 * var docDefinition = {
	 *	content: [
	 *		'First paragraph',
	 *		'Second paragraph, this time a little bit longer',
	 *		{ text: 'Third paragraph, slightly bigger font size', fontSize: 20 },
	 *		{ text: 'Another paragraph using a named style', style: 'header' },
	 *		{ text: ['playing with ', 'inlines' ] },
	 *		{ text: ['and ', { text: 'restyling ', bold: true }, 'them'] },
	 *	],
	 *	styles: {
	 *		header: { fontSize: 30, bold: true }
	 *	}
	 * }
	 *
	 * var pdfDoc = printer.createPdfKitDocument(docDefinition);
	 *
	 * pdfDoc.pipe(fs.createWriteStream('sample.pdf'));
	 * pdfDoc.end();
	 *
	 * @return {Object} a pdfKit document object which can be saved or encode to data-url
	 */
	PdfPrinter.prototype.createPdfKitDocument = function(docDefinition, options) {
		options = options || {};

		var pageSize = pageSize2widthAndHeight(docDefinition.pageSize || 'a4');

	  if(docDefinition.pageOrientation === 'landscape') {
	    pageSize = { width: pageSize.height, height: pageSize.width};
	  }
		pageSize.orientation = docDefinition.pageOrientation === 'landscape' ? docDefinition.pageOrientation : 'portrait';

		this.pdfKitDoc = new PdfKit({ size: [ pageSize.width, pageSize.height ], compress: false});
		this.pdfKitDoc.info.Producer = 'pdfmake';
		this.pdfKitDoc.info.Creator = 'pdfmake';
		this.fontProvider = new FontProvider(this.fontDescriptors, this.pdfKitDoc);

	  docDefinition.images = docDefinition.images || {};

		var builder = new LayoutBuilder(
			pageSize,
			fixPageMargins(docDefinition.pageMargins || 40),
	        new ImageMeasure(this.pdfKitDoc, docDefinition.images));

	  registerDefaultTableLayouts(builder);
	  if (options.tableLayouts) {
	    builder.registerTableLayouts(options.tableLayouts);
	  }

		var pages = builder.layoutDocument(docDefinition.content, this.fontProvider, docDefinition.styles || {}, docDefinition.defaultStyle || { fontSize: 12, font: 'Roboto' }, docDefinition.background, docDefinition.header, docDefinition.footer, docDefinition.images, docDefinition.watermark, docDefinition.pageBreakBefore);

		renderPages(pages, this.fontProvider, this.pdfKitDoc);

		if(options.autoPrint){
	        var jsRef = this.pdfKitDoc.ref({
				S: 'JavaScript',
				JS: new StringObject('this.print\\(true\\);')
			});
			var namesRef = this.pdfKitDoc.ref({
				Names: [new StringObject('EmbeddedJS'), new PDFReference(this.pdfKitDoc, jsRef.id)],
			});

			jsRef.end();
			namesRef.end();

			this.pdfKitDoc._root.data.Names = {
				JavaScript: new PDFReference(this.pdfKitDoc, namesRef.id)
			};
		}
		return this.pdfKitDoc;
	};

	function fixPageMargins(margin) {
	    if (!margin) return null;

	    if (typeof margin === 'number' || margin instanceof Number) {
	        margin = { left: margin, right: margin, top: margin, bottom: margin };
	    } else if (margin instanceof Array) {
	        if (margin.length === 2) {
	            margin = { left: margin[0], top: margin[1], right: margin[0], bottom: margin[1] };
	        } else if (margin.length === 4) {
	            margin = { left: margin[0], top: margin[1], right: margin[2], bottom: margin[3] };
	        } else throw 'Invalid pageMargins definition';
	    }

	    return margin;
	}

	function registerDefaultTableLayouts(layoutBuilder) {
	  layoutBuilder.registerTableLayouts({
	    noBorders: {
	      hLineWidth: function(i) { return 0; },
	      vLineWidth: function(i) { return 0; },
	      paddingLeft: function(i) { return i && 4 || 0; },
	      paddingRight: function(i, node) { return (i < node.table.widths.length - 1) ? 4 : 0; },
	    },
	    headerLineOnly: {
	      hLineWidth: function(i, node) {
	        if (i === 0 || i === node.table.body.length) return 0;
	        return (i === node.table.headerRows) ? 2 : 0;
	      },
	      vLineWidth: function(i) { return 0; },
	      paddingLeft: function(i) {
	        return i === 0 ? 0 : 8;
	      },
	      paddingRight: function(i, node) {
	        return (i === node.table.widths.length - 1) ? 0 : 8;
	      }
	    },
	    lightHorizontalLines: {
	      hLineWidth: function(i, node) {
	        if (i === 0 || i === node.table.body.length) return 0;
	        return (i === node.table.headerRows) ? 2 : 1;
	      },
	      vLineWidth: function(i) { return 0; },
	      hLineColor: function(i) { return i === 1 ? 'black' : '#aaa'; },
	      paddingLeft: function(i) {
	        return i === 0 ? 0 : 8;
	      },
	      paddingRight: function(i, node) {
	        return (i === node.table.widths.length - 1) ? 0 : 8;
	      }
	    }
	  });
	}

	var defaultLayout = {
	  hLineWidth: function(i, node) { return 1; }, //return node.table.headerRows && i === node.table.headerRows && 3 || 0; },
	  vLineWidth: function(i, node) { return 1; },
	  hLineColor: function(i, node) { return 'black'; },
	  vLineColor: function(i, node) { return 'black'; },
	  paddingLeft: function(i, node) { return 4; }, //i && 4 || 0; },
	  paddingRight: function(i, node) { return 4; }, //(i < node.table.widths.length - 1) ? 4 : 0; },
	  paddingTop: function(i, node) { return 2; },
	  paddingBottom: function(i, node) { return 2; }
	};

	function pageSize2widthAndHeight(pageSize) {
	    if (typeof pageSize == 'string' || pageSize instanceof String) {
	        var size = sizes[pageSize.toUpperCase()];
	        if (!size) throw ('Page size ' + pageSize + ' not recognized');
	        return { width: size[0], height: size[1] };
	    }

	    return pageSize;
	}

	function StringObject(str){
		this.isString = true;
		this.toString = function(){
			return str;
		};
	}

	function updatePageOrientationInOptions(currentPage, pdfKitDoc) {
		var previousPageOrientation = pdfKitDoc.options.size[0] > pdfKitDoc.options.size[1] ? 'landscape' : 'portrait';

		if(currentPage.pageSize.orientation !== previousPageOrientation) {
			var width = pdfKitDoc.options.size[0];
			var height = pdfKitDoc.options.size[1];
			pdfKitDoc.options.size = [height, width];
		}
	}

	function renderPages(pages, fontProvider, pdfKitDoc) {
	  pdfKitDoc._pdfMakePages = pages;
		for (var i = 0; i < pages.length; i++) {
			if (i > 0) {
				updatePageOrientationInOptions(pages[i], pdfKitDoc);
				pdfKitDoc.addPage(pdfKitDoc.options);
			}

			var page = pages[i];
	    for(var ii = 0, il = page.items.length; ii < il; ii++) {
	        var item = page.items[ii];
	        switch(item.type) {
	          case 'vector':
	              renderVector(item.item, pdfKitDoc);
	              break;
	          case 'line':
	              renderLine(item.item, item.item.x, item.item.y, pdfKitDoc);
	              break;
	          case 'image':
	              renderImage(item.item, item.item.x, item.item.y, pdfKitDoc);
	              break;
					}
	    }
	    if(page.watermark){
	      renderWatermark(page, pdfKitDoc);
		}

	    fontProvider.setFontRefsToPdfDoc();
	  }
	}

	function renderLine(line, x, y, pdfKitDoc) {
		x = x || 0;
		y = y || 0;

		var ascenderHeight = line.getAscenderHeight();

		textDecorator.drawBackground(line, x, y, pdfKitDoc);

		//TODO: line.optimizeInlines();
		for(var i = 0, l = line.inlines.length; i < l; i++) {
			var inline = line.inlines[i];

			pdfKitDoc.fill(inline.color || 'black');

			pdfKitDoc.save();
			pdfKitDoc.transform(1, 0, 0, -1, 0, pdfKitDoc.page.height);


	    var encoded = inline.font.encode(inline.text);
			pdfKitDoc.addContent('BT');

			pdfKitDoc.addContent('' + (x + inline.x) + ' ' + (pdfKitDoc.page.height - y - ascenderHeight) + ' Td');
			pdfKitDoc.addContent('/' + encoded.fontId + ' ' + inline.fontSize + ' Tf');

	        pdfKitDoc.addContent('<' + encoded.encodedText + '> Tj');

			pdfKitDoc.addContent('ET');
			pdfKitDoc.restore();
		}

		textDecorator.drawDecorations(line, x, y, pdfKitDoc);

	}

	function renderWatermark(page, pdfKitDoc){
		var watermark = page.watermark;

		pdfKitDoc.fill('black');
		pdfKitDoc.opacity(0.6);

		pdfKitDoc.save();
		pdfKitDoc.transform(1, 0, 0, -1, 0, pdfKitDoc.page.height);

		var angle = Math.atan2(pdfKitDoc.page.height, pdfKitDoc.page.width) * 180/Math.PI;
		pdfKitDoc.rotate(angle, {origin: [pdfKitDoc.page.width/2, pdfKitDoc.page.height/2]});

	  var encoded = watermark.font.encode(watermark.text);
		pdfKitDoc.addContent('BT');
		pdfKitDoc.addContent('' + (pdfKitDoc.page.width/2 - watermark.size.size.width/2) + ' ' + (pdfKitDoc.page.height/2 - watermark.size.size.height/4) + ' Td');
		pdfKitDoc.addContent('/' + encoded.fontId + ' ' + watermark.size.fontSize + ' Tf');
		pdfKitDoc.addContent('<' + encoded.encodedText + '> Tj');
		pdfKitDoc.addContent('ET');
		pdfKitDoc.restore();
	}

	function renderVector(vector, pdfDoc) {
		//TODO: pdf optimization (there's no need to write all properties everytime)
		pdfDoc.lineWidth(vector.lineWidth || 1);
		if (vector.dash) {
			pdfDoc.dash(vector.dash.length, { space: vector.dash.space || vector.dash.length });
		} else {
			pdfDoc.undash();
		}
		pdfDoc.fillOpacity(vector.fillOpacity || 1);
		pdfDoc.strokeOpacity(vector.strokeOpacity || 1);
		pdfDoc.lineJoin(vector.lineJoin || 'miter');

		//TODO: clipping

		switch(vector.type) {
			case 'ellipse':
				pdfDoc.ellipse(vector.x, vector.y, vector.r1, vector.r2);
				break;
			case 'rect':
				if (vector.r) {
					pdfDoc.roundedRect(vector.x, vector.y, vector.w, vector.h, vector.r);
				} else {
					pdfDoc.rect(vector.x, vector.y, vector.w, vector.h);
				}
				break;
			case 'line':
				pdfDoc.moveTo(vector.x1, vector.y1);
				pdfDoc.lineTo(vector.x2, vector.y2);
				break;
			case 'polyline':
				if (vector.points.length === 0) break;

				pdfDoc.moveTo(vector.points[0].x, vector.points[0].y);
				for(var i = 1, l = vector.points.length; i < l; i++) {
					pdfDoc.lineTo(vector.points[i].x, vector.points[i].y);
				}

				if (vector.points.length > 1) {
					var p1 = vector.points[0];
					var pn = vector.points[vector.points.length - 1];

					if (vector.closePath || p1.x === pn.x && p1.y === pn.y) {
						pdfDoc.closePath();
					}
				}
				break;
		}

		if (vector.color && vector.lineColor) {
			pdfDoc.fillAndStroke(vector.color, vector.lineColor);
		} else if (vector.color) {
			pdfDoc.fill(vector.color);
		} else {
			pdfDoc.stroke(vector.lineColor || 'black');
		}
	}

	function renderImage(image, x, y, pdfKitDoc) {
	    pdfKitDoc.image(image.image, image.x, image.y, { width: image._width, height: image._height });
	}

	module.exports = PdfPrinter;


	/* temporary browser extension */
	PdfPrinter.prototype.fs = __webpack_require__(20);


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* jslint node: true */
	'use strict';

	var _ = __webpack_require__(2);
	var FontWrapper = __webpack_require__(4);

	function typeName(bold, italics){
		var type = 'normal';
		if (bold && italics) type = 'bolditalics';
		else if (bold) type = 'bold';
		else if (italics) type = 'italics';
		return type;
	}

	function FontProvider(fontDescriptors, pdfDoc) {
		this.fonts = {};
		this.pdfDoc = pdfDoc;
		this.fontWrappers = {};

		for(var font in fontDescriptors) {
			if (fontDescriptors.hasOwnProperty(font)) {
				var fontDef = fontDescriptors[font];

				this.fonts[font] = {
					normal: fontDef.normal,
					bold: fontDef.bold,
					italics: fontDef.italics,
					bolditalics: fontDef.bolditalics
				};
			}
		}
	}

	FontProvider.prototype.provideFont = function(familyName, bold, italics) {
	  if (!this.fonts[familyName]) return this.pdfDoc._font;
		var type = typeName(bold, italics);

	  this.fontWrappers[familyName] = this.fontWrappers[familyName] || {};

	  if (!this.fontWrappers[familyName][type]) {
			this.fontWrappers[familyName][type] = new FontWrapper(this.pdfDoc, this.fonts[familyName][type], familyName + '(' + type + ')');
		}

	  return this.fontWrappers[familyName][type];
	};

	FontProvider.prototype.setFontRefsToPdfDoc = function(){
	  var self = this;

	  _.each(self.fontWrappers, function(fontFamily) {
	    _.each(fontFamily, function(fontWrapper){
	      _.each(fontWrapper.pdfFonts, function(font){
	        if (!self.pdfDoc.page.fonts[font.id]) {
	          self.pdfDoc.page.fonts[font.id] = font.ref();
	        }
	      });
	    });
	  });
	};

	module.exports = FontProvider;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* jslint node: true */
	'use strict';

	var _ = __webpack_require__(2);

	function FontWrapper(pdfkitDoc, path, fontName){
		this.MAX_CHAR_TYPES = 92;

		this.pdfkitDoc = pdfkitDoc;
		this.path = path;
		this.pdfFonts = [];
		this.charCatalogue = [];
		this.name = fontName;

	  this.__defineGetter__('ascender', function(){
	    var font = this.getFont(0);
	    return font.ascender;
	  });
	  this.__defineGetter__('decender', function(){
	    var font = this.getFont(0);
	    return font.decender;
	  });

	}
	// private

	FontWrapper.prototype.getFont = function(index){
		if(!this.pdfFonts[index]){

			var pseudoName = this.name + index;

			if(this.postscriptName){
				delete this.pdfkitDoc._fontFamilies[this.postscriptName];
			}

			this.pdfFonts[index] = this.pdfkitDoc.font(this.path, pseudoName)._font;
			if(!this.postscriptName){
				this.postscriptName = this.pdfFonts[index].name;
			}
		}

		return this.pdfFonts[index];
	};

	// public
	FontWrapper.prototype.widthOfString = function(){
		var font = this.getFont(0);
		return font.widthOfString.apply(font, arguments);
	};

	FontWrapper.prototype.lineHeight = function(){
		var font = this.getFont(0);
		return font.lineHeight.apply(font, arguments);
	};

	FontWrapper.prototype.ref = function(){
		var font = this.getFont(0);
		return font.ref.apply(font, arguments);
	};

	var toCharCode = function(char){
	  return char.charCodeAt(0);
	};

	FontWrapper.prototype.encode = function(text){
	  var self = this;

	  var charTypesInInline = _.chain(text.split('')).map(toCharCode).uniq().value();
		if (charTypesInInline.length > self.MAX_CHAR_TYPES) {
			throw new Error('Inline has more than '+ self.MAX_CHAR_TYPES + ': ' + text + ' different character types and therefore cannot be properly embedded into pdf.');
		}


	  var characterFitInFontWithIndex = function (charCatalogue) {
	    return _.uniq(charCatalogue.concat(charTypesInInline)).length <= self.MAX_CHAR_TYPES;
	  };

	  var index = _.findIndex(self.charCatalogue, characterFitInFontWithIndex);

	  if(index < 0){
	    index = self.charCatalogue.length;
	    self.charCatalogue[index] = [];
	  }

		var font = this.getFont(index);
		font.use(text);

	  _.each(charTypesInInline, function(charCode){
	    if(!_.includes(self.charCatalogue[index], charCode)){
	      self.charCatalogue[index].push(charCode);
	    }
	  });

	  var encodedText = _.map(font.encode(text), function (char) {
	    return char.charCodeAt(0).toString(16);
	  }).join('');

	  return {
	    encodedText: encodedText,
	    fontId: font.id
	  };
	};


	module.exports = FontWrapper;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* jslint node: true */
	'use strict';

	var _ = __webpack_require__(2);
	var TraversalTracker = __webpack_require__(6);
	var DocMeasure = __webpack_require__(7);
	var DocumentContext = __webpack_require__(13);
	var PageElementWriter = __webpack_require__(14);
	var ColumnCalculator = __webpack_require__(10);
	var TableProcessor = __webpack_require__(17);
	var Line = __webpack_require__(16);
	var pack = __webpack_require__(11).pack;
	var offsetVector = __webpack_require__(11).offsetVector;
	var fontStringify = __webpack_require__(11).fontStringify;
	var isFunction = __webpack_require__(11).isFunction;
	var TextTools = __webpack_require__(8);
	var StyleContextStack = __webpack_require__(9);

	function addAll(target, otherArray){
	  _.each(otherArray, function(item){
	    target.push(item);
	  });
	}

	/**
	 * Creates an instance of LayoutBuilder - layout engine which turns document-definition-object
	 * into a set of pages, lines, inlines and vectors ready to be rendered into a PDF
	 *
	 * @param {Object} pageSize - an object defining page width and height
	 * @param {Object} pageMargins - an object defining top, left, right and bottom margins
	 */
	function LayoutBuilder(pageSize, pageMargins, imageMeasure) {
		this.pageSize = pageSize;
		this.pageMargins = pageMargins;
		this.tracker = new TraversalTracker();
	    this.imageMeasure = imageMeasure;
	    this.tableLayouts = {};
	}

	LayoutBuilder.prototype.registerTableLayouts = function (tableLayouts) {
	  this.tableLayouts = pack(this.tableLayouts, tableLayouts);
	};

	/**
	 * Executes layout engine on document-definition-object and creates an array of pages
	 * containing positioned Blocks, Lines and inlines
	 *
	 * @param {Object} docStructure document-definition-object
	 * @param {Object} fontProvider font provider
	 * @param {Object} styleDictionary dictionary with style definitions
	 * @param {Object} defaultStyle default style definition
	 * @return {Array} an array of pages
	 */
	LayoutBuilder.prototype.layoutDocument = function (docStructure, fontProvider, styleDictionary, defaultStyle, background, header, footer, images, watermark, pageBreakBeforeFct) {

	  function addPageBreaksIfNecessary(linearNodeList, pages) {
	    linearNodeList = _.reject(linearNodeList, function(node){
	      return _.isEmpty(node.positions);
	    });

	    _.each(linearNodeList, function(node) {
	      var nodeInfo = _.pick(node, [
	        'id', 'text', 'ul', 'ol', 'table', 'image', 'qr', 'canvas', 'columns',
	        'headlineLevel', 'style', 'pageBreak', 'pageOrientation',
	        'width', 'height'
	      ]);
	      nodeInfo.startPosition = _.first(node.positions);
	      nodeInfo.pageNumbers = _.chain(node.positions).map('pageNumber').uniq().value();
	      nodeInfo.pages = pages.length;
	      nodeInfo.stack = _.isArray(node.stack);

	      node.nodeInfo = nodeInfo;
	    });

	    return _.any(linearNodeList, function (node, index, followingNodeList) {
	      if (node.pageBreak !== 'before' && !node.pageBreakCalculated) {
	        node.pageBreakCalculated = true;
	        var pageNumber = _.first(node.nodeInfo.pageNumbers);

					var followingNodesOnPage = _.chain(followingNodeList).drop(index + 1).filter(function (node0) {
	          return _.contains(node0.nodeInfo.pageNumbers, pageNumber);
	        }).value();

	        var nodesOnNextPage = _.chain(followingNodeList).drop(index + 1).filter(function (node0) {
	          return _.contains(node0.nodeInfo.pageNumbers, pageNumber + 1);
	        }).value();

	        var previousNodesOnPage = _.chain(followingNodeList).take(index).filter(function (node0) {
	          return _.contains(node0.nodeInfo.pageNumbers, pageNumber);
	        }).value();

	        if (pageBreakBeforeFct(node.nodeInfo,
	          _.map(followingNodesOnPage, 'nodeInfo'),
	          _.map(nodesOnNextPage, 'nodeInfo'),
	          _.map(previousNodesOnPage, 'nodeInfo'))) {
	          node.pageBreak = 'before';
	          return true;
	        }
	      }
	    });
	  }

	  if(!isFunction(pageBreakBeforeFct)){
	    pageBreakBeforeFct = function(){
	      return false;
	    };
	  }

	  this.docMeasure = new DocMeasure(fontProvider, styleDictionary, defaultStyle, this.imageMeasure, this.tableLayouts, images);


	  function resetXYs(result) {
	    _.each(result.linearNodeList, function (node) {
	      node.resetXY();
	    });
	  }

	  var result = this.tryLayoutDocument(docStructure, fontProvider, styleDictionary, defaultStyle, background, header, footer, images, watermark);
	  while(addPageBreaksIfNecessary(result.linearNodeList, result.pages)){
	    resetXYs(result);
	    result = this.tryLayoutDocument(docStructure, fontProvider, styleDictionary, defaultStyle, background, header, footer, images, watermark);
	  }

		return result.pages;
	};

	LayoutBuilder.prototype.tryLayoutDocument = function (docStructure, fontProvider, styleDictionary, defaultStyle, background, header, footer, images, watermark, pageBreakBeforeFct) {

	  this.linearNodeList = [];
	  docStructure = this.docMeasure.measureDocument(docStructure);

	  this.writer = new PageElementWriter(
	    new DocumentContext(this.pageSize, this.pageMargins), this.tracker);

	  var _this = this;
	  this.writer.context().tracker.startTracking('pageAdded', function() {
	    _this.addBackground(background);
	  });

	  this.addBackground(background);
	  this.processNode(docStructure);
	  this.addHeadersAndFooters(header, footer);
	  /* jshint eqnull:true */
	  if(watermark != null)
	    this.addWatermark(watermark, fontProvider);

	  return {pages: this.writer.context().pages, linearNodeList: this.linearNodeList};
	};


	LayoutBuilder.prototype.addBackground = function(background) {
	    var backgroundGetter = isFunction(background) ? background : function() { return background; };

	    var pageBackground = backgroundGetter(this.writer.context().page + 1);

	    if (pageBackground) {
	      var pageSize = this.writer.context().getCurrentPage().pageSize;
	      this.writer.beginUnbreakableBlock(pageSize.width, pageSize.height);
	      this.processNode(this.docMeasure.measureDocument(pageBackground));
	      this.writer.commitUnbreakableBlock(0, 0);
	    }
	};

	LayoutBuilder.prototype.addStaticRepeatable = function(headerOrFooter, sizeFunction) {
	  this.addDynamicRepeatable(function() { return headerOrFooter; }, sizeFunction);
	};

	LayoutBuilder.prototype.addDynamicRepeatable = function(nodeGetter, sizeFunction) {
	  var pages = this.writer.context().pages;

	  for(var pageIndex = 0, l = pages.length; pageIndex < l; pageIndex++) {
	    this.writer.context().page = pageIndex;

	    var node = nodeGetter(pageIndex + 1, l);

	    if (node) {
	      var sizes = sizeFunction(this.writer.context().getCurrentPage().pageSize, this.pageMargins);
	      this.writer.beginUnbreakableBlock(sizes.width, sizes.height);
	      this.processNode(this.docMeasure.measureDocument(node));
	      this.writer.commitUnbreakableBlock(sizes.x, sizes.y);
	    }
	  }
	};

	LayoutBuilder.prototype.addHeadersAndFooters = function(header, footer) {
	  var headerSizeFct = function(pageSize, pageMargins){
	    return {
	      x: 0,
	      y: 0,
	      width: pageSize.width,
	      height: pageMargins.top
	    };
	  };

	  var footerSizeFct = function (pageSize, pageMargins) {
	    return {
	      x: 0,
	      y: pageSize.height - pageMargins.bottom,
	      width: pageSize.width,
	      height: pageMargins.bottom
	    };
	  };

	  if(isFunction(header)) {
	    this.addDynamicRepeatable(header, headerSizeFct);
	  } else if(header) {
	    this.addStaticRepeatable(header, headerSizeFct);
	  }

	  if(isFunction(footer)) {
	    this.addDynamicRepeatable(footer, footerSizeFct);
	  } else if(footer) {
	    this.addStaticRepeatable(footer, footerSizeFct);
	  }
	};

	LayoutBuilder.prototype.addWatermark = function(watermark, fontProvider){
	  var defaultFont = Object.getOwnPropertyNames(fontProvider.fonts)[0]; // TODO allow selection of other font
	  var watermarkObject = {
	    text: watermark,
	    font: fontProvider.provideFont(fontProvider[defaultFont], false, false),
	    size: getSize(this.pageSize, watermark, fontProvider)
	  };

	  var pages = this.writer.context().pages;
	  for(var i = 0, l = pages.length; i < l; i++) {
	    pages[i].watermark = watermarkObject;
	  }

	  function getSize(pageSize, watermark, fontProvider){
	    var width = pageSize.width;
	    var height = pageSize.height;
	    var targetWidth = Math.sqrt(width*width + height*height)*0.8; /* page diagnoal * sample factor */
	    var textTools = new TextTools(fontProvider);
	    var styleContextStack = new StyleContextStack();
	    var size;

	    /**
	     * Binary search the best font size.
	     * Initial bounds [0, 1000]
	     * Break when range < 1
	     */
	    var a = 0;
	    var b = 1000;
	    var c = (a+b)/2;
	    while(Math.abs(a - b) > 1){
	      styleContextStack.push({
	        fontSize: c
	      });
	      size = textTools.sizeOfString(watermark, styleContextStack);
	      if(size.width > targetWidth){
	        b = c;
	        c = (a+b)/2;
	      }
	      else if(size.width < targetWidth){
	        a = c;
	        c = (a+b)/2;
	      }
	      styleContextStack.pop();
	    }
	    /*
	      End binary search
	     */
	    return {size: size, fontSize: c};
	  }
	};

	function decorateNode(node){
	  var x = node.x, y = node.y;
	  node.positions = [];

	  _.each(node.canvas, function(vector){
	    var x = vector.x, y = vector.y;
	    vector.resetXY = function(){
	      vector.x = x;
	      vector.y = y;
	    };
	  });

	  node.resetXY = function(){
	    node.x = x;
	    node.y = y;
	    _.each(node.canvas, function(vector){
	      vector.resetXY();
	    });
	  };
	}

	LayoutBuilder.prototype.processNode = function(node) {
	  var self = this;

	  this.linearNodeList.push(node);
	  decorateNode(node);

	  applyMargins(function() {
	    var absPosition = node.absolutePosition;
	    if(absPosition){
	      self.writer.context().beginDetachedBlock();
	      self.writer.context().moveTo(absPosition.x || 0, absPosition.y || 0);
	    }

	    if (node.stack) {
	      self.processVerticalContainer(node);
	    } else if (node.columns) {
	      self.processColumns(node);
	    } else if (node.ul) {
	      self.processList(false, node);
	    } else if (node.ol) {
	      self.processList(true, node);
	    } else if (node.table) {
	      self.processTable(node);
	    } else if (node.text !== undefined) {
	      self.processLeaf(node);
	    } else if (node.image) {
	      self.processImage(node);
	    } else if (node.canvas) {
	      self.processCanvas(node);
	    } else if (node.qr) {
	      self.processQr(node);
	    }else if (!node._span) {
			throw 'Unrecognized document structure: ' + JSON.stringify(node, fontStringify);
			}

	    if(absPosition){
	      self.writer.context().endDetachedBlock();
	    }
		});

		function applyMargins(callback) {
			var margin = node._margin;

	    if (node.pageBreak === 'before') {
	        self.writer.moveToNextPage(node.pageOrientation);
	    }

			if (margin) {
				self.writer.context().moveDown(margin[1]);
				self.writer.context().addMargin(margin[0], margin[2]);
			}

			callback();

			if(margin) {
				self.writer.context().addMargin(-margin[0], -margin[2]);
				self.writer.context().moveDown(margin[3]);
			}

	    if (node.pageBreak === 'after') {
	        self.writer.moveToNextPage(node.pageOrientation);
	    }
		}
	};

	// vertical container
	LayoutBuilder.prototype.processVerticalContainer = function(node) {
		var self = this;
		node.stack.forEach(function(item) {
			self.processNode(item);
			addAll(node.positions, item.positions);

			//TODO: paragraph gap
		});
	};

	// columns
	LayoutBuilder.prototype.processColumns = function(columnNode) {
		var columns = columnNode.columns;
		var availableWidth = this.writer.context().availableWidth;
		var gaps = gapArray(columnNode._gap);

		if (gaps) availableWidth -= (gaps.length - 1) * columnNode._gap;

		ColumnCalculator.buildColumnWidths(columns, availableWidth);
		var result = this.processRow(columns, columns, gaps);
	    addAll(columnNode.positions, result.positions);


		function gapArray(gap) {
			if (!gap) return null;

			var gaps = [];
			gaps.push(0);

			for(var i = columns.length - 1; i > 0; i--) {
				gaps.push(gap);
			}

			return gaps;
		}
	};

	LayoutBuilder.prototype.processRow = function(columns, widths, gaps, tableBody, tableRow) {
	  var self = this;
	  var pageBreaks = [], positions = [];

	  this.tracker.auto('pageChanged', storePageBreakData, function() {
	    widths = widths || columns;

	    self.writer.context().beginColumnGroup();

	    for(var i = 0, l = columns.length; i < l; i++) {
	      var column = columns[i];
	      var width = widths[i]._calcWidth;
	      var leftOffset = colLeftOffset(i);

	      if (column.colSpan && column.colSpan > 1) {
	          for(var j = 1; j < column.colSpan; j++) {
	              width += widths[++i]._calcWidth + gaps[i];
	          }
	      }

	      self.writer.context().beginColumn(width, leftOffset, getEndingCell(column, i));
	      if (!column._span) {
	        self.processNode(column);
	        addAll(positions, column.positions);
	      } else if (column._columnEndingContext) {
	        // row-span ending
	        self.writer.context().markEnding(column);
	      }
	    }

	    self.writer.context().completeColumnGroup();
	  });

	  return {pageBreaks: pageBreaks, positions: positions};

	  function storePageBreakData(data) {
	    var pageDesc;

	    for(var i = 0, l = pageBreaks.length; i < l; i++) {
	      var desc = pageBreaks[i];
	      if (desc.prevPage === data.prevPage) {
	        pageDesc = desc;
	        break;
	      }
	    }

	    if (!pageDesc) {
	      pageDesc = data;
	      pageBreaks.push(pageDesc);
	    }
	    pageDesc.prevY = Math.max(pageDesc.prevY, data.prevY);
	    pageDesc.y = Math.min(pageDesc.y, data.y);
	  }

		function colLeftOffset(i) {
			if (gaps && gaps.length > i) return gaps[i];
			return 0;
		}

	  function getEndingCell(column, columnIndex) {
	    if (column.rowSpan && column.rowSpan > 1) {
	      var endingRow = tableRow + column.rowSpan - 1;
	      if (endingRow >= tableBody.length) throw 'Row span for column ' + columnIndex + ' (with indexes starting from 0) exceeded row count';
	      return tableBody[endingRow][columnIndex];
	    }

	    return null;
	  }
	};

	// lists
	LayoutBuilder.prototype.processList = function(orderedList, node) {
		var self = this,
	      items = orderedList ? node.ol : node.ul,
	      gapSize = node._gapSize;

		this.writer.context().addMargin(gapSize.width);

		var nextMarker;
		this.tracker.auto('lineAdded', addMarkerToFirstLeaf, function() {
			items.forEach(function(item) {
				nextMarker = item.listMarker;
				self.processNode(item);
	            addAll(node.positions, item.positions);
			});
		});

		this.writer.context().addMargin(-gapSize.width);

		function addMarkerToFirstLeaf(line) {
			// I'm not very happy with the way list processing is implemented
			// (both code and algorithm should be rethinked)
			if (nextMarker) {
				var marker = nextMarker;
				nextMarker = null;

				if (marker.canvas) {
					var vector = marker.canvas[0];

					offsetVector(vector, -marker._minWidth, 0);
					self.writer.addVector(vector);
				} else {
					var markerLine = new Line(self.pageSize.width);
					markerLine.addInline(marker._inlines[0]);
					markerLine.x = -marker._minWidth;
					markerLine.y = line.getAscenderHeight() - markerLine.getAscenderHeight();
					self.writer.addLine(markerLine, true);
				}
			}
		}
	};

	// tables
	LayoutBuilder.prototype.processTable = function(tableNode) {
	  var processor = new TableProcessor(tableNode);

	  processor.beginTable(this.writer);

	  for(var i = 0, l = tableNode.table.body.length; i < l; i++) {
	    processor.beginRow(i, this.writer);

	    var result = this.processRow(tableNode.table.body[i], tableNode.table.widths, tableNode._offsets.offsets, tableNode.table.body, i);
	    addAll(tableNode.positions, result.positions);

	    processor.endRow(i, this.writer, result.pageBreaks);
	  }

	  processor.endTable(this.writer);
	};

	// leafs (texts)
	LayoutBuilder.prototype.processLeaf = function(node) {
		var line = this.buildNextLine(node);

		while (line) {
			var positions = this.writer.addLine(line);
	    node.positions.push(positions);
			line = this.buildNextLine(node);
		}
	};

	LayoutBuilder.prototype.buildNextLine = function(textNode) {
		if (!textNode._inlines || textNode._inlines.length === 0) return null;

		var line = new Line(this.writer.context().availableWidth);

		while(textNode._inlines && textNode._inlines.length > 0 && line.hasEnoughSpaceForInline(textNode._inlines[0])) {
			line.addInline(textNode._inlines.shift());
		}

		line.lastLineInParagraph = textNode._inlines.length === 0;
		return line;
	};

	// images
	LayoutBuilder.prototype.processImage = function(node) {
	    var position = this.writer.addImage(node);
	    node.positions.push(position);
	};

	LayoutBuilder.prototype.processCanvas = function(node) {
		var height = node._minHeight;

		if (this.writer.context().availableHeight < height) {
			// TODO: support for canvas larger than a page
			// TODO: support for other overflow methods

			this.writer.moveToNextPage();
		}

		node.canvas.forEach(function(vector) {
			var position = this.writer.addVector(vector);
	        node.positions.push(position);
		}, this);

		this.writer.context().moveDown(height);
	};

	LayoutBuilder.prototype.processQr = function(node) {
		var position = this.writer.addQr(node);
	    node.positions.push(position);
	};

	module.exports = LayoutBuilder;


/***/ },
/* 6 */
/***/ function(module, exports) {

	/* jslint node: true */
	'use strict';

	/**
	* Creates an instance of TraversalTracker
	*
	* @constructor
	*/
	function TraversalTracker() {
		this.events = {};
	}

	TraversalTracker.prototype.startTracking = function(event, cb) {
		var callbacks = (this.events[event] || (this.events[event] = []));

		if (callbacks.indexOf(cb) < 0) {
			callbacks.push(cb);
		}
	};

	TraversalTracker.prototype.stopTracking = function(event, cb) {
		var callbacks = this.events[event];

		if (callbacks) {
			var index = callbacks.indexOf(cb);
			if (index >= 0) {
				callbacks.splice(index, 1);
			}
		}
	};

	TraversalTracker.prototype.emit = function(event) {
		var args = Array.prototype.slice.call(arguments, 1);

		var callbacks = this.events[event];

		if (callbacks) {
			callbacks.forEach(function(cb) {
				cb.apply(this, args);
			});
		}
	};

	TraversalTracker.prototype.auto = function(event, cb, innerBlock) {
		this.startTracking(event, cb);
		innerBlock();
		this.stopTracking(event, cb);
	};

	module.exports = TraversalTracker;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* jslint node: true */
	'use strict';

	var TextTools = __webpack_require__(8);
	var StyleContextStack = __webpack_require__(9);
	var ColumnCalculator = __webpack_require__(10);
	var fontStringify = __webpack_require__(11).fontStringify;
	var pack = __webpack_require__(11).pack;
	var qrEncoder = __webpack_require__(12);

	/**
	* @private
	*/
	function DocMeasure(fontProvider, styleDictionary, defaultStyle, imageMeasure, tableLayouts, images) {
		this.textTools = new TextTools(fontProvider);
		this.styleStack = new StyleContextStack(styleDictionary, defaultStyle);
		this.imageMeasure = imageMeasure;
		this.tableLayouts = tableLayouts;
		this.images = images;
		this.autoImageIndex = 1;
	}

	/**
	* Measures all nodes and sets min/max-width properties required for the second
	* layout-pass.
	* @param  {Object} docStructure document-definition-object
	* @return {Object}              document-measurement-object
	*/
	DocMeasure.prototype.measureDocument = function(docStructure) {
		return this.measureNode(docStructure);
	};

	DocMeasure.prototype.measureNode = function(node) {
		// expand shortcuts
		if (node instanceof Array) {
			node = { stack: node };
		} else if (typeof node == 'string' || node instanceof String) {
			node = { text: node };
		}

		var self = this;

		return this.styleStack.auto(node, function() {
			// TODO: refactor + rethink whether this is the proper way to handle margins
			node._margin = getNodeMargin(node);

			if (node.columns) {
				return extendMargins(self.measureColumns(node));
			} else if (node.stack) {
				return extendMargins(self.measureVerticalContainer(node));
			} else if (node.ul) {
				return extendMargins(self.measureList(false, node));
			} else if (node.ol) {
				return extendMargins(self.measureList(true, node));
			} else if (node.table) {
				return extendMargins(self.measureTable(node));
			} else if (node.text !== undefined) {
				return extendMargins(self.measureLeaf(node));
			} else if (node.image) {
				return extendMargins(self.measureImage(node));
			} else if (node.canvas) {
				return extendMargins(self.measureCanvas(node));
			} else if (node.qr) {
				return extendMargins(self.measureQr(node));
			} else {
				throw 'Unrecognized document structure: ' + JSON.stringify(node, fontStringify);
			}
		});

		function extendMargins(node) {
			var margin = node._margin;

			if (margin) {
				node._minWidth += margin[0] + margin[2];
				node._maxWidth += margin[0] + margin[2];
			}

			return node;
		}

		function getNodeMargin() {

			function processSingleMargins(node, currentMargin){
				if (node.marginLeft || node.marginTop || node.marginRight || node.marginBottom) {
					return [
						node.marginLeft || currentMargin[0] || 0,
						node.marginTop || currentMargin[1] || 0,
						node.marginRight || currentMargin[2]  || 0,
						node.marginBottom || currentMargin[3]  || 0
					];
				}
				return currentMargin;
			}

			function flattenStyleArray(styleArray){
				var flattenedStyles = {};
				for (var i = styleArray.length - 1; i >= 0; i--) {
					var styleName = styleArray[i];
					var style = self.styleStack.styleDictionary[styleName];
					for(var key in style){
						if(style.hasOwnProperty(key)){
							flattenedStyles[key] = style[key];
						}
					}
				}
				return flattenedStyles;
			}

			function convertMargin(margin) {
				if (typeof margin === 'number' || margin instanceof Number) {
					margin = [ margin, margin, margin, margin ];
				} else if (margin instanceof Array) {
					if (margin.length === 2) {
						margin = [ margin[0], margin[1], margin[0], margin[1] ];
					}
				}
				return margin;
			}

			var margin = [undefined, undefined, undefined, undefined];

			if(node.style) {
				var styleArray = (node.style instanceof Array) ? node.style : [node.style];
				var flattenedStyleArray = flattenStyleArray(styleArray);

				if(flattenedStyleArray) {
					margin = processSingleMargins(flattenedStyleArray, margin);
				}

				if(flattenedStyleArray.margin){
					margin = convertMargin(flattenedStyleArray.margin);
				}
			}
			
			margin = processSingleMargins(node, margin);

			if(node.margin){
				margin = convertMargin(node.margin);
			}

			if(margin[0] === undefined && margin[1] === undefined && margin[2] === undefined && margin[3] === undefined) {
				return null;
			} else {
				return margin;
			}
		}
	};

	DocMeasure.prototype.convertIfBase64Image = function(node) {
		if (/^data:image\/(jpeg|jpg|png);base64,/.test(node.image)) {
			var label = '$$pdfmake$$' + this.autoImageIndex++;
			this.images[label] = node.image;
			node.image = label;
	}
	};

	DocMeasure.prototype.measureImage = function(node) {
		if (this.images) {
			this.convertIfBase64Image(node);
		}

		var imageSize = this.imageMeasure.measureImage(node.image);

		if (node.fit) {
			var factor = (imageSize.width / imageSize.height > node.fit[0] / node.fit[1]) ? node.fit[0] / imageSize.width : node.fit[1] / imageSize.height;
			node._width = node._minWidth = node._maxWidth = imageSize.width * factor;
			node._height = imageSize.height * factor;
		} else {
			node._width = node._minWidth = node._maxWidth = node.width || imageSize.width;
			node._height = node.height || (imageSize.height * node._width / imageSize.width);
		}

		node._alignment = this.styleStack.getProperty('alignment');
		return node;
	};

	DocMeasure.prototype.measureLeaf = function(node) {
		var data = this.textTools.buildInlines(node.text, this.styleStack);

		node._inlines = data.items;
		node._minWidth = data.minWidth;
		node._maxWidth = data.maxWidth;

		return node;
	};

	DocMeasure.prototype.measureVerticalContainer = function(node) {
		var items = node.stack;

		node._minWidth = 0;
		node._maxWidth = 0;

		for(var i = 0, l = items.length; i < l; i++) {
			items[i] = this.measureNode(items[i]);

			node._minWidth = Math.max(node._minWidth, items[i]._minWidth);
			node._maxWidth = Math.max(node._maxWidth, items[i]._maxWidth);
		}

		return node;
	};

	DocMeasure.prototype.gapSizeForList = function(isOrderedList, listItems) {
		if (isOrderedList) {
			var longestNo = (listItems.length).toString().replace(/./g, '9');
			return this.textTools.sizeOfString(longestNo + '. ', this.styleStack);
		} else {
			return this.textTools.sizeOfString('9. ', this.styleStack);
		}
	};

	DocMeasure.prototype.buildMarker = function(isOrderedList, counter, styleStack, gapSize) {
		var marker;

		if (isOrderedList) {
			marker = { _inlines: this.textTools.buildInlines(counter, styleStack).items };
		}
		else {
			// TODO: ascender-based calculations
			var radius = gapSize.fontSize / 6;
			marker = {
				canvas: [ {
					x: radius,
					y: (gapSize.height / gapSize.lineHeight) + gapSize.decender - gapSize.fontSize / 3,//0,// gapSize.fontSize * 2 / 3,
					r1: radius,
					r2: radius,
					type: 'ellipse',
					color: 'black'
				} ]
			};
		}

		marker._minWidth = marker._maxWidth = gapSize.width;
		marker._minHeight = marker._maxHeight = gapSize.height;

		return marker;
	};

	DocMeasure.prototype.measureList = function(isOrdered, node) {
		var style = this.styleStack.clone();

		var items = isOrdered ? node.ol : node.ul;
		node._gapSize = this.gapSizeForList(isOrdered, items);
		node._minWidth = 0;
		node._maxWidth = 0;

		var counter = 1;

		for(var i = 0, l = items.length; i < l; i++) {
			var nextItem = items[i] = this.measureNode(items[i]);

			var marker = counter++ + '. ';

			if (!nextItem.ol && !nextItem.ul) {
				nextItem.listMarker = this.buildMarker(isOrdered, nextItem.counter || marker, style, node._gapSize);
			}  // TODO: else - nested lists numbering

			node._minWidth = Math.max(node._minWidth, items[i]._minWidth + node._gapSize.width);
			node._maxWidth = Math.max(node._maxWidth, items[i]._maxWidth + node._gapSize.width);
		}

		return node;
	};

	DocMeasure.prototype.measureColumns = function(node) {
		var columns = node.columns;
		node._gap = this.styleStack.getProperty('columnGap') || 0;

		for(var i = 0, l = columns.length; i < l; i++) {
			columns[i] = this.measureNode(columns[i]);
		}

		var measures = ColumnCalculator.measureMinMax(columns);

		node._minWidth = measures.min + node._gap * (columns.length - 1);
		node._maxWidth = measures.max + node._gap * (columns.length - 1);

		return node;
	};

	DocMeasure.prototype.measureTable = function(node) {
		extendTableWidths(node);
		node._layout = getLayout(this.tableLayouts);
		node._offsets = getOffsets(node._layout);

		var colSpans = [];
		var col, row, cols, rows;

		for(col = 0, cols = node.table.body[0].length; col < cols; col++) {
			var c = node.table.widths[col];
			c._minWidth = 0;
			c._maxWidth = 0;

			for(row = 0, rows = node.table.body.length; row < rows; row++) {
				var rowData = node.table.body[row];
				var data = rowData[col];
				if (!data._span) {
					var _this = this;
					data = rowData[col] = this.styleStack.auto(data, measureCb(this, data));

					if (data.colSpan && data.colSpan > 1) {
						markSpans(rowData, col, data.colSpan);
						colSpans.push({ col: col, span: data.colSpan, minWidth: data._minWidth, maxWidth: data._maxWidth });
					} else {
						c._minWidth = Math.max(c._minWidth, data._minWidth);
						c._maxWidth = Math.max(c._maxWidth, data._maxWidth);
					}
				}

				if (data.rowSpan && data.rowSpan > 1) {
					markVSpans(node.table, row, col, data.rowSpan);
				}
			}
		}

		extendWidthsForColSpans();

		var measures = ColumnCalculator.measureMinMax(node.table.widths);

		node._minWidth = measures.min + node._offsets.total;
		node._maxWidth = measures.max + node._offsets.total;

		return node;

		function measureCb(_this, data) {
			return function() {
				if (data !== null && typeof data === 'object') {
					data.fillColor = _this.styleStack.getProperty('fillColor');
				}
				return _this.measureNode(data);
			};
		}

		function getLayout(tableLayouts) {
			var layout = node.layout;

			if (typeof node.layout === 'string' || node instanceof String) {
				layout = tableLayouts[layout];
			}

			var defaultLayout = {
				hLineWidth: function(i, node) { return 1; }, //return node.table.headerRows && i === node.table.headerRows && 3 || 0; },
				vLineWidth: function(i, node) { return 1; },
				hLineColor: function(i, node) { return 'black'; },
				vLineColor: function(i, node) { return 'black'; },
				paddingLeft: function(i, node) { return 4; }, //i && 4 || 0; },
				paddingRight: function(i, node) { return 4; }, //(i < node.table.widths.length - 1) ? 4 : 0; },
				paddingTop: function(i, node) { return 2; },
				paddingBottom: function(i, node) { return 2; }
			};

			return pack(defaultLayout, layout);
		}

		function getOffsets(layout) {
			var offsets = [];
			var totalOffset = 0;
			var prevRightPadding = 0;

			for(var i = 0, l = node.table.widths.length; i < l; i++) {
				var lOffset = prevRightPadding + layout.vLineWidth(i, node) + layout.paddingLeft(i, node);
				offsets.push(lOffset);
				totalOffset += lOffset;
				prevRightPadding = layout.paddingRight(i, node);
			}

			totalOffset += prevRightPadding + layout.vLineWidth(node.table.widths.length, node);

			return {
				total: totalOffset,
				offsets: offsets
			};
		}

		function extendWidthsForColSpans() {
			var q, j;

			for (var i = 0, l = colSpans.length; i < l; i++) {
				var span = colSpans[i];

				var currentMinMax = getMinMax(span.col, span.span, node._offsets);
				var minDifference = span.minWidth - currentMinMax.minWidth;
				var maxDifference = span.maxWidth - currentMinMax.maxWidth;

				if (minDifference > 0) {
					q = minDifference / span.span;

					for(j = 0; j < span.span; j++) {
						node.table.widths[span.col + j]._minWidth += q;
					}
				}

				if (maxDifference > 0) {
					q = maxDifference / span.span;

					for(j = 0; j < span.span; j++) {
						node.table.widths[span.col + j]._maxWidth += q;
					}
				}
			}
		}

		function getMinMax(col, span, offsets) {
			var result = { minWidth: 0, maxWidth: 0 };

			for(var i = 0; i < span; i++) {
				result.minWidth += node.table.widths[col + i]._minWidth + (i? offsets.offsets[col + i] : 0);
				result.maxWidth += node.table.widths[col + i]._maxWidth + (i? offsets.offsets[col + i] : 0);
			}

			return result;
		}

		function markSpans(rowData, col, span) {
			for (var i = 1; i < span; i++) {
				rowData[col + i] = {
					_span: true,
					_minWidth: 0,
					_maxWidth: 0,
					rowSpan: rowData[col].rowSpan
				};
			}
		}

		function markVSpans(table, row, col, span) {
			for (var i = 1; i < span; i++) {
				table.body[row + i][col] = {
					_span: true,
					_minWidth: 0,
					_maxWidth: 0,
					fillColor: table.body[row][col].fillColor
				};
			}
		}

		function extendTableWidths(node) {
			if (!node.table.widths) {
				node.table.widths = 'auto';
			}

			if (typeof node.table.widths === 'string' || node.table.widths instanceof String) {
				node.table.widths = [ node.table.widths ];

				while(node.table.widths.length < node.table.body[0].length) {
					node.table.widths.push(node.table.widths[node.table.widths.length - 1]);
				}
			}

			for(var i = 0, l = node.table.widths.length; i < l; i++) {
				var w = node.table.widths[i];
				if (typeof w === 'number' || w instanceof Number || typeof w === 'string' || w instanceof String) {
					node.table.widths[i] = { width: w };
				}
			}
		}
	};

	DocMeasure.prototype.measureCanvas = function(node) {
		var w = 0, h = 0;

		for(var i = 0, l = node.canvas.length; i < l; i++) {
			var vector = node.canvas[i];

			switch(vector.type) {
			case 'ellipse':
				w = Math.max(w, vector.x + vector.r1);
				h = Math.max(h, vector.y + vector.r2);
				break;
			case 'rect':
				w = Math.max(w, vector.x + vector.w);
				h = Math.max(h, vector.y + vector.h);
				break;
			case 'line':
				w = Math.max(w, vector.x1, vector.x2);
				h = Math.max(h, vector.y1, vector.y2);
				break;
			case 'polyline':
				for(var i2 = 0, l2 = vector.points.length; i2 < l2; i2++) {
					w = Math.max(w, vector.points[i2].x);
					h = Math.max(h, vector.points[i2].y);
				}
				break;
			}
		}

		node._minWidth = node._maxWidth = w;
		node._minHeight = node._maxHeight = h;

		return node;
	};

	DocMeasure.prototype.measureQr = function(node) {
		node = qrEncoder.measure(node);
		node._alignment = this.styleStack.getProperty('alignment');
		return node;
	};

	module.exports = DocMeasure;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/* jslint node: true */
	'use strict';

	var WORD_RE = /([^ ,\/!.?:;\-\n]*[ ,\/!.?:;\-]*)|\n/g;
	// /\S*\s*/g to be considered (I'm not sure however - we shouldn't split 'aaa !!!!')

	var LEADING = /^(\s)+/g;
	var TRAILING = /(\s)+$/g;

	/**
	* Creates an instance of TextTools - text measurement utility
	*
	* @constructor
	* @param {FontProvider} fontProvider
	*/
	function TextTools(fontProvider) {
		this.fontProvider = fontProvider;
	}

	/**
	* Converts an array of strings (or inline-definition-objects) into a set of inlines
	* and their min/max widths
	* @param  {Object} textArray - an array of inline-definition-objects (or strings)
	* @param  {Number} maxWidth - max width a single Line should have
	* @return {Array} an array of Lines
	*/
	TextTools.prototype.buildInlines = function(textArray, styleContextStack) {
		var measured = measure(this.fontProvider, textArray, styleContextStack);

		var minWidth = 0,
			maxWidth = 0,
			currentLineWidth;

		measured.forEach(function (inline) {
			minWidth = Math.max(minWidth, inline.width - inline.leadingCut - inline.trailingCut);

			if (!currentLineWidth) {
				currentLineWidth = { width: 0, leadingCut: inline.leadingCut, trailingCut: 0 };
			}

			currentLineWidth.width += inline.width;
			currentLineWidth.trailingCut = inline.trailingCut;

			maxWidth = Math.max(maxWidth, getTrimmedWidth(currentLineWidth));

			if (inline.lineEnd) {
				currentLineWidth = null;
			}
		});

		return {
			items: measured,
			minWidth: minWidth,
			maxWidth: maxWidth
		};

		function getTrimmedWidth(item) {
			return Math.max(0, item.width - item.leadingCut - item.trailingCut);
		}
	};

	/**
	* Returns size of the specified string (without breaking it) using the current style
	* @param  {String} text              text to be measured
	* @param  {Object} styleContextStack current style stack
	* @return {Object}                   size of the specified string
	*/
	TextTools.prototype.sizeOfString = function(text, styleContextStack) {
		text = text.replace('\t', '    ');

		//TODO: refactor - extract from measure
		var fontName = getStyleProperty({}, styleContextStack, 'font', 'Roboto');
		var fontSize = getStyleProperty({}, styleContextStack, 'fontSize', 12);
		var bold = getStyleProperty({}, styleContextStack, 'bold', false);
		var italics = getStyleProperty({}, styleContextStack, 'italics', false);
		var lineHeight = getStyleProperty({}, styleContextStack, 'lineHeight', 1);

		var font = this.fontProvider.provideFont(fontName, bold, italics);

		return {
			width: font.widthOfString(removeDiacritics(text), fontSize),
			height: font.lineHeight(fontSize) * lineHeight,
			fontSize: fontSize,
			lineHeight: lineHeight,
			ascender: font.ascender / 1000 * fontSize,
			decender: font.decender / 1000 * fontSize
		};
	};

	function splitWords(text) {
		var results = [];
		text = text.replace('\t', '    ');

		var array = text.match(WORD_RE);

		// i < l - 1, because the last match is always an empty string
		// other empty strings however are treated as new-lines
		for(var i = 0, l = array.length; i < l - 1; i++) {
			var item = array[i];

			var isNewLine = item.length === 0;

			if (!isNewLine) {
				results.push({text: item});
			}
			else {
				var shouldAddLine = (results.length === 0 || results[results.length - 1].lineEnd);

				if (shouldAddLine) {
					results.push({ text: '', lineEnd: true });
				}
				else {
					results[results.length - 1].lineEnd = true;
				}
			}
		}

		return results;
	}

	function copyStyle(source, destination) {
		destination = destination || {};
		source = source || {}; //TODO: default style

		for(var key in source) {
			if (key != 'text' && source.hasOwnProperty(key)) {
				destination[key] = source[key];
			}
		}

		return destination;
	}

	function normalizeTextArray(array) {
		var results = [];

		if (typeof array == 'string' || array instanceof String) {
			array = [ array ];
		}

		for(var i = 0, l = array.length; i < l; i++) {
			var item = array[i];
			var style = null;
			var words;

			if (typeof item == 'string' || item instanceof String) {
				words = splitWords(item);
			} else {
				words = splitWords(item.text);
				style = copyStyle(item);
			}

			for(var i2 = 0, l2 = words.length; i2 < l2; i2++) {
				var result = {
					text: words[i2].text
				};

				if (words[i2].lineEnd) {
					result.lineEnd = true;
				}

				copyStyle(style, result);

				results.push(result);
			}
		}

		return results;
	}

	//TODO: support for other languages (currently only polish is supported)
	var diacriticsMap = { 'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z', 'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z' };
	// '  << atom.io workaround

	function removeDiacritics(text) {
		return text.replace(/[^A-Za-z0-9\[\] ]/g, function(a) {
			return diacriticsMap[a] || a;
		});
	}

	function getStyleProperty(item, styleContextStack, property, defaultValue) {
		var value;

		if (item[property] !== undefined && item[property] !== null) {
			// item defines this property
			return item[property];
		}

		if (!styleContextStack) return defaultValue;

		styleContextStack.auto(item, function() {
			value = styleContextStack.getProperty(property);
		});

		if (value !== null && value !== undefined) {
			return value;
		} else {
			return defaultValue;
		}
	}

	function measure(fontProvider, textArray, styleContextStack) {
		var normalized = normalizeTextArray(textArray);

		normalized.forEach(function(item) {
			var fontName = getStyleProperty(item, styleContextStack, 'font', 'Roboto');
			var fontSize = getStyleProperty(item, styleContextStack, 'fontSize', 12);
			var bold = getStyleProperty(item, styleContextStack, 'bold', false);
			var italics = getStyleProperty(item, styleContextStack, 'italics', false);
			var color = getStyleProperty(item, styleContextStack, 'color', 'black');
			var decoration = getStyleProperty(item, styleContextStack, 'decoration', null);
			var decorationColor = getStyleProperty(item, styleContextStack, 'decorationColor', null);
			var decorationStyle = getStyleProperty(item, styleContextStack, 'decorationStyle', null);
			var background = getStyleProperty(item, styleContextStack, 'background', null);
			var lineHeight = getStyleProperty(item, styleContextStack, 'lineHeight', 1);

			var font = fontProvider.provideFont(fontName, bold, italics);

			// TODO: character spacing
			item.width = font.widthOfString(removeDiacritics(item.text), fontSize);
			item.height = font.lineHeight(fontSize) * lineHeight;

			var leadingSpaces = item.text.match(LEADING);
			var trailingSpaces = item.text.match(TRAILING);
			if (leadingSpaces) {
				item.leadingCut = font.widthOfString(leadingSpaces[0], fontSize);
			}
			else {
				item.leadingCut = 0;
			}

			if (trailingSpaces) {
				item.trailingCut = font.widthOfString(trailingSpaces[0], fontSize);
			}
			else {
				item.trailingCut = 0;
			}

			item.alignment = getStyleProperty(item, styleContextStack, 'alignment', 'left');
			item.font = font;
			item.fontSize = fontSize;
			item.color = color;
			item.decoration = decoration;
			item.decorationColor = decorationColor;
			item.decorationStyle = decorationStyle;
			item.background = background;
		});

		return normalized;
	}

	/****TESTS**** (add a leading '/' to uncomment)
	TextTools.prototype.splitWords = splitWords;
	TextTools.prototype.normalizeTextArray = normalizeTextArray;
	TextTools.prototype.measure = measure;
	// */


	module.exports = TextTools;


/***/ },
/* 9 */
/***/ function(module, exports) {

	/* jslint node: true */
	'use strict';

	/**
	* Creates an instance of StyleContextStack used for style inheritance and style overrides
	*
	* @constructor
	* @this {StyleContextStack}
	* @param {Object} named styles dictionary
	* @param {Object} optional default style definition
	*/
	function StyleContextStack (styleDictionary, defaultStyle) {
		this.defaultStyle = defaultStyle || {};
		this.styleDictionary = styleDictionary;
		this.styleOverrides = [];
	}

	/**
	* Creates cloned version of current stack
	* @return {StyleContextStack} current stack snapshot
	*/
	StyleContextStack.prototype.clone = function() {
		var stack = new StyleContextStack(this.styleDictionary, this.defaultStyle);

		this.styleOverrides.forEach(function(item) {
			stack.styleOverrides.push(item);
		});

		return stack;
	};

	/**
	* Pushes style-name or style-overrides-object onto the stack for future evaluation
	*
	* @param {String|Object} styleNameOrOverride style-name (referring to styleDictionary) or
	*                                            a new dictionary defining overriding properties
	*/
	StyleContextStack.prototype.push = function(styleNameOrOverride) {
		this.styleOverrides.push(styleNameOrOverride);
	};

	/**
	* Removes last style-name or style-overrides-object from the stack
	*
	* @param {Number} howMany - optional number of elements to be popped (if not specified,
	*                           one element will be removed from the stack)
	*/
	StyleContextStack.prototype.pop = function(howMany) {
		howMany = howMany || 1;

		while(howMany-- > 0) {
			this.styleOverrides.pop();
		}
	};

	/**
	* Creates a set of named styles or/and a style-overrides-object based on the item,
	* pushes those elements onto the stack for future evaluation and returns the number
	* of elements pushed, so they can be easily poped then.
	*
	* @param {Object} item - an object with optional style property and/or style overrides
	* @return the number of items pushed onto the stack
	*/
	StyleContextStack.prototype.autopush = function(item) {
		if (typeof item === 'string' || item instanceof String) return 0;

		var styleNames = [];

		if (item.style) {
			if (item.style instanceof Array) {
				styleNames = item.style;
			} else {
				styleNames = [ item.style ];
			}
		}

		for(var i = 0, l = styleNames.length; i < l; i++) {
			this.push(styleNames[i]);
		}

		var styleOverrideObject = {};
		var pushSOO = false;

		[
			'font',
			'fontSize',
			'bold',
			'italics',
			'alignment',
			'color',
			'columnGap',
			'fillColor',
			'decoration',
			'decorationStyle',
			'decorationColor',
			'background',
			'lineHeight'
			//'tableCellPadding'
			// 'cellBorder',
			// 'headerCellBorder',
			// 'oddRowCellBorder',
			// 'evenRowCellBorder',
			// 'tableBorder'
		].forEach(function(key) {
			if (item[key] !== undefined && item[key] !== null) {
				styleOverrideObject[key] = item[key];
				pushSOO = true;
			}
		});

		if (pushSOO) {
			this.push(styleOverrideObject);
		}

		return styleNames.length + (pushSOO ? 1 : 0);
	};

	/**
	* Automatically pushes elements onto the stack, using autopush based on item,
	* executes callback and then pops elements back. Returns value returned by callback
	*
	* @param  {Object}   item - an object with optional style property and/or style overrides
	* @param  {Function} function to be called between autopush and pop
	* @return {Object} value returned by callback
	*/
	StyleContextStack.prototype.auto = function(item, callback) {
		var pushedItems = this.autopush(item);
		var result = callback();

		if (pushedItems > 0) {
			this.pop(pushedItems);
		}

		return result;
	};

	/**
	* Evaluates stack and returns value of a named property
	*
	* @param {String} property - property name
	* @return property value or null if not found
	*/
	StyleContextStack.prototype.getProperty = function(property) {
		if (this.styleOverrides) {
			for(var i = this.styleOverrides.length - 1; i >= 0; i--) {
				var item = this.styleOverrides[i];

				if (typeof item == 'string' || item instanceof String) {
					// named-style-override

					var style = this.styleDictionary[item];
					if (style && style[property] !== null && style[property] !== undefined) {
						return style[property];
					}
				} else {
					// style-overrides-object
					if (item[property] !== undefined && item[property] !== null) {
						return item[property];
					}
				}
			}
		}

		return this.defaultStyle && this.defaultStyle[property];
	};

	module.exports = StyleContextStack;


/***/ },
/* 10 */
/***/ function(module, exports) {

	/* jslint node: true */
	'use strict';

	function buildColumnWidths(columns, availableWidth) {
		var autoColumns = [],
			autoMin = 0, autoMax = 0,
			starColumns = [],
			starMaxMin = 0,
			starMaxMax = 0,
			fixedColumns = [],
			initial_availableWidth = availableWidth;

		columns.forEach(function(column) {
			if (isAutoColumn(column)) {
				autoColumns.push(column);
				autoMin += column._minWidth;
				autoMax += column._maxWidth;
			} else if (isStarColumn(column)) {
				starColumns.push(column);
				starMaxMin = Math.max(starMaxMin, column._minWidth);
				starMaxMax = Math.max(starMaxMax, column._maxWidth);
			} else {
				fixedColumns.push(column);
			}
		});

		fixedColumns.forEach(function(col) {
			// width specified as %
			if (typeof col.width === 'string' && /\d+%/.test(col.width) ) {
				col.width = parseFloat(col.width)*initial_availableWidth/100;
			}
			if (col.width < (col._minWidth) && col.elasticWidth) {
				col._calcWidth = col._minWidth;
			} else {
				col._calcWidth = col.width;
			}

			availableWidth -= col._calcWidth;
		});

		// http://www.freesoft.org/CIE/RFC/1942/18.htm
		// http://www.w3.org/TR/CSS2/tables.html#width-layout
		// http://dev.w3.org/csswg/css3-tables-algorithms/Overview.src.htm
		var minW = autoMin + starMaxMin * starColumns.length;
		var maxW = autoMax + starMaxMax * starColumns.length;
		if (minW >= availableWidth) {
			// case 1 - there's no way to fit all columns within available width
			// that's actually pretty bad situation with PDF as we have no horizontal scroll
			// no easy workaround (unless we decide, in the future, to split single words)
			// currently we simply use minWidths for all columns
			autoColumns.forEach(function(col) {
				col._calcWidth = col._minWidth;
			});

			starColumns.forEach(function(col) {
				col._calcWidth = starMaxMin; // starMaxMin already contains padding
			});
		} else {
			if (maxW < availableWidth) {
				// case 2 - we can fit rest of the table within available space
				autoColumns.forEach(function(col) {
					col._calcWidth = col._maxWidth;
					availableWidth -= col._calcWidth;
				});
			} else {
				// maxW is too large, but minW fits within available width
				var W = availableWidth - minW;
				var D = maxW - minW;

				autoColumns.forEach(function(col) {
					var d = col._maxWidth - col._minWidth;
					col._calcWidth = col._minWidth + d * W / D;
					availableWidth -= col._calcWidth;
				});
			}

			if (starColumns.length > 0) {
				var starSize = availableWidth / starColumns.length;

				starColumns.forEach(function(col) {
					col._calcWidth = starSize;
				});
			}
		}
	}

	function isAutoColumn(column) {
		return column.width === 'auto';
	}

	function isStarColumn(column) {
		return column.width === null || column.width === undefined || column.width === '*' || column.width === 'star';
	}

	//TODO: refactor and reuse in measureTable
	function measureMinMax(columns) {
		var result = { min: 0, max: 0 };

		var maxStar = { min: 0, max: 0 };
		var starCount = 0;

		for(var i = 0, l = columns.length; i < l; i++) {
			var c = columns[i];

			if (isStarColumn(c)) {
				maxStar.min = Math.max(maxStar.min, c._minWidth);
				maxStar.max = Math.max(maxStar.max, c._maxWidth);
				starCount++;
			} else if (isAutoColumn(c)) {
				result.min += c._minWidth;
				result.max += c._maxWidth;
			} else {
				result.min += ((c.width !== undefined && c.width) || c._minWidth);
				result.max += ((c.width  !== undefined && c.width) || c._maxWidth);
			}
		}

		if (starCount) {
			result.min += starCount * maxStar.min;
			result.max += starCount * maxStar.max;
		}

		return result;
	}

	/**
	* Calculates column widths
	* @private
	*/
	module.exports = {
		buildColumnWidths: buildColumnWidths,
		measureMinMax: measureMinMax,
		isAutoColumn: isAutoColumn,
		isStarColumn: isStarColumn
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	/* jslint node: true */
	'use strict';

	function pack() {
		var result = {};

		for(var i = 0, l = arguments.length; i < l; i++) {
			var obj = arguments[i];

			if (obj) {
				for(var key in obj) {
					if (obj.hasOwnProperty(key)) {
						result[key] = obj[key];
					}
				}
			}
		}

		return result;
	}

	function offsetVector(vector, x, y) {
		switch(vector.type) {
		case 'ellipse':
		case 'rect':
			vector.x += x;
			vector.y += y;
			break;
		case 'line':
			vector.x1 += x;
			vector.x2 += x;
			vector.y1 += y;
			vector.y2 += y;
			break;
		case 'polyline':
			for(var i = 0, l = vector.points.length; i < l; i++) {
				vector.points[i].x += x;
				vector.points[i].y += y;
			}
			break;
		}
	}

	function fontStringify(key, val) {
		if (key === 'font') {
			return 'font';
		}
		return val;
	}

	function isFunction(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}


	module.exports = {
		pack: pack,
		fontStringify: fontStringify,
		offsetVector: offsetVector,
		isFunction: isFunction
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	/* jslint node: true */
	'use strict';
	/*jshint -W004 */
	/* qr.js -- QR code generator in Javascript (revision 2011-01-19)
	 * Written by Kang Seonghoon <public+qrjs@mearie.org>.
	 *
	 * This source code is in the public domain; if your jurisdiction does not
	 * recognize the public domain the terms of Creative Commons CC0 license
	 * apply. In the other words, you can always do what you want.
	 */


	// per-version information (cf. JIS X 0510:2004 pp. 30--36, 71)
	//
	// [0]: the degree of generator polynomial by ECC levels
	// [1]: # of code blocks by ECC levels
	// [2]: left-top positions of alignment patterns
	//
	// the number in this table (in particular, [0]) does not exactly match with
	// the numbers in the specficiation. see augumenteccs below for the reason.
	var VERSIONS = [
		null,
		[[10, 7,17,13], [ 1, 1, 1, 1], []],
		[[16,10,28,22], [ 1, 1, 1, 1], [4,16]],
		[[26,15,22,18], [ 1, 1, 2, 2], [4,20]],
		[[18,20,16,26], [ 2, 1, 4, 2], [4,24]],
		[[24,26,22,18], [ 2, 1, 4, 4], [4,28]],
		[[16,18,28,24], [ 4, 2, 4, 4], [4,32]],
		[[18,20,26,18], [ 4, 2, 5, 6], [4,20,36]],
		[[22,24,26,22], [ 4, 2, 6, 6], [4,22,40]],
		[[22,30,24,20], [ 5, 2, 8, 8], [4,24,44]],
		[[26,18,28,24], [ 5, 4, 8, 8], [4,26,48]],
		[[30,20,24,28], [ 5, 4,11, 8], [4,28,52]],
		[[22,24,28,26], [ 8, 4,11,10], [4,30,56]],
		[[22,26,22,24], [ 9, 4,16,12], [4,32,60]],
		[[24,30,24,20], [ 9, 4,16,16], [4,24,44,64]],
		[[24,22,24,30], [10, 6,18,12], [4,24,46,68]],
		[[28,24,30,24], [10, 6,16,17], [4,24,48,72]],
		[[28,28,28,28], [11, 6,19,16], [4,28,52,76]],
		[[26,30,28,28], [13, 6,21,18], [4,28,54,80]],
		[[26,28,26,26], [14, 7,25,21], [4,28,56,84]],
		[[26,28,28,30], [16, 8,25,20], [4,32,60,88]],
		[[26,28,30,28], [17, 8,25,23], [4,26,48,70,92]],
		[[28,28,24,30], [17, 9,34,23], [4,24,48,72,96]],
		[[28,30,30,30], [18, 9,30,25], [4,28,52,76,100]],
		[[28,30,30,30], [20,10,32,27], [4,26,52,78,104]],
		[[28,26,30,30], [21,12,35,29], [4,30,56,82,108]],
		[[28,28,30,28], [23,12,37,34], [4,28,56,84,112]],
		[[28,30,30,30], [25,12,40,34], [4,32,60,88,116]],
		[[28,30,30,30], [26,13,42,35], [4,24,48,72,96,120]],
		[[28,30,30,30], [28,14,45,38], [4,28,52,76,100,124]],
		[[28,30,30,30], [29,15,48,40], [4,24,50,76,102,128]],
		[[28,30,30,30], [31,16,51,43], [4,28,54,80,106,132]],
		[[28,30,30,30], [33,17,54,45], [4,32,58,84,110,136]],
		[[28,30,30,30], [35,18,57,48], [4,28,56,84,112,140]],
		[[28,30,30,30], [37,19,60,51], [4,32,60,88,116,144]],
		[[28,30,30,30], [38,19,63,53], [4,28,52,76,100,124,148]],
		[[28,30,30,30], [40,20,66,56], [4,22,48,74,100,126,152]],
		[[28,30,30,30], [43,21,70,59], [4,26,52,78,104,130,156]],
		[[28,30,30,30], [45,22,74,62], [4,30,56,82,108,134,160]],
		[[28,30,30,30], [47,24,77,65], [4,24,52,80,108,136,164]],
		[[28,30,30,30], [49,25,81,68], [4,28,56,84,112,140,168]]];

	// mode constants (cf. Table 2 in JIS X 0510:2004 p. 16)
	var MODE_TERMINATOR = 0;
	var MODE_NUMERIC = 1, MODE_ALPHANUMERIC = 2, MODE_OCTET = 4, MODE_KANJI = 8;

	// validation regexps
	var NUMERIC_REGEXP = /^\d*$/;
	var ALPHANUMERIC_REGEXP = /^[A-Za-z0-9 $%*+\-./:]*$/;
	var ALPHANUMERIC_OUT_REGEXP = /^[A-Z0-9 $%*+\-./:]*$/;

	// ECC levels (cf. Table 22 in JIS X 0510:2004 p. 45)
	var ECCLEVEL_L = 1, ECCLEVEL_M = 0, ECCLEVEL_Q = 3, ECCLEVEL_H = 2;

	// GF(2^8)-to-integer mapping with a reducing polynomial x^8+x^4+x^3+x^2+1
	// invariant: GF256_MAP[GF256_INVMAP[i]] == i for all i in [1,256)
	var GF256_MAP = [], GF256_INVMAP = [-1];
	for (var i = 0, v = 1; i < 255; ++i) {
		GF256_MAP.push(v);
		GF256_INVMAP[v] = i;
		v = (v * 2) ^ (v >= 128 ? 0x11d : 0);
	}

	// generator polynomials up to degree 30
	// (should match with polynomials in JIS X 0510:2004 Appendix A)
	//
	// generator polynomial of degree K is product of (x-\alpha^0), (x-\alpha^1),
	// ..., (x-\alpha^(K-1)). by convention, we omit the K-th coefficient (always 1)
	// from the result; also other coefficients are written in terms of the exponent
	// to \alpha to avoid the redundant calculation. (see also calculateecc below.)
	var GF256_GENPOLY = [[]];
	for (var i = 0; i < 30; ++i) {
		var prevpoly = GF256_GENPOLY[i], poly = [];
		for (var j = 0; j <= i; ++j) {
			var a = (j < i ? GF256_MAP[prevpoly[j]] : 0);
			var b = GF256_MAP[(i + (prevpoly[j-1] || 0)) % 255];
			poly.push(GF256_INVMAP[a ^ b]);
		}
		GF256_GENPOLY.push(poly);
	}

	// alphanumeric character mapping (cf. Table 5 in JIS X 0510:2004 p. 19)
	var ALPHANUMERIC_MAP = {};
	for (var i = 0; i < 45; ++i) {
		ALPHANUMERIC_MAP['0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'.charAt(i)] = i;
	}

	// mask functions in terms of row # and column #
	// (cf. Table 20 in JIS X 0510:2004 p. 42)
	var MASKFUNCS = [
		function(i,j) { return (i+j) % 2 === 0; },
		function(i,j) { return i % 2 === 0; },
		function(i,j) { return j % 3 === 0; },
		function(i,j) { return (i+j) % 3 === 0; },
		function(i,j) { return (((i/2)|0) + ((j/3)|0)) % 2 === 0; },
		function(i,j) { return (i*j) % 2 + (i*j) % 3 === 0; },
		function(i,j) { return ((i*j) % 2 + (i*j) % 3) % 2 === 0; },
		function(i,j) { return ((i+j) % 2 + (i*j) % 3) % 2 === 0; }];

	// returns true when the version information has to be embeded.
	var needsverinfo = function(ver) { return ver > 6; };

	// returns the size of entire QR code for given version.
	var getsizebyver = function(ver) { return 4 * ver + 17; };

	// returns the number of bits available for code words in this version.
	var nfullbits = function(ver) {
		/*
		 * |<--------------- n --------------->|
		 * |        |<----- n-17 ---->|        |
		 * +-------+                ///+-------+ ----
		 * |       |                ///|       |    ^
		 * |  9x9  |       @@@@@    ///|  9x8  |    |
		 * |       | # # # @5x5@ # # # |       |    |
		 * +-------+       @@@@@       +-------+    |
		 *       #                               ---|
		 *                                        ^ |
		 *       #                                |
		 *     @@@@@       @@@@@       @@@@@      | n
		 *     @5x5@       @5x5@       @5x5@   n-17
		 *     @@@@@       @@@@@       @@@@@      | |
		 *       #                                | |
		 * //////                                 v |
		 * //////#                               ---|
		 * +-------+       @@@@@       @@@@@        |
		 * |       |       @5x5@       @5x5@        |
		 * |  8x9  |       @@@@@       @@@@@        |
		 * |       |                                v
		 * +-------+                             ----
		 *
		 * when the entire code has n^2 modules and there are m^2-3 alignment
		 * patterns, we have:
		 * - 225 (= 9x9 + 9x8 + 8x9) modules for finder patterns and
		 *   format information;
		 * - 2n-34 (= 2(n-17)) modules for timing patterns;
		 * - 36 (= 3x6 + 6x3) modules for version information, if any;
		 * - 25m^2-75 (= (m^2-3)(5x5)) modules for alignment patterns
		 *   if any, but 10m-20 (= 2(m-2)x5) of them overlaps with
		 *   timing patterns.
		 */
		var v = VERSIONS[ver];
		var nbits = 16*ver*ver + 128*ver + 64; // finder, timing and format info.
		if (needsverinfo(ver)) nbits -= 36; // version information
		if (v[2].length) { // alignment patterns
			nbits -= 25 * v[2].length * v[2].length - 10 * v[2].length - 55;
		}
		return nbits;
	};

	// returns the number of bits available for data portions (i.e. excludes ECC
	// bits but includes mode and length bits) in this version and ECC level.
	var ndatabits = function(ver, ecclevel) {
		var nbits = nfullbits(ver) & ~7; // no sub-octet code words
		var v = VERSIONS[ver];
		nbits -= 8 * v[0][ecclevel] * v[1][ecclevel]; // ecc bits
		return nbits;
	};

	// returns the number of bits required for the length of data.
	// (cf. Table 3 in JIS X 0510:2004 p. 16)
	var ndatalenbits = function(ver, mode) {
		switch (mode) {
		case MODE_NUMERIC: return (ver < 10 ? 10 : ver < 27 ? 12 : 14);
		case MODE_ALPHANUMERIC: return (ver < 10 ? 9 : ver < 27 ? 11 : 13);
		case MODE_OCTET: return (ver < 10 ? 8 : 16);
		case MODE_KANJI: return (ver < 10 ? 8 : ver < 27 ? 10 : 12);
		}
	};

	// returns the maximum length of data possible in given configuration.
	var getmaxdatalen = function(ver, mode, ecclevel) {
		var nbits = ndatabits(ver, ecclevel) - 4 - ndatalenbits(ver, mode); // 4 for mode bits
		switch (mode) {
		case MODE_NUMERIC:
			return ((nbits/10) | 0) * 3 + (nbits%10 < 4 ? 0 : nbits%10 < 7 ? 1 : 2);
		case MODE_ALPHANUMERIC:
			return ((nbits/11) | 0) * 2 + (nbits%11 < 6 ? 0 : 1);
		case MODE_OCTET:
			return (nbits/8) | 0;
		case MODE_KANJI:
			return (nbits/13) | 0;
		}
	};

	// checks if the given data can be encoded in given mode, and returns
	// the converted data for the further processing if possible. otherwise
	// returns null.
	//
	// this function does not check the length of data; it is a duty of
	// encode function below (as it depends on the version and ECC level too).
	var validatedata = function(mode, data) {
		switch (mode) {
		case MODE_NUMERIC:
			if (!data.match(NUMERIC_REGEXP)) return null;
			return data;

		case MODE_ALPHANUMERIC:
			if (!data.match(ALPHANUMERIC_REGEXP)) return null;
			return data.toUpperCase();

		case MODE_OCTET:
			if (typeof data === 'string') { // encode as utf-8 string
				var newdata = [];
				for (var i = 0; i < data.length; ++i) {
					var ch = data.charCodeAt(i);
					if (ch < 0x80) {
						newdata.push(ch);
					} else if (ch < 0x800) {
						newdata.push(0xc0 | (ch >> 6),
							0x80 | (ch & 0x3f));
					} else if (ch < 0x10000) {
						newdata.push(0xe0 | (ch >> 12),
							0x80 | ((ch >> 6) & 0x3f),
							0x80 | (ch & 0x3f));
					} else {
						newdata.push(0xf0 | (ch >> 18),
							0x80 | ((ch >> 12) & 0x3f),
							0x80 | ((ch >> 6) & 0x3f),
							0x80 | (ch & 0x3f));
					}
				}
				return newdata;
			} else {
				return data;
			}
		}
	};

	// returns the code words (sans ECC bits) for given data and configurations.
	// requires data to be preprocessed by validatedata. no length check is
	// performed, and everything has to be checked before calling this function.
	var encode = function(ver, mode, data, maxbuflen) {
		var buf = [];
		var bits = 0, remaining = 8;
		var datalen = data.length;

		// this function is intentionally no-op when n=0.
		var pack = function(x, n) {
			if (n >= remaining) {
				buf.push(bits | (x >> (n -= remaining)));
				while (n >= 8) buf.push((x >> (n -= 8)) & 255);
				bits = 0;
				remaining = 8;
			}
			if (n > 0) bits |= (x & ((1 << n) - 1)) << (remaining -= n);
		};

		var nlenbits = ndatalenbits(ver, mode);
		pack(mode, 4);
		pack(datalen, nlenbits);

		switch (mode) {
		case MODE_NUMERIC:
			for (var i = 2; i < datalen; i += 3) {
				pack(parseInt(data.substring(i-2,i+1), 10), 10);
			}
			pack(parseInt(data.substring(i-2), 10), [0,4,7][datalen%3]);
			break;

		case MODE_ALPHANUMERIC:
			for (var i = 1; i < datalen; i += 2) {
				pack(ALPHANUMERIC_MAP[data.charAt(i-1)] * 45 +
					ALPHANUMERIC_MAP[data.charAt(i)], 11);
			}
			if (datalen % 2 == 1) {
				pack(ALPHANUMERIC_MAP[data.charAt(i-1)], 6);
			}
			break;

		case MODE_OCTET:
			for (var i = 0; i < datalen; ++i) {
				pack(data[i], 8);
			}
			break;
		}

		// final bits. it is possible that adding terminator causes the buffer
		// to overflow, but then the buffer truncated to the maximum size will
		// be valid as the truncated terminator mode bits and padding is
		// identical in appearance (cf. JIS X 0510:2004 sec 8.4.8).
		pack(MODE_TERMINATOR, 4);
		if (remaining < 8) buf.push(bits);

		// the padding to fill up the remaining space. we should not add any
		// words when the overflow already occurred.
		while (buf.length + 1 < maxbuflen) buf.push(0xec, 0x11);
		if (buf.length < maxbuflen) buf.push(0xec);
		return buf;
	};

	// calculates ECC code words for given code words and generator polynomial.
	//
	// this is quite similar to CRC calculation as both Reed-Solomon and CRC use
	// the certain kind of cyclic codes, which is effectively the division of
	// zero-augumented polynomial by the generator polynomial. the only difference
	// is that Reed-Solomon uses GF(2^8), instead of CRC's GF(2), and Reed-Solomon
	// uses the different generator polynomial than CRC's.
	var calculateecc = function(poly, genpoly) {
		var modulus = poly.slice(0);
		var polylen = poly.length, genpolylen = genpoly.length;
		for (var i = 0; i < genpolylen; ++i) modulus.push(0);
		for (var i = 0; i < polylen; ) {
			var quotient = GF256_INVMAP[modulus[i++]];
			if (quotient >= 0) {
				for (var j = 0; j < genpolylen; ++j) {
					modulus[i+j] ^= GF256_MAP[(quotient + genpoly[j]) % 255];
				}
			}
		}
		return modulus.slice(polylen);
	};

	// auguments ECC code words to given code words. the resulting words are
	// ready to be encoded in the matrix.
	//
	// the much of actual augumenting procedure follows JIS X 0510:2004 sec 8.7.
	// the code is simplified using the fact that the size of each code & ECC
	// blocks is almost same; for example, when we have 4 blocks and 46 data words
	// the number of code words in those blocks are 11, 11, 12, 12 respectively.
	var augumenteccs = function(poly, nblocks, genpoly) {
		var subsizes = [];
		var subsize = (poly.length / nblocks) | 0, subsize0 = 0;
		var pivot = nblocks - poly.length % nblocks;
		for (var i = 0; i < pivot; ++i) {
			subsizes.push(subsize0);
			subsize0 += subsize;
		}
		for (var i = pivot; i < nblocks; ++i) {
			subsizes.push(subsize0);
			subsize0 += subsize+1;
		}
		subsizes.push(subsize0);

		var eccs = [];
		for (var i = 0; i < nblocks; ++i) {
			eccs.push(calculateecc(poly.slice(subsizes[i], subsizes[i+1]), genpoly));
		}

		var result = [];
		var nitemsperblock = (poly.length / nblocks) | 0;
		for (var i = 0; i < nitemsperblock; ++i) {
			for (var j = 0; j < nblocks; ++j) {
				result.push(poly[subsizes[j] + i]);
			}
		}
		for (var j = pivot; j < nblocks; ++j) {
			result.push(poly[subsizes[j+1] - 1]);
		}
		for (var i = 0; i < genpoly.length; ++i) {
			for (var j = 0; j < nblocks; ++j) {
				result.push(eccs[j][i]);
			}
		}
		return result;
	};

	// auguments BCH(p+q,q) code to the polynomial over GF(2), given the proper
	// genpoly. the both input and output are in binary numbers, and unlike
	// calculateecc genpoly should include the 1 bit for the highest degree.
	//
	// actual polynomials used for this procedure are as follows:
	// - p=10, q=5, genpoly=x^10+x^8+x^5+x^4+x^2+x+1 (JIS X 0510:2004 Appendix C)
	// - p=18, q=6, genpoly=x^12+x^11+x^10+x^9+x^8+x^5+x^2+1 (ibid. Appendix D)
	var augumentbch = function(poly, p, genpoly, q) {
		var modulus = poly << q;
		for (var i = p - 1; i >= 0; --i) {
			if ((modulus >> (q+i)) & 1) modulus ^= genpoly << i;
		}
		return (poly << q) | modulus;
	};

	// creates the base matrix for given version. it returns two matrices, one of
	// them is the actual one and the another represents the "reserved" portion
	// (e.g. finder and timing patterns) of the matrix.
	//
	// some entries in the matrix may be undefined, rather than 0 or 1. this is
	// intentional (no initialization needed!), and putdata below will fill
	// the remaining ones.
	var makebasematrix = function(ver) {
		var v = VERSIONS[ver], n = getsizebyver(ver);
		var matrix = [], reserved = [];
		for (var i = 0; i < n; ++i) {
			matrix.push([]);
			reserved.push([]);
		}

		var blit = function(y, x, h, w, bits) {
			for (var i = 0; i < h; ++i) {
				for (var j = 0; j < w; ++j) {
					matrix[y+i][x+j] = (bits[i] >> j) & 1;
					reserved[y+i][x+j] = 1;
				}
			}
		};

		// finder patterns and a part of timing patterns
		// will also mark the format information area (not yet written) as reserved.
		blit(0, 0, 9, 9, [0x7f, 0x41, 0x5d, 0x5d, 0x5d, 0x41, 0x17f, 0x00, 0x40]);
		blit(n-8, 0, 8, 9, [0x100, 0x7f, 0x41, 0x5d, 0x5d, 0x5d, 0x41, 0x7f]);
		blit(0, n-8, 9, 8, [0xfe, 0x82, 0xba, 0xba, 0xba, 0x82, 0xfe, 0x00, 0x00]);

		// the rest of timing patterns
		for (var i = 9; i < n-8; ++i) {
			matrix[6][i] = matrix[i][6] = ~i & 1;
			reserved[6][i] = reserved[i][6] = 1;
		}

		// alignment patterns
		var aligns = v[2], m = aligns.length;
		for (var i = 0; i < m; ++i) {
			var minj = (i===0 || i===m-1 ? 1 : 0), maxj = (i===0 ? m-1 : m);
			for (var j = minj; j < maxj; ++j) {
				blit(aligns[i], aligns[j], 5, 5, [0x1f, 0x11, 0x15, 0x11, 0x1f]);
			}
		}

		// version information
		if (needsverinfo(ver)) {
			var code = augumentbch(ver, 6, 0x1f25, 12);
			var k = 0;
			for (var i = 0; i < 6; ++i) {
				for (var j = 0; j < 3; ++j) {
					matrix[i][(n-11)+j] = matrix[(n-11)+j][i] = (code >> k++) & 1;
					reserved[i][(n-11)+j] = reserved[(n-11)+j][i] = 1;
				}
			}
		}

		return {matrix: matrix, reserved: reserved};
	};

	// fills the data portion (i.e. unmarked in reserved) of the matrix with given
	// code words. the size of code words should be no more than available bits,
	// and remaining bits are padded to 0 (cf. JIS X 0510:2004 sec 8.7.3).
	var putdata = function(matrix, reserved, buf) {
		var n = matrix.length;
		var k = 0, dir = -1;
		for (var i = n-1; i >= 0; i -= 2) {
			if (i == 6) --i; // skip the entire timing pattern column
			var jj = (dir < 0 ? n-1 : 0);
			for (var j = 0; j < n; ++j) {
				for (var ii = i; ii > i-2; --ii) {
					if (!reserved[jj][ii]) {
						// may overflow, but (undefined >> x)
						// is 0 so it will auto-pad to zero.
						matrix[jj][ii] = (buf[k >> 3] >> (~k&7)) & 1;
						++k;
					}
				}
				jj += dir;
			}
			dir = -dir;
		}
		return matrix;
	};

	// XOR-masks the data portion of the matrix. repeating the call with the same
	// arguments will revert the prior call (convenient in the matrix evaluation).
	var maskdata = function(matrix, reserved, mask) {
		var maskf = MASKFUNCS[mask];
		var n = matrix.length;
		for (var i = 0; i < n; ++i) {
			for (var j = 0; j < n; ++j) {
				if (!reserved[i][j]) matrix[i][j] ^= maskf(i,j);
			}
		}
		return matrix;
	};

	// puts the format information.
	var putformatinfo = function(matrix, reserved, ecclevel, mask) {
		var n = matrix.length;
		var code = augumentbch((ecclevel << 3) | mask, 5, 0x537, 10) ^ 0x5412;
		for (var i = 0; i < 15; ++i) {
			var r = [0,1,2,3,4,5,7,8,n-7,n-6,n-5,n-4,n-3,n-2,n-1][i];
			var c = [n-1,n-2,n-3,n-4,n-5,n-6,n-7,n-8,7,5,4,3,2,1,0][i];
			matrix[r][8] = matrix[8][c] = (code >> i) & 1;
			// we don't have to mark those bits reserved; always done
			// in makebasematrix above.
		}
		return matrix;
	};

	// evaluates the resulting matrix and returns the score (lower is better).
	// (cf. JIS X 0510:2004 sec 8.8.2)
	//
	// the evaluation procedure tries to avoid the problematic patterns naturally
	// occuring from the original matrix. for example, it penaltizes the patterns
	// which just look like the finder pattern which will confuse the decoder.
	// we choose the mask which results in the lowest score among 8 possible ones.
	//
	// note: zxing seems to use the same procedure and in many cases its choice
	// agrees to ours, but sometimes it does not. practically it doesn't matter.
	var evaluatematrix = function(matrix) {
		// N1+(k-5) points for each consecutive row of k same-colored modules,
		// where k >= 5. no overlapping row counts.
		var PENALTY_CONSECUTIVE = 3;
		// N2 points for each 2x2 block of same-colored modules.
		// overlapping block does count.
		var PENALTY_TWOBYTWO = 3;
		// N3 points for each pattern with >4W:1B:1W:3B:1W:1B or
		// 1B:1W:3B:1W:1B:>4W, or their multiples (e.g. highly unlikely,
		// but 13W:3B:3W:9B:3W:3B counts).
		var PENALTY_FINDERLIKE = 40;
		// N4*k points for every (5*k)% deviation from 50% black density.
		// i.e. k=1 for 55~60% and 40~45%, k=2 for 60~65% and 35~40%, etc.
		var PENALTY_DENSITY = 10;

		var evaluategroup = function(groups) { // assumes [W,B,W,B,W,...,B,W]
			var score = 0;
			for (var i = 0; i < groups.length; ++i) {
				if (groups[i] >= 5) score += PENALTY_CONSECUTIVE + (groups[i]-5);
			}
			for (var i = 5; i < groups.length; i += 2) {
				var p = groups[i];
				if (groups[i-1] == p && groups[i-2] == 3*p && groups[i-3] == p &&
						groups[i-4] == p && (groups[i-5] >= 4*p || groups[i+1] >= 4*p)) {
					// this part differs from zxing...
					score += PENALTY_FINDERLIKE;
				}
			}
			return score;
		};

		var n = matrix.length;
		var score = 0, nblacks = 0;
		for (var i = 0; i < n; ++i) {
			var row = matrix[i];
			var groups;

			// evaluate the current row
			groups = [0]; // the first empty group of white
			for (var j = 0; j < n; ) {
				var k;
				for (k = 0; j < n && row[j]; ++k) ++j;
				groups.push(k);
				for (k = 0; j < n && !row[j]; ++k) ++j;
				groups.push(k);
			}
			score += evaluategroup(groups);

			// evaluate the current column
			groups = [0];
			for (var j = 0; j < n; ) {
				var k;
				for (k = 0; j < n && matrix[j][i]; ++k) ++j;
				groups.push(k);
				for (k = 0; j < n && !matrix[j][i]; ++k) ++j;
				groups.push(k);
			}
			score += evaluategroup(groups);

			// check the 2x2 box and calculate the density
			var nextrow = matrix[i+1] || [];
			nblacks += row[0];
			for (var j = 1; j < n; ++j) {
				var p = row[j];
				nblacks += p;
				// at least comparison with next row should be strict...
				if (row[j-1] == p && nextrow[j] === p && nextrow[j-1] === p) {
					score += PENALTY_TWOBYTWO;
				}
			}
		}

		score += PENALTY_DENSITY * ((Math.abs(nblacks / n / n - 0.5) / 0.05) | 0);
		return score;
	};

	// returns the fully encoded QR code matrix which contains given data.
	// it also chooses the best mask automatically when mask is -1.
	var generate = function(data, ver, mode, ecclevel, mask) {
		var v = VERSIONS[ver];
		var buf = encode(ver, mode, data, ndatabits(ver, ecclevel) >> 3);
		buf = augumenteccs(buf, v[1][ecclevel], GF256_GENPOLY[v[0][ecclevel]]);

		var result = makebasematrix(ver);
		var matrix = result.matrix, reserved = result.reserved;
		putdata(matrix, reserved, buf);

		if (mask < 0) {
			// find the best mask
			maskdata(matrix, reserved, 0);
			putformatinfo(matrix, reserved, ecclevel, 0);
			var bestmask = 0, bestscore = evaluatematrix(matrix);
			maskdata(matrix, reserved, 0);
			for (mask = 1; mask < 8; ++mask) {
				maskdata(matrix, reserved, mask);
				putformatinfo(matrix, reserved, ecclevel, mask);
				var score = evaluatematrix(matrix);
				if (bestscore > score) {
					bestscore = score;
					bestmask = mask;
				}
				maskdata(matrix, reserved, mask);
			}
			mask = bestmask;
		}

		maskdata(matrix, reserved, mask);
		putformatinfo(matrix, reserved, ecclevel, mask);
		return matrix;
	};

	// the public interface is trivial; the options available are as follows:
	//
	// - version: an integer in [1,40]. when omitted (or -1) the smallest possible
	//   version is chosen.
	// - mode: one of 'numeric', 'alphanumeric', 'octet'. when omitted the smallest
	//   possible mode is chosen.
	// - eccLevel: one of 'L', 'M', 'Q', 'H'. defaults to 'L'.
	// - mask: an integer in [0,7]. when omitted (or -1) the best mask is chosen.
	//

	function generateFrame(data, options) {
			var MODES = {'numeric': MODE_NUMERIC, 'alphanumeric': MODE_ALPHANUMERIC,
				'octet': MODE_OCTET};
			var ECCLEVELS = {'L': ECCLEVEL_L, 'M': ECCLEVEL_M, 'Q': ECCLEVEL_Q,
				'H': ECCLEVEL_H};

			options = options || {};
			var ver = options.version || -1;
			var ecclevel = ECCLEVELS[(options.eccLevel || 'L').toUpperCase()];
			var mode = options.mode ? MODES[options.mode.toLowerCase()] : -1;
			var mask = 'mask' in options ? options.mask : -1;

			if (mode < 0) {
				if (typeof data === 'string') {
					if (data.match(NUMERIC_REGEXP)) {
						mode = MODE_NUMERIC;
					} else if (data.match(ALPHANUMERIC_OUT_REGEXP)) {
						// while encode supports case-insensitive encoding, we restrict the data to be uppercased when auto-selecting the mode.
						mode = MODE_ALPHANUMERIC;
					} else {
						mode = MODE_OCTET;
					}
				} else {
					mode = MODE_OCTET;
				}
			} else if (!(mode == MODE_NUMERIC || mode == MODE_ALPHANUMERIC ||
					mode == MODE_OCTET)) {
				throw 'invalid or unsupported mode';
			}

			data = validatedata(mode, data);
			if (data === null) throw 'invalid data format';

			if (ecclevel < 0 || ecclevel > 3) throw 'invalid ECC level';

			if (ver < 0) {
				for (ver = 1; ver <= 40; ++ver) {
					if (data.length <= getmaxdatalen(ver, mode, ecclevel)) break;
				}
				if (ver > 40) throw 'too large data for the Qr format';
			} else if (ver < 1 || ver > 40) {
				throw 'invalid Qr version! should be between 1 and 40';
			}

			if (mask != -1 && (mask < 0 || mask > 8)) throw 'invalid mask';
	        //console.log('version:', ver, 'mode:', mode, 'ECC:', ecclevel, 'mask:', mask )
			return generate(data, ver, mode, ecclevel, mask);
		}


	// options
	// - modulesize: a number. this is a size of each modules in pixels, and
	//   defaults to 5px.
	// - margin: a number. this is a size of margin in *modules*, and defaults to
	//   4 (white modules). the specficiation mandates the margin no less than 4
	//   modules, so it is better not to alter this value unless you know what
	//   you're doing.
	function buildCanvas(data, options) {
	   
	    var canvas = [];
	    var background = data.background || '#fff';
	    var foreground = data.foreground || '#000';
	    //var margin = options.margin || 4;
		var matrix = generateFrame(data, options);
		var n = matrix.length;
		var modSize = Math.floor( options.fit ? options.fit/n : 5 );
		var size = n * modSize;
		
	    canvas.push({
	      type: 'rect',
	      x: 0, y: 0, w: size, h: size, lineWidth: 0, color: background
	    });
	    
		for (var i = 0; i < n; ++i) {
			for (var j = 0; j < n; ++j) {
	            if(matrix[i][j]) {
	              canvas.push({
	                type: 'rect',
	                x: modSize * i,
	                y: modSize * j,
	                w: modSize,
	                h: modSize,
	                lineWidth: 0,
	                color: foreground
	              });
	            }
	        }
	    }
	    
	    return {
	        canvas: canvas,
	        size: size
	    };
			
	}

	function measure(node) {
	    var cd = buildCanvas(node.qr, node);
	    node._canvas = cd.canvas;
	    node._width = node._height = node._minWidth = node._maxWidth = node._minHeight = node._maxHeight = cd.size;
	    return node;
	}

	module.exports = {
	  measure: measure
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* jslint node: true */
	'use strict';

	var TraversalTracker = __webpack_require__(6);

	/**
	* Creates an instance of DocumentContext - a store for current x, y positions and available width/height.
	* It facilitates column divisions and vertical sync
	*/
	function DocumentContext(pageSize, pageMargins) {
		this.pages = [];

		this.pageMargins = pageMargins;

		this.x = pageMargins.left;
		this.availableWidth = pageSize.width - pageMargins.left - pageMargins.right;
		this.availableHeight = 0;
		this.page = -1;

		this.snapshots = [];

		this.endingCell = null;

	  this.tracker = new TraversalTracker();

		this.addPage(pageSize);
	}

	DocumentContext.prototype.beginColumnGroup = function() {
		this.snapshots.push({
			x: this.x,
			y: this.y,
			availableHeight: this.availableHeight,
			availableWidth: this.availableWidth,
			page: this.page,
			bottomMost: { y: this.y, page: this.page },
			endingCell: this.endingCell,
			lastColumnWidth: this.lastColumnWidth
		});

		this.lastColumnWidth = 0;
	};

	DocumentContext.prototype.beginColumn = function(width, offset, endingCell) {
		var saved = this.snapshots[this.snapshots.length - 1];

		this.calculateBottomMost(saved);

	  this.endingCell = endingCell;
		this.page = saved.page;
		this.x = this.x + this.lastColumnWidth + (offset || 0);
		this.y = saved.y;
		this.availableWidth = width;	//saved.availableWidth - offset;
		this.availableHeight = saved.availableHeight;

		this.lastColumnWidth = width;
	};

	DocumentContext.prototype.calculateBottomMost = function(destContext) {
		if (this.endingCell) {
			this.saveContextInEndingCell(this.endingCell);
			this.endingCell = null;
		} else {
			destContext.bottomMost = bottomMostContext(this, destContext.bottomMost);
		}
	};

	DocumentContext.prototype.markEnding = function(endingCell) {
		this.page = endingCell._columnEndingContext.page;
		this.x = endingCell._columnEndingContext.x;
		this.y = endingCell._columnEndingContext.y;
		this.availableWidth = endingCell._columnEndingContext.availableWidth;
		this.availableHeight = endingCell._columnEndingContext.availableHeight;
		this.lastColumnWidth = endingCell._columnEndingContext.lastColumnWidth;
	};

	DocumentContext.prototype.saveContextInEndingCell = function(endingCell) {
		endingCell._columnEndingContext = {
			page: this.page,
			x: this.x,
			y: this.y,
			availableHeight: this.availableHeight,
			availableWidth: this.availableWidth,
			lastColumnWidth: this.lastColumnWidth
		};
	};

	DocumentContext.prototype.completeColumnGroup = function() {
		var saved = this.snapshots.pop();

		this.calculateBottomMost(saved);

		this.endingCell = null;
		this.x = saved.x;
		this.y = saved.bottomMost.y;
		this.page = saved.bottomMost.page;
		this.availableWidth = saved.availableWidth;
		this.availableHeight = saved.bottomMost.availableHeight;
		this.lastColumnWidth = saved.lastColumnWidth;
	};

	DocumentContext.prototype.addMargin = function(left, right) {
		this.x += left;
		this.availableWidth -= left + (right || 0);
	};

	DocumentContext.prototype.moveDown = function(offset) {
		this.y += offset;
		this.availableHeight -= offset;

		return this.availableHeight > 0;
	};

	DocumentContext.prototype.initializePage = function() {
		this.y = this.pageMargins.top;
		this.availableHeight = this.getCurrentPage().pageSize.height - this.pageMargins.top - this.pageMargins.bottom;
		this.pageSnapshot().availableWidth = this.getCurrentPage().pageSize.width - this.pageMargins.left - this.pageMargins.right;
	};

	DocumentContext.prototype.pageSnapshot = function(){
	  if(this.snapshots[0]){
	    return this.snapshots[0];
	  } else {
	    return this;
	  }
	};

	DocumentContext.prototype.moveTo = function(x,y) {
		if(x !== undefined && x !== null) {
			this.x = x;
			this.availableWidth = this.getCurrentPage().pageSize.width - this.x - this.pageMargins.right;
		}
		if(y !== undefined && y !== null){
			this.y = y;
			this.availableHeight = this.getCurrentPage().pageSize.height - this.y - this.pageMargins.bottom;
		}
	};

	DocumentContext.prototype.beginDetachedBlock = function() {
		this.snapshots.push({
			x: this.x,
			y: this.y,
			availableHeight: this.availableHeight,
			availableWidth: this.availableWidth,
			page: this.page,
			endingCell: this.endingCell,
			lastColumnWidth: this.lastColumnWidth
		});
	};

	DocumentContext.prototype.endDetachedBlock = function() {
		var saved = this.snapshots.pop();

		this.x = saved.x;
		this.y = saved.y;
		this.availableWidth = saved.availableWidth;
		this.availableHeight = saved.availableHeight;
		this.page = saved.page;
		this.endingCell = saved.endingCell;
		this.lastColumnWidth = saved.lastColumnWidth;
	};

	function pageOrientation(pageOrientationString, currentPageOrientation){
		if(pageOrientationString === undefined) {
			return currentPageOrientation;
		} else if(pageOrientationString === 'landscape'){
			return 'landscape';
		} else {
			return 'portrait';
		}
	}

	var getPageSize = function (currentPage, newPageOrientation) {

		newPageOrientation = pageOrientation(newPageOrientation, currentPage.pageSize.orientation);

		if(newPageOrientation !== currentPage.pageSize.orientation) {
			return {
				orientation: newPageOrientation,
				width: currentPage.pageSize.height,
				height: currentPage.pageSize.width
			};
		} else {
			return {
				orientation: currentPage.pageSize.orientation,
				width: currentPage.pageSize.width,
				height: currentPage.pageSize.height
			};
		}

	};


	DocumentContext.prototype.moveToNextPage = function(pageOrientation) {
		var nextPageIndex = this.page + 1;

		var prevPage = this.page;
		var prevY = this.y;

		var createNewPage = nextPageIndex >= this.pages.length;
		if (createNewPage) {
			this.addPage(getPageSize(this.getCurrentPage(), pageOrientation));
		} else {
			this.page = nextPageIndex;
			this.initializePage();
		}

	  return {
			newPageCreated: createNewPage,
			prevPage: prevPage,
			prevY: prevY,
			y: this.y
		};
	};


	DocumentContext.prototype.addPage = function(pageSize) {
		var page = { items: [], pageSize: pageSize };
		this.pages.push(page);
		this.page = this.pages.length - 1;
		this.initializePage();

		this.tracker.emit('pageAdded');

		return page;
	};

	DocumentContext.prototype.getCurrentPage = function() {
		if (this.page < 0 || this.page >= this.pages.length) return null;

		return this.pages[this.page];
	};

	DocumentContext.prototype.getCurrentPosition = function() {
	  var pageSize = this.getCurrentPage().pageSize;
	  var innerHeight = pageSize.height - this.pageMargins.top - this.pageMargins.bottom;
	  var innerWidth = pageSize.width - this.pageMargins.left - this.pageMargins.right;

	  return {
	    pageNumber: this.page + 1,
	    pageOrientation: pageSize.orientation,
	    pageInnerHeight: innerHeight,
	    pageInnerWidth: innerWidth,
	    left: this.x,
	    top: this.y,
	    verticalRatio: ((this.y - this.pageMargins.top) / innerHeight),
	    horizontalRatio: ((this.x - this.pageMargins.left) / innerWidth)
	  };
	};

	function bottomMostContext(c1, c2) {
		var r;

		if (c1.page > c2.page) r = c1;
		else if (c2.page > c1.page) r = c2;
		else r = (c1.y > c2.y) ? c1 : c2;

		return {
			page: r.page,
			x: r.x,
			y: r.y,
			availableHeight: r.availableHeight,
			availableWidth: r.availableWidth
		};
	}

	/****TESTS**** (add a leading '/' to uncomment)
	DocumentContext.bottomMostContext = bottomMostContext;
	// */

	module.exports = DocumentContext;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* jslint node: true */
	'use strict';

	var ElementWriter = __webpack_require__(15);

	/**
	* Creates an instance of PageElementWriter - an extended ElementWriter
	* which can handle:
	* - page-breaks (it adds new pages when there's not enough space left),
	* - repeatable fragments (like table-headers, which are repeated everytime
	*                         a page-break occurs)
	* - transactions (used for unbreakable-blocks when we want to make sure
	*                 whole block will be rendered on the same page)
	*/
	function PageElementWriter(context, tracker) {
		this.transactionLevel = 0;
		this.repeatables = [];
		this.tracker = tracker;
		this.writer = new ElementWriter(context, tracker);
	}

	function fitOnPage(self, addFct){
	  var position = addFct(self);
	  if (!position) {
	    self.moveToNextPage();
	    position = addFct(self);
	  }
	  return position;
	}

	PageElementWriter.prototype.addLine = function(line, dontUpdateContextPosition, index) {
	  return fitOnPage(this, function(self){
	    return self.writer.addLine(line, dontUpdateContextPosition, index);
	  });
	};

	PageElementWriter.prototype.addImage = function(image, index) {
	  return fitOnPage(this, function(self){
	    return self.writer.addImage(image, index);
	  });
	};

	PageElementWriter.prototype.addQr = function(qr, index) {
	  return fitOnPage(this, function(self){
			return self.writer.addQr(qr, index);
		});
	};

	PageElementWriter.prototype.addVector = function(vector, ignoreContextX, ignoreContextY, index) {
		return this.writer.addVector(vector, ignoreContextX, ignoreContextY, index);
	};

	PageElementWriter.prototype.addFragment = function(fragment, useBlockXOffset, useBlockYOffset, dontUpdateContextPosition) {
		if (!this.writer.addFragment(fragment, useBlockXOffset, useBlockYOffset, dontUpdateContextPosition)) {
			this.moveToNextPage();
			this.writer.addFragment(fragment, useBlockXOffset, useBlockYOffset, dontUpdateContextPosition);
		}
	};

	PageElementWriter.prototype.moveToNextPage = function(pageOrientation) {
		
		var nextPage = this.writer.context.moveToNextPage(pageOrientation);
		
	  if (nextPage.newPageCreated) {
			this.repeatables.forEach(function(rep) {
				this.writer.addFragment(rep, true);
			}, this);
		} else {
			this.repeatables.forEach(function(rep) {
				this.writer.context.moveDown(rep.height);
			}, this);
		}

		this.writer.tracker.emit('pageChanged', {
			prevPage: nextPage.prevPage,
			prevY: nextPage.prevY,
			y: nextPage.y
		});
	};

	PageElementWriter.prototype.beginUnbreakableBlock = function(width, height) {
		if (this.transactionLevel++ === 0) {
			this.originalX = this.writer.context.x;
			this.writer.pushContext(width, height);
		}
	};

	PageElementWriter.prototype.commitUnbreakableBlock = function(forcedX, forcedY) {
		if (--this.transactionLevel === 0) {
			var unbreakableContext = this.writer.context;
			this.writer.popContext();

			var nbPages = unbreakableContext.pages.length;
			if(nbPages > 0) {
				// no support for multi-page unbreakableBlocks
				var fragment = unbreakableContext.pages[0];
				fragment.xOffset = forcedX;
				fragment.yOffset = forcedY;

				//TODO: vectors can influence height in some situations
				if(nbPages > 1) {
					// on out-of-context blocs (headers, footers, background) height should be the whole DocumentContext height
					if (forcedX !== undefined || forcedY !== undefined) {
						fragment.height = unbreakableContext.getCurrentPage().pageSize.height - unbreakableContext.pageMargins.top - unbreakableContext.pageMargins.bottom;
					} else {
						fragment.height = this.writer.context.getCurrentPage().pageSize.height - this.writer.context.pageMargins.top - this.writer.context.pageMargins.bottom;
						for (var i = 0, l = this.repeatables.length; i < l; i++) {
							fragment.height -= this.repeatables[i].height;
						}
					}
				} else {
					fragment.height = unbreakableContext.y;
				}

				if (forcedX !== undefined || forcedY !== undefined) {
					this.writer.addFragment(fragment, true, true, true);
				} else {
					this.addFragment(fragment);
				}
			}
		}
	};

	PageElementWriter.prototype.currentBlockToRepeatable = function() {
		var unbreakableContext = this.writer.context;
		var rep = { items: [] };

	    unbreakableContext.pages[0].items.forEach(function(item) {
	        rep.items.push(item);
	    });

		rep.xOffset = this.originalX;

		//TODO: vectors can influence height in some situations
		rep.height = unbreakableContext.y;

		return rep;
	};

	PageElementWriter.prototype.pushToRepeatables = function(rep) {
		this.repeatables.push(rep);
	};

	PageElementWriter.prototype.popFromRepeatables = function() {
		this.repeatables.pop();
	};

	PageElementWriter.prototype.context = function() {
		return this.writer.context;
	};

	module.exports = PageElementWriter;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* jslint node: true */
	'use strict';

	var Line = __webpack_require__(16);
	var pack = __webpack_require__(11).pack;
	var offsetVector = __webpack_require__(11).offsetVector;
	var DocumentContext = __webpack_require__(13);

	/**
	* Creates an instance of ElementWriter - a line/vector writer, which adds
	* elements to current page and sets their positions based on the context
	*/
	function ElementWriter(context, tracker) {
		this.context = context;
		this.contextStack = [];
		this.tracker = tracker;
	}

	function addPageItem(page, item, index) {
		if(index === null || index === undefined || index < 0 || index > page.items.length) {
			page.items.push(item);
		} else {
			page.items.splice(index, 0, item);
		}
	}

	ElementWriter.prototype.addLine = function(line, dontUpdateContextPosition, index) {
		var height = line.getHeight();
		var context = this.context;
		var page = context.getCurrentPage(),
	      position = this.getCurrentPositionOnPage();

		if (context.availableHeight < height || !page) {
			return false;
		}

		line.x = context.x + (line.x || 0);
		line.y = context.y + (line.y || 0);

		this.alignLine(line);

	    addPageItem(page, {
	        type: 'line',
	        item: line
	    }, index);
		this.tracker.emit('lineAdded', line);

		if (!dontUpdateContextPosition) context.moveDown(height);

		return position;
	};

	ElementWriter.prototype.alignLine = function(line) {
		var width = this.context.availableWidth;
		var lineWidth = line.getWidth();

		var alignment = line.inlines && line.inlines.length > 0 && line.inlines[0].alignment;

		var offset = 0;
		switch(alignment) {
			case 'right':
				offset = width - lineWidth;
				break;
			case 'center':
				offset = (width - lineWidth) / 2;
				break;
		}

		if (offset) {
			line.x = (line.x || 0) + offset;
		}

		if (alignment === 'justify' &&
			!line.newLineForced &&
			!line.lastLineInParagraph &&
			line.inlines.length > 1) {
			var additionalSpacing = (width - lineWidth) / (line.inlines.length - 1);

			for(var i = 1, l = line.inlines.length; i < l; i++) {
				offset = i * additionalSpacing;

				line.inlines[i].x += offset;
			}
		}
	};

	ElementWriter.prototype.addImage = function(image, index) {
		var context = this.context;
		var page = context.getCurrentPage(),
	      position = this.getCurrentPositionOnPage();

		if (context.availableHeight < image._height || !page) {
			return false;
		}

		image.x = context.x + (image.x || 0);
		image.y = context.y;

		this.alignImage(image);

		addPageItem(page, {
	        type: 'image',
	        item: image
	    }, index);

		context.moveDown(image._height);

		return position;
	};

	ElementWriter.prototype.addQr = function(qr, index) {
		var context = this.context;
		var page = context.getCurrentPage(),
	      position = this.getCurrentPositionOnPage();

		if (context.availableHeight < qr._height || !page) {
			return false;
		}

		qr.x = context.x + (qr.x || 0);
		qr.y = context.y;

		this.alignImage(qr);

		for (var i=0, l=qr._canvas.length; i < l; i++) {
			var vector = qr._canvas[i];
			vector.x += qr.x;
			vector.y += qr.y;
			this.addVector(vector, true, true, index);
		}

		context.moveDown(qr._height);

		return position;
	};

	ElementWriter.prototype.alignImage = function(image) {
		var width = this.context.availableWidth;
		var imageWidth = image._minWidth;
		var offset = 0;
		switch(image._alignment) {
			case 'right':
				offset = width - imageWidth;
				break;
			case 'center':
				offset = (width - imageWidth) / 2;
				break;
		}

		if (offset) {
			image.x = (image.x || 0) + offset;
		}
	};

	ElementWriter.prototype.addVector = function(vector, ignoreContextX, ignoreContextY, index) {
		var context = this.context;
		var page = context.getCurrentPage(),
	      position = this.getCurrentPositionOnPage();

		if (page) {
			offsetVector(vector, ignoreContextX ? 0 : context.x, ignoreContextY ? 0 : context.y);
	        addPageItem(page, {
	            type: 'vector',
	            item: vector
	        }, index);
			return position;
		}
	};

	function cloneLine(line) {
		var result = new Line(line.maxWidth);

		for(var key in line) {
			if (line.hasOwnProperty(key)) {
				result[key] = line[key];
			}
		}

		return result;
	}

	ElementWriter.prototype.addFragment = function(block, useBlockXOffset, useBlockYOffset, dontUpdateContextPosition) {
		var ctx = this.context;
		var page = ctx.getCurrentPage();

		if (!useBlockXOffset && block.height > ctx.availableHeight) return false;

		block.items.forEach(function(item) {
	        switch(item.type) {
	            case 'line':
	                var l = cloneLine(item.item);

	                l.x = (l.x || 0) + (useBlockXOffset ? (block.xOffset || 0) : ctx.x);
	                l.y = (l.y || 0) + (useBlockYOffset ? (block.yOffset || 0) : ctx.y);

	                page.items.push({
	                    type: 'line',
	                    item: l
	                });
	                break;

	            case 'vector':
	                var v = pack(item.item);

	                offsetVector(v, useBlockXOffset ? (block.xOffset || 0) : ctx.x, useBlockYOffset ? (block.yOffset || 0) : ctx.y);
	                page.items.push({
	                    type: 'vector',
	                    item: v
	                });
	                break;

	            case 'image':
	                var img = pack(item.item);

	                img.x = (img.x || 0) + (useBlockXOffset ? (block.xOffset || 0) : ctx.x);
	                img.y = (img.y || 0) + (useBlockYOffset ? (block.yOffset || 0) : ctx.y);

	                page.items.push({
	                    type: 'image',
	                    item: img
	                });
	                break;
	        }
		});

		if (!dontUpdateContextPosition) ctx.moveDown(block.height);

		return true;
	};

	/**
	* Pushes the provided context onto the stack or creates a new one
	*
	* pushContext(context) - pushes the provided context and makes it current
	* pushContext(width, height) - creates and pushes a new context with the specified width and height
	* pushContext() - creates a new context for unbreakable blocks (with current availableWidth and full-page-height)
	*/
	ElementWriter.prototype.pushContext = function(contextOrWidth, height) {
		if (contextOrWidth === undefined) {
			height = this.context.getCurrentPage().height - this.context.pageMargins.top - this.context.pageMargins.bottom;
			contextOrWidth = this.context.availableWidth;
		}

		if (typeof contextOrWidth === 'number' || contextOrWidth instanceof Number) {
			contextOrWidth = new DocumentContext({ width: contextOrWidth, height: height }, { left: 0, right: 0, top: 0, bottom: 0 });
		}

		this.contextStack.push(this.context);
		this.context = contextOrWidth;
	};

	ElementWriter.prototype.popContext = function() {
		this.context = this.contextStack.pop();
	};

	ElementWriter.prototype.getCurrentPositionOnPage = function(){
		return (this.contextStack[0] || this.context).getCurrentPosition();
	};


	module.exports = ElementWriter;


/***/ },
/* 16 */
/***/ function(module, exports) {

	/* jslint node: true */
	'use strict';

	/**
	* Creates an instance of Line
	*
	* @constructor
	* @this {Line}
	* @param {Number} Maximum width this line can have
	*/
	function Line(maxWidth) {
		this.maxWidth = maxWidth;
		this.leadingCut = 0;
		this.trailingCut = 0;
		this.inlineWidths = 0;
		this.inlines = [];
	}

	Line.prototype.getAscenderHeight = function() {
		var y = 0;

		this.inlines.forEach(function(inline) {
			y = Math.max(y, inline.font.ascender / 1000 * inline.fontSize);
		});
		return y;
	};

	Line.prototype.hasEnoughSpaceForInline = function(inline) {
		if (this.inlines.length === 0) return true;
		if (this.newLineForced) return false;

		return this.inlineWidths + inline.width - this.leadingCut - (inline.trailingCut || 0) <= this.maxWidth;
	};

	Line.prototype.addInline = function(inline) {
		if (this.inlines.length === 0) {
			this.leadingCut = inline.leadingCut || 0;
		}
		this.trailingCut = inline.trailingCut || 0;

		inline.x = this.inlineWidths - this.leadingCut;

		this.inlines.push(inline);
		this.inlineWidths += inline.width;

		if (inline.lineEnd) {
			this.newLineForced = true;
		}
	};

	Line.prototype.getWidth = function() {
		return this.inlineWidths - this.leadingCut - this.trailingCut;
	};

	/**
	* Returns line height
	* @return {Number}
	*/
	Line.prototype.getHeight = function() {
		var max = 0;

		this.inlines.forEach(function(item) {
			max = Math.max(max, item.height || 0);
		});

		return max;
	};

	module.exports = Line;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* jslint node: true */
	'use strict';

	var ColumnCalculator = __webpack_require__(10);

	function TableProcessor(tableNode) {
	  this.tableNode = tableNode;
	}

	TableProcessor.prototype.beginTable = function(writer) {
	  var tableNode;
	  var availableWidth;
	  var self = this;

	  tableNode = this.tableNode;
	  this.offsets = tableNode._offsets;
	  this.layout = tableNode._layout;

	  availableWidth = writer.context().availableWidth - this.offsets.total;
	  ColumnCalculator.buildColumnWidths(tableNode.table.widths, availableWidth);

	  this.tableWidth = tableNode._offsets.total + getTableInnerContentWidth();
	  this.rowSpanData = prepareRowSpanData();
	  this.cleanUpRepeatables = false;

	  this.headerRows = tableNode.table.headerRows || 0;
	  this.rowsWithoutPageBreak = this.headerRows + (tableNode.table.keepWithHeaderRows || 0);
	  this.dontBreakRows = tableNode.table.dontBreakRows || false;

	  if (this.rowsWithoutPageBreak) {
	    writer.beginUnbreakableBlock();
	  }

	  this.drawHorizontalLine(0, writer);

	  function getTableInnerContentWidth() {
	    var width = 0;

	    tableNode.table.widths.forEach(function(w) {
	      width += w._calcWidth;
	    });

	    return width;
	  }

	  function prepareRowSpanData() {
	    var rsd = [];
	    var x = 0;
	    var lastWidth = 0;

	    rsd.push({ left: 0, rowSpan: 0 });

	    for(var i = 0, l = self.tableNode.table.body[0].length; i < l; i++) {
	      var paddings = self.layout.paddingLeft(i, self.tableNode) + self.layout.paddingRight(i, self.tableNode);
	      var lBorder = self.layout.vLineWidth(i, self.tableNode);
	      lastWidth = paddings + lBorder + self.tableNode.table.widths[i]._calcWidth;
	      rsd[rsd.length - 1].width = lastWidth;
	      x += lastWidth;
	      rsd.push({ left: x, rowSpan: 0, width: 0 });
	    }

	    return rsd;
	  }
	};

	TableProcessor.prototype.onRowBreak = function(rowIndex, writer) {
	  var self = this;
	  return function() {
	    //console.log('moving by : ', topLineWidth, rowPaddingTop);
	    var offset = self.rowPaddingTop + (!self.headerRows ? self.topLineWidth : 0);
	    writer.context().moveDown(offset);
	  };

	};

	TableProcessor.prototype.beginRow = function(rowIndex, writer) {
	  this.topLineWidth = this.layout.hLineWidth(rowIndex, this.tableNode);
	  this.rowPaddingTop = this.layout.paddingTop(rowIndex, this.tableNode);
	  this.bottomLineWidth = this.layout.hLineWidth(rowIndex+1, this.tableNode);
	  this.rowPaddingBottom = this.layout.paddingBottom(rowIndex, this.tableNode);

	  this.rowCallback = this.onRowBreak(rowIndex, writer);
	  writer.tracker.startTracking('pageChanged', this.rowCallback );
	    if(this.dontBreakRows) {
	        writer.beginUnbreakableBlock();
	    }
	  this.rowTopY = writer.context().y;
	  this.reservedAtBottom = this.bottomLineWidth + this.rowPaddingBottom;

	  writer.context().availableHeight -= this.reservedAtBottom;

	  writer.context().moveDown(this.rowPaddingTop);
	};

	TableProcessor.prototype.drawHorizontalLine = function(lineIndex, writer, overrideY) {
	  var lineWidth = this.layout.hLineWidth(lineIndex, this.tableNode);
	  if (lineWidth) {
	    var offset = lineWidth / 2;
	    var currentLine = null;

	    for(var i = 0, l = this.rowSpanData.length; i < l; i++) {
	      var data = this.rowSpanData[i];
	      var shouldDrawLine = !data.rowSpan;

	      if (!currentLine && shouldDrawLine) {
	        currentLine = { left: data.left, width: 0 };
	      }

	      if (shouldDrawLine) {
	        currentLine.width += (data.width || 0);
	      }

	      var y = (overrideY || 0) + offset;

	      if (!shouldDrawLine || i === l - 1) {
	        if (currentLine) {
	          writer.addVector({
	            type: 'line',
	            x1: currentLine.left,
	            x2: currentLine.left + currentLine.width,
	            y1: y,
	            y2: y,
	            lineWidth: lineWidth,
	            lineColor: typeof this.layout.hLineColor === 'function' ? this.layout.hLineColor(lineIndex, this.tableNode) : this.layout.hLineColor
	          }, false, overrideY);
	          currentLine = null;
	        }
	      }
	    }

	    writer.context().moveDown(lineWidth);
	  }
	};

	TableProcessor.prototype.drawVerticalLine = function(x, y0, y1, vLineIndex, writer) {
	  var width = this.layout.vLineWidth(vLineIndex, this.tableNode);
	  if (width === 0) return;
	  writer.addVector({
	    type: 'line',
	    x1: x + width/2,
	    x2: x + width/2,
	    y1: y0,
	    y2: y1,
	    lineWidth: width,
	    lineColor: typeof this.layout.vLineColor === 'function' ? this.layout.vLineColor(vLineIndex, this.tableNode) : this.layout.vLineColor
	  }, false, true);
	};

	TableProcessor.prototype.endTable = function(writer) {
	  if (this.cleanUpRepeatables) {
	    writer.popFromRepeatables();
	  }
	};

	TableProcessor.prototype.endRow = function(rowIndex, writer, pageBreaks) {
	    var l, i;
	    var self = this;
	    writer.tracker.stopTracking('pageChanged', this.rowCallback);
	    writer.context().moveDown(this.layout.paddingBottom(rowIndex, this.tableNode));
	    writer.context().availableHeight += this.reservedAtBottom;

	    var endingPage = writer.context().page;
	    var endingY = writer.context().y;

	    var xs = getLineXs();

	    var ys = [];

	    var hasBreaks = pageBreaks && pageBreaks.length > 0;

	    ys.push({
	      y0: this.rowTopY,
	      page: hasBreaks ? pageBreaks[0].prevPage : endingPage
	    });

	    if (hasBreaks) {
	      for(i = 0, l = pageBreaks.length; i < l; i++) {
	        var pageBreak = pageBreaks[i];
	        ys[ys.length - 1].y1 = pageBreak.prevY;

	        ys.push({y0: pageBreak.y, page: pageBreak.prevPage + 1});
	      }
	    }

	    ys[ys.length - 1].y1 = endingY;

	    var skipOrphanePadding = (ys[0].y1 - ys[0].y0 === this.rowPaddingTop);
	    for(var yi = (skipOrphanePadding ? 1 : 0), yl = ys.length; yi < yl; yi++) {
	      var willBreak = yi < ys.length - 1;
	      var rowBreakWithoutHeader = (yi > 0 && !this.headerRows);
	      var hzLineOffset =  rowBreakWithoutHeader ? 0 : this.topLineWidth;
	      var y1 = ys[yi].y0;
	      var y2 = ys[yi].y1;

				if(willBreak) {
					y2 = y2 + this.rowPaddingBottom;
				}

	      if (writer.context().page != ys[yi].page) {
	        writer.context().page = ys[yi].page;

	        //TODO: buggy, availableHeight should be updated on every pageChanged event
	        // TableProcessor should be pageChanged listener, instead of processRow
	        this.reservedAtBottom = 0;
	      }

	      for(i = 0, l = xs.length; i < l; i++) {
	        this.drawVerticalLine(xs[i].x, y1 - hzLineOffset, y2 + this.bottomLineWidth, xs[i].index, writer);
	        if(i < l-1) {
	          var colIndex = xs[i].index;
	          var fillColor=  this.tableNode.table.body[rowIndex][colIndex].fillColor;
	          if(fillColor ) {
	            var wBorder = this.layout.vLineWidth(colIndex, this.tableNode);
	            var xf = xs[i].x+wBorder;
	            var yf = y1 - hzLineOffset;
	            writer.addVector({
	              type: 'rect',
	              x: xf,
	              y: yf,
	              w: xs[i+1].x-xf,
	              h: y2+this.bottomLineWidth-yf,
	              lineWidth: 0,
	              color: fillColor
	            }, false, true, 0);
	          }
	        }
	      }

	      if (willBreak && this.layout.hLineWhenBroken !== false) {
	        this.drawHorizontalLine(rowIndex + 1, writer, y2);
	      }
	      if(rowBreakWithoutHeader && this.layout.hLineWhenBroken !== false) {
	        this.drawHorizontalLine(rowIndex, writer, y1);
	      }
	    }

	    writer.context().page = endingPage;
	    writer.context().y = endingY;

	    var row = this.tableNode.table.body[rowIndex];
	    for(i = 0, l = row.length; i < l; i++) {
	      if (row[i].rowSpan) {
	        this.rowSpanData[i].rowSpan = row[i].rowSpan;

	        // fix colSpans
	        if (row[i].colSpan && row[i].colSpan > 1) {
	          for(var j = 1; j < row[i].rowSpan; j++) {
	            this.tableNode.table.body[rowIndex + j][i]._colSpan = row[i].colSpan;
	          }
	        }
	      }

	      if(this.rowSpanData[i].rowSpan > 0) {
	        this.rowSpanData[i].rowSpan--;
	      }
	    }

	    this.drawHorizontalLine(rowIndex + 1, writer);

	    if(this.headerRows && rowIndex === this.headerRows - 1) {
	      this.headerRepeatable = writer.currentBlockToRepeatable();
	    }

	    if(this.dontBreakRows) {
	      writer.tracker.auto('pageChanged',
	        function() {
	          self.drawHorizontalLine(rowIndex, writer);
	        },
	        function() {
	          writer.commitUnbreakableBlock();
	          self.drawHorizontalLine(rowIndex, writer);
	        }
	      );
	    }

	    if(this.headerRepeatable && (rowIndex === (this.rowsWithoutPageBreak - 1) || rowIndex === this.tableNode.table.body.length - 1)) {
	      writer.commitUnbreakableBlock();
	      writer.pushToRepeatables(this.headerRepeatable);
	      this.cleanUpRepeatables = true;
	      this.headerRepeatable = null;
	    }

	    function getLineXs() {
	      var result = [];
	      var cols = 0;

	      for(var i = 0, l = self.tableNode.table.body[rowIndex].length; i < l; i++) {
	        if (!cols) {
	          result.push({ x: self.rowSpanData[i].left, index: i});

	          var item = self.tableNode.table.body[rowIndex][i];
	          cols = (item._colSpan || item.colSpan || 0);
	        }
	        if (cols > 0) {
	          cols--;
	        }
	      }

	      result.push({ x: self.rowSpanData[self.rowSpanData.length - 1].left, index: self.rowSpanData.length - 1});

	      return result;
	    }
	};

	module.exports = TableProcessor;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0

	/*
	PDFDocument - represents an entire PDF document
	By Devon Govett
	 */

	(function() {
	  var PDFDocument, PDFObject, PDFPage, PDFReference, fs, stream,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  stream = __webpack_require__(19);

	  fs = __webpack_require__(20);

	  PDFObject = __webpack_require__(21);

	  PDFReference = __webpack_require__(22);

	  PDFPage = __webpack_require__(24);

	  PDFDocument = (function(superClass) {
	    var mixin;

	    extend(PDFDocument, superClass);

	    function PDFDocument(options1) {
	      var key, ref1, ref2, val;
	      this.options = options1 != null ? options1 : {};
	      PDFDocument.__super__.constructor.apply(this, arguments);
	      this.version = 1.3;
	      this.compress = (ref1 = this.options.compress) != null ? ref1 : true;
	      this._pageBuffer = [];
	      this._pageBufferStart = 0;
	      this._offsets = [];
	      this._waiting = 0;
	      this._ended = false;
	      this._offset = 0;
	      this._root = this.ref({
	        Type: 'Catalog',
	        Pages: this.ref({
	          Type: 'Pages',
	          Count: 0,
	          Kids: []
	        })
	      });
	      this.page = null;
	      this.initColor();
	      this.initVector();
	      this.initFonts();
	      this.initText();
	      this.initImages();
	      this.info = {
	        Producer: 'PDFKit',
	        Creator: 'PDFKit',
	        CreationDate: new Date()
	      };
	      if (this.options.info) {
	        ref2 = this.options.info;
	        for (key in ref2) {
	          val = ref2[key];
	          this.info[key] = val;
	        }
	      }
	      this._write("%PDF-" + this.version);
	      this._write("%\xFF\xFF\xFF\xFF");
	      if (this.options.autoFirstPage !== false) {
	        this.addPage();
	      }
	    }

	    mixin = function(methods) {
	      var method, name, results;
	      results = [];
	      for (name in methods) {
	        method = methods[name];
	        results.push(PDFDocument.prototype[name] = method);
	      }
	      return results;
	    };

	    mixin(__webpack_require__(25));

	    mixin(__webpack_require__(27));

	    mixin(__webpack_require__(29));

	    mixin(__webpack_require__(49));

	    mixin(__webpack_require__(57));

	    mixin(__webpack_require__(62));

	    PDFDocument.prototype.addPage = function(options) {
	      var pages;
	      if (options == null) {
	        options = this.options;
	      }
	      if (!this.options.bufferPages) {
	        this.flushPages();
	      }
	      this.page = new PDFPage(this, options);
	      this._pageBuffer.push(this.page);
	      pages = this._root.data.Pages.data;
	      pages.Kids.push(this.page.dictionary);
	      pages.Count++;
	      this.x = this.page.margins.left;
	      this.y = this.page.margins.top;
	      this._ctm = [1, 0, 0, 1, 0, 0];
	      this.transform(1, 0, 0, -1, 0, this.page.height);
	      this.emit('pageAdded');
	      return this;
	    };

	    PDFDocument.prototype.bufferedPageRange = function() {
	      return {
	        start: this._pageBufferStart,
	        count: this._pageBuffer.length
	      };
	    };

	    PDFDocument.prototype.switchToPage = function(n) {
	      var page;
	      if (!(page = this._pageBuffer[n - this._pageBufferStart])) {
	        throw new Error("switchToPage(" + n + ") out of bounds, current buffer covers pages " + this._pageBufferStart + " to " + (this._pageBufferStart + this._pageBuffer.length - 1));
	      }
	      return this.page = page;
	    };

	    PDFDocument.prototype.flushPages = function() {
	      var i, len, page, pages;
	      pages = this._pageBuffer;
	      this._pageBuffer = [];
	      this._pageBufferStart += pages.length;
	      for (i = 0, len = pages.length; i < len; i++) {
	        page = pages[i];
	        page.end();
	      }
	    };

	    PDFDocument.prototype.ref = function(data) {
	      var ref;
	      ref = new PDFReference(this, this._offsets.length + 1, data);
	      this._offsets.push(null);
	      this._waiting++;
	      return ref;
	    };

	    PDFDocument.prototype._read = function() {};

	    PDFDocument.prototype._write = function(data) {
	      if (!Buffer.isBuffer(data)) {
	        data = new Buffer(data + '\n', 'binary');
	      }
	      this.push(data);
	      return this._offset += data.length;
	    };

	    PDFDocument.prototype.addContent = function(data) {
	      this.page.write(data);
	      return this;
	    };

	    PDFDocument.prototype._refEnd = function(ref) {
	      this._offsets[ref.id - 1] = ref.offset;
	      if (--this._waiting === 0 && this._ended) {
	        this._finalize();
	        return this._ended = false;
	      }
	    };

	    PDFDocument.prototype.write = function(filename, fn) {
	      var err;
	      err = new Error('PDFDocument#write is deprecated, and will be removed in a future version of PDFKit. Please pipe the document into a Node stream.');
	      console.warn(err.stack);
	      this.pipe(fs.createWriteStream(filename));
	      this.end();
	      return this.once('end', fn);
	    };

	    PDFDocument.prototype.output = function(fn) {
	      throw new Error('PDFDocument#output is deprecated, and has been removed from PDFKit. Please pipe the document into a Node stream.');
	    };

	    PDFDocument.prototype.end = function() {
	      var font, key, name, ref1, ref2, val;
	      this.flushPages();
	      this._info = this.ref();
	      ref1 = this.info;
	      for (key in ref1) {
	        val = ref1[key];
	        if (typeof val === 'string') {
	          val = new String(val);
	        }
	        this._info.data[key] = val;
	      }
	      this._info.end();
	      ref2 = this._fontFamilies;
	      for (name in ref2) {
	        font = ref2[name];
	        font.embed();
	      }
	      this._root.end();
	      this._root.data.Pages.end();
	      if (this._waiting === 0) {
	        return this._finalize();
	      } else {
	        return this._ended = true;
	      }
	    };

	    PDFDocument.prototype._finalize = function(fn) {
	      var i, len, offset, ref1, xRefOffset;
	      xRefOffset = this._offset;
	      this._write("xref");
	      this._write("0 " + (this._offsets.length + 1));
	      this._write("0000000000 65535 f ");
	      ref1 = this._offsets;
	      for (i = 0, len = ref1.length; i < len; i++) {
	        offset = ref1[i];
	        offset = ('0000000000' + offset).slice(-10);
	        this._write(offset + ' 00000 n ');
	      }
	      this._write('trailer');
	      this._write(PDFObject.convert({
	        Size: this._offsets.length + 1,
	        Root: this._root,
	        Info: this._info
	      }));
	      this._write('startxref');
	      this._write("" + xRefOffset);
	      this._write('%%EOF');
	      return this.push(null);
	    };

	    PDFDocument.prototype.toString = function() {
	      return "[object PDFDocument]";
	    };

	    return PDFDocument;

	  })(stream.Readable);

	  module.exports = PDFDocument;

	}).call(this);


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_19__;

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0

	/*
	PDFObject - converts JavaScript types into their corrisponding PDF types.
	By Devon Govett
	 */

	(function() {
	  var PDFObject, PDFReference;

	  PDFObject = (function() {
	    var escapable, escapableRe, pad, swapBytes;

	    function PDFObject() {}

	    pad = function(str, length) {
	      return (Array(length + 1).join('0') + str).slice(-length);
	    };

	    escapableRe = /[\n\r\t\b\f\(\)\\]/g;

	    escapable = {
	      '\n': '\\n',
	      '\r': '\\r',
	      '\t': '\\t',
	      '\b': '\\b',
	      '\f': '\\f',
	      '\\': '\\\\',
	      '(': '\\(',
	      ')': '\\)'
	    };

	    swapBytes = function(buff) {
	      var a, i, j, l, ref;
	      l = buff.length;
	      if (l & 0x01) {
	        throw new Error("Buffer length must be even");
	      } else {
	        for (i = j = 0, ref = l - 1; j < ref; i = j += 2) {
	          a = buff[i];
	          buff[i] = buff[i + 1];
	          buff[i + 1] = a;
	        }
	      }
	      return buff;
	    };

	    PDFObject.convert = function(object) {
	      var e, i, isUnicode, items, j, key, out, ref, string, val;
	      if (typeof object === 'string') {
	        return '/' + object;
	      } else if (object instanceof String) {
	        string = object.replace(escapableRe, function(c) {
	          return escapable[c];
	        });
	        isUnicode = false;
	        for (i = j = 0, ref = string.length; j < ref; i = j += 1) {
	          if (string.charCodeAt(i) > 0x7f) {
	            isUnicode = true;
	            break;
	          }
	        }
	        if (isUnicode) {
	          string = swapBytes(new Buffer('\ufeff' + string, 'utf16le')).toString('binary');
	        }
	        return '(' + string + ')';
	      } else if (Buffer.isBuffer(object)) {
	        return '<' + object.toString('hex') + '>';
	      } else if (object instanceof PDFReference) {
	        return object.toString();
	      } else if (object instanceof Date) {
	        return '(D:' + pad(object.getUTCFullYear(), 4) + pad(object.getUTCMonth(), 2) + pad(object.getUTCDate(), 2) + pad(object.getUTCHours(), 2) + pad(object.getUTCMinutes(), 2) + pad(object.getUTCSeconds(), 2) + 'Z)';
	      } else if (Array.isArray(object)) {
	        items = ((function() {
	          var k, len, results;
	          results = [];
	          for (k = 0, len = object.length; k < len; k++) {
	            e = object[k];
	            results.push(PDFObject.convert(e));
	          }
	          return results;
	        })()).join(' ');
	        return '[' + items + ']';
	      } else if ({}.toString.call(object) === '[object Object]') {
	        out = ['<<'];
	        for (key in object) {
	          val = object[key];
	          out.push('/' + key + ' ' + PDFObject.convert(val));
	        }
	        out.push('>>');
	        return out.join('\n');
	      } else {
	        return '' + object;
	      }
	    };

	    return PDFObject;

	  })();

	  module.exports = PDFObject;

	  PDFReference = __webpack_require__(22);

	}).call(this);


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0

	/*
	PDFReference - represents a reference to another object in the PDF object heirarchy
	By Devon Govett
	 */

	(function() {
	  var PDFObject, PDFReference, zlib,
	    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	  zlib = __webpack_require__(23);

	  PDFReference = (function() {
	    function PDFReference(document, id, data) {
	      this.document = document;
	      this.id = id;
	      this.data = data != null ? data : {};
	      this.finalize = bind(this.finalize, this);
	      this.gen = 0;
	      this.deflate = null;
	      this.compress = this.document.compress && !this.data.Filter;
	      this.uncompressedLength = 0;
	      this.chunks = [];
	    }

	    PDFReference.prototype.initDeflate = function() {
	      this.data.Filter = 'FlateDecode';
	      this.deflate = zlib.createDeflate();
	      this.deflate.on('data', (function(_this) {
	        return function(chunk) {
	          _this.chunks.push(chunk);
	          return _this.data.Length += chunk.length;
	        };
	      })(this));
	      return this.deflate.on('end', this.finalize);
	    };

	    PDFReference.prototype.write = function(chunk) {
	      var base;
	      if (!Buffer.isBuffer(chunk)) {
	        chunk = new Buffer(chunk + '\n', 'binary');
	      }
	      this.uncompressedLength += chunk.length;
	      if ((base = this.data).Length == null) {
	        base.Length = 0;
	      }
	      if (this.compress) {
	        if (!this.deflate) {
	          this.initDeflate();
	        }
	        return this.deflate.write(chunk);
	      } else {
	        this.chunks.push(chunk);
	        return this.data.Length += chunk.length;
	      }
	    };

	    PDFReference.prototype.end = function(chunk) {
	      if (typeof chunk === 'string' || Buffer.isBuffer(chunk)) {
	        this.write(chunk);
	      }
	      if (this.deflate) {
	        return this.deflate.end();
	      } else {
	        return this.finalize();
	      }
	    };

	    PDFReference.prototype.finalize = function() {
	      var chunk, i, len, ref;
	      this.offset = this.document._offset;
	      this.document._write(this.id + " " + this.gen + " obj");
	      this.document._write(PDFObject.convert(this.data));
	      if (this.chunks.length) {
	        this.document._write('stream');
	        ref = this.chunks;
	        for (i = 0, len = ref.length; i < len; i++) {
	          chunk = ref[i];
	          this.document._write(chunk);
	        }
	        this.chunks.length = 0;
	        this.document._write('\nendstream');
	      }
	      this.document._write('endobj');
	      return this.document._refEnd(this);
	    };

	    PDFReference.prototype.toString = function() {
	      return this.id + " " + this.gen + " R";
	    };

	    return PDFReference;

	  })();

	  module.exports = PDFReference;

	  PDFObject = __webpack_require__(21);

	}).call(this);


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_23__;

/***/ },
/* 24 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.10.0

	/*
	PDFPage - represents a single page in the PDF document
	By Devon Govett
	 */

	(function() {
	  var PDFPage;

	  PDFPage = (function() {
	    var DEFAULT_MARGINS, SIZES;

	    function PDFPage(document, options) {
	      var dimensions;
	      this.document = document;
	      if (options == null) {
	        options = {};
	      }
	      this.size = options.size || 'letter';
	      this.layout = options.layout || 'portrait';
	      if (typeof options.margin === 'number') {
	        this.margins = {
	          top: options.margin,
	          left: options.margin,
	          bottom: options.margin,
	          right: options.margin
	        };
	      } else {
	        this.margins = options.margins || DEFAULT_MARGINS;
	      }
	      dimensions = Array.isArray(this.size) ? this.size : SIZES[this.size.toUpperCase()];
	      this.width = dimensions[this.layout === 'portrait' ? 0 : 1];
	      this.height = dimensions[this.layout === 'portrait' ? 1 : 0];
	      this.content = this.document.ref();
	      this.resources = this.document.ref({
	        ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI']
	      });
	      Object.defineProperties(this, {
	        fonts: {
	          get: (function(_this) {
	            return function() {
	              var base;
	              return (base = _this.resources.data).Font != null ? base.Font : base.Font = {};
	            };
	          })(this)
	        },
	        xobjects: {
	          get: (function(_this) {
	            return function() {
	              var base;
	              return (base = _this.resources.data).XObject != null ? base.XObject : base.XObject = {};
	            };
	          })(this)
	        },
	        ext_gstates: {
	          get: (function(_this) {
	            return function() {
	              var base;
	              return (base = _this.resources.data).ExtGState != null ? base.ExtGState : base.ExtGState = {};
	            };
	          })(this)
	        },
	        patterns: {
	          get: (function(_this) {
	            return function() {
	              var base;
	              return (base = _this.resources.data).Pattern != null ? base.Pattern : base.Pattern = {};
	            };
	          })(this)
	        },
	        annotations: {
	          get: (function(_this) {
	            return function() {
	              var base;
	              return (base = _this.dictionary.data).Annots != null ? base.Annots : base.Annots = [];
	            };
	          })(this)
	        }
	      });
	      this.dictionary = this.document.ref({
	        Type: 'Page',
	        Parent: this.document._root.data.Pages,
	        MediaBox: [0, 0, this.width, this.height],
	        Contents: this.content,
	        Resources: this.resources
	      });
	    }

	    PDFPage.prototype.maxY = function() {
	      return this.height - this.margins.bottom;
	    };

	    PDFPage.prototype.write = function(chunk) {
	      return this.content.write(chunk);
	    };

	    PDFPage.prototype.end = function() {
	      this.dictionary.end();
	      this.resources.end();
	      return this.content.end();
	    };

	    DEFAULT_MARGINS = {
	      top: 72,
	      left: 72,
	      bottom: 72,
	      right: 72
	    };

	    SIZES = {
	      '4A0': [4767.87, 6740.79],
	      '2A0': [3370.39, 4767.87],
	      A0: [2383.94, 3370.39],
	      A1: [1683.78, 2383.94],
	      A2: [1190.55, 1683.78],
	      A3: [841.89, 1190.55],
	      A4: [595.28, 841.89],
	      A5: [419.53, 595.28],
	      A6: [297.64, 419.53],
	      A7: [209.76, 297.64],
	      A8: [147.40, 209.76],
	      A9: [104.88, 147.40],
	      A10: [73.70, 104.88],
	      B0: [2834.65, 4008.19],
	      B1: [2004.09, 2834.65],
	      B2: [1417.32, 2004.09],
	      B3: [1000.63, 1417.32],
	      B4: [708.66, 1000.63],
	      B5: [498.90, 708.66],
	      B6: [354.33, 498.90],
	      B7: [249.45, 354.33],
	      B8: [175.75, 249.45],
	      B9: [124.72, 175.75],
	      B10: [87.87, 124.72],
	      C0: [2599.37, 3676.54],
	      C1: [1836.85, 2599.37],
	      C2: [1298.27, 1836.85],
	      C3: [918.43, 1298.27],
	      C4: [649.13, 918.43],
	      C5: [459.21, 649.13],
	      C6: [323.15, 459.21],
	      C7: [229.61, 323.15],
	      C8: [161.57, 229.61],
	      C9: [113.39, 161.57],
	      C10: [79.37, 113.39],
	      RA0: [2437.80, 3458.27],
	      RA1: [1729.13, 2437.80],
	      RA2: [1218.90, 1729.13],
	      RA3: [864.57, 1218.90],
	      RA4: [609.45, 864.57],
	      SRA0: [2551.18, 3628.35],
	      SRA1: [1814.17, 2551.18],
	      SRA2: [1275.59, 1814.17],
	      SRA3: [907.09, 1275.59],
	      SRA4: [637.80, 907.09],
	      EXECUTIVE: [521.86, 756.00],
	      FOLIO: [612.00, 936.00],
	      LEGAL: [612.00, 1008.00],
	      LETTER: [612.00, 792.00],
	      TABLOID: [792.00, 1224.00]
	    };

	    return PDFPage;

	  })();

	  module.exports = PDFPage;

	}).call(this);


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var PDFGradient, PDFLinearGradient, PDFRadialGradient, namedColors, ref;

	  ref = __webpack_require__(26), PDFGradient = ref.PDFGradient, PDFLinearGradient = ref.PDFLinearGradient, PDFRadialGradient = ref.PDFRadialGradient;

	  module.exports = {
	    initColor: function() {
	      this._opacityRegistry = {};
	      this._opacityCount = 0;
	      return this._gradCount = 0;
	    },
	    _normalizeColor: function(color) {
	      var hex, part;
	      if (color instanceof PDFGradient) {
	        return color;
	      }
	      if (typeof color === 'string') {
	        if (color.charAt(0) === '#') {
	          if (color.length === 4) {
	            color = color.replace(/#([0-9A-F])([0-9A-F])([0-9A-F])/i, "#$1$1$2$2$3$3");
	          }
	          hex = parseInt(color.slice(1), 16);
	          color = [hex >> 16, hex >> 8 & 0xff, hex & 0xff];
	        } else if (namedColors[color]) {
	          color = namedColors[color];
	        }
	      }
	      if (Array.isArray(color)) {
	        if (color.length === 3) {
	          color = (function() {
	            var i, len, results;
	            results = [];
	            for (i = 0, len = color.length; i < len; i++) {
	              part = color[i];
	              results.push(part / 255);
	            }
	            return results;
	          })();
	        } else if (color.length === 4) {
	          color = (function() {
	            var i, len, results;
	            results = [];
	            for (i = 0, len = color.length; i < len; i++) {
	              part = color[i];
	              results.push(part / 100);
	            }
	            return results;
	          })();
	        }
	        return color;
	      }
	      return null;
	    },
	    _setColor: function(color, stroke) {
	      var gstate, name, op, space;
	      color = this._normalizeColor(color);
	      if (!color) {
	        return false;
	      }
	      if (this._sMasked) {
	        gstate = this.ref({
	          Type: 'ExtGState',
	          SMask: 'None'
	        });
	        gstate.end();
	        name = "Gs" + (++this._opacityCount);
	        this.page.ext_gstates[name] = gstate;
	        this.addContent("/" + name + " gs");
	        this._sMasked = false;
	      }
	      op = stroke ? 'SCN' : 'scn';
	      if (color instanceof PDFGradient) {
	        this._setColorSpace('Pattern', stroke);
	        color.apply(op);
	      } else {
	        space = color.length === 4 ? 'DeviceCMYK' : 'DeviceRGB';
	        this._setColorSpace(space, stroke);
	        color = color.join(' ');
	        this.addContent(color + " " + op);
	      }
	      return true;
	    },
	    _setColorSpace: function(space, stroke) {
	      var op;
	      op = stroke ? 'CS' : 'cs';
	      return this.addContent("/" + space + " " + op);
	    },
	    fillColor: function(color, opacity) {
	      var set;
	      if (opacity == null) {
	        opacity = 1;
	      }
	      set = this._setColor(color, false);
	      if (set) {
	        this.fillOpacity(opacity);
	      }
	      this._fillColor = [color, opacity];
	      return this;
	    },
	    strokeColor: function(color, opacity) {
	      var set;
	      if (opacity == null) {
	        opacity = 1;
	      }
	      set = this._setColor(color, true);
	      if (set) {
	        this.strokeOpacity(opacity);
	      }
	      return this;
	    },
	    opacity: function(opacity) {
	      this._doOpacity(opacity, opacity);
	      return this;
	    },
	    fillOpacity: function(opacity) {
	      this._doOpacity(opacity, null);
	      return this;
	    },
	    strokeOpacity: function(opacity) {
	      this._doOpacity(null, opacity);
	      return this;
	    },
	    _doOpacity: function(fillOpacity, strokeOpacity) {
	      var dictionary, id, key, name, ref1;
	      if (!((fillOpacity != null) || (strokeOpacity != null))) {
	        return;
	      }
	      if (fillOpacity != null) {
	        fillOpacity = Math.max(0, Math.min(1, fillOpacity));
	      }
	      if (strokeOpacity != null) {
	        strokeOpacity = Math.max(0, Math.min(1, strokeOpacity));
	      }
	      key = fillOpacity + "_" + strokeOpacity;
	      if (this._opacityRegistry[key]) {
	        ref1 = this._opacityRegistry[key], dictionary = ref1[0], name = ref1[1];
	      } else {
	        dictionary = {
	          Type: 'ExtGState'
	        };
	        if (fillOpacity != null) {
	          dictionary.ca = fillOpacity;
	        }
	        if (strokeOpacity != null) {
	          dictionary.CA = strokeOpacity;
	        }
	        dictionary = this.ref(dictionary);
	        dictionary.end();
	        id = ++this._opacityCount;
	        name = "Gs" + id;
	        this._opacityRegistry[key] = [dictionary, name];
	      }
	      this.page.ext_gstates[name] = dictionary;
	      return this.addContent("/" + name + " gs");
	    },
	    linearGradient: function(x1, y1, x2, y2) {
	      return new PDFLinearGradient(this, x1, y1, x2, y2);
	    },
	    radialGradient: function(x1, y1, r1, x2, y2, r2) {
	      return new PDFRadialGradient(this, x1, y1, r1, x2, y2, r2);
	    }
	  };

	  namedColors = {
	    aliceblue: [240, 248, 255],
	    antiquewhite: [250, 235, 215],
	    aqua: [0, 255, 255],
	    aquamarine: [127, 255, 212],
	    azure: [240, 255, 255],
	    beige: [245, 245, 220],
	    bisque: [255, 228, 196],
	    black: [0, 0, 0],
	    blanchedalmond: [255, 235, 205],
	    blue: [0, 0, 255],
	    blueviolet: [138, 43, 226],
	    brown: [165, 42, 42],
	    burlywood: [222, 184, 135],
	    cadetblue: [95, 158, 160],
	    chartreuse: [127, 255, 0],
	    chocolate: [210, 105, 30],
	    coral: [255, 127, 80],
	    cornflowerblue: [100, 149, 237],
	    cornsilk: [255, 248, 220],
	    crimson: [220, 20, 60],
	    cyan: [0, 255, 255],
	    darkblue: [0, 0, 139],
	    darkcyan: [0, 139, 139],
	    darkgoldenrod: [184, 134, 11],
	    darkgray: [169, 169, 169],
	    darkgreen: [0, 100, 0],
	    darkgrey: [169, 169, 169],
	    darkkhaki: [189, 183, 107],
	    darkmagenta: [139, 0, 139],
	    darkolivegreen: [85, 107, 47],
	    darkorange: [255, 140, 0],
	    darkorchid: [153, 50, 204],
	    darkred: [139, 0, 0],
	    darksalmon: [233, 150, 122],
	    darkseagreen: [143, 188, 143],
	    darkslateblue: [72, 61, 139],
	    darkslategray: [47, 79, 79],
	    darkslategrey: [47, 79, 79],
	    darkturquoise: [0, 206, 209],
	    darkviolet: [148, 0, 211],
	    deeppink: [255, 20, 147],
	    deepskyblue: [0, 191, 255],
	    dimgray: [105, 105, 105],
	    dimgrey: [105, 105, 105],
	    dodgerblue: [30, 144, 255],
	    firebrick: [178, 34, 34],
	    floralwhite: [255, 250, 240],
	    forestgreen: [34, 139, 34],
	    fuchsia: [255, 0, 255],
	    gainsboro: [220, 220, 220],
	    ghostwhite: [248, 248, 255],
	    gold: [255, 215, 0],
	    goldenrod: [218, 165, 32],
	    gray: [128, 128, 128],
	    grey: [128, 128, 128],
	    green: [0, 128, 0],
	    greenyellow: [173, 255, 47],
	    honeydew: [240, 255, 240],
	    hotpink: [255, 105, 180],
	    indianred: [205, 92, 92],
	    indigo: [75, 0, 130],
	    ivory: [255, 255, 240],
	    khaki: [240, 230, 140],
	    lavender: [230, 230, 250],
	    lavenderblush: [255, 240, 245],
	    lawngreen: [124, 252, 0],
	    lemonchiffon: [255, 250, 205],
	    lightblue: [173, 216, 230],
	    lightcoral: [240, 128, 128],
	    lightcyan: [224, 255, 255],
	    lightgoldenrodyellow: [250, 250, 210],
	    lightgray: [211, 211, 211],
	    lightgreen: [144, 238, 144],
	    lightgrey: [211, 211, 211],
	    lightpink: [255, 182, 193],
	    lightsalmon: [255, 160, 122],
	    lightseagreen: [32, 178, 170],
	    lightskyblue: [135, 206, 250],
	    lightslategray: [119, 136, 153],
	    lightslategrey: [119, 136, 153],
	    lightsteelblue: [176, 196, 222],
	    lightyellow: [255, 255, 224],
	    lime: [0, 255, 0],
	    limegreen: [50, 205, 50],
	    linen: [250, 240, 230],
	    magenta: [255, 0, 255],
	    maroon: [128, 0, 0],
	    mediumaquamarine: [102, 205, 170],
	    mediumblue: [0, 0, 205],
	    mediumorchid: [186, 85, 211],
	    mediumpurple: [147, 112, 219],
	    mediumseagreen: [60, 179, 113],
	    mediumslateblue: [123, 104, 238],
	    mediumspringgreen: [0, 250, 154],
	    mediumturquoise: [72, 209, 204],
	    mediumvioletred: [199, 21, 133],
	    midnightblue: [25, 25, 112],
	    mintcream: [245, 255, 250],
	    mistyrose: [255, 228, 225],
	    moccasin: [255, 228, 181],
	    navajowhite: [255, 222, 173],
	    navy: [0, 0, 128],
	    oldlace: [253, 245, 230],
	    olive: [128, 128, 0],
	    olivedrab: [107, 142, 35],
	    orange: [255, 165, 0],
	    orangered: [255, 69, 0],
	    orchid: [218, 112, 214],
	    palegoldenrod: [238, 232, 170],
	    palegreen: [152, 251, 152],
	    paleturquoise: [175, 238, 238],
	    palevioletred: [219, 112, 147],
	    papayawhip: [255, 239, 213],
	    peachpuff: [255, 218, 185],
	    peru: [205, 133, 63],
	    pink: [255, 192, 203],
	    plum: [221, 160, 221],
	    powderblue: [176, 224, 230],
	    purple: [128, 0, 128],
	    red: [255, 0, 0],
	    rosybrown: [188, 143, 143],
	    royalblue: [65, 105, 225],
	    saddlebrown: [139, 69, 19],
	    salmon: [250, 128, 114],
	    sandybrown: [244, 164, 96],
	    seagreen: [46, 139, 87],
	    seashell: [255, 245, 238],
	    sienna: [160, 82, 45],
	    silver: [192, 192, 192],
	    skyblue: [135, 206, 235],
	    slateblue: [106, 90, 205],
	    slategray: [112, 128, 144],
	    slategrey: [112, 128, 144],
	    snow: [255, 250, 250],
	    springgreen: [0, 255, 127],
	    steelblue: [70, 130, 180],
	    tan: [210, 180, 140],
	    teal: [0, 128, 128],
	    thistle: [216, 191, 216],
	    tomato: [255, 99, 71],
	    turquoise: [64, 224, 208],
	    violet: [238, 130, 238],
	    wheat: [245, 222, 179],
	    white: [255, 255, 255],
	    whitesmoke: [245, 245, 245],
	    yellow: [255, 255, 0],
	    yellowgreen: [154, 205, 50]
	  };

	}).call(this);


/***/ },
/* 26 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var PDFGradient, PDFLinearGradient, PDFRadialGradient,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  PDFGradient = (function() {
	    function PDFGradient(doc) {
	      this.doc = doc;
	      this.stops = [];
	      this.embedded = false;
	      this.transform = [1, 0, 0, 1, 0, 0];
	      this._colorSpace = 'DeviceRGB';
	    }

	    PDFGradient.prototype.stop = function(pos, color, opacity) {
	      if (opacity == null) {
	        opacity = 1;
	      }
	      opacity = Math.max(0, Math.min(1, opacity));
	      this.stops.push([pos, this.doc._normalizeColor(color), opacity]);
	      return this;
	    };

	    PDFGradient.prototype.embed = function() {
	      var bounds, dx, dy, encode, fn, form, grad, group, gstate, i, j, k, last, len, m, m0, m1, m11, m12, m2, m21, m22, m3, m4, m5, name, pattern, ref, ref1, ref2, resources, sMask, shader, stop, stops, v;
	      if (this.embedded || this.stops.length === 0) {
	        return;
	      }
	      this.embedded = true;
	      last = this.stops[this.stops.length - 1];
	      if (last[0] < 1) {
	        this.stops.push([1, last[1], last[2]]);
	      }
	      bounds = [];
	      encode = [];
	      stops = [];
	      for (i = j = 0, ref = this.stops.length - 1; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	        encode.push(0, 1);
	        if (i + 2 !== this.stops.length) {
	          bounds.push(this.stops[i + 1][0]);
	        }
	        fn = this.doc.ref({
	          FunctionType: 2,
	          Domain: [0, 1],
	          C0: this.stops[i + 0][1],
	          C1: this.stops[i + 1][1],
	          N: 1
	        });
	        stops.push(fn);
	        fn.end();
	      }
	      if (stops.length === 1) {
	        fn = stops[0];
	      } else {
	        fn = this.doc.ref({
	          FunctionType: 3,
	          Domain: [0, 1],
	          Functions: stops,
	          Bounds: bounds,
	          Encode: encode
	        });
	        fn.end();
	      }
	      this.id = 'Sh' + (++this.doc._gradCount);
	      m = this.doc._ctm.slice();
	      m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3], m4 = m[4], m5 = m[5];
	      ref1 = this.transform, m11 = ref1[0], m12 = ref1[1], m21 = ref1[2], m22 = ref1[3], dx = ref1[4], dy = ref1[5];
	      m[0] = m0 * m11 + m2 * m12;
	      m[1] = m1 * m11 + m3 * m12;
	      m[2] = m0 * m21 + m2 * m22;
	      m[3] = m1 * m21 + m3 * m22;
	      m[4] = m0 * dx + m2 * dy + m4;
	      m[5] = m1 * dx + m3 * dy + m5;
	      shader = this.shader(fn);
	      shader.end();
	      pattern = this.doc.ref({
	        Type: 'Pattern',
	        PatternType: 2,
	        Shading: shader,
	        Matrix: (function() {
	          var k, len, results;
	          results = [];
	          for (k = 0, len = m.length; k < len; k++) {
	            v = m[k];
	            results.push(+v.toFixed(5));
	          }
	          return results;
	        })()
	      });
	      this.doc.page.patterns[this.id] = pattern;
	      pattern.end();
	      if (this.stops.some(function(stop) {
	        return stop[2] < 1;
	      })) {
	        grad = this.opacityGradient();
	        grad._colorSpace = 'DeviceGray';
	        ref2 = this.stops;
	        for (k = 0, len = ref2.length; k < len; k++) {
	          stop = ref2[k];
	          grad.stop(stop[0], [stop[2]]);
	        }
	        grad = grad.embed();
	        group = this.doc.ref({
	          Type: 'Group',
	          S: 'Transparency',
	          CS: 'DeviceGray'
	        });
	        group.end();
	        resources = this.doc.ref({
	          ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI'],
	          Shading: {
	            Sh1: grad.data.Shading
	          }
	        });
	        resources.end();
	        form = this.doc.ref({
	          Type: 'XObject',
	          Subtype: 'Form',
	          FormType: 1,
	          BBox: [0, 0, this.doc.page.width, this.doc.page.height],
	          Group: group,
	          Resources: resources
	        });
	        form.end("/Sh1 sh");
	        sMask = this.doc.ref({
	          Type: 'Mask',
	          S: 'Luminosity',
	          G: form
	        });
	        sMask.end();
	        gstate = this.doc.ref({
	          Type: 'ExtGState',
	          SMask: sMask
	        });
	        this.opacity_id = ++this.doc._opacityCount;
	        name = "Gs" + this.opacity_id;
	        this.doc.page.ext_gstates[name] = gstate;
	        gstate.end();
	      }
	      return pattern;
	    };

	    PDFGradient.prototype.apply = function(op) {
	      if (!this.embedded) {
	        this.embed();
	      }
	      this.doc.addContent("/" + this.id + " " + op);
	      if (this.opacity_id) {
	        this.doc.addContent("/Gs" + this.opacity_id + " gs");
	        return this.doc._sMasked = true;
	      }
	    };

	    return PDFGradient;

	  })();

	  PDFLinearGradient = (function(superClass) {
	    extend(PDFLinearGradient, superClass);

	    function PDFLinearGradient(doc, x1, y1, x2, y2) {
	      this.doc = doc;
	      this.x1 = x1;
	      this.y1 = y1;
	      this.x2 = x2;
	      this.y2 = y2;
	      PDFLinearGradient.__super__.constructor.apply(this, arguments);
	    }

	    PDFLinearGradient.prototype.shader = function(fn) {
	      return this.doc.ref({
	        ShadingType: 2,
	        ColorSpace: this._colorSpace,
	        Coords: [this.x1, this.y1, this.x2, this.y2],
	        Function: fn,
	        Extend: [true, true]
	      });
	    };

	    PDFLinearGradient.prototype.opacityGradient = function() {
	      return new PDFLinearGradient(this.doc, this.x1, this.y1, this.x2, this.y2);
	    };

	    return PDFLinearGradient;

	  })(PDFGradient);

	  PDFRadialGradient = (function(superClass) {
	    extend(PDFRadialGradient, superClass);

	    function PDFRadialGradient(doc, x1, y1, r1, x2, y2, r2) {
	      this.doc = doc;
	      this.x1 = x1;
	      this.y1 = y1;
	      this.r1 = r1;
	      this.x2 = x2;
	      this.y2 = y2;
	      this.r2 = r2;
	      PDFRadialGradient.__super__.constructor.apply(this, arguments);
	    }

	    PDFRadialGradient.prototype.shader = function(fn) {
	      return this.doc.ref({
	        ShadingType: 3,
	        ColorSpace: this._colorSpace,
	        Coords: [this.x1, this.y1, this.r1, this.x2, this.y2, this.r2],
	        Function: fn,
	        Extend: [true, true]
	      });
	    };

	    PDFRadialGradient.prototype.opacityGradient = function() {
	      return new PDFRadialGradient(this.doc, this.x1, this.y1, this.r1, this.x2, this.y2, this.r2);
	    };

	    return PDFRadialGradient;

	  })(PDFGradient);

	  module.exports = {
	    PDFGradient: PDFGradient,
	    PDFLinearGradient: PDFLinearGradient,
	    PDFRadialGradient: PDFRadialGradient
	  };

	}).call(this);


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var KAPPA, SVGPath,
	    slice = [].slice;

	  SVGPath = __webpack_require__(28);

	  KAPPA = 4.0 * ((Math.sqrt(2) - 1.0) / 3.0);

	  module.exports = {
	    initVector: function() {
	      this._ctm = [1, 0, 0, 1, 0, 0];
	      return this._ctmStack = [];
	    },
	    save: function() {
	      this._ctmStack.push(this._ctm.slice());
	      return this.addContent('q');
	    },
	    restore: function() {
	      this._ctm = this._ctmStack.pop() || [1, 0, 0, 1, 0, 0];
	      return this.addContent('Q');
	    },
	    closePath: function() {
	      return this.addContent('h');
	    },
	    lineWidth: function(w) {
	      return this.addContent(w + " w");
	    },
	    _CAP_STYLES: {
	      BUTT: 0,
	      ROUND: 1,
	      SQUARE: 2
	    },
	    lineCap: function(c) {
	      if (typeof c === 'string') {
	        c = this._CAP_STYLES[c.toUpperCase()];
	      }
	      return this.addContent(c + " J");
	    },
	    _JOIN_STYLES: {
	      MITER: 0,
	      ROUND: 1,
	      BEVEL: 2
	    },
	    lineJoin: function(j) {
	      if (typeof j === 'string') {
	        j = this._JOIN_STYLES[j.toUpperCase()];
	      }
	      return this.addContent(j + " j");
	    },
	    miterLimit: function(m) {
	      return this.addContent(m + " M");
	    },
	    dash: function(length, options) {
	      var phase, ref, space;
	      if (options == null) {
	        options = {};
	      }
	      if (length == null) {
	        return this;
	      }
	      space = (ref = options.space) != null ? ref : length;
	      phase = options.phase || 0;
	      return this.addContent("[" + length + " " + space + "] " + phase + " d");
	    },
	    undash: function() {
	      return this.addContent("[] 0 d");
	    },
	    moveTo: function(x, y) {
	      return this.addContent(x + " " + y + " m");
	    },
	    lineTo: function(x, y) {
	      return this.addContent(x + " " + y + " l");
	    },
	    bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
	      return this.addContent(cp1x + " " + cp1y + " " + cp2x + " " + cp2y + " " + x + " " + y + " c");
	    },
	    quadraticCurveTo: function(cpx, cpy, x, y) {
	      return this.addContent(cpx + " " + cpy + " " + x + " " + y + " v");
	    },
	    rect: function(x, y, w, h) {
	      return this.addContent(x + " " + y + " " + w + " " + h + " re");
	    },
	    roundedRect: function(x, y, w, h, r) {
	      if (r == null) {
	        r = 0;
	      }
	      this.moveTo(x + r, y);
	      this.lineTo(x + w - r, y);
	      this.quadraticCurveTo(x + w, y, x + w, y + r);
	      this.lineTo(x + w, y + h - r);
	      this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	      this.lineTo(x + r, y + h);
	      this.quadraticCurveTo(x, y + h, x, y + h - r);
	      this.lineTo(x, y + r);
	      return this.quadraticCurveTo(x, y, x + r, y);
	    },
	    ellipse: function(x, y, r1, r2) {
	      var ox, oy, xe, xm, ye, ym;
	      if (r2 == null) {
	        r2 = r1;
	      }
	      x -= r1;
	      y -= r2;
	      ox = r1 * KAPPA;
	      oy = r2 * KAPPA;
	      xe = x + r1 * 2;
	      ye = y + r2 * 2;
	      xm = x + r1;
	      ym = y + r2;
	      this.moveTo(x, ym);
	      this.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	      this.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	      this.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	      this.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	      return this.closePath();
	    },
	    circle: function(x, y, radius) {
	      return this.ellipse(x, y, radius);
	    },
	    polygon: function() {
	      var i, len, point, points;
	      points = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	      this.moveTo.apply(this, points.shift());
	      for (i = 0, len = points.length; i < len; i++) {
	        point = points[i];
	        this.lineTo.apply(this, point);
	      }
	      return this.closePath();
	    },
	    path: function(path) {
	      SVGPath.apply(this, path);
	      return this;
	    },
	    _windingRule: function(rule) {
	      if (/even-?odd/.test(rule)) {
	        return '*';
	      }
	      return '';
	    },
	    fill: function(color, rule) {
	      if (/(even-?odd)|(non-?zero)/.test(color)) {
	        rule = color;
	        color = null;
	      }
	      if (color) {
	        this.fillColor(color);
	      }
	      return this.addContent('f' + this._windingRule(rule));
	    },
	    stroke: function(color) {
	      if (color) {
	        this.strokeColor(color);
	      }
	      return this.addContent('S');
	    },
	    fillAndStroke: function(fillColor, strokeColor, rule) {
	      var isFillRule;
	      if (strokeColor == null) {
	        strokeColor = fillColor;
	      }
	      isFillRule = /(even-?odd)|(non-?zero)/;
	      if (isFillRule.test(fillColor)) {
	        rule = fillColor;
	        fillColor = null;
	      }
	      if (isFillRule.test(strokeColor)) {
	        rule = strokeColor;
	        strokeColor = fillColor;
	      }
	      if (fillColor) {
	        this.fillColor(fillColor);
	        this.strokeColor(strokeColor);
	      }
	      return this.addContent('B' + this._windingRule(rule));
	    },
	    clip: function(rule) {
	      return this.addContent('W' + this._windingRule(rule) + ' n');
	    },
	    transform: function(m11, m12, m21, m22, dx, dy) {
	      var m, m0, m1, m2, m3, m4, m5, v, values;
	      m = this._ctm;
	      m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3], m4 = m[4], m5 = m[5];
	      m[0] = m0 * m11 + m2 * m12;
	      m[1] = m1 * m11 + m3 * m12;
	      m[2] = m0 * m21 + m2 * m22;
	      m[3] = m1 * m21 + m3 * m22;
	      m[4] = m0 * dx + m2 * dy + m4;
	      m[5] = m1 * dx + m3 * dy + m5;
	      values = ((function() {
	        var i, len, ref, results;
	        ref = [m11, m12, m21, m22, dx, dy];
	        results = [];
	        for (i = 0, len = ref.length; i < len; i++) {
	          v = ref[i];
	          results.push(+v.toFixed(5));
	        }
	        return results;
	      })()).join(' ');
	      return this.addContent(values + " cm");
	    },
	    translate: function(x, y) {
	      return this.transform(1, 0, 0, 1, x, y);
	    },
	    rotate: function(angle, options) {
	      var cos, rad, ref, sin, x, x1, y, y1;
	      if (options == null) {
	        options = {};
	      }
	      rad = angle * Math.PI / 180;
	      cos = Math.cos(rad);
	      sin = Math.sin(rad);
	      x = y = 0;
	      if (options.origin != null) {
	        ref = options.origin, x = ref[0], y = ref[1];
	        x1 = x * cos - y * sin;
	        y1 = x * sin + y * cos;
	        x -= x1;
	        y -= y1;
	      }
	      return this.transform(cos, sin, -sin, cos, x, y);
	    },
	    scale: function(xFactor, yFactor, options) {
	      var ref, x, y;
	      if (yFactor == null) {
	        yFactor = xFactor;
	      }
	      if (options == null) {
	        options = {};
	      }
	      if (arguments.length === 2) {
	        yFactor = xFactor;
	        options = yFactor;
	      }
	      x = y = 0;
	      if (options.origin != null) {
	        ref = options.origin, x = ref[0], y = ref[1];
	        x -= xFactor * x;
	        y -= yFactor * y;
	      }
	      return this.transform(xFactor, 0, 0, yFactor, x, y);
	    }
	  };

	}).call(this);


/***/ },
/* 28 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var SVGPath;

	  SVGPath = (function() {
	    var apply, arcToSegments, cx, cy, parameters, parse, px, py, runners, segmentToBezier, solveArc, sx, sy;

	    function SVGPath() {}

	    SVGPath.apply = function(doc, path) {
	      var commands;
	      commands = parse(path);
	      return apply(commands, doc);
	    };

	    parameters = {
	      A: 7,
	      a: 7,
	      C: 6,
	      c: 6,
	      H: 1,
	      h: 1,
	      L: 2,
	      l: 2,
	      M: 2,
	      m: 2,
	      Q: 4,
	      q: 4,
	      S: 4,
	      s: 4,
	      T: 2,
	      t: 2,
	      V: 1,
	      v: 1,
	      Z: 0,
	      z: 0
	    };

	    parse = function(path) {
	      var args, c, cmd, curArg, foundDecimal, j, len, params, ret;
	      ret = [];
	      args = [];
	      curArg = "";
	      foundDecimal = false;
	      params = 0;
	      for (j = 0, len = path.length; j < len; j++) {
	        c = path[j];
	        if (parameters[c] != null) {
	          params = parameters[c];
	          if (cmd) {
	            if (curArg.length > 0) {
	              args[args.length] = +curArg;
	            }
	            ret[ret.length] = {
	              cmd: cmd,
	              args: args
	            };
	            args = [];
	            curArg = "";
	            foundDecimal = false;
	          }
	          cmd = c;
	        } else if ((c === " " || c === ",") || (c === "-" && curArg.length > 0 && curArg[curArg.length - 1] !== 'e') || (c === "." && foundDecimal)) {
	          if (curArg.length === 0) {
	            continue;
	          }
	          if (args.length === params) {
	            ret[ret.length] = {
	              cmd: cmd,
	              args: args
	            };
	            args = [+curArg];
	            if (cmd === "M") {
	              cmd = "L";
	            }
	            if (cmd === "m") {
	              cmd = "l";
	            }
	          } else {
	            args[args.length] = +curArg;
	          }
	          foundDecimal = c === ".";
	          curArg = c === '-' || c === '.' ? c : '';
	        } else {
	          curArg += c;
	          if (c === '.') {
	            foundDecimal = true;
	          }
	        }
	      }
	      if (curArg.length > 0) {
	        if (args.length === params) {
	          ret[ret.length] = {
	            cmd: cmd,
	            args: args
	          };
	          args = [+curArg];
	          if (cmd === "M") {
	            cmd = "L";
	          }
	          if (cmd === "m") {
	            cmd = "l";
	          }
	        } else {
	          args[args.length] = +curArg;
	        }
	      }
	      ret[ret.length] = {
	        cmd: cmd,
	        args: args
	      };
	      return ret;
	    };

	    cx = cy = px = py = sx = sy = 0;

	    apply = function(commands, doc) {
	      var c, i, j, len, name;
	      cx = cy = px = py = sx = sy = 0;
	      for (i = j = 0, len = commands.length; j < len; i = ++j) {
	        c = commands[i];
	        if (typeof runners[name = c.cmd] === "function") {
	          runners[name](doc, c.args);
	        }
	      }
	      return cx = cy = px = py = 0;
	    };

	    runners = {
	      M: function(doc, a) {
	        cx = a[0];
	        cy = a[1];
	        px = py = null;
	        sx = cx;
	        sy = cy;
	        return doc.moveTo(cx, cy);
	      },
	      m: function(doc, a) {
	        cx += a[0];
	        cy += a[1];
	        px = py = null;
	        sx = cx;
	        sy = cy;
	        return doc.moveTo(cx, cy);
	      },
	      C: function(doc, a) {
	        cx = a[4];
	        cy = a[5];
	        px = a[2];
	        py = a[3];
	        return doc.bezierCurveTo.apply(doc, a);
	      },
	      c: function(doc, a) {
	        doc.bezierCurveTo(a[0] + cx, a[1] + cy, a[2] + cx, a[3] + cy, a[4] + cx, a[5] + cy);
	        px = cx + a[2];
	        py = cy + a[3];
	        cx += a[4];
	        return cy += a[5];
	      },
	      S: function(doc, a) {
	        if (px === null) {
	          px = cx;
	          py = cy;
	        }
	        doc.bezierCurveTo(cx - (px - cx), cy - (py - cy), a[0], a[1], a[2], a[3]);
	        px = a[0];
	        py = a[1];
	        cx = a[2];
	        return cy = a[3];
	      },
	      s: function(doc, a) {
	        if (px === null) {
	          px = cx;
	          py = cy;
	        }
	        doc.bezierCurveTo(cx - (px - cx), cy - (py - cy), cx + a[0], cy + a[1], cx + a[2], cy + a[3]);
	        px = cx + a[0];
	        py = cy + a[1];
	        cx += a[2];
	        return cy += a[3];
	      },
	      Q: function(doc, a) {
	        px = a[0];
	        py = a[1];
	        cx = a[2];
	        cy = a[3];
	        return doc.quadraticCurveTo(a[0], a[1], cx, cy);
	      },
	      q: function(doc, a) {
	        doc.quadraticCurveTo(a[0] + cx, a[1] + cy, a[2] + cx, a[3] + cy);
	        px = cx + a[0];
	        py = cy + a[1];
	        cx += a[2];
	        return cy += a[3];
	      },
	      T: function(doc, a) {
	        if (px === null) {
	          px = cx;
	          py = cy;
	        } else {
	          px = cx - (px - cx);
	          py = cy - (py - cy);
	        }
	        doc.quadraticCurveTo(px, py, a[0], a[1]);
	        px = cx - (px - cx);
	        py = cy - (py - cy);
	        cx = a[0];
	        return cy = a[1];
	      },
	      t: function(doc, a) {
	        if (px === null) {
	          px = cx;
	          py = cy;
	        } else {
	          px = cx - (px - cx);
	          py = cy - (py - cy);
	        }
	        doc.quadraticCurveTo(px, py, cx + a[0], cy + a[1]);
	        cx += a[0];
	        return cy += a[1];
	      },
	      A: function(doc, a) {
	        solveArc(doc, cx, cy, a);
	        cx = a[5];
	        return cy = a[6];
	      },
	      a: function(doc, a) {
	        a[5] += cx;
	        a[6] += cy;
	        solveArc(doc, cx, cy, a);
	        cx = a[5];
	        return cy = a[6];
	      },
	      L: function(doc, a) {
	        cx = a[0];
	        cy = a[1];
	        px = py = null;
	        return doc.lineTo(cx, cy);
	      },
	      l: function(doc, a) {
	        cx += a[0];
	        cy += a[1];
	        px = py = null;
	        return doc.lineTo(cx, cy);
	      },
	      H: function(doc, a) {
	        cx = a[0];
	        px = py = null;
	        return doc.lineTo(cx, cy);
	      },
	      h: function(doc, a) {
	        cx += a[0];
	        px = py = null;
	        return doc.lineTo(cx, cy);
	      },
	      V: function(doc, a) {
	        cy = a[0];
	        px = py = null;
	        return doc.lineTo(cx, cy);
	      },
	      v: function(doc, a) {
	        cy += a[0];
	        px = py = null;
	        return doc.lineTo(cx, cy);
	      },
	      Z: function(doc) {
	        doc.closePath();
	        cx = sx;
	        return cy = sy;
	      },
	      z: function(doc) {
	        doc.closePath();
	        cx = sx;
	        return cy = sy;
	      }
	    };

	    solveArc = function(doc, x, y, coords) {
	      var bez, ex, ey, j, large, len, results, rot, rx, ry, seg, segs, sweep;
	      rx = coords[0], ry = coords[1], rot = coords[2], large = coords[3], sweep = coords[4], ex = coords[5], ey = coords[6];
	      segs = arcToSegments(ex, ey, rx, ry, large, sweep, rot, x, y);
	      results = [];
	      for (j = 0, len = segs.length; j < len; j++) {
	        seg = segs[j];
	        bez = segmentToBezier.apply(null, seg);
	        results.push(doc.bezierCurveTo.apply(doc, bez));
	      }
	      return results;
	    };

	    arcToSegments = function(x, y, rx, ry, large, sweep, rotateX, ox, oy) {
	      var a00, a01, a10, a11, cos_th, d, i, j, pl, ref, result, segments, sfactor, sfactor_sq, sin_th, th, th0, th1, th2, th3, th_arc, x0, x1, xc, y0, y1, yc;
	      th = rotateX * (Math.PI / 180);
	      sin_th = Math.sin(th);
	      cos_th = Math.cos(th);
	      rx = Math.abs(rx);
	      ry = Math.abs(ry);
	      px = cos_th * (ox - x) * 0.5 + sin_th * (oy - y) * 0.5;
	      py = cos_th * (oy - y) * 0.5 - sin_th * (ox - x) * 0.5;
	      pl = (px * px) / (rx * rx) + (py * py) / (ry * ry);
	      if (pl > 1) {
	        pl = Math.sqrt(pl);
	        rx *= pl;
	        ry *= pl;
	      }
	      a00 = cos_th / rx;
	      a01 = sin_th / rx;
	      a10 = (-sin_th) / ry;
	      a11 = cos_th / ry;
	      x0 = a00 * ox + a01 * oy;
	      y0 = a10 * ox + a11 * oy;
	      x1 = a00 * x + a01 * y;
	      y1 = a10 * x + a11 * y;
	      d = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
	      sfactor_sq = 1 / d - 0.25;
	      if (sfactor_sq < 0) {
	        sfactor_sq = 0;
	      }
	      sfactor = Math.sqrt(sfactor_sq);
	      if (sweep === large) {
	        sfactor = -sfactor;
	      }
	      xc = 0.5 * (x0 + x1) - sfactor * (y1 - y0);
	      yc = 0.5 * (y0 + y1) + sfactor * (x1 - x0);
	      th0 = Math.atan2(y0 - yc, x0 - xc);
	      th1 = Math.atan2(y1 - yc, x1 - xc);
	      th_arc = th1 - th0;
	      if (th_arc < 0 && sweep === 1) {
	        th_arc += 2 * Math.PI;
	      } else if (th_arc > 0 && sweep === 0) {
	        th_arc -= 2 * Math.PI;
	      }
	      segments = Math.ceil(Math.abs(th_arc / (Math.PI * 0.5 + 0.001)));
	      result = [];
	      for (i = j = 0, ref = segments; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	        th2 = th0 + i * th_arc / segments;
	        th3 = th0 + (i + 1) * th_arc / segments;
	        result[i] = [xc, yc, th2, th3, rx, ry, sin_th, cos_th];
	      }
	      return result;
	    };

	    segmentToBezier = function(cx, cy, th0, th1, rx, ry, sin_th, cos_th) {
	      var a00, a01, a10, a11, t, th_half, x1, x2, x3, y1, y2, y3;
	      a00 = cos_th * rx;
	      a01 = -sin_th * ry;
	      a10 = sin_th * rx;
	      a11 = cos_th * ry;
	      th_half = 0.5 * (th1 - th0);
	      t = (8 / 3) * Math.sin(th_half * 0.5) * Math.sin(th_half * 0.5) / Math.sin(th_half);
	      x1 = cx + Math.cos(th0) - t * Math.sin(th0);
	      y1 = cy + Math.sin(th0) + t * Math.cos(th0);
	      x3 = cx + Math.cos(th1);
	      y3 = cy + Math.sin(th1);
	      x2 = x3 + t * Math.sin(th1);
	      y2 = y3 - t * Math.cos(th1);
	      return [a00 * x1 + a01 * y1, a10 * x1 + a11 * y1, a00 * x2 + a01 * y2, a10 * x2 + a11 * y2, a00 * x3 + a01 * y3, a10 * x3 + a11 * y3];
	    };

	    return SVGPath;

	  })();

	  module.exports = SVGPath;

	}).call(this);


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var PDFFont;

	  PDFFont = __webpack_require__(30);

	  module.exports = {
	    initFonts: function() {
	      this._fontFamilies = {};
	      this._fontCount = 0;
	      this._fontSize = 12;
	      this._font = null;
	      this._registeredFonts = {};
	      
	    },
	    font: function(src, family, size) {
	      var cacheKey, font, id, ref;
	      if (typeof family === 'number') {
	        size = family;
	        family = null;
	      }
	      if (typeof src === 'string' && this._registeredFonts[src]) {
	        cacheKey = src;
	        ref = this._registeredFonts[src], src = ref.src, family = ref.family;
	      } else {
	        cacheKey = family || src;
	        if (typeof cacheKey !== 'string') {
	          cacheKey = null;
	        }
	      }
	      if (size != null) {
	        this.fontSize(size);
	      }
	      if (font = this._fontFamilies[cacheKey]) {
	        this._font = font;
	        return this;
	      }
	      id = 'F' + (++this._fontCount);
	      this._font = new PDFFont(this, src, family, id);
	      if (font = this._fontFamilies[this._font.name]) {
	        this._font = font;
	        return this;
	      }
	      if (cacheKey) {
	        this._fontFamilies[cacheKey] = this._font;
	      }
	      this._fontFamilies[this._font.name] = this._font;
	      return this;
	    },
	    fontSize: function(_fontSize) {
	      this._fontSize = _fontSize;
	      return this;
	    },
	    currentLineHeight: function(includeGap) {
	      if (includeGap == null) {
	        includeGap = false;
	      }
	      return this._font.lineHeight(this._fontSize, includeGap);
	    },
	    registerFont: function(name, src, family) {
	      this._registeredFonts[name] = {
	        src: src,
	        family: family
	      };
	      return this;
	    }
	  };

	}).call(this);


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {// Generated by CoffeeScript 1.10.0

	/*
	PDFFont - embeds fonts in PDF documents
	By Devon Govett
	 */

	(function() {
	  var AFMFont, PDFFont, Subset, TTFFont, fs;

	  TTFFont = __webpack_require__(31);

	  AFMFont = __webpack_require__(47);

	  Subset = __webpack_require__(48);

	  fs = __webpack_require__(20);

	  PDFFont = (function() {
	    var STANDARD_FONTS, toUnicodeCmap;

	    function PDFFont(document, src, family, id) {
	      this.document = document;
	      this.id = id;
	      if (typeof src === 'string') {
	        if (src in STANDARD_FONTS) {
	          this.isAFM = true;
	          this.font = new AFMFont(STANDARD_FONTS[src]());
	          this.registerAFM(src);
	          return;
	        } else if (/\.(ttf|ttc)$/i.test(src)) {
	          this.font = TTFFont.open(src, family);
	        } else if (/\.dfont$/i.test(src)) {
	          this.font = TTFFont.fromDFont(src, family);
	        } else {
	          throw new Error('Not a supported font format or standard PDF font.');
	        }
	      } else if (Buffer.isBuffer(src)) {
	        this.font = TTFFont.fromBuffer(src, family);
	      } else if (src instanceof Uint8Array) {
	        this.font = TTFFont.fromBuffer(new Buffer(src), family);
	      } else if (src instanceof ArrayBuffer) {
	        this.font = TTFFont.fromBuffer(new Buffer(new Uint8Array(src)), family);
	      } else {
	        throw new Error('Not a supported font format or standard PDF font.');
	      }
	      this.subset = new Subset(this.font);
	      this.registerTTF();
	    }

	    STANDARD_FONTS = {
	      "Courier": function() {
	        return fs.readFileSync(__dirname + "/font/data/Courier.afm", 'utf8');
	      },
	      "Courier-Bold": function() {
	        return fs.readFileSync(__dirname + "/font/data/Courier-Bold.afm", 'utf8');
	      },
	      "Courier-Oblique": function() {
	        return fs.readFileSync(__dirname + "/font/data/Courier-Oblique.afm", 'utf8');
	      },
	      "Courier-BoldOblique": function() {
	        return fs.readFileSync(__dirname + "/font/data/Courier-BoldOblique.afm", 'utf8');
	      },
	      "Helvetica": function() {
	        return fs.readFileSync(__dirname + "/font/data/Helvetica.afm", 'utf8');
	      },
	      "Helvetica-Bold": function() {
	        return fs.readFileSync(__dirname + "/font/data/Helvetica-Bold.afm", 'utf8');
	      },
	      "Helvetica-Oblique": function() {
	        return fs.readFileSync(__dirname + "/font/data/Helvetica-Oblique.afm", 'utf8');
	      },
	      "Helvetica-BoldOblique": function() {
	        return fs.readFileSync(__dirname + "/font/data/Helvetica-BoldOblique.afm", 'utf8');
	      },
	      "Times-Roman": function() {
	        return fs.readFileSync(__dirname + "/font/data/Times-Roman.afm", 'utf8');
	      },
	      "Times-Bold": function() {
	        return fs.readFileSync(__dirname + "/font/data/Times-Bold.afm", 'utf8');
	      },
	      "Times-Italic": function() {
	        return fs.readFileSync(__dirname + "/font/data/Times-Italic.afm", 'utf8');
	      },
	      "Times-BoldItalic": function() {
	        return fs.readFileSync(__dirname + "/font/data/Times-BoldItalic.afm", 'utf8');
	      },
	      "Symbol": function() {
	        return fs.readFileSync(__dirname + "/font/data/Symbol.afm", 'utf8');
	      },
	      "ZapfDingbats": function() {
	        return fs.readFileSync(__dirname + "/font/data/ZapfDingbats.afm", 'utf8');
	      }
	    };

	    PDFFont.prototype.use = function(characters) {
	      var ref;
	      return (ref = this.subset) != null ? ref.use(characters) : void 0;
	    };

	    PDFFont.prototype.embed = function() {
	      if (this.embedded || (this.dictionary == null)) {
	        return;
	      }
	      if (this.isAFM) {
	        this.embedAFM();
	      } else {
	        this.embedTTF();
	      }
	      return this.embedded = true;
	    };

	    PDFFont.prototype.encode = function(text) {
	      var ref;
	      if (this.isAFM) {
	        return this.font.encodeText(text);
	      } else {
	        return ((ref = this.subset) != null ? ref.encodeText(text) : void 0) || text;
	      }
	    };

	    PDFFont.prototype.ref = function() {
	      return this.dictionary != null ? this.dictionary : this.dictionary = this.document.ref();
	    };

	    PDFFont.prototype.registerTTF = function() {
	      var e, hi, low, raw, ref;
	      this.name = this.font.name.postscriptName;
	      this.scaleFactor = 1000.0 / this.font.head.unitsPerEm;
	      this.bbox = (function() {
	        var j, len, ref, results;
	        ref = this.font.bbox;
	        results = [];
	        for (j = 0, len = ref.length; j < len; j++) {
	          e = ref[j];
	          results.push(Math.round(e * this.scaleFactor));
	        }
	        return results;
	      }).call(this);
	      this.stemV = 0;
	      if (this.font.post.exists) {
	        raw = this.font.post.italic_angle;
	        hi = raw >> 16;
	        low = raw & 0xFF;
	        if (hi & 0x8000 !== 0) {
	          hi = -((hi ^ 0xFFFF) + 1);
	        }
	        this.italicAngle = +(hi + "." + low);
	      } else {
	        this.italicAngle = 0;
	      }
	      this.ascender = Math.round(this.font.ascender * this.scaleFactor);
	      this.decender = Math.round(this.font.decender * this.scaleFactor);
	      this.lineGap = Math.round(this.font.lineGap * this.scaleFactor);
	      this.capHeight = (this.font.os2.exists && this.font.os2.capHeight) || this.ascender;
	      this.xHeight = (this.font.os2.exists && this.font.os2.xHeight) || 0;
	      this.familyClass = (this.font.os2.exists && this.font.os2.familyClass || 0) >> 8;
	      this.isSerif = (ref = this.familyClass) === 1 || ref === 2 || ref === 3 || ref === 4 || ref === 5 || ref === 7;
	      this.isScript = this.familyClass === 10;
	      this.flags = 0;
	      if (this.font.post.isFixedPitch) {
	        this.flags |= 1 << 0;
	      }
	      if (this.isSerif) {
	        this.flags |= 1 << 1;
	      }
	      if (this.isScript) {
	        this.flags |= 1 << 3;
	      }
	      if (this.italicAngle !== 0) {
	        this.flags |= 1 << 6;
	      }
	      this.flags |= 1 << 5;
	      if (!this.font.cmap.unicode) {
	        throw new Error('No unicode cmap for font');
	      }
	    };

	    PDFFont.prototype.embedTTF = function() {
	      var charWidths, cmap, code, data, descriptor, firstChar, fontfile, glyph;
	      data = this.subset.encode();
	      fontfile = this.document.ref();
	      fontfile.write(data);
	      fontfile.data.Length1 = fontfile.uncompressedLength;
	      fontfile.end();
	      descriptor = this.document.ref({
	        Type: 'FontDescriptor',
	        FontName: this.subset.postscriptName,
	        FontFile2: fontfile,
	        FontBBox: this.bbox,
	        Flags: this.flags,
	        StemV: this.stemV,
	        ItalicAngle: this.italicAngle,
	        Ascent: this.ascender,
	        Descent: this.decender,
	        CapHeight: this.capHeight,
	        XHeight: this.xHeight
	      });
	      descriptor.end();
	      firstChar = +Object.keys(this.subset.cmap)[0];
	      charWidths = (function() {
	        var ref, results;
	        ref = this.subset.cmap;
	        results = [];
	        for (code in ref) {
	          glyph = ref[code];
	          results.push(Math.round(this.font.widthOfGlyph(glyph)));
	        }
	        return results;
	      }).call(this);
	      cmap = this.document.ref();
	      cmap.end(toUnicodeCmap(this.subset.subset));
	      this.dictionary.data = {
	        Type: 'Font',
	        BaseFont: this.subset.postscriptName,
	        Subtype: 'TrueType',
	        FontDescriptor: descriptor,
	        FirstChar: firstChar,
	        LastChar: firstChar + charWidths.length - 1,
	        Widths: charWidths,
	        Encoding: 'MacRomanEncoding',
	        ToUnicode: cmap
	      };
	      return this.dictionary.end();
	    };

	    toUnicodeCmap = function(map) {
	      var code, codes, j, len, range, unicode, unicodeMap;
	      unicodeMap = '/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<00><ff>\nendcodespacerange';
	      codes = Object.keys(map).sort(function(a, b) {
	        return a - b;
	      });
	      range = [];
	      for (j = 0, len = codes.length; j < len; j++) {
	        code = codes[j];
	        if (range.length >= 100) {
	          unicodeMap += "\n" + range.length + " beginbfchar\n" + (range.join('\n')) + "\nendbfchar";
	          range = [];
	        }
	        unicode = ('0000' + map[code].toString(16)).slice(-4);
	        code = (+code).toString(16);
	        range.push("<" + code + "><" + unicode + ">");
	      }
	      if (range.length) {
	        unicodeMap += "\n" + range.length + " beginbfchar\n" + (range.join('\n')) + "\nendbfchar\n";
	      }
	      return unicodeMap += 'endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend';
	    };

	    PDFFont.prototype.registerAFM = function(name) {
	      var ref;
	      this.name = name;
	      return ref = this.font, this.ascender = ref.ascender, this.decender = ref.decender, this.bbox = ref.bbox, this.lineGap = ref.lineGap, ref;
	    };

	    PDFFont.prototype.embedAFM = function() {
	      this.dictionary.data = {
	        Type: 'Font',
	        BaseFont: this.name,
	        Subtype: 'Type1',
	        Encoding: 'WinAnsiEncoding'
	      };
	      return this.dictionary.end();
	    };

	    PDFFont.prototype.widthOfString = function(string, size) {
	      var charCode, i, j, ref, scale, width;
	      string = '' + string;
	      width = 0;
	      for (i = j = 0, ref = string.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	        charCode = string.charCodeAt(i);
	        width += this.font.widthOfGlyph(this.font.characterToGlyph(charCode)) || 0;
	      }
	      scale = size / 1000;
	      return width * scale;
	    };

	    PDFFont.prototype.lineHeight = function(size, includeGap) {
	      var gap;
	      if (includeGap == null) {
	        includeGap = false;
	      }
	      gap = includeGap ? this.lineGap : 0;
	      return (this.ascender + gap - this.decender) / 1000 * size;
	    };

	    return PDFFont;

	  })();

	  module.exports = PDFFont;

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var CmapTable, DFont, Data, Directory, GlyfTable, HeadTable, HheaTable, HmtxTable, LocaTable, MaxpTable, NameTable, OS2Table, PostTable, TTFFont, fs;

	  fs = __webpack_require__(20);

	  Data = __webpack_require__(32);

	  DFont = __webpack_require__(33);

	  Directory = __webpack_require__(34);

	  NameTable = __webpack_require__(35);

	  HeadTable = __webpack_require__(38);

	  CmapTable = __webpack_require__(39);

	  HmtxTable = __webpack_require__(40);

	  HheaTable = __webpack_require__(41);

	  MaxpTable = __webpack_require__(42);

	  PostTable = __webpack_require__(43);

	  OS2Table = __webpack_require__(44);

	  LocaTable = __webpack_require__(45);

	  GlyfTable = __webpack_require__(46);

	  TTFFont = (function() {
	    TTFFont.open = function(filename, name) {
	      var contents;
	      contents = fs.readFileSync(filename);
	      return new TTFFont(contents, name);
	    };

	    TTFFont.fromDFont = function(filename, family) {
	      var dfont;
	      dfont = DFont.open(filename);
	      return new TTFFont(dfont.getNamedFont(family));
	    };

	    TTFFont.fromBuffer = function(buffer, family) {
	      var dfont, e, error, ttf;
	      try {
	        ttf = new TTFFont(buffer, family);
	        if (!(ttf.head.exists && ttf.name.exists && ttf.cmap.exists)) {
	          dfont = new DFont(buffer);
	          ttf = new TTFFont(dfont.getNamedFont(family));
	          if (!(ttf.head.exists && ttf.name.exists && ttf.cmap.exists)) {
	            throw new Error('Invalid TTF file in DFont');
	          }
	        }
	        return ttf;
	      } catch (error) {
	        e = error;
	        throw new Error('Unknown font format in buffer: ' + e.message);
	      }
	    };

	    function TTFFont(rawData, name) {
	      var data, i, j, k, len, numFonts, offset, offsets, ref, version;
	      this.rawData = rawData;
	      data = this.contents = new Data(this.rawData);
	      if (data.readString(4) === 'ttcf') {
	        if (!name) {
	          throw new Error("Must specify a font name for TTC files.");
	        }
	        version = data.readInt();
	        numFonts = data.readInt();
	        offsets = [];
	        for (i = j = 0, ref = numFonts; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	          offsets[i] = data.readInt();
	        }
	        for (i = k = 0, len = offsets.length; k < len; i = ++k) {
	          offset = offsets[i];
	          data.pos = offset;
	          this.parse();
	          if (this.name.postscriptName === name) {
	            return;
	          }
	        }
	        throw new Error("Font " + name + " not found in TTC file.");
	      } else {
	        data.pos = 0;
	        this.parse();
	      }
	    }

	    TTFFont.prototype.parse = function() {
	      this.directory = new Directory(this.contents);
	      this.head = new HeadTable(this);
	      this.name = new NameTable(this);
	      this.cmap = new CmapTable(this);
	      this.hhea = new HheaTable(this);
	      this.maxp = new MaxpTable(this);
	      this.hmtx = new HmtxTable(this);
	      this.post = new PostTable(this);
	      this.os2 = new OS2Table(this);
	      this.loca = new LocaTable(this);
	      this.glyf = new GlyfTable(this);
	      this.ascender = (this.os2.exists && this.os2.ascender) || this.hhea.ascender;
	      this.decender = (this.os2.exists && this.os2.decender) || this.hhea.decender;
	      this.lineGap = (this.os2.exists && this.os2.lineGap) || this.hhea.lineGap;
	      return this.bbox = [this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax];
	    };

	    TTFFont.prototype.characterToGlyph = function(character) {
	      var ref;
	      return ((ref = this.cmap.unicode) != null ? ref.codeMap[character] : void 0) || 0;
	    };

	    TTFFont.prototype.widthOfGlyph = function(glyph) {
	      var scale;
	      scale = 1000.0 / this.head.unitsPerEm;
	      return this.hmtx.forGlyph(glyph).advance * scale;
	    };

	    return TTFFont;

	  })();

	  module.exports = TTFFont;

	}).call(this);


/***/ },
/* 32 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var Data;

	  Data = (function() {
	    function Data(data) {
	      this.data = data != null ? data : [];
	      this.pos = 0;
	      this.length = this.data.length;
	    }

	    Data.prototype.readByte = function() {
	      return this.data[this.pos++];
	    };

	    Data.prototype.writeByte = function(byte) {
	      return this.data[this.pos++] = byte;
	    };

	    Data.prototype.byteAt = function(index) {
	      return this.data[index];
	    };

	    Data.prototype.readBool = function() {
	      return !!this.readByte();
	    };

	    Data.prototype.writeBool = function(val) {
	      return this.writeByte(val ? 1 : 0);
	    };

	    Data.prototype.readUInt32 = function() {
	      var b1, b2, b3, b4;
	      b1 = this.readByte() * 0x1000000;
	      b2 = this.readByte() << 16;
	      b3 = this.readByte() << 8;
	      b4 = this.readByte();
	      return b1 + b2 + b3 + b4;
	    };

	    Data.prototype.writeUInt32 = function(val) {
	      this.writeByte((val >>> 24) & 0xff);
	      this.writeByte((val >> 16) & 0xff);
	      this.writeByte((val >> 8) & 0xff);
	      return this.writeByte(val & 0xff);
	    };

	    Data.prototype.readInt32 = function() {
	      var int;
	      int = this.readUInt32();
	      if (int >= 0x80000000) {
	        return int - 0x100000000;
	      } else {
	        return int;
	      }
	    };

	    Data.prototype.writeInt32 = function(val) {
	      if (val < 0) {
	        val += 0x100000000;
	      }
	      return this.writeUInt32(val);
	    };

	    Data.prototype.readUInt16 = function() {
	      var b1, b2;
	      b1 = this.readByte() << 8;
	      b2 = this.readByte();
	      return b1 | b2;
	    };

	    Data.prototype.writeUInt16 = function(val) {
	      this.writeByte((val >> 8) & 0xff);
	      return this.writeByte(val & 0xff);
	    };

	    Data.prototype.readInt16 = function() {
	      var int;
	      int = this.readUInt16();
	      if (int >= 0x8000) {
	        return int - 0x10000;
	      } else {
	        return int;
	      }
	    };

	    Data.prototype.writeInt16 = function(val) {
	      if (val < 0) {
	        val += 0x10000;
	      }
	      return this.writeUInt16(val);
	    };

	    Data.prototype.readString = function(length) {
	      var i, j, ref, ret;
	      ret = [];
	      for (i = j = 0, ref = length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	        ret[i] = String.fromCharCode(this.readByte());
	      }
	      return ret.join('');
	    };

	    Data.prototype.writeString = function(val) {
	      var i, j, ref, results;
	      results = [];
	      for (i = j = 0, ref = val.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	        results.push(this.writeByte(val.charCodeAt(i)));
	      }
	      return results;
	    };

	    Data.prototype.stringAt = function(pos, length) {
	      this.pos = pos;
	      return this.readString(length);
	    };

	    Data.prototype.readShort = function() {
	      return this.readInt16();
	    };

	    Data.prototype.writeShort = function(val) {
	      return this.writeInt16(val);
	    };

	    Data.prototype.readLongLong = function() {
	      var b1, b2, b3, b4, b5, b6, b7, b8;
	      b1 = this.readByte();
	      b2 = this.readByte();
	      b3 = this.readByte();
	      b4 = this.readByte();
	      b5 = this.readByte();
	      b6 = this.readByte();
	      b7 = this.readByte();
	      b8 = this.readByte();
	      if (b1 & 0x80) {
	        return ((b1 ^ 0xff) * 0x100000000000000 + (b2 ^ 0xff) * 0x1000000000000 + (b3 ^ 0xff) * 0x10000000000 + (b4 ^ 0xff) * 0x100000000 + (b5 ^ 0xff) * 0x1000000 + (b6 ^ 0xff) * 0x10000 + (b7 ^ 0xff) * 0x100 + (b8 ^ 0xff) + 1) * -1;
	      }
	      return b1 * 0x100000000000000 + b2 * 0x1000000000000 + b3 * 0x10000000000 + b4 * 0x100000000 + b5 * 0x1000000 + b6 * 0x10000 + b7 * 0x100 + b8;
	    };

	    Data.prototype.writeLongLong = function(val) {
	      var high, low;
	      high = Math.floor(val / 0x100000000);
	      low = val & 0xffffffff;
	      this.writeByte((high >> 24) & 0xff);
	      this.writeByte((high >> 16) & 0xff);
	      this.writeByte((high >> 8) & 0xff);
	      this.writeByte(high & 0xff);
	      this.writeByte((low >> 24) & 0xff);
	      this.writeByte((low >> 16) & 0xff);
	      this.writeByte((low >> 8) & 0xff);
	      return this.writeByte(low & 0xff);
	    };

	    Data.prototype.readInt = function() {
	      return this.readInt32();
	    };

	    Data.prototype.writeInt = function(val) {
	      return this.writeInt32(val);
	    };

	    Data.prototype.slice = function(start, end) {
	      return this.data.slice(start, end);
	    };

	    Data.prototype.read = function(bytes) {
	      var buf, i, j, ref;
	      buf = [];
	      for (i = j = 0, ref = bytes; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	        buf.push(this.readByte());
	      }
	      return buf;
	    };

	    Data.prototype.write = function(bytes) {
	      var byte, j, len, results;
	      results = [];
	      for (j = 0, len = bytes.length; j < len; j++) {
	        byte = bytes[j];
	        results.push(this.writeByte(byte));
	      }
	      return results;
	    };

	    return Data;

	  })();

	  module.exports = Data;

	}).call(this);


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var DFont, Data, Directory, NameTable, fs;

	  fs = __webpack_require__(20);

	  Data = __webpack_require__(32);

	  Directory = __webpack_require__(34);

	  NameTable = __webpack_require__(35);

	  DFont = (function() {
	    DFont.open = function(filename) {
	      var contents;
	      contents = fs.readFileSync(filename);
	      return new DFont(contents);
	    };

	    function DFont(contents) {
	      this.contents = new Data(contents);
	      this.parse(this.contents);
	    }

	    DFont.prototype.parse = function(data) {
	      var attr, b2, b3, b4, dataLength, dataOffset, dataOfs, entry, font, handle, i, id, j, k, l, len, length, mapLength, mapOffset, maxIndex, maxTypeIndex, name, nameListOffset, nameOfs, p, pos, ref, ref1, refListOffset, type, typeListOffset;
	      dataOffset = data.readInt();
	      mapOffset = data.readInt();
	      dataLength = data.readInt();
	      mapLength = data.readInt();
	      this.map = {};
	      data.pos = mapOffset + 24;
	      typeListOffset = data.readShort() + mapOffset;
	      nameListOffset = data.readShort() + mapOffset;
	      data.pos = typeListOffset;
	      maxIndex = data.readShort();
	      for (i = k = 0, ref = maxIndex; k <= ref; i = k += 1) {
	        type = data.readString(4);
	        maxTypeIndex = data.readShort();
	        refListOffset = data.readShort();
	        this.map[type] = {
	          list: [],
	          named: {}
	        };
	        pos = data.pos;
	        data.pos = typeListOffset + refListOffset;
	        for (j = l = 0, ref1 = maxTypeIndex; l <= ref1; j = l += 1) {
	          id = data.readShort();
	          nameOfs = data.readShort();
	          attr = data.readByte();
	          b2 = data.readByte() << 16;
	          b3 = data.readByte() << 8;
	          b4 = data.readByte();
	          dataOfs = dataOffset + (0 | b2 | b3 | b4);
	          handle = data.readUInt32();
	          entry = {
	            id: id,
	            attributes: attr,
	            offset: dataOfs,
	            handle: handle
	          };
	          p = data.pos;
	          if (nameOfs !== -1 && (nameListOffset + nameOfs < mapOffset + mapLength)) {
	            data.pos = nameListOffset + nameOfs;
	            len = data.readByte();
	            entry.name = data.readString(len);
	          } else if (type === 'sfnt') {
	            data.pos = entry.offset;
	            length = data.readUInt32();
	            font = {};
	            font.contents = new Data(data.slice(data.pos, data.pos + length));
	            font.directory = new Directory(font.contents);
	            name = new NameTable(font);
	            entry.name = name.fontName[0].raw;
	          }
	          data.pos = p;
	          this.map[type].list.push(entry);
	          if (entry.name) {
	            this.map[type].named[entry.name] = entry;
	          }
	        }
	        data.pos = pos;
	      }
	    };

	    DFont.prototype.getNamedFont = function(name) {
	      var data, entry, length, pos, ref, ret;
	      data = this.contents;
	      pos = data.pos;
	      entry = (ref = this.map.sfnt) != null ? ref.named[name] : void 0;
	      if (!entry) {
	        throw new Error("Font " + name + " not found in DFont file.");
	      }
	      data.pos = entry.offset;
	      length = data.readUInt32();
	      ret = data.slice(data.pos, data.pos + length);
	      data.pos = pos;
	      return ret;
	    };

	    return DFont;

	  })();

	  module.exports = DFont;

	}).call(this);


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var Data, Directory,
	    slice = [].slice;

	  Data = __webpack_require__(32);

	  Directory = (function() {
	    var checksum;

	    function Directory(data) {
	      var entry, i, j, ref;
	      this.scalarType = data.readInt();
	      this.tableCount = data.readShort();
	      this.searchRange = data.readShort();
	      this.entrySelector = data.readShort();
	      this.rangeShift = data.readShort();
	      this.tables = {};
	      for (i = j = 0, ref = this.tableCount; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	        entry = {
	          tag: data.readString(4),
	          checksum: data.readInt(),
	          offset: data.readInt(),
	          length: data.readInt()
	        };
	        this.tables[entry.tag] = entry;
	      }
	    }

	    Directory.prototype.encode = function(tables) {
	      var adjustment, directory, directoryLength, entrySelector, headOffset, log2, offset, rangeShift, searchRange, sum, table, tableCount, tableData, tag;
	      tableCount = Object.keys(tables).length;
	      log2 = Math.log(2);
	      searchRange = Math.floor(Math.log(tableCount) / log2) * 16;
	      entrySelector = Math.floor(searchRange / log2);
	      rangeShift = tableCount * 16 - searchRange;
	      directory = new Data;
	      directory.writeInt(this.scalarType);
	      directory.writeShort(tableCount);
	      directory.writeShort(searchRange);
	      directory.writeShort(entrySelector);
	      directory.writeShort(rangeShift);
	      directoryLength = tableCount * 16;
	      offset = directory.pos + directoryLength;
	      headOffset = null;
	      tableData = [];
	      for (tag in tables) {
	        table = tables[tag];
	        directory.writeString(tag);
	        directory.writeInt(checksum(table));
	        directory.writeInt(offset);
	        directory.writeInt(table.length);
	        tableData = tableData.concat(table);
	        if (tag === 'head') {
	          headOffset = offset;
	        }
	        offset += table.length;
	        while (offset % 4) {
	          tableData.push(0);
	          offset++;
	        }
	      }
	      directory.write(tableData);
	      sum = checksum(directory.data);
	      adjustment = 0xB1B0AFBA - sum;
	      directory.pos = headOffset + 8;
	      directory.writeUInt32(adjustment);
	      return new Buffer(directory.data);
	    };

	    checksum = function(data) {
	      var i, j, ref, sum, tmp;
	      data = slice.call(data);
	      while (data.length % 4) {
	        data.push(0);
	      }
	      tmp = new Data(data);
	      sum = 0;
	      for (i = j = 0, ref = data.length; j < ref; i = j += 4) {
	        sum += tmp.readUInt32();
	      }
	      return sum & 0xFFFFFFFF;
	    };

	    return Directory;

	  })();

	  module.exports = Directory;

	}).call(this);


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var Data, NameEntry, NameTable, Table, utils,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  Table = __webpack_require__(36);

	  Data = __webpack_require__(32);

	  utils = __webpack_require__(37);

	  NameTable = (function(superClass) {
	    var subsetTag;

	    extend(NameTable, superClass);

	    function NameTable() {
	      return NameTable.__super__.constructor.apply(this, arguments);
	    }

	    NameTable.prototype.tag = 'name';

	    NameTable.prototype.parse = function(data) {
	      var count, entries, entry, format, i, j, k, len, name, name1, ref, stringOffset, strings, text;
	      data.pos = this.offset;
	      format = data.readShort();
	      count = data.readShort();
	      stringOffset = data.readShort();
	      entries = [];
	      for (i = j = 0, ref = count; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	        entries.push({
	          platformID: data.readShort(),
	          encodingID: data.readShort(),
	          languageID: data.readShort(),
	          nameID: data.readShort(),
	          length: data.readShort(),
	          offset: this.offset + stringOffset + data.readShort()
	        });
	      }
	      strings = {};
	      for (i = k = 0, len = entries.length; k < len; i = ++k) {
	        entry = entries[i];
	        data.pos = entry.offset;
	        text = data.readString(entry.length);
	        name = new NameEntry(text, entry);
	        if (strings[name1 = entry.nameID] == null) {
	          strings[name1] = [];
	        }
	        strings[entry.nameID].push(name);
	      }
	      this.strings = strings;
	      this.copyright = strings[0];
	      this.fontFamily = strings[1];
	      this.fontSubfamily = strings[2];
	      this.uniqueSubfamily = strings[3];
	      this.fontName = strings[4];
	      this.version = strings[5];
	      this.postscriptName = strings[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g, "");
	      this.trademark = strings[7];
	      this.manufacturer = strings[8];
	      this.designer = strings[9];
	      this.description = strings[10];
	      this.vendorUrl = strings[11];
	      this.designerUrl = strings[12];
	      this.license = strings[13];
	      this.licenseUrl = strings[14];
	      this.preferredFamily = strings[15];
	      this.preferredSubfamily = strings[17];
	      this.compatibleFull = strings[18];
	      return this.sampleText = strings[19];
	    };

	    subsetTag = "AAAAAA";

	    NameTable.prototype.encode = function() {
	      var id, j, len, list, nameID, nameTable, postscriptName, ref, strCount, strTable, string, strings, table, val;
	      strings = {};
	      ref = this.strings;
	      for (id in ref) {
	        val = ref[id];
	        strings[id] = val;
	      }
	      postscriptName = new NameEntry(subsetTag + "+" + this.postscriptName, {
	        platformID: 1,
	        encodingID: 0,
	        languageID: 0
	      });
	      strings[6] = [postscriptName];
	      subsetTag = utils.successorOf(subsetTag);
	      strCount = 0;
	      for (id in strings) {
	        list = strings[id];
	        if (list != null) {
	          strCount += list.length;
	        }
	      }
	      table = new Data;
	      strTable = new Data;
	      table.writeShort(0);
	      table.writeShort(strCount);
	      table.writeShort(6 + 12 * strCount);
	      for (nameID in strings) {
	        list = strings[nameID];
	        if (list != null) {
	          for (j = 0, len = list.length; j < len; j++) {
	            string = list[j];
	            table.writeShort(string.platformID);
	            table.writeShort(string.encodingID);
	            table.writeShort(string.languageID);
	            table.writeShort(nameID);
	            table.writeShort(string.length);
	            table.writeShort(strTable.pos);
	            strTable.writeString(string.raw);
	          }
	        }
	      }
	      return nameTable = {
	        postscriptName: postscriptName.raw,
	        table: table.data.concat(strTable.data)
	      };
	    };

	    return NameTable;

	  })(Table);

	  module.exports = NameTable;

	  NameEntry = (function() {
	    function NameEntry(raw, entry) {
	      this.raw = raw;
	      this.length = this.raw.length;
	      this.platformID = entry.platformID;
	      this.encodingID = entry.encodingID;
	      this.languageID = entry.languageID;
	    }

	    return NameEntry;

	  })();

	}).call(this);


/***/ },
/* 36 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var Table;

	  Table = (function() {
	    function Table(file) {
	      var info;
	      this.file = file;
	      info = this.file.directory.tables[this.tag];
	      this.exists = !!info;
	      if (info) {
	        this.offset = info.offset, this.length = info.length;
	        this.parse(this.file.contents);
	      }
	    }

	    Table.prototype.parse = function() {};

	    Table.prototype.encode = function() {};

	    Table.prototype.raw = function() {
	      if (!this.exists) {
	        return null;
	      }
	      this.file.contents.pos = this.offset;
	      return this.file.contents.read(this.length);
	    };

	    return Table;

	  })();

	  module.exports = Table;

	}).call(this);


/***/ },
/* 37 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.10.0

	/*
	 * An implementation of Ruby's string.succ method.
	 * By Devon Govett
	 *
	 * Returns the successor to str. The successor is calculated by incrementing characters starting 
	 * from the rightmost alphanumeric (or the rightmost character if there are no alphanumerics) in the
	 * string. Incrementing a digit always results in another digit, and incrementing a letter results in
	 * another letter of the same case.
	 *
	 * If the increment generates a carry, the character to the left of it is incremented. This 
	 * process repeats until there is no carry, adding an additional character if necessary.
	 *
	 * succ("abcd")      == "abce"
	 * succ("THX1138")   == "THX1139"
	 * succ("<<koala>>") == "<<koalb>>"
	 * succ("1999zzz")   == "2000aaa"
	 * succ("ZZZ9999")   == "AAAA0000"
	 */

	(function() {
	  exports.successorOf = function(input) {
	    var added, alphabet, carry, i, index, isUpperCase, last, length, next, result;
	    alphabet = 'abcdefghijklmnopqrstuvwxyz';
	    length = alphabet.length;
	    result = input;
	    i = input.length;
	    while (i >= 0) {
	      last = input.charAt(--i);
	      if (isNaN(last)) {
	        index = alphabet.indexOf(last.toLowerCase());
	        if (index === -1) {
	          next = last;
	          carry = true;
	        } else {
	          next = alphabet.charAt((index + 1) % length);
	          isUpperCase = last === last.toUpperCase();
	          if (isUpperCase) {
	            next = next.toUpperCase();
	          }
	          carry = index + 1 >= length;
	          if (carry && i === 0) {
	            added = isUpperCase ? 'A' : 'a';
	            result = added + next + result.slice(1);
	            break;
	          }
	        }
	      } else {
	        next = +last + 1;
	        carry = next > 9;
	        if (carry) {
	          next = 0;
	        }
	        if (carry && i === 0) {
	          result = '1' + next + result.slice(1);
	          break;
	        }
	      }
	      result = result.slice(0, i) + next + result.slice(i + 1);
	      if (!carry) {
	        break;
	      }
	    }
	    return result;
	  };

	  exports.invert = function(object) {
	    var key, ret, val;
	    ret = {};
	    for (key in object) {
	      val = object[key];
	      ret[val] = key;
	    }
	    return ret;
	  };

	}).call(this);


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var Data, HeadTable, Table,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  Table = __webpack_require__(36);

	  Data = __webpack_require__(32);

	  HeadTable = (function(superClass) {
	    extend(HeadTable, superClass);

	    function HeadTable() {
	      return HeadTable.__super__.constructor.apply(this, arguments);
	    }

	    HeadTable.prototype.tag = 'head';

	    HeadTable.prototype.parse = function(data) {
	      data.pos = this.offset;
	      this.version = data.readInt();
	      this.revision = data.readInt();
	      this.checkSumAdjustment = data.readInt();
	      this.magicNumber = data.readInt();
	      this.flags = data.readShort();
	      this.unitsPerEm = data.readShort();
	      this.created = data.readLongLong();
	      this.modified = data.readLongLong();
	      this.xMin = data.readShort();
	      this.yMin = data.readShort();
	      this.xMax = data.readShort();
	      this.yMax = data.readShort();
	      this.macStyle = data.readShort();
	      this.lowestRecPPEM = data.readShort();
	      this.fontDirectionHint = data.readShort();
	      this.indexToLocFormat = data.readShort();
	      return this.glyphDataFormat = data.readShort();
	    };

	    HeadTable.prototype.encode = function(loca) {
	      var table;
	      table = new Data;
	      table.writeInt(this.version);
	      table.writeInt(this.revision);
	      table.writeInt(this.checkSumAdjustment);
	      table.writeInt(this.magicNumber);
	      table.writeShort(this.flags);
	      table.writeShort(this.unitsPerEm);
	      table.writeLongLong(this.created);
	      table.writeLongLong(this.modified);
	      table.writeShort(this.xMin);
	      table.writeShort(this.yMin);
	      table.writeShort(this.xMax);
	      table.writeShort(this.yMax);
	      table.writeShort(this.macStyle);
	      table.writeShort(this.lowestRecPPEM);
	      table.writeShort(this.fontDirectionHint);
	      table.writeShort(loca.type);
	      table.writeShort(this.glyphDataFormat);
	      return table.data;
	    };

	    return HeadTable;

	  })(Table);

	  module.exports = HeadTable;

	}).call(this);


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var CmapEntry, CmapTable, Data, Table,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  Table = __webpack_require__(36);

	  Data = __webpack_require__(32);

	  CmapTable = (function(superClass) {
	    extend(CmapTable, superClass);

	    function CmapTable() {
	      return CmapTable.__super__.constructor.apply(this, arguments);
	    }

	    CmapTable.prototype.tag = 'cmap';

	    CmapTable.prototype.parse = function(data) {
	      var entry, i, j, ref, tableCount;
	      data.pos = this.offset;
	      this.version = data.readUInt16();
	      tableCount = data.readUInt16();
	      this.tables = [];
	      this.unicode = null;
	      for (i = j = 0, ref = tableCount; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	        entry = new CmapEntry(data, this.offset);
	        this.tables.push(entry);
	        if (entry.isUnicode) {
	          if (this.unicode == null) {
	            this.unicode = entry;
	          }
	        }
	      }
	      return true;
	    };

	    CmapTable.encode = function(charmap, encoding) {
	      var result, table;
	      if (encoding == null) {
	        encoding = 'macroman';
	      }
	      result = CmapEntry.encode(charmap, encoding);
	      table = new Data;
	      table.writeUInt16(0);
	      table.writeUInt16(1);
	      result.table = table.data.concat(result.subtable);
	      return result;
	    };

	    return CmapTable;

	  })(Table);

	  CmapEntry = (function() {
	    function CmapEntry(data, offset) {
	      var code, count, endCode, glyphId, glyphIds, i, idDelta, idRangeOffset, index, j, k, l, len, ref, ref1, saveOffset, segCount, segCountX2, start, startCode, tail;
	      this.platformID = data.readUInt16();
	      this.encodingID = data.readShort();
	      this.offset = offset + data.readInt();
	      saveOffset = data.pos;
	      data.pos = this.offset;
	      this.format = data.readUInt16();
	      this.length = data.readUInt16();
	      this.language = data.readUInt16();
	      this.isUnicode = (this.platformID === 3 && this.encodingID === 1 && this.format === 4) || this.platformID === 0 && this.format === 4;
	      this.codeMap = {};
	      switch (this.format) {
	        case 0:
	          for (i = j = 0; j < 256; i = ++j) {
	            this.codeMap[i] = data.readByte();
	          }
	          break;
	        case 4:
	          segCountX2 = data.readUInt16();
	          segCount = segCountX2 / 2;
	          data.pos += 6;
	          endCode = (function() {
	            var k, ref, results;
	            results = [];
	            for (i = k = 0, ref = segCount; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
	              results.push(data.readUInt16());
	            }
	            return results;
	          })();
	          data.pos += 2;
	          startCode = (function() {
	            var k, ref, results;
	            results = [];
	            for (i = k = 0, ref = segCount; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
	              results.push(data.readUInt16());
	            }
	            return results;
	          })();
	          idDelta = (function() {
	            var k, ref, results;
	            results = [];
	            for (i = k = 0, ref = segCount; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
	              results.push(data.readUInt16());
	            }
	            return results;
	          })();
	          idRangeOffset = (function() {
	            var k, ref, results;
	            results = [];
	            for (i = k = 0, ref = segCount; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
	              results.push(data.readUInt16());
	            }
	            return results;
	          })();
	          count = (this.length - data.pos + this.offset) / 2;
	          glyphIds = (function() {
	            var k, ref, results;
	            results = [];
	            for (i = k = 0, ref = count; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
	              results.push(data.readUInt16());
	            }
	            return results;
	          })();
	          for (i = k = 0, len = endCode.length; k < len; i = ++k) {
	            tail = endCode[i];
	            start = startCode[i];
	            for (code = l = ref = start, ref1 = tail; ref <= ref1 ? l <= ref1 : l >= ref1; code = ref <= ref1 ? ++l : --l) {
	              if (idRangeOffset[i] === 0) {
	                glyphId = code + idDelta[i];
	              } else {
	                index = idRangeOffset[i] / 2 + (code - start) - (segCount - i);
	                glyphId = glyphIds[index] || 0;
	                if (glyphId !== 0) {
	                  glyphId += idDelta[i];
	                }
	              }
	              this.codeMap[code] = glyphId & 0xFFFF;
	            }
	          }
	      }
	      data.pos = saveOffset;
	    }

	    CmapEntry.encode = function(charmap, encoding) {
	      var charMap, code, codeMap, codes, delta, deltas, diff, endCode, endCodes, entrySelector, glyphIDs, i, id, indexes, j, k, l, last, len, len1, len2, len3, len4, len5, len6, len7, m, map, n, name, nextID, o, offset, old, p, q, r, rangeOffsets, rangeShift, ref, ref1, result, searchRange, segCount, segCountX2, startCode, startCodes, startGlyph, subtable;
	      subtable = new Data;
	      codes = Object.keys(charmap).sort(function(a, b) {
	        return a - b;
	      });
	      switch (encoding) {
	        case 'macroman':
	          id = 0;
	          indexes = (function() {
	            var j, results;
	            results = [];
	            for (i = j = 0; j < 256; i = ++j) {
	              results.push(0);
	            }
	            return results;
	          })();
	          map = {
	            0: 0
	          };
	          codeMap = {};
	          for (j = 0, len = codes.length; j < len; j++) {
	            code = codes[j];
	            if (map[name = charmap[code]] == null) {
	              map[name] = ++id;
	            }
	            codeMap[code] = {
	              old: charmap[code],
	              "new": map[charmap[code]]
	            };
	            indexes[code] = map[charmap[code]];
	          }
	          subtable.writeUInt16(1);
	          subtable.writeUInt16(0);
	          subtable.writeUInt32(12);
	          subtable.writeUInt16(0);
	          subtable.writeUInt16(262);
	          subtable.writeUInt16(0);
	          subtable.write(indexes);
	          return result = {
	            charMap: codeMap,
	            subtable: subtable.data,
	            maxGlyphID: id + 1
	          };
	        case 'unicode':
	          startCodes = [];
	          endCodes = [];
	          nextID = 0;
	          map = {};
	          charMap = {};
	          last = diff = null;
	          for (k = 0, len1 = codes.length; k < len1; k++) {
	            code = codes[k];
	            old = charmap[code];
	            if (map[old] == null) {
	              map[old] = ++nextID;
	            }
	            charMap[code] = {
	              old: old,
	              "new": map[old]
	            };
	            delta = map[old] - code;
	            if ((last == null) || delta !== diff) {
	              if (last) {
	                endCodes.push(last);
	              }
	              startCodes.push(code);
	              diff = delta;
	            }
	            last = code;
	          }
	          if (last) {
	            endCodes.push(last);
	          }
	          endCodes.push(0xFFFF);
	          startCodes.push(0xFFFF);
	          segCount = startCodes.length;
	          segCountX2 = segCount * 2;
	          searchRange = 2 * Math.pow(Math.log(segCount) / Math.LN2, 2);
	          entrySelector = Math.log(searchRange / 2) / Math.LN2;
	          rangeShift = 2 * segCount - searchRange;
	          deltas = [];
	          rangeOffsets = [];
	          glyphIDs = [];
	          for (i = l = 0, len2 = startCodes.length; l < len2; i = ++l) {
	            startCode = startCodes[i];
	            endCode = endCodes[i];
	            if (startCode === 0xFFFF) {
	              deltas.push(0);
	              rangeOffsets.push(0);
	              break;
	            }
	            startGlyph = charMap[startCode]["new"];
	            if (startCode - startGlyph >= 0x8000) {
	              deltas.push(0);
	              rangeOffsets.push(2 * (glyphIDs.length + segCount - i));
	              for (code = m = ref = startCode, ref1 = endCode; ref <= ref1 ? m <= ref1 : m >= ref1; code = ref <= ref1 ? ++m : --m) {
	                glyphIDs.push(charMap[code]["new"]);
	              }
	            } else {
	              deltas.push(startGlyph - startCode);
	              rangeOffsets.push(0);
	            }
	          }
	          subtable.writeUInt16(3);
	          subtable.writeUInt16(1);
	          subtable.writeUInt32(12);
	          subtable.writeUInt16(4);
	          subtable.writeUInt16(16 + segCount * 8 + glyphIDs.length * 2);
	          subtable.writeUInt16(0);
	          subtable.writeUInt16(segCountX2);
	          subtable.writeUInt16(searchRange);
	          subtable.writeUInt16(entrySelector);
	          subtable.writeUInt16(rangeShift);
	          for (n = 0, len3 = endCodes.length; n < len3; n++) {
	            code = endCodes[n];
	            subtable.writeUInt16(code);
	          }
	          subtable.writeUInt16(0);
	          for (o = 0, len4 = startCodes.length; o < len4; o++) {
	            code = startCodes[o];
	            subtable.writeUInt16(code);
	          }
	          for (p = 0, len5 = deltas.length; p < len5; p++) {
	            delta = deltas[p];
	            subtable.writeUInt16(delta);
	          }
	          for (q = 0, len6 = rangeOffsets.length; q < len6; q++) {
	            offset = rangeOffsets[q];
	            subtable.writeUInt16(offset);
	          }
	          for (r = 0, len7 = glyphIDs.length; r < len7; r++) {
	            id = glyphIDs[r];
	            subtable.writeUInt16(id);
	          }
	          return result = {
	            charMap: charMap,
	            subtable: subtable.data,
	            maxGlyphID: nextID + 1
	          };
	      }
	    };

	    return CmapEntry;

	  })();

	  module.exports = CmapTable;

	}).call(this);


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var Data, HmtxTable, Table,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  Table = __webpack_require__(36);

	  Data = __webpack_require__(32);

	  HmtxTable = (function(superClass) {
	    extend(HmtxTable, superClass);

	    function HmtxTable() {
	      return HmtxTable.__super__.constructor.apply(this, arguments);
	    }

	    HmtxTable.prototype.tag = 'hmtx';

	    HmtxTable.prototype.parse = function(data) {
	      var i, j, k, last, lsbCount, m, ref, ref1, results;
	      data.pos = this.offset;
	      this.metrics = [];
	      for (i = j = 0, ref = this.file.hhea.numberOfMetrics; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	        this.metrics.push({
	          advance: data.readUInt16(),
	          lsb: data.readInt16()
	        });
	      }
	      lsbCount = this.file.maxp.numGlyphs - this.file.hhea.numberOfMetrics;
	      this.leftSideBearings = (function() {
	        var k, ref1, results;
	        results = [];
	        for (i = k = 0, ref1 = lsbCount; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
	          results.push(data.readInt16());
	        }
	        return results;
	      })();
	      this.widths = (function() {
	        var k, len, ref1, results;
	        ref1 = this.metrics;
	        results = [];
	        for (k = 0, len = ref1.length; k < len; k++) {
	          m = ref1[k];
	          results.push(m.advance);
	        }
	        return results;
	      }).call(this);
	      last = this.widths[this.widths.length - 1];
	      results = [];
	      for (i = k = 0, ref1 = lsbCount; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
	        results.push(this.widths.push(last));
	      }
	      return results;
	    };

	    HmtxTable.prototype.forGlyph = function(id) {
	      var metrics;
	      if (id in this.metrics) {
	        return this.metrics[id];
	      }
	      return metrics = {
	        advance: this.metrics[this.metrics.length - 1].advance,
	        lsb: this.leftSideBearings[id - this.metrics.length]
	      };
	    };

	    HmtxTable.prototype.encode = function(mapping) {
	      var id, j, len, metric, table;
	      table = new Data;
	      for (j = 0, len = mapping.length; j < len; j++) {
	        id = mapping[j];
	        metric = this.forGlyph(id);
	        table.writeUInt16(metric.advance);
	        table.writeUInt16(metric.lsb);
	      }
	      return table.data;
	    };

	    return HmtxTable;

	  })(Table);

	  module.exports = HmtxTable;

	}).call(this);


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var Data, HheaTable, Table,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  Table = __webpack_require__(36);

	  Data = __webpack_require__(32);

	  HheaTable = (function(superClass) {
	    extend(HheaTable, superClass);

	    function HheaTable() {
	      return HheaTable.__super__.constructor.apply(this, arguments);
	    }

	    HheaTable.prototype.tag = 'hhea';

	    HheaTable.prototype.parse = function(data) {
	      data.pos = this.offset;
	      this.version = data.readInt();
	      this.ascender = data.readShort();
	      this.decender = data.readShort();
	      this.lineGap = data.readShort();
	      this.advanceWidthMax = data.readShort();
	      this.minLeftSideBearing = data.readShort();
	      this.minRightSideBearing = data.readShort();
	      this.xMaxExtent = data.readShort();
	      this.caretSlopeRise = data.readShort();
	      this.caretSlopeRun = data.readShort();
	      this.caretOffset = data.readShort();
	      data.pos += 4 * 2;
	      this.metricDataFormat = data.readShort();
	      return this.numberOfMetrics = data.readUInt16();
	    };

	    HheaTable.prototype.encode = function(ids) {
	      var i, j, ref, table;
	      table = new Data;
	      table.writeInt(this.version);
	      table.writeShort(this.ascender);
	      table.writeShort(this.decender);
	      table.writeShort(this.lineGap);
	      table.writeShort(this.advanceWidthMax);
	      table.writeShort(this.minLeftSideBearing);
	      table.writeShort(this.minRightSideBearing);
	      table.writeShort(this.xMaxExtent);
	      table.writeShort(this.caretSlopeRise);
	      table.writeShort(this.caretSlopeRun);
	      table.writeShort(this.caretOffset);
	      for (i = j = 0, ref = 4 * 2; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	        table.writeByte(0);
	      }
	      table.writeShort(this.metricDataFormat);
	      table.writeUInt16(ids.length);
	      return table.data;
	    };

	    return HheaTable;

	  })(Table);

	  module.exports = HheaTable;

	}).call(this);


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var Data, MaxpTable, Table,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  Table = __webpack_require__(36);

	  Data = __webpack_require__(32);

	  MaxpTable = (function(superClass) {
	    extend(MaxpTable, superClass);

	    function MaxpTable() {
	      return MaxpTable.__super__.constructor.apply(this, arguments);
	    }

	    MaxpTable.prototype.tag = 'maxp';

	    MaxpTable.prototype.parse = function(data) {
	      data.pos = this.offset;
	      this.version = data.readInt();
	      this.numGlyphs = data.readUInt16();
	      this.maxPoints = data.readUInt16();
	      this.maxContours = data.readUInt16();
	      this.maxCompositePoints = data.readUInt16();
	      this.maxComponentContours = data.readUInt16();
	      this.maxZones = data.readUInt16();
	      this.maxTwilightPoints = data.readUInt16();
	      this.maxStorage = data.readUInt16();
	      this.maxFunctionDefs = data.readUInt16();
	      this.maxInstructionDefs = data.readUInt16();
	      this.maxStackElements = data.readUInt16();
	      this.maxSizeOfInstructions = data.readUInt16();
	      this.maxComponentElements = data.readUInt16();
	      return this.maxComponentDepth = data.readUInt16();
	    };

	    MaxpTable.prototype.encode = function(ids) {
	      var table;
	      table = new Data;
	      table.writeInt(this.version);
	      table.writeUInt16(ids.length);
	      table.writeUInt16(this.maxPoints);
	      table.writeUInt16(this.maxContours);
	      table.writeUInt16(this.maxCompositePoints);
	      table.writeUInt16(this.maxComponentContours);
	      table.writeUInt16(this.maxZones);
	      table.writeUInt16(this.maxTwilightPoints);
	      table.writeUInt16(this.maxStorage);
	      table.writeUInt16(this.maxFunctionDefs);
	      table.writeUInt16(this.maxInstructionDefs);
	      table.writeUInt16(this.maxStackElements);
	      table.writeUInt16(this.maxSizeOfInstructions);
	      table.writeUInt16(this.maxComponentElements);
	      table.writeUInt16(this.maxComponentDepth);
	      return table.data;
	    };

	    return MaxpTable;

	  })(Table);

	  module.exports = MaxpTable;

	}).call(this);


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var Data, PostTable, Table,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  Table = __webpack_require__(36);

	  Data = __webpack_require__(32);

	  PostTable = (function(superClass) {
	    var POSTSCRIPT_GLYPHS;

	    extend(PostTable, superClass);

	    function PostTable() {
	      return PostTable.__super__.constructor.apply(this, arguments);
	    }

	    PostTable.prototype.tag = 'post';

	    PostTable.prototype.parse = function(data) {
	      var i, j, length, numberOfGlyphs, ref, results;
	      data.pos = this.offset;
	      this.format = data.readInt();
	      this.italicAngle = data.readInt();
	      this.underlinePosition = data.readShort();
	      this.underlineThickness = data.readShort();
	      this.isFixedPitch = data.readInt();
	      this.minMemType42 = data.readInt();
	      this.maxMemType42 = data.readInt();
	      this.minMemType1 = data.readInt();
	      this.maxMemType1 = data.readInt();
	      switch (this.format) {
	        case 0x00010000:
	          break;
	        case 0x00020000:
	          numberOfGlyphs = data.readUInt16();
	          this.glyphNameIndex = [];
	          for (i = j = 0, ref = numberOfGlyphs; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	            this.glyphNameIndex.push(data.readUInt16());
	          }
	          this.names = [];
	          results = [];
	          while (data.pos < this.offset + this.length) {
	            length = data.readByte();
	            results.push(this.names.push(data.readString(length)));
	          }
	          return results;
	          break;
	        case 0x00025000:
	          numberOfGlyphs = data.readUInt16();
	          return this.offsets = data.read(numberOfGlyphs);
	        case 0x00030000:
	          break;
	        case 0x00040000:
	          return this.map = (function() {
	            var k, ref1, results1;
	            results1 = [];
	            for (i = k = 0, ref1 = this.file.maxp.numGlyphs; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
	              results1.push(data.readUInt32());
	            }
	            return results1;
	          }).call(this);
	      }
	    };

	    PostTable.prototype.glyphFor = function(code) {
	      var index;
	      switch (this.format) {
	        case 0x00010000:
	          return POSTSCRIPT_GLYPHS[code] || '.notdef';
	        case 0x00020000:
	          index = this.glyphNameIndex[code];
	          if (index <= 257) {
	            return POSTSCRIPT_GLYPHS[index];
	          } else {
	            return this.names[index - 258] || '.notdef';
	          }
	          break;
	        case 0x00025000:
	          return POSTSCRIPT_GLYPHS[code + this.offsets[code]] || '.notdef';
	        case 0x00030000:
	          return '.notdef';
	        case 0x00040000:
	          return this.map[code] || 0xFFFF;
	      }
	    };

	    PostTable.prototype.encode = function(mapping) {
	      var id, index, indexes, j, k, l, len, len1, len2, position, post, raw, string, strings, table;
	      if (!this.exists) {
	        return null;
	      }
	      raw = this.raw();
	      if (this.format === 0x00030000) {
	        return raw;
	      }
	      table = new Data(raw.slice(0, 32));
	      table.writeUInt32(0x00020000);
	      table.pos = 32;
	      indexes = [];
	      strings = [];
	      for (j = 0, len = mapping.length; j < len; j++) {
	        id = mapping[j];
	        post = this.glyphFor(id);
	        position = POSTSCRIPT_GLYPHS.indexOf(post);
	        if (position !== -1) {
	          indexes.push(position);
	        } else {
	          indexes.push(257 + strings.length);
	          strings.push(post);
	        }
	      }
	      table.writeUInt16(Object.keys(mapping).length);
	      for (k = 0, len1 = indexes.length; k < len1; k++) {
	        index = indexes[k];
	        table.writeUInt16(index);
	      }
	      for (l = 0, len2 = strings.length; l < len2; l++) {
	        string = strings[l];
	        table.writeByte(string.length);
	        table.writeString(string);
	      }
	      return table.data;
	    };

	    POSTSCRIPT_GLYPHS = '.notdef .null nonmarkingreturn space exclam quotedbl numbersign dollar percent\nampersand quotesingle parenleft parenright asterisk plus comma hyphen period slash\nzero one two three four five six seven eight nine colon semicolon less equal greater\nquestion at A B C D E F G H I J K L M N O P Q R S T U V W X Y Z\nbracketleft backslash bracketright asciicircum underscore grave\na b c d e f g h i j k l m n o p q r s t u v w x y z\nbraceleft bar braceright asciitilde Adieresis Aring Ccedilla Eacute Ntilde Odieresis\nUdieresis aacute agrave acircumflex adieresis atilde aring ccedilla eacute egrave\necircumflex edieresis iacute igrave icircumflex idieresis ntilde oacute ograve\nocircumflex odieresis otilde uacute ugrave ucircumflex udieresis dagger degree cent\nsterling section bullet paragraph germandbls registered copyright trademark acute\ndieresis notequal AE Oslash infinity plusminus lessequal greaterequal yen mu\npartialdiff summation product pi integral ordfeminine ordmasculine Omega ae oslash\nquestiondown exclamdown logicalnot radical florin approxequal Delta guillemotleft\nguillemotright ellipsis nonbreakingspace Agrave Atilde Otilde OE oe endash emdash\nquotedblleft quotedblright quoteleft quoteright divide lozenge ydieresis Ydieresis\nfraction currency guilsinglleft guilsinglright fi fl daggerdbl periodcentered\nquotesinglbase quotedblbase perthousand Acircumflex Ecircumflex Aacute Edieresis\nEgrave Iacute Icircumflex Idieresis Igrave Oacute Ocircumflex apple Ograve Uacute\nUcircumflex Ugrave dotlessi circumflex tilde macron breve dotaccent ring cedilla\nhungarumlaut ogonek caron Lslash lslash Scaron scaron Zcaron zcaron brokenbar Eth\neth Yacute yacute Thorn thorn minus multiply onesuperior twosuperior threesuperior\nonehalf onequarter threequarters franc Gbreve gbreve Idotaccent Scedilla scedilla\nCacute cacute Ccaron ccaron dcroat'.split(/\s+/g);

	    return PostTable;

	  })(Table);

	  module.exports = PostTable;

	}).call(this);


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var OS2Table, Table,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  Table = __webpack_require__(36);

	  OS2Table = (function(superClass) {
	    extend(OS2Table, superClass);

	    function OS2Table() {
	      return OS2Table.__super__.constructor.apply(this, arguments);
	    }

	    OS2Table.prototype.tag = 'OS/2';

	    OS2Table.prototype.parse = function(data) {
	      var i;
	      data.pos = this.offset;
	      this.version = data.readUInt16();
	      this.averageCharWidth = data.readShort();
	      this.weightClass = data.readUInt16();
	      this.widthClass = data.readUInt16();
	      this.type = data.readShort();
	      this.ySubscriptXSize = data.readShort();
	      this.ySubscriptYSize = data.readShort();
	      this.ySubscriptXOffset = data.readShort();
	      this.ySubscriptYOffset = data.readShort();
	      this.ySuperscriptXSize = data.readShort();
	      this.ySuperscriptYSize = data.readShort();
	      this.ySuperscriptXOffset = data.readShort();
	      this.ySuperscriptYOffset = data.readShort();
	      this.yStrikeoutSize = data.readShort();
	      this.yStrikeoutPosition = data.readShort();
	      this.familyClass = data.readShort();
	      this.panose = (function() {
	        var j, results;
	        results = [];
	        for (i = j = 0; j < 10; i = ++j) {
	          results.push(data.readByte());
	        }
	        return results;
	      })();
	      this.charRange = (function() {
	        var j, results;
	        results = [];
	        for (i = j = 0; j < 4; i = ++j) {
	          results.push(data.readInt());
	        }
	        return results;
	      })();
	      this.vendorID = data.readString(4);
	      this.selection = data.readShort();
	      this.firstCharIndex = data.readShort();
	      this.lastCharIndex = data.readShort();
	      if (this.version > 0) {
	        this.ascent = data.readShort();
	        this.descent = data.readShort();
	        this.lineGap = data.readShort();
	        this.winAscent = data.readShort();
	        this.winDescent = data.readShort();
	        this.codePageRange = (function() {
	          var j, results;
	          results = [];
	          for (i = j = 0; j < 2; i = ++j) {
	            results.push(data.readInt());
	          }
	          return results;
	        })();
	        if (this.version > 1) {
	          this.xHeight = data.readShort();
	          this.capHeight = data.readShort();
	          this.defaultChar = data.readShort();
	          this.breakChar = data.readShort();
	          return this.maxContext = data.readShort();
	        }
	      }
	    };

	    OS2Table.prototype.encode = function() {
	      return this.raw();
	    };

	    return OS2Table;

	  })(Table);

	  module.exports = OS2Table;

	}).call(this);


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var Data, LocaTable, Table,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  Table = __webpack_require__(36);

	  Data = __webpack_require__(32);

	  LocaTable = (function(superClass) {
	    extend(LocaTable, superClass);

	    function LocaTable() {
	      return LocaTable.__super__.constructor.apply(this, arguments);
	    }

	    LocaTable.prototype.tag = 'loca';

	    LocaTable.prototype.parse = function(data) {
	      var format, i;
	      data.pos = this.offset;
	      format = this.file.head.indexToLocFormat;
	      if (format === 0) {
	        return this.offsets = (function() {
	          var j, ref, results;
	          results = [];
	          for (i = j = 0, ref = this.length; j < ref; i = j += 2) {
	            results.push(data.readUInt16() * 2);
	          }
	          return results;
	        }).call(this);
	      } else {
	        return this.offsets = (function() {
	          var j, ref, results;
	          results = [];
	          for (i = j = 0, ref = this.length; j < ref; i = j += 4) {
	            results.push(data.readUInt32());
	          }
	          return results;
	        }).call(this);
	      }
	    };

	    LocaTable.prototype.indexOf = function(id) {
	      return this.offsets[id];
	    };

	    LocaTable.prototype.lengthOf = function(id) {
	      return this.offsets[id + 1] - this.offsets[id];
	    };

	    LocaTable.prototype.encode = function(offsets) {
	      var j, k, l, len, len1, len2, o, offset, ref, ret, table;
	      table = new Data;
	      for (j = 0, len = offsets.length; j < len; j++) {
	        offset = offsets[j];
	        if (!(offset > 0xFFFF)) {
	          continue;
	        }
	        ref = this.offsets;
	        for (k = 0, len1 = ref.length; k < len1; k++) {
	          o = ref[k];
	          table.writeUInt32(o);
	        }
	        return ret = {
	          format: 1,
	          table: table.data
	        };
	      }
	      for (l = 0, len2 = offsets.length; l < len2; l++) {
	        o = offsets[l];
	        table.writeUInt16(o / 2);
	      }
	      return ret = {
	        format: 0,
	        table: table.data
	      };
	    };

	    return LocaTable;

	  })(Table);

	  module.exports = LocaTable;

	}).call(this);


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var CompoundGlyph, Data, GlyfTable, SimpleGlyph, Table,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty,
	    slice = [].slice;

	  Table = __webpack_require__(36);

	  Data = __webpack_require__(32);

	  GlyfTable = (function(superClass) {
	    extend(GlyfTable, superClass);

	    function GlyfTable() {
	      return GlyfTable.__super__.constructor.apply(this, arguments);
	    }

	    GlyfTable.prototype.tag = 'glyf';

	    GlyfTable.prototype.parse = function(data) {
	      return this.cache = {};
	    };

	    GlyfTable.prototype.glyphFor = function(id) {
	      var data, index, length, loca, numberOfContours, raw, xMax, xMin, yMax, yMin;
	      if (id in this.cache) {
	        return this.cache[id];
	      }
	      loca = this.file.loca;
	      data = this.file.contents;
	      index = loca.indexOf(id);
	      length = loca.lengthOf(id);
	      if (length === 0) {
	        return this.cache[id] = null;
	      }
	      data.pos = this.offset + index;
	      raw = new Data(data.read(length));
	      numberOfContours = raw.readShort();
	      xMin = raw.readShort();
	      yMin = raw.readShort();
	      xMax = raw.readShort();
	      yMax = raw.readShort();
	      if (numberOfContours === -1) {
	        this.cache[id] = new CompoundGlyph(raw, xMin, yMin, xMax, yMax);
	      } else {
	        this.cache[id] = new SimpleGlyph(raw, numberOfContours, xMin, yMin, xMax, yMax);
	      }
	      return this.cache[id];
	    };

	    GlyfTable.prototype.encode = function(glyphs, mapping, old2new) {
	      var glyph, id, j, len, offsets, table;
	      table = [];
	      offsets = [];
	      for (j = 0, len = mapping.length; j < len; j++) {
	        id = mapping[j];
	        glyph = glyphs[id];
	        offsets.push(table.length);
	        if (glyph) {
	          table = table.concat(glyph.encode(old2new));
	        }
	      }
	      offsets.push(table.length);
	      return {
	        table: table,
	        offsets: offsets
	      };
	    };

	    return GlyfTable;

	  })(Table);

	  SimpleGlyph = (function() {
	    function SimpleGlyph(raw1, numberOfContours1, xMin1, yMin1, xMax1, yMax1) {
	      this.raw = raw1;
	      this.numberOfContours = numberOfContours1;
	      this.xMin = xMin1;
	      this.yMin = yMin1;
	      this.xMax = xMax1;
	      this.yMax = yMax1;
	      this.compound = false;
	    }

	    SimpleGlyph.prototype.encode = function() {
	      return this.raw.data;
	    };

	    return SimpleGlyph;

	  })();

	  CompoundGlyph = (function() {
	    var ARG_1_AND_2_ARE_WORDS, MORE_COMPONENTS, WE_HAVE_AN_X_AND_Y_SCALE, WE_HAVE_A_SCALE, WE_HAVE_A_TWO_BY_TWO, WE_HAVE_INSTRUCTIONS;

	    ARG_1_AND_2_ARE_WORDS = 0x0001;

	    WE_HAVE_A_SCALE = 0x0008;

	    MORE_COMPONENTS = 0x0020;

	    WE_HAVE_AN_X_AND_Y_SCALE = 0x0040;

	    WE_HAVE_A_TWO_BY_TWO = 0x0080;

	    WE_HAVE_INSTRUCTIONS = 0x0100;

	    function CompoundGlyph(raw1, xMin1, yMin1, xMax1, yMax1) {
	      var data, flags;
	      this.raw = raw1;
	      this.xMin = xMin1;
	      this.yMin = yMin1;
	      this.xMax = xMax1;
	      this.yMax = yMax1;
	      this.compound = true;
	      this.glyphIDs = [];
	      this.glyphOffsets = [];
	      data = this.raw;
	      while (true) {
	        flags = data.readShort();
	        this.glyphOffsets.push(data.pos);
	        this.glyphIDs.push(data.readShort());
	        if (!(flags & MORE_COMPONENTS)) {
	          break;
	        }
	        if (flags & ARG_1_AND_2_ARE_WORDS) {
	          data.pos += 4;
	        } else {
	          data.pos += 2;
	        }
	        if (flags & WE_HAVE_A_TWO_BY_TWO) {
	          data.pos += 8;
	        } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
	          data.pos += 4;
	        } else if (flags & WE_HAVE_A_SCALE) {
	          data.pos += 2;
	        }
	      }
	    }

	    CompoundGlyph.prototype.encode = function(mapping) {
	      var i, id, j, len, ref, result;
	      result = new Data(slice.call(this.raw.data));
	      ref = this.glyphIDs;
	      for (i = j = 0, len = ref.length; j < len; i = ++j) {
	        id = ref[i];
	        result.pos = this.glyphOffsets[i];
	        result.writeShort(mapping[id]);
	      }
	      return result.data;
	    };

	    return CompoundGlyph;

	  })();

	  module.exports = GlyfTable;

	}).call(this);


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var AFMFont, fs;

	  fs = __webpack_require__(20);

	  AFMFont = (function() {
	    var WIN_ANSI_MAP, characters;

	    AFMFont.open = function(filename) {
	      return new AFMFont(fs.readFileSync(filename, 'utf8'));
	    };

	    function AFMFont(contents) {
	      var e, i;
	      this.contents = contents;
	      this.attributes = {};
	      this.glyphWidths = {};
	      this.boundingBoxes = {};
	      this.parse();
	      this.charWidths = (function() {
	        var j, results;
	        results = [];
	        for (i = j = 0; j <= 255; i = ++j) {
	          results.push(this.glyphWidths[characters[i]]);
	        }
	        return results;
	      }).call(this);
	      this.bbox = (function() {
	        var j, len, ref, results;
	        ref = this.attributes['FontBBox'].split(/\s+/);
	        results = [];
	        for (j = 0, len = ref.length; j < len; j++) {
	          e = ref[j];
	          results.push(+e);
	        }
	        return results;
	      }).call(this);
	      this.ascender = +(this.attributes['Ascender'] || 0);
	      this.decender = +(this.attributes['Descender'] || 0);
	      this.lineGap = (this.bbox[3] - this.bbox[1]) - (this.ascender - this.decender);
	    }

	    AFMFont.prototype.parse = function() {
	      var a, j, key, len, line, match, name, ref, section, value;
	      section = '';
	      ref = this.contents.split('\n');
	      for (j = 0, len = ref.length; j < len; j++) {
	        line = ref[j];
	        if (match = line.match(/^Start(\w+)/)) {
	          section = match[1];
	          continue;
	        } else if (match = line.match(/^End(\w+)/)) {
	          section = '';
	          continue;
	        }
	        switch (section) {
	          case 'FontMetrics':
	            match = line.match(/(^\w+)\s+(.*)/);
	            key = match[1];
	            value = match[2];
	            if (a = this.attributes[key]) {
	              if (!Array.isArray(a)) {
	                a = this.attributes[key] = [a];
	              }
	              a.push(value);
	            } else {
	              this.attributes[key] = value;
	            }
	            break;
	          case 'CharMetrics':
	            if (!/^CH?\s/.test(line)) {
	              continue;
	            }
	            name = line.match(/\bN\s+(\.?\w+)\s*;/)[1];
	            this.glyphWidths[name] = +line.match(/\bWX\s+(\d+)\s*;/)[1];
	        }
	      }
	    };

	    WIN_ANSI_MAP = {
	      402: 131,
	      8211: 150,
	      8212: 151,
	      8216: 145,
	      8217: 146,
	      8218: 130,
	      8220: 147,
	      8221: 148,
	      8222: 132,
	      8224: 134,
	      8225: 135,
	      8226: 149,
	      8230: 133,
	      8364: 128,
	      8240: 137,
	      8249: 139,
	      8250: 155,
	      710: 136,
	      8482: 153,
	      338: 140,
	      339: 156,
	      732: 152,
	      352: 138,
	      353: 154,
	      376: 159,
	      381: 142,
	      382: 158
	    };

	    AFMFont.prototype.encodeText = function(text) {
	      var char, i, j, ref, string;
	      string = '';
	      for (i = j = 0, ref = text.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	        char = text.charCodeAt(i);
	        char = WIN_ANSI_MAP[char] || char;
	        string += String.fromCharCode(char);
	      }
	      return string;
	    };

	    AFMFont.prototype.characterToGlyph = function(character) {
	      return characters[WIN_ANSI_MAP[character] || character];
	    };

	    AFMFont.prototype.widthOfGlyph = function(glyph) {
	      return this.glyphWidths[glyph];
	    };

	    characters = '.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n\nspace         exclam         quotedbl       numbersign\ndollar        percent        ampersand      quotesingle\nparenleft     parenright     asterisk       plus\ncomma         hyphen         period         slash\nzero          one            two            three\nfour          five           six            seven\neight         nine           colon          semicolon\nless          equal          greater        question\n\nat            A              B              C\nD             E              F              G\nH             I              J              K\nL             M              N              O\nP             Q              R              S\nT             U              V              W\nX             Y              Z              bracketleft\nbackslash     bracketright   asciicircum    underscore\n\ngrave         a              b              c\nd             e              f              g\nh             i              j              k\nl             m              n              o\np             q              r              s\nt             u              v              w\nx             y              z              braceleft\nbar           braceright     asciitilde     .notdef\n\nEuro          .notdef        quotesinglbase florin\nquotedblbase  ellipsis       dagger         daggerdbl\ncircumflex    perthousand    Scaron         guilsinglleft\nOE            .notdef        Zcaron         .notdef\n.notdef       quoteleft      quoteright     quotedblleft\nquotedblright bullet         endash         emdash\ntilde         trademark      scaron         guilsinglright\noe            .notdef        zcaron         ydieresis\n\nspace         exclamdown     cent           sterling\ncurrency      yen            brokenbar      section\ndieresis      copyright      ordfeminine    guillemotleft\nlogicalnot    hyphen         registered     macron\ndegree        plusminus      twosuperior    threesuperior\nacute         mu             paragraph      periodcentered\ncedilla       onesuperior    ordmasculine   guillemotright\nonequarter    onehalf        threequarters  questiondown\n\nAgrave        Aacute         Acircumflex    Atilde\nAdieresis     Aring          AE             Ccedilla\nEgrave        Eacute         Ecircumflex    Edieresis\nIgrave        Iacute         Icircumflex    Idieresis\nEth           Ntilde         Ograve         Oacute\nOcircumflex   Otilde         Odieresis      multiply\nOslash        Ugrave         Uacute         Ucircumflex\nUdieresis     Yacute         Thorn          germandbls\n\nagrave        aacute         acircumflex    atilde\nadieresis     aring          ae             ccedilla\negrave        eacute         ecircumflex    edieresis\nigrave        iacute         icircumflex    idieresis\neth           ntilde         ograve         oacute\nocircumflex   otilde         odieresis      divide\noslash        ugrave         uacute         ucircumflex\nudieresis     yacute         thorn          ydieresis'.split(/\s+/);

	    return AFMFont;

	  })();

	  module.exports = AFMFont;

	}).call(this);


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var CmapTable, Subset, utils,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  CmapTable = __webpack_require__(39);

	  utils = __webpack_require__(37);

	  Subset = (function() {
	    function Subset(font) {
	      this.font = font;
	      this.subset = {};
	      this.unicodes = {};
	      this.next = 33;
	    }

	    Subset.prototype.use = function(character) {
	      var i, j, ref;
	      if (typeof character === 'string') {
	        for (i = j = 0, ref = character.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	          this.use(character.charCodeAt(i));
	        }
	        return;
	      }
	      if (!this.unicodes[character]) {
	        this.subset[this.next] = character;
	        return this.unicodes[character] = this.next++;
	      }
	    };

	    Subset.prototype.encodeText = function(text) {
	      var char, i, j, ref, string;
	      string = '';
	      for (i = j = 0, ref = text.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	        char = this.unicodes[text.charCodeAt(i)];
	        string += String.fromCharCode(char);
	      }
	      return string;
	    };

	    Subset.prototype.generateCmap = function() {
	      var mapping, ref, roman, unicode, unicodeCmap;
	      unicodeCmap = this.font.cmap.tables[0].codeMap;
	      mapping = {};
	      ref = this.subset;
	      for (roman in ref) {
	        unicode = ref[roman];
	        mapping[roman] = unicodeCmap[unicode];
	      }
	      return mapping;
	    };

	    Subset.prototype.glyphIDs = function() {
	      var ref, ret, roman, unicode, unicodeCmap, val;
	      unicodeCmap = this.font.cmap.tables[0].codeMap;
	      ret = [0];
	      ref = this.subset;
	      for (roman in ref) {
	        unicode = ref[roman];
	        val = unicodeCmap[unicode];
	        if ((val != null) && indexOf.call(ret, val) < 0) {
	          ret.push(val);
	        }
	      }
	      return ret.sort();
	    };

	    Subset.prototype.glyphsFor = function(glyphIDs) {
	      var additionalIDs, glyph, glyphs, id, j, len, ref;
	      glyphs = {};
	      for (j = 0, len = glyphIDs.length; j < len; j++) {
	        id = glyphIDs[j];
	        glyphs[id] = this.font.glyf.glyphFor(id);
	      }
	      additionalIDs = [];
	      for (id in glyphs) {
	        glyph = glyphs[id];
	        if (glyph != null ? glyph.compound : void 0) {
	          additionalIDs.push.apply(additionalIDs, glyph.glyphIDs);
	        }
	      }
	      if (additionalIDs.length > 0) {
	        ref = this.glyphsFor(additionalIDs);
	        for (id in ref) {
	          glyph = ref[id];
	          glyphs[id] = glyph;
	        }
	      }
	      return glyphs;
	    };

	    Subset.prototype.encode = function() {
	      var cmap, code, glyf, glyphs, id, ids, loca, name, new2old, newIDs, nextGlyphID, old2new, oldID, oldIDs, ref, ref1, tables;
	      cmap = CmapTable.encode(this.generateCmap(), 'unicode');
	      glyphs = this.glyphsFor(this.glyphIDs());
	      old2new = {
	        0: 0
	      };
	      ref = cmap.charMap;
	      for (code in ref) {
	        ids = ref[code];
	        old2new[ids.old] = ids["new"];
	      }
	      nextGlyphID = cmap.maxGlyphID;
	      for (oldID in glyphs) {
	        if (!(oldID in old2new)) {
	          old2new[oldID] = nextGlyphID++;
	        }
	      }
	      new2old = utils.invert(old2new);
	      newIDs = Object.keys(new2old).sort(function(a, b) {
	        return a - b;
	      });
	      oldIDs = (function() {
	        var j, len, results;
	        results = [];
	        for (j = 0, len = newIDs.length; j < len; j++) {
	          id = newIDs[j];
	          results.push(new2old[id]);
	        }
	        return results;
	      })();
	      glyf = this.font.glyf.encode(glyphs, oldIDs, old2new);
	      loca = this.font.loca.encode(glyf.offsets);
	      name = this.font.name.encode();
	      this.postscriptName = name.postscriptName;
	      this.cmap = {};
	      ref1 = cmap.charMap;
	      for (code in ref1) {
	        ids = ref1[code];
	        this.cmap[code] = ids.old;
	      }
	      tables = {
	        cmap: cmap.table,
	        glyf: glyf.table,
	        loca: loca.table,
	        hmtx: this.font.hmtx.encode(oldIDs),
	        hhea: this.font.hhea.encode(oldIDs),
	        maxp: this.font.maxp.encode(oldIDs),
	        post: this.font.post.encode(oldIDs),
	        name: name.table,
	        head: this.font.head.encode(loca)
	      };
	      if (this.font.os2.exists) {
	        tables['OS/2'] = this.font.os2.raw();
	      }
	      return this.font.directory.encode(tables);
	    };

	    return Subset;

	  })();

	  module.exports = Subset;

	}).call(this);


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var LineWrapper;

	  LineWrapper = __webpack_require__(50);

	  module.exports = {
	    initText: function() {
	      this.x = 0;
	      this.y = 0;
	      return this._lineGap = 0;
	    },
	    lineGap: function(_lineGap) {
	      this._lineGap = _lineGap;
	      return this;
	    },
	    moveDown: function(lines) {
	      if (lines == null) {
	        lines = 1;
	      }
	      this.y += this.currentLineHeight(true) * lines + this._lineGap;
	      return this;
	    },
	    moveUp: function(lines) {
	      if (lines == null) {
	        lines = 1;
	      }
	      this.y -= this.currentLineHeight(true) * lines + this._lineGap;
	      return this;
	    },
	    _text: function(text, x, y, options, lineCallback) {
	      var j, len, line, ref, wrapper;
	      options = this._initOptions(x, y, options);
	      text = '' + text;
	      if (options.wordSpacing) {
	        text = text.replace(/\s{2,}/g, ' ');
	      }
	      if (options.width) {
	        wrapper = this._wrapper;
	        if (!wrapper) {
	          wrapper = new LineWrapper(this, options);
	          wrapper.on('line', lineCallback);
	        }
	        this._wrapper = options.continued ? wrapper : null;
	        this._textOptions = options.continued ? options : null;
	        wrapper.wrap(text, options);
	      } else {
	        ref = text.split('\n');
	        for (j = 0, len = ref.length; j < len; j++) {
	          line = ref[j];
	          lineCallback(line, options);
	        }
	      }
	      return this;
	    },
	    text: function(text, x, y, options) {
	      return this._text(text, x, y, options, this._line.bind(this));
	    },
	    widthOfString: function(string, options) {
	      if (options == null) {
	        options = {};
	      }
	      return this._font.widthOfString(string, this._fontSize) + (options.characterSpacing || 0) * (string.length - 1);
	    },
	    heightOfString: function(text, options) {
	      var height, lineGap, x, y;
	      if (options == null) {
	        options = {};
	      }
	      x = this.x, y = this.y;
	      options = this._initOptions(options);
	      options.height = Infinity;
	      lineGap = options.lineGap || this._lineGap || 0;
	      this._text(text, this.x, this.y, options, (function(_this) {
	        return function(line, options) {
	          return _this.y += _this.currentLineHeight(true) + lineGap;
	        };
	      })(this));
	      height = this.y - y;
	      this.x = x;
	      this.y = y;
	      return height;
	    },
	    list: function(list, x, y, options, wrapper) {
	      var flatten, i, indent, itemIndent, items, level, levels, r;
	      options = this._initOptions(x, y, options);
	      r = Math.round((this._font.ascender / 1000 * this._fontSize) / 3);
	      indent = options.textIndent || r * 5;
	      itemIndent = options.bulletIndent || r * 8;
	      level = 1;
	      items = [];
	      levels = [];
	      flatten = function(list) {
	        var i, item, j, len, results;
	        results = [];
	        for (i = j = 0, len = list.length; j < len; i = ++j) {
	          item = list[i];
	          if (Array.isArray(item)) {
	            level++;
	            flatten(item);
	            results.push(level--);
	          } else {
	            items.push(item);
	            results.push(levels.push(level));
	          }
	        }
	        return results;
	      };
	      flatten(list);
	      wrapper = new LineWrapper(this, options);
	      wrapper.on('line', this._line.bind(this));
	      level = 1;
	      i = 0;
	      wrapper.on('firstLine', (function(_this) {
	        return function() {
	          var diff, l;
	          if ((l = levels[i++]) !== level) {
	            diff = itemIndent * (l - level);
	            _this.x += diff;
	            wrapper.lineWidth -= diff;
	            level = l;
	          }
	          _this.circle(_this.x - indent + r, _this.y + r + (r / 2), r);
	          return _this.fill();
	        };
	      })(this));
	      wrapper.on('sectionStart', (function(_this) {
	        return function() {
	          var pos;
	          pos = indent + itemIndent * (level - 1);
	          _this.x += pos;
	          return wrapper.lineWidth -= pos;
	        };
	      })(this));
	      wrapper.on('sectionEnd', (function(_this) {
	        return function() {
	          var pos;
	          pos = indent + itemIndent * (level - 1);
	          _this.x -= pos;
	          return wrapper.lineWidth += pos;
	        };
	      })(this));
	      wrapper.wrap(items.join('\n'), options);
	      return this;
	    },
	    _initOptions: function(x, y, options) {
	      var key, margins, ref, val;
	      if (x == null) {
	        x = {};
	      }
	      if (options == null) {
	        options = {};
	      }
	      if (typeof x === 'object') {
	        options = x;
	        x = null;
	      }
	      options = (function() {
	        var k, opts, v;
	        opts = {};
	        for (k in options) {
	          v = options[k];
	          opts[k] = v;
	        }
	        return opts;
	      })();
	      if (this._textOptions) {
	        ref = this._textOptions;
	        for (key in ref) {
	          val = ref[key];
	          if (key !== 'continued') {
	            if (options[key] == null) {
	              options[key] = val;
	            }
	          }
	        }
	      }
	      if (x != null) {
	        this.x = x;
	      }
	      if (y != null) {
	        this.y = y;
	      }
	      if (options.lineBreak !== false) {
	        margins = this.page.margins;
	        if (options.width == null) {
	          options.width = this.page.width - this.x - margins.right;
	        }
	      }
	      options.columns || (options.columns = 0);
	      if (options.columnGap == null) {
	        options.columnGap = 18;
	      }
	      return options;
	    },
	    _line: function(text, options, wrapper) {
	      var lineGap;
	      if (options == null) {
	        options = {};
	      }
	      this._fragment(text, this.x, this.y, options);
	      lineGap = options.lineGap || this._lineGap || 0;
	      if (!wrapper) {
	        return this.x += this.widthOfString(text);
	      } else {
	        return this.y += this.currentLineHeight(true) + lineGap;
	      }
	    },
	    _fragment: function(text, x, y, options) {
	      var align, base, characterSpacing, commands, d, encoded, i, j, len, lineWidth, lineY, mode, name, renderedWidth, spaceWidth, textWidth, word, wordSpacing, words;
	      text = '' + text;
	      if (text.length === 0) {
	        return;
	      }
	      align = options.align || 'left';
	      wordSpacing = options.wordSpacing || 0;
	      characterSpacing = options.characterSpacing || 0;
	      if (options.width) {
	        switch (align) {
	          case 'right':
	            textWidth = this.widthOfString(text.replace(/\s+$/, ''), options);
	            x += options.lineWidth - textWidth;
	            break;
	          case 'center':
	            x += options.lineWidth / 2 - options.textWidth / 2;
	            break;
	          case 'justify':
	            words = text.trim().split(/\s+/);
	            textWidth = this.widthOfString(text.replace(/\s+/g, ''), options);
	            spaceWidth = this.widthOfString(' ') + characterSpacing;
	            wordSpacing = Math.max(0, (options.lineWidth - textWidth) / Math.max(1, words.length - 1) - spaceWidth);
	        }
	      }
	      renderedWidth = options.textWidth + (wordSpacing * (options.wordCount - 1)) + (characterSpacing * (text.length - 1));
	      if (options.link) {
	        this.link(x, y, renderedWidth, this.currentLineHeight(), options.link);
	      }
	      if (options.underline || options.strike) {
	        this.save();
	        if (!options.stroke) {
	          this.strokeColor.apply(this, this._fillColor);
	        }
	        lineWidth = this._fontSize < 10 ? 0.5 : Math.floor(this._fontSize / 10);
	        this.lineWidth(lineWidth);
	        d = options.underline ? 1 : 2;
	        lineY = y + this.currentLineHeight() / d;
	        if (options.underline) {
	          lineY -= lineWidth;
	        }
	        this.moveTo(x, lineY);
	        this.lineTo(x + renderedWidth, lineY);
	        this.stroke();
	        this.restore();
	      }
	      this.save();
	      this.transform(1, 0, 0, -1, 0, this.page.height);
	      y = this.page.height - y - (this._font.ascender / 1000 * this._fontSize);
	      if ((base = this.page.fonts)[name = this._font.id] == null) {
	        base[name] = this._font.ref();
	      }
	      this._font.use(text);
	      this.addContent("BT");
	      this.addContent(x + " " + y + " Td");
	      this.addContent("/" + this._font.id + " " + this._fontSize + " Tf");
	      mode = options.fill && options.stroke ? 2 : options.stroke ? 1 : 0;
	      if (mode) {
	        this.addContent(mode + " Tr");
	      }
	      if (characterSpacing) {
	        this.addContent(characterSpacing + " Tc");
	      }
	      if (wordSpacing) {
	        words = text.trim().split(/\s+/);
	        wordSpacing += this.widthOfString(' ') + characterSpacing;
	        wordSpacing *= 1000 / this._fontSize;
	        commands = [];
	        for (j = 0, len = words.length; j < len; j++) {
	          word = words[j];
	          encoded = this._font.encode(word);
	          encoded = ((function() {
	            var m, ref, results;
	            results = [];
	            for (i = m = 0, ref = encoded.length; m < ref; i = m += 1) {
	              results.push(encoded.charCodeAt(i).toString(16));
	            }
	            return results;
	          })()).join('');
	          commands.push("<" + encoded + "> " + (-wordSpacing));
	        }
	        this.addContent("[" + (commands.join(' ')) + "] TJ");
	      } else {
	        encoded = this._font.encode(text);
	        encoded = ((function() {
	          var m, ref, results;
	          results = [];
	          for (i = m = 0, ref = encoded.length; m < ref; i = m += 1) {
	            results.push(encoded.charCodeAt(i).toString(16));
	          }
	          return results;
	        })()).join('');
	        this.addContent("<" + encoded + "> Tj");
	      }
	      this.addContent("ET");
	      return this.restore();
	    }
	  };

	}).call(this);


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var EventEmitter, LineBreaker, LineWrapper,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  EventEmitter = __webpack_require__(51).EventEmitter;

	  LineBreaker = __webpack_require__(52);

	  LineWrapper = (function(superClass) {
	    extend(LineWrapper, superClass);

	    function LineWrapper(document, options) {
	      var ref;
	      this.document = document;
	      this.indent = options.indent || 0;
	      this.characterSpacing = options.characterSpacing || 0;
	      this.wordSpacing = options.wordSpacing === 0;
	      this.columns = options.columns || 1;
	      this.columnGap = (ref = options.columnGap) != null ? ref : 18;
	      this.lineWidth = (options.width - (this.columnGap * (this.columns - 1))) / this.columns;
	      this.spaceLeft = this.lineWidth;
	      this.startX = this.document.x;
	      this.startY = this.document.y;
	      this.column = 1;
	      this.ellipsis = options.ellipsis;
	      this.continuedX = 0;
	      if (options.height != null) {
	        this.height = options.height;
	        this.maxY = this.startY + options.height;
	      } else {
	        this.maxY = this.document.page.maxY();
	      }
	      this.on('firstLine', (function(_this) {
	        return function(options) {
	          var indent;
	          indent = _this.continuedX || _this.indent;
	          _this.document.x += indent;
	          _this.lineWidth -= indent;
	          return _this.once('line', function() {
	            _this.document.x -= indent;
	            _this.lineWidth += indent;
	            if (options.continued && !_this.continuedX) {
	              _this.continuedX = _this.indent;
	            }
	            if (!options.continued) {
	              return _this.continuedX = 0;
	            }
	          });
	        };
	      })(this));
	      this.on('lastLine', (function(_this) {
	        return function(options) {
	          var align;
	          align = options.align;
	          if (align === 'justify') {
	            options.align = 'left';
	          }
	          _this.lastLine = true;
	          return _this.once('line', function() {
	            _this.document.y += options.paragraphGap || 0;
	            options.align = align;
	            return _this.lastLine = false;
	          });
	        };
	      })(this));
	    }

	    LineWrapper.prototype.wordWidth = function(word) {
	      return this.document.widthOfString(word, this) + this.characterSpacing + this.wordSpacing;
	    };

	    LineWrapper.prototype.eachWord = function(text, fn) {
	      var bk, breaker, fbk, l, last, lbk, shouldContinue, w, word, wordWidths;
	      breaker = new LineBreaker(text);
	      last = null;
	      wordWidths = Object.create(null);
	      while (bk = breaker.nextBreak()) {
	        word = text.slice((last != null ? last.position : void 0) || 0, bk.position);
	        w = wordWidths[word] != null ? wordWidths[word] : wordWidths[word] = this.wordWidth(word);
	        if (w > this.lineWidth + this.continuedX) {
	          lbk = last;
	          fbk = {};
	          while (word.length) {
	            l = word.length;
	            while (w > this.spaceLeft) {
	              w = this.wordWidth(word.slice(0, --l));
	            }
	            fbk.required = l < word.length;
	            shouldContinue = fn(word.slice(0, l), w, fbk, lbk);
	            lbk = {
	              required: false
	            };
	            word = word.slice(l);
	            w = this.wordWidth(word);
	            if (shouldContinue === false) {
	              break;
	            }
	          }
	        } else {
	          shouldContinue = fn(word, w, bk, last);
	        }
	        if (shouldContinue === false) {
	          break;
	        }
	        last = bk;
	      }
	    };

	    LineWrapper.prototype.wrap = function(text, options) {
	      var buffer, emitLine, lc, nextY, textWidth, wc, y;
	      if (options.indent != null) {
	        this.indent = options.indent;
	      }
	      if (options.characterSpacing != null) {
	        this.characterSpacing = options.characterSpacing;
	      }
	      if (options.wordSpacing != null) {
	        this.wordSpacing = options.wordSpacing;
	      }
	      if (options.ellipsis != null) {
	        this.ellipsis = options.ellipsis;
	      }
	      nextY = this.document.y + this.document.currentLineHeight(true);
	      if (this.document.y > this.maxY || nextY > this.maxY) {
	        this.nextSection();
	      }
	      buffer = '';
	      textWidth = 0;
	      wc = 0;
	      lc = 0;
	      y = this.document.y;
	      emitLine = (function(_this) {
	        return function() {
	          options.textWidth = textWidth + _this.wordSpacing * (wc - 1);
	          options.wordCount = wc;
	          options.lineWidth = _this.lineWidth;
	          y = _this.document.y;
	          _this.emit('line', buffer, options, _this);
	          return lc++;
	        };
	      })(this);
	      this.emit('sectionStart', options, this);
	      this.eachWord(text, (function(_this) {
	        return function(word, w, bk, last) {
	          var lh, shouldContinue;
	          if ((last == null) || last.required) {
	            _this.emit('firstLine', options, _this);
	            _this.spaceLeft = _this.lineWidth;
	          }
	          if (w <= _this.spaceLeft) {
	            buffer += word;
	            textWidth += w;
	            wc++;
	          }
	          if (bk.required || w > _this.spaceLeft) {
	            if (bk.required) {
	              _this.emit('lastLine', options, _this);
	            }
	            lh = _this.document.currentLineHeight(true);
	            if ((_this.height != null) && _this.ellipsis && _this.document.y + lh * 2 > _this.maxY && _this.column >= _this.columns) {
	              if (_this.ellipsis === true) {
	                _this.ellipsis = '…';
	              }
	              buffer = buffer.replace(/\s+$/, '');
	              textWidth = _this.wordWidth(buffer + _this.ellipsis);
	              while (textWidth > _this.lineWidth) {
	                buffer = buffer.slice(0, -1).replace(/\s+$/, '');
	                textWidth = _this.wordWidth(buffer + _this.ellipsis);
	              }
	              buffer = buffer + _this.ellipsis;
	            }
	            emitLine();
	            if (_this.document.y + lh > _this.maxY) {
	              shouldContinue = _this.nextSection();
	              if (!shouldContinue) {
	                wc = 0;
	                buffer = '';
	                return false;
	              }
	            }
	            if (bk.required) {
	              if (w > _this.spaceLeft) {
	                buffer = word;
	                textWidth = w;
	                wc = 1;
	                emitLine();
	              }
	              _this.spaceLeft = _this.lineWidth;
	              buffer = '';
	              textWidth = 0;
	              return wc = 0;
	            } else {
	              _this.spaceLeft = _this.lineWidth - w;
	              buffer = word;
	              textWidth = w;
	              return wc = 1;
	            }
	          } else {
	            return _this.spaceLeft -= w;
	          }
	        };
	      })(this));
	      if (wc > 0) {
	        this.emit('lastLine', options, this);
	        emitLine();
	      }
	      this.emit('sectionEnd', options, this);
	      if (options.continued === true) {
	        if (lc > 1) {
	          this.continuedX = 0;
	        }
	        this.continuedX += options.textWidth;
	        return this.document.y = y;
	      } else {
	        return this.document.x = this.startX;
	      }
	    };

	    LineWrapper.prototype.nextSection = function(options) {
	      var ref;
	      this.emit('sectionEnd', options, this);
	      if (++this.column > this.columns) {
	        if (this.height != null) {
	          return false;
	        }
	        this.document.addPage();
	        this.column = 1;
	        this.startY = this.document.page.margins.top;
	        this.maxY = this.document.page.maxY();
	        this.document.x = this.startX;
	        if (this.document._fillColor) {
	          (ref = this.document).fillColor.apply(ref, this.document._fillColor);
	        }
	        this.emit('pageBreak', options, this);
	      } else {
	        this.document.x += this.lineWidth + this.columnGap;
	        this.document.y = this.startY;
	        this.emit('columnBreak', options, this);
	      }
	      this.emit('sectionStart', options, this);
	      return true;
	    };

	    return LineWrapper;

	  })(EventEmitter);

	  module.exports = LineWrapper;

	}).call(this);


/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_51__;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.7.1
	(function() {
	  var AI, AL, BA, BK, CB, CI_BRK, CJ, CP_BRK, CR, DI_BRK, ID, IN_BRK, LF, LineBreaker, NL, NS, PR_BRK, SA, SG, SP, UnicodeTrie, WJ, XX, characterClasses, classTrie, pairTable, _ref, _ref1;

	  UnicodeTrie = __webpack_require__(53);

	  classTrie = new UnicodeTrie(__webpack_require__(54));

	  _ref = __webpack_require__(55), BK = _ref.BK, CR = _ref.CR, LF = _ref.LF, NL = _ref.NL, CB = _ref.CB, BA = _ref.BA, SP = _ref.SP, WJ = _ref.WJ, SP = _ref.SP, BK = _ref.BK, LF = _ref.LF, NL = _ref.NL, AI = _ref.AI, AL = _ref.AL, SA = _ref.SA, SG = _ref.SG, XX = _ref.XX, CJ = _ref.CJ, ID = _ref.ID, NS = _ref.NS, characterClasses = _ref.characterClasses;

	  _ref1 = __webpack_require__(56), DI_BRK = _ref1.DI_BRK, IN_BRK = _ref1.IN_BRK, CI_BRK = _ref1.CI_BRK, CP_BRK = _ref1.CP_BRK, PR_BRK = _ref1.PR_BRK, pairTable = _ref1.pairTable;

	  LineBreaker = (function() {
	    var Break, mapClass, mapFirst;

	    function LineBreaker(string) {
	      this.string = string;
	      this.pos = 0;
	      this.lastPos = 0;
	      this.curClass = null;
	      this.nextClass = null;
	    }

	    LineBreaker.prototype.nextCodePoint = function() {
	      var code, next;
	      code = this.string.charCodeAt(this.pos++);
	      next = this.string.charCodeAt(this.pos);
	      if ((0xd800 <= code && code <= 0xdbff) && (0xdc00 <= next && next <= 0xdfff)) {
	        this.pos++;
	        return ((code - 0xd800) * 0x400) + (next - 0xdc00) + 0x10000;
	      }
	      return code;
	    };

	    mapClass = function(c) {
	      switch (c) {
	        case AI:
	          return AL;
	        case SA:
	        case SG:
	        case XX:
	          return AL;
	        case CJ:
	          return NS;
	        default:
	          return c;
	      }
	    };

	    mapFirst = function(c) {
	      switch (c) {
	        case LF:
	        case NL:
	          return BK;
	        case CB:
	          return BA;
	        case SP:
	          return WJ;
	        default:
	          return c;
	      }
	    };

	    LineBreaker.prototype.nextCharClass = function(first) {
	      if (first == null) {
	        first = false;
	      }
	      return mapClass(classTrie.get(this.nextCodePoint()));
	    };

	    Break = (function() {
	      function Break(position, required) {
	        this.position = position;
	        this.required = required != null ? required : false;
	      }

	      return Break;

	    })();

	    LineBreaker.prototype.nextBreak = function() {
	      var cur, lastClass, shouldBreak;
	      if (this.curClass == null) {
	        this.curClass = mapFirst(this.nextCharClass());
	      }
	      while (this.pos < this.string.length) {
	        this.lastPos = this.pos;
	        lastClass = this.nextClass;
	        this.nextClass = this.nextCharClass();
	        if (this.curClass === BK || (this.curClass === CR && this.nextClass !== LF)) {
	          this.curClass = mapFirst(mapClass(this.nextClass));
	          return new Break(this.lastPos, true);
	        }
	        cur = (function() {
	          switch (this.nextClass) {
	            case SP:
	              return this.curClass;
	            case BK:
	            case LF:
	            case NL:
	              return BK;
	            case CR:
	              return CR;
	            case CB:
	              return BA;
	          }
	        }).call(this);
	        if (cur != null) {
	          this.curClass = cur;
	          if (this.nextClass === CB) {
	            return new Break(this.lastPos);
	          }
	          continue;
	        }
	        shouldBreak = false;
	        switch (pairTable[this.curClass][this.nextClass]) {
	          case DI_BRK:
	            shouldBreak = true;
	            break;
	          case IN_BRK:
	            shouldBreak = lastClass === SP;
	            break;
	          case CI_BRK:
	            shouldBreak = lastClass === SP;
	            if (!shouldBreak) {
	              continue;
	            }
	            break;
	          case CP_BRK:
	            if (lastClass !== SP) {
	              continue;
	            }
	        }
	        this.curClass = this.nextClass;
	        if (shouldBreak) {
	          return new Break(this.lastPos);
	        }
	      }
	      if (this.pos >= this.string.length) {
	        if (this.lastPos < this.string.length) {
	          this.lastPos = this.string.length;
	          return new Break(this.string.length);
	        } else {
	          return null;
	        }
	      }
	    };

	    return LineBreaker;

	  })();

	  module.exports = LineBreaker;

	}).call(this);


/***/ },
/* 53 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_53__;

/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = {
		"data": [
			1961,
			1969,
			1977,
			1985,
			2025,
			2033,
			2041,
			2049,
			2057,
			2065,
			2073,
			2081,
			2089,
			2097,
			2105,
			2113,
			2121,
			2129,
			2137,
			2145,
			2153,
			2161,
			2169,
			2177,
			2185,
			2193,
			2201,
			2209,
			2217,
			2225,
			2233,
			2241,
			2249,
			2257,
			2265,
			2273,
			2281,
			2289,
			2297,
			2305,
			2313,
			2321,
			2329,
			2337,
			2345,
			2353,
			2361,
			2369,
			2377,
			2385,
			2393,
			2401,
			2409,
			2417,
			2425,
			2433,
			2441,
			2449,
			2457,
			2465,
			2473,
			2481,
			2489,
			2497,
			2505,
			2513,
			2521,
			2529,
			2529,
			2537,
			2009,
			2545,
			2553,
			2561,
			2569,
			2577,
			2585,
			2593,
			2601,
			2609,
			2617,
			2625,
			2633,
			2641,
			2649,
			2657,
			2665,
			2673,
			2681,
			2689,
			2697,
			2705,
			2713,
			2721,
			2729,
			2737,
			2745,
			2753,
			2761,
			2769,
			2777,
			2785,
			2793,
			2801,
			2809,
			2817,
			2825,
			2833,
			2841,
			2849,
			2857,
			2865,
			2873,
			2881,
			2889,
			2009,
			2897,
			2905,
			2913,
			2009,
			2921,
			2929,
			2937,
			2945,
			2953,
			2961,
			2969,
			2009,
			2977,
			2977,
			2985,
			2993,
			3001,
			3009,
			3009,
			3009,
			3017,
			3017,
			3017,
			3025,
			3025,
			3033,
			3041,
			3041,
			3049,
			3049,
			3049,
			3049,
			3049,
			3049,
			3049,
			3049,
			3049,
			3049,
			3057,
			3065,
			3073,
			3073,
			3073,
			3081,
			3089,
			3097,
			3097,
			3097,
			3097,
			3097,
			3097,
			3097,
			3097,
			3097,
			3097,
			3097,
			3097,
			3097,
			3097,
			3097,
			3097,
			3097,
			3097,
			3097,
			3105,
			3113,
			3113,
			3121,
			3129,
			3137,
			3145,
			3153,
			3161,
			3161,
			3169,
			3177,
			3185,
			3193,
			3193,
			3193,
			3193,
			3201,
			3209,
			3209,
			3217,
			3225,
			3233,
			3241,
			3241,
			3241,
			3249,
			3257,
			3265,
			3273,
			3273,
			3281,
			3289,
			3297,
			2009,
			2009,
			3305,
			3313,
			3321,
			3329,
			3337,
			3345,
			3353,
			3361,
			3369,
			3377,
			3385,
			3393,
			2009,
			2009,
			3401,
			3409,
			3417,
			3417,
			3417,
			3417,
			3417,
			3417,
			3425,
			3425,
			3433,
			3433,
			3433,
			3433,
			3433,
			3433,
			3433,
			3433,
			3433,
			3433,
			3433,
			3433,
			3433,
			3433,
			3433,
			3441,
			3449,
			3457,
			3465,
			3473,
			3481,
			3489,
			3497,
			3505,
			3513,
			3521,
			3529,
			3537,
			3545,
			3553,
			3561,
			3569,
			3577,
			3585,
			3593,
			3601,
			3609,
			3617,
			3625,
			3625,
			3633,
			3641,
			3649,
			3649,
			3649,
			3649,
			3649,
			3657,
			3665,
			3665,
			3673,
			3681,
			3681,
			3681,
			3681,
			3689,
			3697,
			3697,
			3705,
			3713,
			3721,
			3729,
			3737,
			3745,
			3753,
			3761,
			3769,
			3777,
			3785,
			3793,
			3801,
			3809,
			3817,
			3825,
			3833,
			3841,
			3849,
			3857,
			3865,
			3873,
			3881,
			3881,
			3881,
			3881,
			3881,
			3881,
			3881,
			3881,
			3881,
			3881,
			3881,
			3881,
			3889,
			3897,
			3905,
			3913,
			3921,
			3921,
			3921,
			3921,
			3921,
			3921,
			3921,
			3921,
			3921,
			3921,
			3929,
			2009,
			2009,
			2009,
			2009,
			2009,
			3937,
			3937,
			3937,
			3937,
			3937,
			3937,
			3937,
			3945,
			3953,
			3953,
			3953,
			3961,
			3969,
			3969,
			3977,
			3985,
			3993,
			4001,
			2009,
			2009,
			4009,
			4009,
			4009,
			4009,
			4009,
			4009,
			4009,
			4009,
			4009,
			4009,
			4009,
			4009,
			4017,
			4025,
			4033,
			4041,
			4049,
			4057,
			4065,
			4073,
			4081,
			4081,
			4081,
			4081,
			4081,
			4081,
			4081,
			4089,
			4097,
			4097,
			4105,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4113,
			4121,
			4121,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4129,
			4137,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4145,
			4153,
			4161,
			4169,
			4169,
			4169,
			4169,
			4169,
			4169,
			4169,
			4169,
			4177,
			4185,
			4193,
			4201,
			4209,
			4217,
			4217,
			4225,
			4233,
			4233,
			4233,
			4233,
			4233,
			4233,
			4233,
			4233,
			4241,
			4249,
			4257,
			4265,
			4273,
			4281,
			4289,
			4297,
			4305,
			4313,
			4321,
			4329,
			4337,
			4345,
			4353,
			4361,
			4361,
			4369,
			4377,
			4385,
			4385,
			4385,
			4385,
			4393,
			4401,
			4409,
			4409,
			4409,
			4409,
			4409,
			4409,
			4417,
			4425,
			4433,
			4441,
			4449,
			4457,
			4465,
			4473,
			4481,
			4489,
			4497,
			4505,
			4513,
			4521,
			4529,
			4537,
			4545,
			4553,
			4561,
			4569,
			4577,
			4585,
			4593,
			4601,
			4609,
			4617,
			4625,
			4633,
			4641,
			4649,
			4657,
			4665,
			4673,
			4681,
			4689,
			4697,
			4705,
			4713,
			4721,
			4729,
			4737,
			4745,
			4753,
			4761,
			4769,
			4777,
			4785,
			4793,
			4801,
			4809,
			4817,
			4825,
			4833,
			4841,
			4849,
			4857,
			4865,
			4873,
			4881,
			4889,
			4897,
			4905,
			4913,
			4921,
			4929,
			4937,
			4945,
			4953,
			4961,
			4969,
			4977,
			4985,
			4993,
			5001,
			5009,
			5017,
			5025,
			5033,
			5041,
			5049,
			5057,
			5065,
			5073,
			5081,
			5089,
			5097,
			5105,
			5113,
			5121,
			5129,
			5137,
			5145,
			5153,
			5161,
			5169,
			5177,
			5185,
			5193,
			5201,
			5209,
			5217,
			5225,
			5233,
			5241,
			5249,
			5257,
			5265,
			5273,
			5281,
			5289,
			5297,
			5305,
			5313,
			5321,
			5329,
			5337,
			5345,
			5353,
			5361,
			5369,
			5377,
			5385,
			5393,
			5401,
			5409,
			5417,
			5425,
			5433,
			5441,
			5449,
			5457,
			5465,
			5473,
			5481,
			5489,
			5497,
			5505,
			5513,
			5521,
			5529,
			5537,
			5545,
			5553,
			5561,
			5569,
			5577,
			5585,
			5593,
			5601,
			5609,
			5617,
			5625,
			5633,
			5641,
			5649,
			5657,
			5665,
			5673,
			5681,
			5689,
			5697,
			5705,
			5713,
			5721,
			5729,
			5737,
			5745,
			5753,
			5761,
			5769,
			5777,
			5785,
			5793,
			5801,
			5809,
			5817,
			5825,
			5833,
			5841,
			5849,
			5857,
			5865,
			5873,
			5881,
			5889,
			5897,
			5905,
			5913,
			5921,
			5929,
			5937,
			5945,
			5953,
			5961,
			5969,
			5977,
			5985,
			5993,
			6001,
			6009,
			6017,
			6025,
			6033,
			6041,
			6049,
			6057,
			6065,
			6073,
			6081,
			6089,
			6097,
			6105,
			6113,
			6121,
			6129,
			6137,
			6145,
			6153,
			6161,
			6169,
			6177,
			6185,
			6193,
			6201,
			6209,
			6217,
			6225,
			6233,
			6241,
			6249,
			6257,
			6265,
			6273,
			6281,
			6289,
			6297,
			6305,
			6313,
			6321,
			6329,
			6337,
			6345,
			6353,
			6361,
			6369,
			6377,
			6385,
			6393,
			6401,
			6409,
			6417,
			6425,
			6433,
			6441,
			6449,
			6457,
			6465,
			6473,
			6481,
			6489,
			6497,
			6505,
			6513,
			6521,
			6529,
			6537,
			6545,
			6553,
			6561,
			6569,
			6577,
			6585,
			6593,
			6601,
			6609,
			6617,
			6625,
			6633,
			6641,
			6649,
			6657,
			6665,
			6673,
			6681,
			6689,
			6697,
			6705,
			6713,
			6721,
			6729,
			6737,
			6745,
			6753,
			6761,
			6769,
			6777,
			6785,
			6793,
			6801,
			6809,
			6817,
			6825,
			6833,
			6841,
			6849,
			6857,
			6865,
			6873,
			6881,
			6889,
			6897,
			6905,
			6913,
			6921,
			6929,
			6937,
			6945,
			6953,
			6961,
			6969,
			6977,
			6985,
			6993,
			7001,
			7009,
			7017,
			7025,
			7033,
			7041,
			7049,
			7057,
			7065,
			7073,
			7081,
			7089,
			7097,
			7105,
			7113,
			7121,
			7129,
			7137,
			7145,
			7153,
			7161,
			7169,
			7177,
			7185,
			7193,
			7201,
			7209,
			7217,
			7225,
			7233,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			7249,
			7249,
			7249,
			7249,
			7249,
			7249,
			7249,
			7249,
			7249,
			7249,
			7249,
			7249,
			7249,
			7249,
			7249,
			7249,
			7257,
			7265,
			7273,
			7281,
			7281,
			7281,
			7281,
			7281,
			7281,
			7281,
			7281,
			7281,
			7281,
			7281,
			7281,
			7281,
			7281,
			7289,
			7297,
			7305,
			7305,
			7305,
			7305,
			7313,
			7321,
			7329,
			7337,
			7345,
			7353,
			7353,
			7353,
			7361,
			7369,
			7377,
			7385,
			7393,
			7401,
			7409,
			7417,
			7425,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7241,
			7972,
			7972,
			8100,
			8164,
			8228,
			8292,
			8356,
			8420,
			8484,
			8548,
			8612,
			8676,
			8740,
			8804,
			8868,
			8932,
			8996,
			9060,
			9124,
			9188,
			9252,
			9316,
			9380,
			9444,
			9508,
			9572,
			9636,
			9700,
			9764,
			9828,
			9892,
			9956,
			2593,
			2657,
			2721,
			2529,
			2785,
			2529,
			2849,
			2913,
			2977,
			3041,
			3105,
			3169,
			3233,
			3297,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			3361,
			2529,
			2529,
			2529,
			3425,
			2529,
			2529,
			3489,
			3553,
			2529,
			3617,
			3681,
			3745,
			3809,
			3873,
			3937,
			4001,
			4065,
			4129,
			4193,
			4257,
			4321,
			4385,
			4449,
			4513,
			4577,
			4641,
			4705,
			4769,
			4833,
			4897,
			4961,
			5025,
			5089,
			5153,
			5217,
			5281,
			5345,
			5409,
			5473,
			5537,
			5601,
			5665,
			5729,
			5793,
			5857,
			5921,
			5985,
			6049,
			6113,
			6177,
			6241,
			6305,
			6369,
			6433,
			6497,
			6561,
			6625,
			6689,
			6753,
			6817,
			6881,
			6945,
			7009,
			7073,
			7137,
			7201,
			7265,
			7329,
			7393,
			7457,
			7521,
			7585,
			7649,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			2529,
			7713,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			7433,
			7433,
			7433,
			7433,
			7433,
			7433,
			7433,
			7441,
			7449,
			7457,
			7457,
			7457,
			7457,
			7457,
			7457,
			7465,
			2009,
			2009,
			2009,
			2009,
			7473,
			7473,
			7473,
			7473,
			7473,
			7473,
			7473,
			7473,
			7481,
			7489,
			7497,
			7505,
			7505,
			7505,
			7505,
			7505,
			7513,
			7521,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			7529,
			7529,
			7537,
			7545,
			7545,
			7545,
			7545,
			7545,
			7553,
			7561,
			7561,
			7561,
			7561,
			7561,
			7561,
			7561,
			7569,
			7577,
			7585,
			7593,
			7593,
			7593,
			7593,
			7593,
			7593,
			7601,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7609,
			7617,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			7625,
			7633,
			7641,
			7649,
			7657,
			7665,
			7673,
			7681,
			7689,
			7697,
			7705,
			2009,
			7713,
			7721,
			7729,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			7737,
			7745,
			7753,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7761,
			7769,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			7777,
			7777,
			7777,
			7777,
			7777,
			7777,
			7777,
			7777,
			7777,
			7777,
			7777,
			7777,
			7777,
			7777,
			7777,
			7777,
			7777,
			7777,
			7785,
			7793,
			7801,
			7809,
			7809,
			7809,
			7809,
			7809,
			7809,
			7817,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7825,
			7833,
			7841,
			7849,
			2009,
			2009,
			2009,
			7857,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			7865,
			7865,
			7865,
			7865,
			7865,
			7865,
			7865,
			7865,
			7865,
			7865,
			7865,
			7873,
			7881,
			7889,
			7897,
			7897,
			7897,
			7897,
			7905,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7913,
			7921,
			7929,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			7937,
			7937,
			7937,
			7937,
			7937,
			7937,
			7937,
			7945,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			7953,
			7953,
			7953,
			7953,
			7953,
			7953,
			7953,
			2009,
			7961,
			7969,
			7977,
			7985,
			7993,
			2009,
			2009,
			8001,
			8009,
			8009,
			8009,
			8009,
			8009,
			8009,
			8009,
			8009,
			8009,
			8009,
			8009,
			8009,
			8009,
			8017,
			8025,
			8025,
			8025,
			8025,
			8025,
			8025,
			8025,
			8033,
			8041,
			8049,
			8057,
			8065,
			8073,
			8081,
			8081,
			8081,
			8081,
			8081,
			8081,
			8081,
			8081,
			8081,
			8081,
			8081,
			8089,
			2009,
			8097,
			8097,
			8097,
			8105,
			2009,
			2009,
			2009,
			2009,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8113,
			8121,
			8129,
			8137,
			8137,
			8137,
			8137,
			8137,
			8137,
			8137,
			8137,
			8137,
			8137,
			8137,
			8137,
			8137,
			8137,
			8145,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			2009,
			67496,
			67496,
			67496,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			17,
			34,
			30,
			30,
			33,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			38,
			6,
			3,
			12,
			9,
			10,
			12,
			3,
			0,
			2,
			12,
			9,
			8,
			16,
			8,
			7,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			8,
			8,
			12,
			12,
			12,
			6,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			0,
			9,
			2,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			0,
			17,
			1,
			12,
			21,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			35,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			4,
			0,
			10,
			9,
			9,
			9,
			12,
			29,
			29,
			12,
			29,
			3,
			12,
			17,
			12,
			12,
			10,
			9,
			29,
			29,
			18,
			12,
			29,
			29,
			29,
			29,
			29,
			3,
			29,
			29,
			29,
			0,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			18,
			29,
			29,
			29,
			18,
			29,
			12,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			29,
			29,
			29,
			12,
			29,
			12,
			18,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			4,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			4,
			4,
			4,
			4,
			4,
			4,
			4,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			8,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			8,
			17,
			39,
			39,
			39,
			39,
			9,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			17,
			21,
			12,
			21,
			21,
			12,
			21,
			21,
			6,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			10,
			10,
			10,
			8,
			8,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			6,
			6,
			6,
			6,
			6,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			10,
			11,
			11,
			12,
			12,
			12,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			6,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			21,
			21,
			12,
			21,
			21,
			21,
			21,
			12,
			12,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			8,
			6,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			21,
			21,
			21,
			12,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			17,
			17,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			21,
			21,
			21,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			21,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			12,
			12,
			10,
			10,
			12,
			12,
			12,
			12,
			12,
			10,
			12,
			9,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			21,
			21,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			21,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			12,
			9,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			21,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			9,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			21,
			21,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			21,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			21,
			21,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			21,
			21,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			10,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			21,
			21,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			39,
			39,
			39,
			39,
			9,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			12,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			17,
			17,
			39,
			39,
			39,
			39,
			39,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			36,
			36,
			36,
			36,
			12,
			18,
			18,
			18,
			18,
			12,
			18,
			18,
			4,
			18,
			18,
			17,
			4,
			6,
			6,
			6,
			6,
			6,
			4,
			12,
			6,
			12,
			12,
			12,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			17,
			21,
			12,
			21,
			12,
			21,
			0,
			1,
			0,
			1,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			17,
			21,
			21,
			21,
			21,
			21,
			17,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			17,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			18,
			18,
			17,
			18,
			12,
			12,
			12,
			12,
			12,
			4,
			4,
			39,
			39,
			39,
			39,
			39,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			17,
			17,
			12,
			12,
			12,
			12,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			36,
			36,
			36,
			36,
			36,
			36,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			21,
			21,
			21,
			12,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			0,
			1,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			17,
			17,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			17,
			17,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			21,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			17,
			17,
			5,
			36,
			17,
			12,
			17,
			9,
			36,
			36,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			6,
			6,
			17,
			17,
			18,
			12,
			6,
			6,
			12,
			21,
			21,
			21,
			4,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			39,
			39,
			12,
			39,
			39,
			39,
			6,
			6,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			39,
			39,
			39,
			39,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			36,
			36,
			36,
			36,
			36,
			36,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			12,
			12,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			39,
			39,
			21,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			39,
			39,
			39,
			39,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			17,
			17,
			12,
			17,
			17,
			17,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			39,
			17,
			17,
			17,
			17,
			17,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			39,
			12,
			12,
			12,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			17,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			21,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			18,
			12,
			39,
			17,
			17,
			17,
			17,
			17,
			17,
			17,
			4,
			17,
			17,
			17,
			20,
			21,
			21,
			21,
			21,
			17,
			4,
			17,
			17,
			19,
			29,
			29,
			12,
			3,
			3,
			0,
			3,
			3,
			3,
			0,
			3,
			29,
			29,
			12,
			12,
			15,
			15,
			15,
			17,
			30,
			30,
			21,
			21,
			21,
			21,
			21,
			4,
			10,
			10,
			10,
			10,
			10,
			10,
			10,
			10,
			12,
			3,
			3,
			29,
			5,
			5,
			12,
			12,
			12,
			12,
			12,
			12,
			8,
			0,
			1,
			5,
			5,
			5,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			17,
			12,
			17,
			17,
			17,
			17,
			12,
			17,
			17,
			17,
			22,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			39,
			39,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			0,
			1,
			29,
			12,
			29,
			29,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			0,
			1,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			9,
			9,
			9,
			9,
			9,
			9,
			9,
			10,
			9,
			9,
			9,
			9,
			9,
			9,
			9,
			9,
			9,
			9,
			9,
			9,
			9,
			9,
			10,
			9,
			9,
			9,
			9,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			10,
			12,
			29,
			12,
			12,
			12,
			10,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			12,
			9,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			12,
			29,
			12,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			12,
			12,
			12,
			12,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			29,
			29,
			12,
			12,
			12,
			29,
			29,
			12,
			12,
			29,
			12,
			12,
			12,
			29,
			12,
			29,
			9,
			9,
			12,
			29,
			12,
			12,
			12,
			12,
			29,
			12,
			12,
			29,
			29,
			29,
			29,
			12,
			12,
			29,
			12,
			29,
			12,
			29,
			29,
			29,
			29,
			29,
			29,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			29,
			29,
			29,
			29,
			12,
			12,
			12,
			12,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			12,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			29,
			12,
			12,
			29,
			29,
			29,
			29,
			12,
			12,
			29,
			29,
			12,
			12,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			29,
			12,
			12,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			12,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			14,
			14,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			0,
			1,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			14,
			14,
			14,
			14,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			12,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			12,
			12,
			12,
			12,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			12,
			12,
			29,
			29,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			29,
			12,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			29,
			12,
			12,
			29,
			29,
			12,
			12,
			12,
			12,
			29,
			29,
			12,
			12,
			29,
			29,
			12,
			12,
			12,
			12,
			29,
			29,
			29,
			12,
			12,
			29,
			12,
			12,
			29,
			29,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			29,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			14,
			14,
			14,
			14,
			12,
			29,
			29,
			12,
			12,
			29,
			12,
			12,
			12,
			12,
			29,
			29,
			12,
			12,
			12,
			12,
			14,
			14,
			29,
			29,
			14,
			12,
			14,
			14,
			14,
			14,
			14,
			14,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			14,
			14,
			14,
			12,
			12,
			12,
			12,
			29,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			29,
			12,
			29,
			29,
			29,
			12,
			29,
			14,
			29,
			29,
			12,
			29,
			29,
			12,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			14,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			29,
			29,
			29,
			29,
			14,
			12,
			14,
			14,
			14,
			29,
			14,
			14,
			29,
			29,
			29,
			14,
			14,
			29,
			29,
			14,
			29,
			29,
			14,
			14,
			14,
			12,
			29,
			12,
			12,
			12,
			12,
			29,
			29,
			14,
			29,
			29,
			29,
			29,
			29,
			29,
			14,
			14,
			14,
			14,
			14,
			29,
			14,
			14,
			14,
			14,
			29,
			29,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			12,
			12,
			12,
			14,
			14,
			14,
			14,
			14,
			14,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			12,
			12,
			12,
			3,
			3,
			3,
			3,
			12,
			12,
			12,
			6,
			6,
			12,
			12,
			12,
			12,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			0,
			1,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			0,
			1,
			0,
			1,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			0,
			1,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			29,
			29,
			29,
			29,
			29,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			6,
			17,
			17,
			17,
			12,
			6,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			17,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			3,
			3,
			3,
			3,
			3,
			3,
			3,
			3,
			3,
			3,
			3,
			3,
			3,
			3,
			17,
			17,
			17,
			17,
			17,
			17,
			17,
			17,
			12,
			17,
			0,
			17,
			12,
			12,
			3,
			3,
			12,
			12,
			3,
			3,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			17,
			17,
			17,
			17,
			6,
			12,
			17,
			17,
			12,
			17,
			17,
			12,
			12,
			12,
			12,
			12,
			19,
			19,
			39,
			39,
			39,
			39,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			1,
			1,
			14,
			14,
			5,
			14,
			14,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			14,
			14,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			5,
			0,
			1,
			1,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			21,
			21,
			21,
			21,
			21,
			21,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			5,
			5,
			14,
			14,
			14,
			39,
			32,
			14,
			32,
			14,
			32,
			14,
			32,
			14,
			32,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			32,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			32,
			14,
			32,
			14,
			32,
			14,
			14,
			14,
			14,
			14,
			14,
			32,
			14,
			14,
			14,
			14,
			14,
			14,
			32,
			32,
			39,
			39,
			21,
			21,
			5,
			5,
			5,
			5,
			14,
			5,
			32,
			14,
			32,
			14,
			32,
			14,
			32,
			14,
			32,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			32,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			32,
			14,
			32,
			14,
			32,
			14,
			14,
			14,
			14,
			14,
			14,
			32,
			14,
			14,
			14,
			14,
			14,
			14,
			32,
			32,
			14,
			14,
			14,
			14,
			5,
			32,
			5,
			5,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			32,
			32,
			32,
			32,
			32,
			32,
			32,
			32,
			32,
			32,
			32,
			32,
			32,
			32,
			32,
			32,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			5,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			17,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			17,
			6,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			12,
			17,
			17,
			17,
			17,
			17,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			12,
			12,
			12,
			21,
			12,
			12,
			12,
			12,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			10,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			18,
			18,
			6,
			6,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			17,
			17,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			17,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			25,
			39,
			39,
			39,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			17,
			17,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			12,
			17,
			17,
			17,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			36,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			17,
			17,
			12,
			12,
			12,
			21,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			17,
			21,
			21,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			39,
			39,
			39,
			39,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			23,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			24,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			26,
			39,
			39,
			39,
			39,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			27,
			39,
			39,
			39,
			39,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			37,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			13,
			21,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			12,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			13,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			0,
			1,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			10,
			12,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			8,
			1,
			1,
			8,
			8,
			6,
			6,
			0,
			1,
			15,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			14,
			14,
			14,
			14,
			14,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			14,
			14,
			0,
			1,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			1,
			14,
			1,
			39,
			5,
			5,
			6,
			6,
			14,
			0,
			1,
			0,
			1,
			0,
			1,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			9,
			10,
			14,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			22,
			39,
			6,
			14,
			14,
			9,
			10,
			14,
			14,
			0,
			1,
			14,
			14,
			1,
			14,
			1,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			5,
			5,
			14,
			14,
			14,
			6,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			0,
			14,
			1,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			0,
			14,
			1,
			14,
			0,
			1,
			1,
			0,
			1,
			1,
			5,
			12,
			32,
			32,
			32,
			32,
			32,
			32,
			32,
			32,
			32,
			32,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			5,
			5,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			10,
			9,
			14,
			14,
			14,
			9,
			9,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			31,
			29,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			17,
			17,
			17,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			17,
			17,
			17,
			17,
			17,
			17,
			17,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			17,
			17,
			17,
			17,
			17,
			17,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			17,
			17,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			17,
			17,
			17,
			17,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			17,
			17,
			17,
			17,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			17,
			17,
			12,
			17,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			17,
			17,
			17,
			17,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			0,
			0,
			0,
			1,
			1,
			1,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			1,
			12,
			12,
			12,
			0,
			1,
			0,
			1,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			0,
			1,
			1,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			14,
			14,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			21,
			21,
			21,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			11,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			12,
			39,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			12,
			12,
			39,
			39,
			39,
			39,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			29,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			28,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			12,
			12,
			14,
			14,
			14,
			14,
			14,
			12,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			12,
			14,
			12,
			14,
			12,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			12,
			14,
			12,
			12,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			12,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			14,
			39,
			39,
			39,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			21,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39,
			39
		],
		"highStart": 919552,
		"errorValue": 0
	};

/***/ },
/* 55 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.7.1
	(function() {
	  var AI, AL, B2, BA, BB, BK, CB, CJ, CL, CM, CP, CR, EX, GL, H2, H3, HL, HY, ID, IN, IS, JL, JT, JV, LF, NL, NS, NU, OP, PO, PR, QU, RI, SA, SG, SP, SY, WJ, XX, ZW;

	  exports.OP = OP = 0;

	  exports.CL = CL = 1;

	  exports.CP = CP = 2;

	  exports.QU = QU = 3;

	  exports.GL = GL = 4;

	  exports.NS = NS = 5;

	  exports.EX = EX = 6;

	  exports.SY = SY = 7;

	  exports.IS = IS = 8;

	  exports.PR = PR = 9;

	  exports.PO = PO = 10;

	  exports.NU = NU = 11;

	  exports.AL = AL = 12;

	  exports.HL = HL = 13;

	  exports.ID = ID = 14;

	  exports.IN = IN = 15;

	  exports.HY = HY = 16;

	  exports.BA = BA = 17;

	  exports.BB = BB = 18;

	  exports.B2 = B2 = 19;

	  exports.ZW = ZW = 20;

	  exports.CM = CM = 21;

	  exports.WJ = WJ = 22;

	  exports.H2 = H2 = 23;

	  exports.H3 = H3 = 24;

	  exports.JL = JL = 25;

	  exports.JV = JV = 26;

	  exports.JT = JT = 27;

	  exports.RI = RI = 28;

	  exports.AI = AI = 29;

	  exports.BK = BK = 30;

	  exports.CB = CB = 31;

	  exports.CJ = CJ = 32;

	  exports.CR = CR = 33;

	  exports.LF = LF = 34;

	  exports.NL = NL = 35;

	  exports.SA = SA = 36;

	  exports.SG = SG = 37;

	  exports.SP = SP = 38;

	  exports.XX = XX = 39;

	}).call(this);


/***/ },
/* 56 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.7.1
	(function() {
	  var CI_BRK, CP_BRK, DI_BRK, IN_BRK, PR_BRK;

	  exports.DI_BRK = DI_BRK = 0;

	  exports.IN_BRK = IN_BRK = 1;

	  exports.CI_BRK = CI_BRK = 2;

	  exports.CP_BRK = CP_BRK = 3;

	  exports.PR_BRK = PR_BRK = 4;

	  exports.pairTable = [[PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, CP_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, DI_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, DI_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, PR_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK]];

	}).call(this);


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var PDFImage;

	  PDFImage = __webpack_require__(58);

	  module.exports = {
	    initImages: function() {
	      this._imageRegistry = {};
	      return this._imageCount = 0;
	    },
	    image: function(src, x, y, options) {
	      var base, bh, bp, bw, h, hp, image, ip, name, ref, ref1, ref2, w, wp;
	      if (options == null) {
	        options = {};
	      }
	      if (typeof x === 'object') {
	        options = x;
	        x = null;
	      }
	      x = (ref = x != null ? x : options.x) != null ? ref : this.x;
	      y = (ref1 = y != null ? y : options.y) != null ? ref1 : this.y;
	      if (!Buffer.isBuffer(src)) {
	        image = this._imageRegistry[src];
	      }
	      if (!image) {
	        image = PDFImage.open(src, 'I' + (++this._imageCount));
	        image.embed(this);
	        if (!Buffer.isBuffer(src)) {
	          this._imageRegistry[src] = image;
	        }
	      }
	      if ((base = this.page.xobjects)[name = image.label] == null) {
	        base[name] = image.obj;
	      }
	      w = options.width || image.width;
	      h = options.height || image.height;
	      if (options.width && !options.height) {
	        wp = w / image.width;
	        w = image.width * wp;
	        h = image.height * wp;
	      } else if (options.height && !options.width) {
	        hp = h / image.height;
	        w = image.width * hp;
	        h = image.height * hp;
	      } else if (options.scale) {
	        w = image.width * options.scale;
	        h = image.height * options.scale;
	      } else if (options.fit) {
	        ref2 = options.fit, bw = ref2[0], bh = ref2[1];
	        bp = bw / bh;
	        ip = image.width / image.height;
	        if (ip > bp) {
	          w = bw;
	          h = bw / ip;
	        } else {
	          h = bh;
	          w = bh * ip;
	        }
	        if (options.align === 'center') {
	          x = x + bw / 2 - w / 2;
	        } else if (options.align === 'right') {
	          x = x + bw - w;
	        }
	        if (options.valign === 'center') {
	          y = y + bh / 2 - h / 2;
	        } else if (options.valign === 'bottom') {
	          y = y + bh - h;
	        }
	      }
	      if (this.y === y) {
	        this.y += h;
	      }
	      this.save();
	      this.transform(w, 0, 0, -h, x, y + h);
	      this.addContent("/" + image.label + " Do");
	      this.restore();
	      return this;
	    }
	  };

	}).call(this);


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0

	/*
	PDFImage - embeds images in PDF documents
	By Devon Govett
	 */

	(function() {
	  var Data, JPEG, PDFImage, PNG, fs;

	  fs = __webpack_require__(20);

	  Data = __webpack_require__(32);

	  JPEG = __webpack_require__(59);

	  PNG = __webpack_require__(60);

	  PDFImage = (function() {
	    function PDFImage() {}

	    PDFImage.open = function(src, label) {
	      var data, match;
	      if (Buffer.isBuffer(src)) {
	        data = src;
	      } else {
	        if (match = /^data:.+;base64,(.*)$/.exec(src)) {
	          data = new Buffer(match[1], 'base64');
	        } else {
	          data = fs.readFileSync(src);
	          if (!data) {
	            return;
	          }
	        }
	      }
	      if (data[0] === 0xff && data[1] === 0xd8) {
	        return new JPEG(data, label);
	      } else if (data[0] === 0x89 && data.toString('ascii', 1, 4) === 'PNG') {
	        return new PNG(data, label);
	      } else {
	        throw new Error('Unknown image format.');
	      }
	    };

	    return PDFImage;

	  })();

	  module.exports = PDFImage;

	}).call(this);


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var JPEG, fs,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  fs = __webpack_require__(20);

	  JPEG = (function() {
	    var MARKERS;

	    MARKERS = [0xFFC0, 0xFFC1, 0xFFC2, 0xFFC3, 0xFFC5, 0xFFC6, 0xFFC7, 0xFFC8, 0xFFC9, 0xFFCA, 0xFFCB, 0xFFCC, 0xFFCD, 0xFFCE, 0xFFCF];

	    function JPEG(data, label) {
	      var channels, marker, pos;
	      this.data = data;
	      this.label = label;
	      if (this.data.readUInt16BE(0) !== 0xFFD8) {
	        throw "SOI not found in JPEG";
	      }
	      pos = 2;
	      while (pos < this.data.length) {
	        marker = this.data.readUInt16BE(pos);
	        pos += 2;
	        if (indexOf.call(MARKERS, marker) >= 0) {
	          break;
	        }
	        pos += this.data.readUInt16BE(pos);
	      }
	      if (indexOf.call(MARKERS, marker) < 0) {
	        throw "Invalid JPEG.";
	      }
	      pos += 2;
	      this.bits = this.data[pos++];
	      this.height = this.data.readUInt16BE(pos);
	      pos += 2;
	      this.width = this.data.readUInt16BE(pos);
	      pos += 2;
	      channels = this.data[pos++];
	      this.colorSpace = (function() {
	        switch (channels) {
	          case 1:
	            return 'DeviceGray';
	          case 3:
	            return 'DeviceRGB';
	          case 4:
	            return 'DeviceCMYK';
	        }
	      })();
	      this.obj = null;
	    }

	    JPEG.prototype.embed = function(document) {
	      if (this.obj) {
	        return;
	      }
	      this.obj = document.ref({
	        Type: 'XObject',
	        Subtype: 'Image',
	        BitsPerComponent: this.bits,
	        Width: this.width,
	        Height: this.height,
	        ColorSpace: this.colorSpace,
	        Filter: 'DCTDecode'
	      });
	      if (this.colorSpace === 'DeviceCMYK') {
	        this.obj.data['Decode'] = [1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0];
	      }
	      this.obj.end(this.data);
	      return this.data = null;
	    };

	    return JPEG;

	  })();

	  module.exports = JPEG;

	}).call(this);


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var PNG, PNGImage, zlib;

	  zlib = __webpack_require__(23);

	  PNG = __webpack_require__(61);

	  PNGImage = (function() {
	    function PNGImage(data, label) {
	      this.label = label;
	      this.image = new PNG(data);
	      this.width = this.image.width;
	      this.height = this.image.height;
	      this.imgData = this.image.imgData;
	      this.obj = null;
	    }

	    PNGImage.prototype.embed = function(document) {
	      var k, len1, mask, palette, params, rgb, val, x;
	      this.document = document;
	      if (this.obj) {
	        return;
	      }
	      this.obj = this.document.ref({
	        Type: 'XObject',
	        Subtype: 'Image',
	        BitsPerComponent: this.image.bits,
	        Width: this.width,
	        Height: this.height,
	        Filter: 'FlateDecode'
	      });
	      if (!this.image.hasAlphaChannel) {
	        params = this.document.ref({
	          Predictor: 15,
	          Colors: this.image.colors,
	          BitsPerComponent: this.image.bits,
	          Columns: this.width
	        });
	        this.obj.data['DecodeParms'] = params;
	        params.end();
	      }
	      if (this.image.palette.length === 0) {
	        this.obj.data['ColorSpace'] = this.image.colorSpace;
	      } else {
	        palette = this.document.ref();
	        palette.end(new Buffer(this.image.palette));
	        this.obj.data['ColorSpace'] = ['Indexed', 'DeviceRGB', (this.image.palette.length / 3) - 1, palette];
	      }
	      if (this.image.transparency.grayscale) {
	        val = this.image.transparency.greyscale;
	        return this.obj.data['Mask'] = [val, val];
	      } else if (this.image.transparency.rgb) {
	        rgb = this.image.transparency.rgb;
	        mask = [];
	        for (k = 0, len1 = rgb.length; k < len1; k++) {
	          x = rgb[k];
	          mask.push(x, x);
	        }
	        return this.obj.data['Mask'] = mask;
	      } else if (this.image.transparency.indexed) {
	        return this.loadIndexedAlphaChannel();
	      } else if (this.image.hasAlphaChannel) {
	        return this.splitAlphaChannel();
	      } else {
	        return this.finalize();
	      }
	    };

	    PNGImage.prototype.finalize = function() {
	      var sMask;
	      if (this.alphaChannel) {
	        sMask = this.document.ref({
	          Type: 'XObject',
	          Subtype: 'Image',
	          Height: this.height,
	          Width: this.width,
	          BitsPerComponent: 8,
	          Filter: 'FlateDecode',
	          ColorSpace: 'DeviceGray',
	          Decode: [0, 1]
	        });
	        sMask.end(this.alphaChannel);
	        this.obj.data['SMask'] = sMask;
	      }
	      this.obj.end(this.imgData);
	      this.image = null;
	      return this.imgData = null;
	    };

	    PNGImage.prototype.splitAlphaChannel = function() {
	      return this.image.decodePixels((function(_this) {
	        return function(pixels) {
	          var a, alphaChannel, colorByteSize, done, i, imgData, len, p, pixelCount;
	          colorByteSize = _this.image.colors * _this.image.bits / 8;
	          pixelCount = _this.width * _this.height;
	          imgData = new Buffer(pixelCount * colorByteSize);
	          alphaChannel = new Buffer(pixelCount);
	          i = p = a = 0;
	          len = pixels.length;
	          while (i < len) {
	            imgData[p++] = pixels[i++];
	            imgData[p++] = pixels[i++];
	            imgData[p++] = pixels[i++];
	            alphaChannel[a++] = pixels[i++];
	          }
	          done = 0;
	          zlib.deflate(imgData, function(err, imgData1) {
	            _this.imgData = imgData1;
	            if (err) {
	              throw err;
	            }
	            if (++done === 2) {
	              return _this.finalize();
	            }
	          });
	          return zlib.deflate(alphaChannel, function(err, alphaChannel1) {
	            _this.alphaChannel = alphaChannel1;
	            if (err) {
	              throw err;
	            }
	            if (++done === 2) {
	              return _this.finalize();
	            }
	          });
	        };
	      })(this));
	    };

	    PNGImage.prototype.loadIndexedAlphaChannel = function(fn) {
	      var transparency;
	      transparency = this.image.transparency.indexed;
	      return this.image.decodePixels((function(_this) {
	        return function(pixels) {
	          var alphaChannel, i, j, k, ref;
	          alphaChannel = new Buffer(_this.width * _this.height);
	          i = 0;
	          for (j = k = 0, ref = pixels.length; k < ref; j = k += 1) {
	            alphaChannel[i++] = transparency[pixels[j]];
	          }
	          return zlib.deflate(alphaChannel, function(err, alphaChannel1) {
	            _this.alphaChannel = alphaChannel1;
	            if (err) {
	              throw err;
	            }
	            return _this.finalize();
	          });
	        };
	      })(this));
	    };

	    return PNGImage;

	  })();

	  module.exports = PNGImage;

	}).call(this);


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.4.0

	/*
	# MIT LICENSE
	# Copyright (c) 2011 Devon Govett
	# 
	# Permission is hereby granted, free of charge, to any person obtaining a copy of this 
	# software and associated documentation files (the "Software"), to deal in the Software 
	# without restriction, including without limitation the rights to use, copy, modify, merge, 
	# publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
	# to whom the Software is furnished to do so, subject to the following conditions:
	# 
	# The above copyright notice and this permission notice shall be included in all copies or 
	# substantial portions of the Software.
	# 
	# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
	# BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
	# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
	# DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
	# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/


	(function() {
	  var PNG, fs, zlib;

	  fs = __webpack_require__(20);

	  zlib = __webpack_require__(23);

	  module.exports = PNG = (function() {

	    PNG.decode = function(path, fn) {
	      return fs.readFile(path, function(err, file) {
	        var png;
	        png = new PNG(file);
	        return png.decode(function(pixels) {
	          return fn(pixels);
	        });
	      });
	    };

	    PNG.load = function(path) {
	      var file;
	      file = fs.readFileSync(path);
	      return new PNG(file);
	    };

	    function PNG(data) {
	      var chunkSize, colors, i, index, key, section, short, text, _i, _j, _ref;
	      this.data = data;
	      this.pos = 8;
	      this.palette = [];
	      this.imgData = [];
	      this.transparency = {};
	      this.text = {};
	      while (true) {
	        chunkSize = this.readUInt32();
	        section = ((function() {
	          var _i, _results;
	          _results = [];
	          for (i = _i = 0; _i < 4; i = ++_i) {
	            _results.push(String.fromCharCode(this.data[this.pos++]));
	          }
	          return _results;
	        }).call(this)).join('');
	        switch (section) {
	          case 'IHDR':
	            this.width = this.readUInt32();
	            this.height = this.readUInt32();
	            this.bits = this.data[this.pos++];
	            this.colorType = this.data[this.pos++];
	            this.compressionMethod = this.data[this.pos++];
	            this.filterMethod = this.data[this.pos++];
	            this.interlaceMethod = this.data[this.pos++];
	            break;
	          case 'PLTE':
	            this.palette = this.read(chunkSize);
	            break;
	          case 'IDAT':
	            for (i = _i = 0; _i < chunkSize; i = _i += 1) {
	              this.imgData.push(this.data[this.pos++]);
	            }
	            break;
	          case 'tRNS':
	            this.transparency = {};
	            switch (this.colorType) {
	              case 3:
	                this.transparency.indexed = this.read(chunkSize);
	                short = 255 - this.transparency.indexed.length;
	                if (short > 0) {
	                  for (i = _j = 0; 0 <= short ? _j < short : _j > short; i = 0 <= short ? ++_j : --_j) {
	                    this.transparency.indexed.push(255);
	                  }
	                }
	                break;
	              case 0:
	                this.transparency.grayscale = this.read(chunkSize)[0];
	                break;
	              case 2:
	                this.transparency.rgb = this.read(chunkSize);
	            }
	            break;
	          case 'tEXt':
	            text = this.read(chunkSize);
	            index = text.indexOf(0);
	            key = String.fromCharCode.apply(String, text.slice(0, index));
	            this.text[key] = String.fromCharCode.apply(String, text.slice(index + 1));
	            break;
	          case 'IEND':
	            this.colors = (function() {
	              switch (this.colorType) {
	                case 0:
	                case 3:
	                case 4:
	                  return 1;
	                case 2:
	                case 6:
	                  return 3;
	              }
	            }).call(this);
	            this.hasAlphaChannel = (_ref = this.colorType) === 4 || _ref === 6;
	            colors = this.colors + (this.hasAlphaChannel ? 1 : 0);
	            this.pixelBitlength = this.bits * colors;
	            this.colorSpace = (function() {
	              switch (this.colors) {
	                case 1:
	                  return 'DeviceGray';
	                case 3:
	                  return 'DeviceRGB';
	              }
	            }).call(this);
	            this.imgData = new Buffer(this.imgData);
	            return;
	          default:
	            this.pos += chunkSize;
	        }
	        this.pos += 4;
	        if (this.pos > this.data.length) {
	          throw new Error("Incomplete or corrupt PNG file");
	        }
	      }
	      return;
	    }

	    PNG.prototype.read = function(bytes) {
	      var i, _i, _results;
	      _results = [];
	      for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
	        _results.push(this.data[this.pos++]);
	      }
	      return _results;
	    };

	    PNG.prototype.readUInt32 = function() {
	      var b1, b2, b3, b4;
	      b1 = this.data[this.pos++] << 24;
	      b2 = this.data[this.pos++] << 16;
	      b3 = this.data[this.pos++] << 8;
	      b4 = this.data[this.pos++];
	      return b1 | b2 | b3 | b4;
	    };

	    PNG.prototype.readUInt16 = function() {
	      var b1, b2;
	      b1 = this.data[this.pos++] << 8;
	      b2 = this.data[this.pos++];
	      return b1 | b2;
	    };

	    PNG.prototype.decodePixels = function(fn) {
	      var _this = this;
	      return zlib.inflate(this.imgData, function(err, data) {
	        var byte, c, col, i, left, length, p, pa, paeth, pb, pc, pixelBytes, pixels, pos, row, scanlineLength, upper, upperLeft, _i, _j, _k, _l, _m;
	        if (err) {
	          throw err;
	        }
	        pixelBytes = _this.pixelBitlength / 8;
	        scanlineLength = pixelBytes * _this.width;
	        pixels = new Buffer(scanlineLength * _this.height);
	        length = data.length;
	        row = 0;
	        pos = 0;
	        c = 0;
	        while (pos < length) {
	          switch (data[pos++]) {
	            case 0:
	              for (i = _i = 0; _i < scanlineLength; i = _i += 1) {
	                pixels[c++] = data[pos++];
	              }
	              break;
	            case 1:
	              for (i = _j = 0; _j < scanlineLength; i = _j += 1) {
	                byte = data[pos++];
	                left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
	                pixels[c++] = (byte + left) % 256;
	              }
	              break;
	            case 2:
	              for (i = _k = 0; _k < scanlineLength; i = _k += 1) {
	                byte = data[pos++];
	                col = (i - (i % pixelBytes)) / pixelBytes;
	                upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
	                pixels[c++] = (upper + byte) % 256;
	              }
	              break;
	            case 3:
	              for (i = _l = 0; _l < scanlineLength; i = _l += 1) {
	                byte = data[pos++];
	                col = (i - (i % pixelBytes)) / pixelBytes;
	                left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
	                upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
	                pixels[c++] = (byte + Math.floor((left + upper) / 2)) % 256;
	              }
	              break;
	            case 4:
	              for (i = _m = 0; _m < scanlineLength; i = _m += 1) {
	                byte = data[pos++];
	                col = (i - (i % pixelBytes)) / pixelBytes;
	                left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
	                if (row === 0) {
	                  upper = upperLeft = 0;
	                } else {
	                  upper = pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
	                  upperLeft = col && pixels[(row - 1) * scanlineLength + (col - 1) * pixelBytes + (i % pixelBytes)];
	                }
	                p = left + upper - upperLeft;
	                pa = Math.abs(p - left);
	                pb = Math.abs(p - upper);
	                pc = Math.abs(p - upperLeft);
	                if (pa <= pb && pa <= pc) {
	                  paeth = left;
	                } else if (pb <= pc) {
	                  paeth = upper;
	                } else {
	                  paeth = upperLeft;
	                }
	                pixels[c++] = (byte + paeth) % 256;
	              }
	              break;
	            default:
	              throw new Error("Invalid filter algorithm: " + data[pos - 1]);
	          }
	          row++;
	        }
	        return fn(pixels);
	      });
	    };

	    PNG.prototype.decodePalette = function() {
	      var c, i, length, palette, pos, ret, transparency, _i, _ref, _ref1;
	      palette = this.palette;
	      transparency = this.transparency.indexed || [];
	      ret = new Buffer(transparency.length + palette.length);
	      pos = 0;
	      length = palette.length;
	      c = 0;
	      for (i = _i = 0, _ref = palette.length; _i < _ref; i = _i += 3) {
	        ret[pos++] = palette[i];
	        ret[pos++] = palette[i + 1];
	        ret[pos++] = palette[i + 2];
	        ret[pos++] = (_ref1 = transparency[c++]) != null ? _ref1 : 255;
	      }
	      return ret;
	    };

	    PNG.prototype.copyToImageData = function(imageData, pixels) {
	      var alpha, colors, data, i, input, j, k, length, palette, v, _ref;
	      colors = this.colors;
	      palette = null;
	      alpha = this.hasAlphaChannel;
	      if (this.palette.length) {
	        palette = (_ref = this._decodedPalette) != null ? _ref : this._decodedPalette = this.decodePalette();
	        colors = 4;
	        alpha = true;
	      }
	      data = (imageData != null ? imageData.data : void 0) || imageData;
	      length = data.length;
	      input = palette || pixels;
	      i = j = 0;
	      if (colors === 1) {
	        while (i < length) {
	          k = palette ? pixels[i / 4] * 4 : j;
	          v = input[k++];
	          data[i++] = v;
	          data[i++] = v;
	          data[i++] = v;
	          data[i++] = alpha ? input[k++] : 255;
	          j = k;
	        }
	      } else {
	        while (i < length) {
	          k = palette ? pixels[i / 4] * 4 : j;
	          data[i++] = input[k++];
	          data[i++] = input[k++];
	          data[i++] = input[k++];
	          data[i++] = alpha ? input[k++] : 255;
	          j = k;
	        }
	      }
	    };

	    PNG.prototype.decode = function(fn) {
	      var ret,
	        _this = this;
	      ret = new Buffer(this.width * this.height * 4);
	      return this.decodePixels(function(pixels) {
	        _this.copyToImageData(ret, pixels);
	        return fn(ret);
	      });
	    };

	    return PNG;

	  })();

	}).call(this);


/***/ },
/* 62 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  module.exports = {
	    annotate: function(x, y, w, h, options) {
	      var key, ref, val;
	      options.Type = 'Annot';
	      options.Rect = this._convertRect(x, y, w, h);
	      options.Border = [0, 0, 0];
	      if (options.Subtype !== 'Link') {
	        if (options.C == null) {
	          options.C = this._normalizeColor(options.color || [0, 0, 0]);
	        }
	      }
	      delete options.color;
	      if (typeof options.Dest === 'string') {
	        options.Dest = new String(options.Dest);
	      }
	      for (key in options) {
	        val = options[key];
	        options[key[0].toUpperCase() + key.slice(1)] = val;
	      }
	      ref = this.ref(options);
	      this.page.annotations.push(ref);
	      ref.end();
	      return this;
	    },
	    note: function(x, y, w, h, contents, options) {
	      if (options == null) {
	        options = {};
	      }
	      options.Subtype = 'Text';
	      options.Contents = new String(contents);
	      options.Name = 'Comment';
	      if (options.color == null) {
	        options.color = [243, 223, 92];
	      }
	      return this.annotate(x, y, w, h, options);
	    },
	    link: function(x, y, w, h, url, options) {
	      if (options == null) {
	        options = {};
	      }
	      options.Subtype = 'Link';
	      options.A = this.ref({
	        S: 'URI',
	        URI: new String(url)
	      });
	      options.A.end();
	      return this.annotate(x, y, w, h, options);
	    },
	    _markup: function(x, y, w, h, options) {
	      var ref1, x1, x2, y1, y2;
	      if (options == null) {
	        options = {};
	      }
	      ref1 = this._convertRect(x, y, w, h), x1 = ref1[0], y1 = ref1[1], x2 = ref1[2], y2 = ref1[3];
	      options.QuadPoints = [x1, y2, x2, y2, x1, y1, x2, y1];
	      options.Contents = new String;
	      return this.annotate(x, y, w, h, options);
	    },
	    highlight: function(x, y, w, h, options) {
	      if (options == null) {
	        options = {};
	      }
	      options.Subtype = 'Highlight';
	      if (options.color == null) {
	        options.color = [241, 238, 148];
	      }
	      return this._markup(x, y, w, h, options);
	    },
	    underline: function(x, y, w, h, options) {
	      if (options == null) {
	        options = {};
	      }
	      options.Subtype = 'Underline';
	      return this._markup(x, y, w, h, options);
	    },
	    strike: function(x, y, w, h, options) {
	      if (options == null) {
	        options = {};
	      }
	      options.Subtype = 'StrikeOut';
	      return this._markup(x, y, w, h, options);
	    },
	    lineAnnotation: function(x1, y1, x2, y2, options) {
	      if (options == null) {
	        options = {};
	      }
	      options.Subtype = 'Line';
	      options.Contents = new String;
	      options.L = [x1, this.page.height - y1, x2, this.page.height - y2];
	      return this.annotate(x1, y1, x2, y2, options);
	    },
	    rectAnnotation: function(x, y, w, h, options) {
	      if (options == null) {
	        options = {};
	      }
	      options.Subtype = 'Square';
	      options.Contents = new String;
	      return this.annotate(x, y, w, h, options);
	    },
	    ellipseAnnotation: function(x, y, w, h, options) {
	      if (options == null) {
	        options = {};
	      }
	      options.Subtype = 'Circle';
	      options.Contents = new String;
	      return this.annotate(x, y, w, h, options);
	    },
	    textAnnotation: function(x, y, w, h, text, options) {
	      if (options == null) {
	        options = {};
	      }
	      options.Subtype = 'FreeText';
	      options.Contents = new String(text);
	      options.DA = new String;
	      return this.annotate(x, y, w, h, options);
	    },
	    _convertRect: function(x1, y1, w, h) {
	      var m0, m1, m2, m3, m4, m5, ref1, x2, y2;
	      y2 = y1;
	      y1 += h;
	      x2 = x1 + w;
	      ref1 = this._ctm, m0 = ref1[0], m1 = ref1[1], m2 = ref1[2], m3 = ref1[3], m4 = ref1[4], m5 = ref1[5];
	      x1 = m0 * x1 + m2 * y1 + m4;
	      y1 = m1 * x1 + m3 * y1 + m5;
	      x2 = m0 * x2 + m2 * y2 + m4;
	      y2 = m1 * x2 + m3 * y2 + m5;
	      return [x1, y1, x2, y2];
	    }
	  };

	}).call(this);


/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = {
		'4A0': [4767.87, 6740.79],
		'2A0': [3370.39, 4767.87],
		A0: [2383.94, 3370.39],
		A1: [1683.78, 2383.94],
		A2: [1190.55, 1683.78],
		A3: [841.89, 1190.55],
		A4: [595.28, 841.89],
		A5: [419.53, 595.28],
		A6: [297.64, 419.53],
		A7: [209.76, 297.64],
		A8: [147.40, 209.76],
		A9: [104.88, 147.40],
		A10: [73.70, 104.88],
		B0: [2834.65, 4008.19],
		B1: [2004.09, 2834.65],
		B2: [1417.32, 2004.09],
		B3: [1000.63, 1417.32],
		B4: [708.66, 1000.63],
		B5: [498.90, 708.66],
		B6: [354.33, 498.90],
		B7: [249.45, 354.33],
		B8: [175.75, 249.45],
		B9: [124.72, 175.75],
		B10: [87.87, 124.72],
		C0: [2599.37, 3676.54],
		C1: [1836.85, 2599.37],
		C2: [1298.27, 1836.85],
		C3: [918.43, 1298.27],
		C4: [649.13, 918.43],
		C5: [459.21, 649.13],
		C6: [323.15, 459.21],
		C7: [229.61, 323.15],
		C8: [161.57, 229.61],
		C9: [113.39, 161.57],
		C10: [79.37, 113.39],
		RA0: [2437.80, 3458.27],
		RA1: [1729.13, 2437.80],
		RA2: [1218.90, 1729.13],
		RA3: [864.57, 1218.90],
		RA4: [609.45, 864.57],
		SRA0: [2551.18, 3628.35],
		SRA1: [1814.17, 2551.18],
		SRA2: [1275.59, 1814.17],
		SRA3: [907.09, 1275.59],
		SRA4: [637.80, 907.09],
		EXECUTIVE: [521.86, 756.00],
		FOLIO: [612.00, 936.00],
		LEGAL: [612.00, 1008.00],
		LETTER: [612.00, 792.00],
		TABLOID: [792.00, 1224.00]
	};


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/* jslint node: true */
	'use strict';

	var pdfKit = __webpack_require__(18);
	var PDFImage = __webpack_require__(58);

	function ImageMeasure(pdfDoc, imageDictionary) {
		this.pdfDoc = pdfDoc;
		this.imageDictionary = imageDictionary || {};
	}

	ImageMeasure.prototype.measureImage = function(src) {
		var image, label;
		var that = this;

		if (!this.pdfDoc._imageRegistry[src]) {
			label = 'I' + (++this.pdfDoc._imageCount);
			image = PDFImage.open(realImageSrc(src), label);
			image.embed(this.pdfDoc);
			this.pdfDoc._imageRegistry[src] = image;
		} else {
			image = this.pdfDoc._imageRegistry[src];
		}

		return { width: image.width, height: image.height };

		function realImageSrc(src) {
			var img = that.imageDictionary[src];

			if (!img) return src;

			var index = img.indexOf('base64,');
			if (index < 0) {
				throw 'invalid image format, images dictionary should contain dataURL entries';
			}

			return new Buffer(img.substring(index + 7), 'base64');
		}
	};

	module.exports = ImageMeasure;


/***/ },
/* 65 */
/***/ function(module, exports) {

	/* jslint node: true */
	'use strict';


	function groupDecorations(line) {
		var groups = [], curGroup = null;
		for(var i = 0, l = line.inlines.length; i < l; i++) {
			var inline = line.inlines[i];
			var decoration = inline.decoration;
			if(!decoration) {
				curGroup = null;
				continue;
			}
			var color = inline.decorationColor || inline.color || 'black';
			var style = inline.decorationStyle || 'solid';
			decoration = Array.isArray(decoration) ? decoration : [ decoration ];
			for(var ii = 0, ll = decoration.length; ii < ll; ii++) {
				var deco = decoration[ii];
				if(!curGroup || deco !== curGroup.decoration ||
						style !== curGroup.decorationStyle || color !== curGroup.decorationColor ||
						deco === 'lineThrough') {
			
					curGroup = {
						line: line,
						decoration: deco, 
						decorationColor: color, 
						decorationStyle: style,
						inlines: [ inline ]
					};
					groups.push(curGroup);
				} else {
					curGroup.inlines.push(inline);
				}
			}
		}
		
		return groups;
	}

	function drawDecoration(group, x, y, pdfKitDoc) {
		function maxInline() {
			var max = 0;
			for (var i = 0, l = group.inlines.length; i < l; i++) {
				var inl = group.inlines[i];
				max = inl.fontSize > max ? i : max;
			}
			return group.inlines[max];
		}
		function width() {
			var sum = 0;
			for (var i = 0, l = group.inlines.length; i < l; i++) {
				sum += group.inlines[i].width;
			}
			return sum;
		}
		var firstInline = group.inlines[0],
			biggerInline = maxInline(),
			totalWidth = width(),
			lineAscent = group.line.getAscenderHeight(),
			ascent = biggerInline.font.ascender / 1000 * biggerInline.fontSize,
			height = biggerInline.height,
			descent = height - ascent;
		
		var lw = 0.5 + Math.floor(Math.max(biggerInline.fontSize - 8, 0) / 2) * 0.12;
		
		switch (group.decoration) {
			case 'underline':
				y += lineAscent + descent * 0.45;
				break;
			case 'overline':
				y += lineAscent - (ascent * 0.85);
				break;
			case 'lineThrough':
				y += lineAscent - (ascent * 0.25);
				break;
			default:
				throw 'Unkown decoration : ' + group.decoration;
		}
		pdfKitDoc.save();
		
		if(group.decorationStyle === 'double') {
			var gap = Math.max(0.5, lw*2);
			pdfKitDoc	.fillColor(group.decorationColor)
						.rect(x + firstInline.x, y-lw/2, totalWidth, lw/2).fill()
						.rect(x + firstInline.x, y+gap-lw/2, totalWidth, lw/2).fill();
		} else if(group.decorationStyle === 'dashed') {
			var nbDashes = Math.ceil(totalWidth / (3.96+2.84));
			var rdx = x + firstInline.x;
			pdfKitDoc.rect(rdx, y, totalWidth, lw).clip();
			pdfKitDoc.fillColor(group.decorationColor);
			for (var i = 0; i < nbDashes; i++) {
				pdfKitDoc.rect(rdx, y-lw/2, 3.96, lw).fill();
				rdx += 3.96 + 2.84;
			}
		} else if(group.decorationStyle === 'dotted') {
			var nbDots = Math.ceil(totalWidth / (lw*3));
			var rx = x + firstInline.x;
			pdfKitDoc.rect(rx, y, totalWidth, lw).clip();
			pdfKitDoc.fillColor(group.decorationColor);
			for (var ii = 0; ii < nbDots; ii++) {
				pdfKitDoc.rect(rx, y-lw/2, lw, lw).fill();
				rx += (lw*3);
			}
		} else if(group.decorationStyle === 'wavy') {
			var sh = 0.7, sv = 1;
			var nbWaves = Math.ceil(totalWidth / (sh*2))+1;
			var rwx = x + firstInline.x - 1;
			pdfKitDoc.rect(x + firstInline.x, y-sv, totalWidth, y+sv).clip();
			pdfKitDoc.lineWidth(0.24);
			pdfKitDoc.moveTo(rwx, y);
			for(var iii = 0; iii < nbWaves; iii++) {
				pdfKitDoc   .bezierCurveTo(rwx+sh, y-sv, rwx+sh*2, y-sv, rwx+sh*3, y)
							.bezierCurveTo(rwx+sh*4, y+sv, rwx+sh*5, y+sv, rwx+sh*6, y);
					rwx += sh*6;
				}
			pdfKitDoc.stroke(group.decorationColor);
			
		} else {
			pdfKitDoc	.fillColor(group.decorationColor)
						.rect(x + firstInline.x, y-lw/2, totalWidth, lw)
						.fill();
		}
		pdfKitDoc.restore();
	}

	function drawDecorations(line, x, y, pdfKitDoc) {
		var groups = groupDecorations(line);
		for (var i = 0, l = groups.length; i < l; i++) {
			drawDecoration(groups[i], x, y, pdfKitDoc);
		}
	}

	function drawBackground(line, x, y, pdfKitDoc) {
		var height = line.getHeight();
		for(var i = 0, l = line.inlines.length; i < l; i++) {
			var inline = line.inlines[i];
				if(inline.background) {
					pdfKitDoc	.fillColor(inline.background)
								.rect(x + inline.x, y, inline.width, height)
								.fill();
				}
		}
	}

	module.exports = {
		drawBackground: drawBackground,
		drawDecorations: drawDecorations
	};

/***/ }
/******/ ])
});
;