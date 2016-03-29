import * as d3 from 'd3-selection';

function webFrame(){
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
		watermarkLocation = 'icons.svg#ft-logo',
		watermarkMarkup = '',
		watermarkSize = 50,
		units = 'px';

	function frame(p){
		if (p.node().nodeName.toLowerCase() == 'svg') {
			p.attr('width', width+units);
			p.attr('height', height+units);
			p.attr('viewBox',['0 0', width, height].join(' '))
			p.append('title')
				.text(title).html(title);
		}

		p.append('text')
			.attr('class', 'chart-title')
			.attr('dy', titleY+units)
			.html(title);

		p.append('text')
			.attr('class','chart-subtitle')
			.attr('dy',subtitleY+units)
			.html(subtitle);

		p.append('text')
			.attr('class','chart-source')
			.attr('dy',height + sourceYOffset+units)
			.html(source);

		p.append('use')
			.attr('xlink:href',watermarkLocation)
			.attr('class','chart-watermark')
			.attr('transform','translate('+(width-watermarkSize)+','+(height-watermarkSize)+') scale('+watermarkSize/100+') ');

		var plot = p
			.append('g')
				.attr('class','chart-plot')
				.attr('transform','translate(' + margin.left + ',' + margin.top + ')');
	}

	frame.plot = function

	frame.units = function(u){
		if(!u) return units
		units = u; 
		return frame;
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

	frame.watermarkLocation = function(location){
		if(!location) return watermarkLocation;
		watermarkMarkup = '';
		watermarkLocation = location;
		return frame;
	}

	frame.watermark = function(markup){
		if(!markup) return watermarkMarkup;
		watermarkLocation = '';
		watermarkMarkup = markup;
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

export { webFrame as web };