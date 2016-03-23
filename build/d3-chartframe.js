(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-selection'], factory) :
	(factory((global.d3_chartframe = global.d3_chartframe || {}),global.d3Selection));
}(this, function (exports,d3Selection) { 'use strict';

	function chartFrame(){

		var margin = {
				top:60,
				left:20,
				bottom:20,
				right:20
			},
			titleY = 20,
			subtitleY = 50,
			sourceYOffset = -5,
			title = 'Title: A description of the charts purpose',
			subtitle = 'some supporting information, units perhaps',
			source = 'Source: research',
			width = 500, 
			height = 500,
			watermark = 'icons.svg#ft-logo',
			watermarkSize = 20;

		function frame(p){
			if (p.node().nodeName.toLowerCase() == 'svg') {
				p.attr('width', width);
				p.attr('height', height);
				p.append('title')
					.text(title).html(title);
			}

			p.append('text')
				.attr('class', 'chart-title')
				.attr('dy', titleY)
				.html(title);

			p.append('text')
				.attr('class','chart-subtitle')
				.attr('dy',subtitleY)
				.html(subtitle);

			p.append('text')
				.attr('class','chart-source')
				.attr('dy',height + sourceYOffset)
				.html(source);

			p.append('use')
				.attr('xlink:href',watermark)
				.attr('class','chart-watermark')
				.attr('transform','translate('+(width-watermarkSize)+','+(height-watermarkSize)+') scale('+watermarkSize/100+') ');

			var plot = p
				.append('g')
					.attr('class','chart-plot')
					.attr('transform','translate(' + margin.left + ',' + margin.top + ')');
		}

		frame.dimension = function(){
			return {
				width:width-(margin.left+margin.right),
				height:height-(margin.top+margin.bottom)
			};
		}

		frame.watermarkSize = function(n){
			if(!n) return watermarkSize;
			watermarkSize = n;
			return frame;
		}


		frame.watermark = function(location){
			if(!location) return watermark;
			watermark = location;
			return frame;
		}

		frame.titleY = function(n){
			if(!n) return titleY;
			titleY = n;
			return frame;
		}

		frame.subtitleY = function(n){
			if(!n) return subtitleY;
			subtitleY = n;
			return frame;
		}

		frame.width = function(n){
			if(!n) return width;
			width = n;
			return frame;
		};

		frame.height = function(n){
			if(!n) return height;
			height = n;
			return frame;
		};

		frame.margin = function(o){
			if(!o) return margin;
			Object.keys(o).forEach(function(k){
				margin[k] = o[k];
			});
			return frame;
		};

		frame.title = function(s){
			if(!s) return title;
			title = s;
			return frame;
		};

		frame.subtitle = function(s){
			if(!s) return subtitle;
			subtitle = s;
			return frame;
		};

		frame.source = function(s){
			if(!s) return source;
			source = s;
			return frame;
		};

		frame.sourceYOffset = function(n){
			if(!n) return sourceYOffset;
			sourceYOffset = n;
			return frame;
		}

		return frame;
	}

	var version = "1.0.0";

	exports.version = version;
	exports.frame = chartFrame;

}));