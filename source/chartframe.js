'use strict';

var d3 = require('d3');

function chartFrame(){

	var margin = {
			top:60,
			left:20,
			bottom:20,
			right:20
		},
		titleY = 20,
		subtitleY = 50,
		title = 'Title: A description of the charts purpose',
		subtitle = 'some supporting information, units perhaps',
		source = 'Source: research',
		width = 500, 
		height = 500,
		watermark = 'icons.svg#flower_playing_cards',
		watermarkDim = 20;


	function frame(p){
		if (p.node().nodeName.toLowerCase() == 'svg') {
			p.attr('width', width);
			p.attr('height', height);
			p.append('title')
				.text(title).html(title);
		}

		p.append('text')
			.attr({
				'class':'chart-title',
				'dy':titleY
			})
			.html(title);

		p.append('text')
			.attr({
				'class':'chart-subtitle',
				'dy':subtitleY
			})
			.html(subtitle);

		p.append('text')
			.attr({
				'class':'chart-source',
				'dy':height
			})
			.html(source);

		p.append('use')
			.attr({
				'xlink:href':watermark,
				'class':'chart-watermark',
				'transform':'translate('+(width-watermarkDim)+','+(height-watermarkDim)+') scale('+watermarkDim/100+') '
			});

		var plot = p
			.append('g')
				.attr({
					'class':'chart-plot',
					'transform':'translate(' + margin.left + ',' + margin.top + ')'
				});
	}

	frame.dimension = function(){
		return {
			width:width-(margin.left+margin.right),
			height:height-(margin.top+margin.bottom)
		};
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

	return frame;
}

if(module) module.exports = chartFrame;