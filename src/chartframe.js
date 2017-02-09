var watermarkPath = '<path fill="#000" fill-opacity="0.2" id="logo" d="M1.502 1.5h97.996v98h-97.996v-98zm46.127 23.686h1.866l-.287-9.762h-36.988v1.675c1.18.063 2.074.151 2.68.263.606.112 1.148.359 1.627.742s.797.909.957 1.579c.159.67.239 1.595.239 2.775v30.193c0 1.18-.08 2.097-.239 2.747-.16.654-.479 1.181-.957 1.562-.479.383-1.037.639-1.675.766-.638.128-1.547.208-2.728.239v1.723h20.958v-1.723c-1.468-.031-2.568-.111-3.302-.239-.734-.127-1.372-.383-1.914-.766-.542-.382-.893-.908-1.053-1.562-.16-.65-.239-1.567-.239-2.747v-14.451h3.302c2.967 0 5.136.454 6.507 1.364 1.372.908 2.281 2.623 2.728 5.144h1.675v-15.647h-1.675c-.287 1.627-.71 2.84-1.268 3.637-.558.798-1.443 1.372-2.656 1.723-1.212.352-2.982.527-5.311.527h-3.302v-14.021c0-.894.16-1.491.479-1.794.319-.304.973-.455 1.962-.455h6.699c2.201 0 3.972.096 5.312.287s2.448.566 3.326 1.125c.877.558 1.539 1.212 1.985 1.961.447.75.877 1.795 1.292 3.135zm42.107 0h2.249l-.909-9.762h-38.805l-.909 9.762h2.249c.702-2.393 1.658-4.075 2.871-5.049 1.212-.973 2.982-1.459 5.312-1.459h5.454v33.974c0 1.18-.079 2.097-.239 2.747-.159.654-.502 1.181-1.028 1.562-.526.383-1.141.639-1.843.766-.701.128-1.738.208-3.109.239v1.723h21.341v-1.723c-1.372-.031-2.417-.111-3.135-.239-.718-.127-1.34-.383-1.866-.766-.526-.382-.869-.908-1.028-1.562-.159-.65-.239-1.567-.239-2.747v-33.974h5.455c2.328 0 4.099.486 5.311 1.459 1.21.973 2.167 2.656 2.868 5.049z"/>';

function chartFrame(){
	var backgroundColour,
		containerClass='g-chartframe',

		graphicHeight = 500,
		graphicWidth = 500, 

		margin = {
			top:60,
			left:20,
			bottom:20,
			right:20
		},
		plot,
		
		subtitle = 'some supporting information, units perhaps',
		subtitleLineHeight = 20,
		subtitlePosition = {x:0, y:50},
		subtitleStyle={},

		source = 'Source: research|FT Graphic Tom Pearson',
		sourceLineHeight = 18,	
		sourcePosition = {x:0,y:480},
		sourceStyle={},

		title = 'Title: A description of the charts purpose',
		titleLineHeight = 20,
		titlePosition = {x:0, y:20},
		titleStyle={},

		watermarkLocation = 'icons.svg#ft-logo',
		watermarkMarkup = '',
		watermarkSize = 50,
		
		units = 'px';

	function attributeStyle(parent, style){
	    Object.keys(style).forEach(function(attribute){
	        parent.attr(attribute, style[attribute]);
	    });
	}

	function frame(p){
		p.attr('class', containerClass);
		if (p.node().nodeName.toLowerCase() == 'svg') {
			p.attr('width', graphicWidth+units);
			p.attr('height', graphicHeight+units);
			p.attr('viewBox',['0 0', graphicWidth, graphicHeight].join(' '))
			p.append('title')
				.text(title).html(title);
		}

		if(backgroundColour !== undefined){
			p.append('rect')
				.attr('x',0)
				.attr('y',0)
				.attr('width',graphicWidth)
				.attr('height',graphicHeight)
				.attr('fill',backgroundColour);
		};

		p.append('text')
			.attr('class', 'chart-title')
			.selectAll('tspan')
				.data(title.split('|'))
			.enter()
				.append('tspan')
			.attr('y',function(d,i){ return (titlePosition.y + (i * titleLineHeight)) + units; })
			.attr('x',titlePosition.x)
			.html(function(d){ return d; })
			.call(attributeStyle, titleStyle);

		p.append('text')
			.attr('class','chart-subtitle')
			.selectAll('tspan')
				.data(subtitle.split('|'))
			.enter()
				.append('tspan')
			.attr('y',function(d,i){ return (subtitlePosition.y + (i * subtitleLineHeight)) + units})
			.attr('x',subtitlePosition.x)
			.html(function(d){ return d; })
			.call(attributeStyle, subtitleStyle);

		p.append('text')
			.attr('class','chart-source')
			.selectAll('tspan')
				.data(source.split('|'))
			.enter()
				.append('tspan')
			.attr('y',function(d,i){ return (sourcePosition.y +(i * sourceLineHeight)) + units})
			.attr('x',sourcePosition.x)
			.html(function(d){ console.log(d); return d; })
			.call(attributeStyle, sourceStyle);


		if(watermarkLocation!=''){
			var mark = p.append('use')
				.attr('xlink:href',watermarkLocation);
		}

		if(watermarkMarkup!=''){
			mark = p.append('g')
				.html(watermarkMarkup);
		}

		mark.attr('class','chart-watermark')
			.attr('transform','translate('+(graphicWidth-watermarkSize)+','+(graphicHeight-watermarkSize)+') scale('+watermarkSize/100+') ');	
		
		plot = p.append('g')
			.attr('class','chart-plot')
			.attr('transform','translate(' + margin.left + ',' + margin.top + ')');
	}


//Setters and getters

	frame.backgroundColour = function(x){
		if(!x) return backgroundColour;
		backgroundColour = x;
		return frame;
	}

	frame.containerClass = function(x){
		if(!x) return containerClass;
		containerClass = x;
		return frame;
	}

	frame.dimension = function(){
		return {
			width:graphicWidth-(margin.left+margin.right),
			height:graphicHeight-(margin.top+margin.bottom)
		};
	}

	frame.height = function(x){
		if(!x) return graphicHeight;
		graphicHeight = x;
		return frame;
	};

	frame.margin = function(x){
		if(!x) return margin;
		Object.keys(x).forEach(function(k){
			margin[k] = x[k];
		});
		return frame;
	};

	frame.plot = function(){
		return plot;
	}

	frame.source = function(x){
		if(!x) return source;
		source = x;
		return frame;
	};
	frame.sourceStyle = function(x){
		if(!x) return sourceStyle;
		sourceStyle = x;
		return frame;
	}
	frame.sourceY = function(x){
		if(!x) return sourcePosition.y;
		sourcePosition.y = x;
		return frame;
	}

	frame.subtitle = function(x){
		if(!x) return subtitle;
		subtitle = x;
		return frame;
	};

	frame.subtitleStyle = function(x){
		if(!x) return subtitleStyle;
		subtitleStyle = x;
		return frame;
	}

	frame.subtitleY = function(x){
		if(!x) return subtitlePosition.y;
		subtitlePosition.y = x;
		return frame;
	}

	frame.title = function(x){
		if(!x) return title;
		title = x;
		return frame;
	};

	frame.titleStyle = function(x){
		if(!x) return titleStyle;
		titleStyle = x;
		return frame;
	}

	frame.titleLineHeight = function(x){
		if(!x) return titleLineHeight;
		titleLineHeight = x;
		return frame;
	}

	frame.titleY = function(x){
		if(!x) return titlePosition.y;
		titlePosition.y = x;
		return frame;
	}

	frame.units = function(x){
		if(!x) return units
		units = x; 
		return frame;
	}

	frame.watermark = function(x){
		if(!x) return watermarkMarkup;
		watermarkLocation = '';
		watermarkMarkup = x;
		return frame;
	}

	frame.watermarkSize = function(x){
		if(!x) return watermarkSize;
		watermarkSize = x;
		return frame;
	}

	frame.watermarkLocation = function(x){
		if(!x) return watermarkLocation;
		watermarkMarkup = '';
		watermarkLocation = x;
		return frame;
	}

	frame.width = function(x){
		if(!x) return graphicWidth;
		graphicWidth = x;
		return frame;
	};

	return frame;
}

//Some Conventional frames

var webFrame = chartFrame()
	.containerClass('ft-webgraphic')
	.backgroundColour('#FFF1E0')
	.width(700)
	.watermark(watermarkPath)
	.margin({bottom:50, right:50})
	.titleStyle({
		'font-size':25,
		'font-family': 'MetricWeb,sans-serif',
		'fill':'#3b3d3b',
	})
	.titleLineHeight(20)
	.subtitleStyle({
		'font-size':20,
		'font-family': 'MetricWeb,sans-serif',
		'fill': '#6b6e68',
	})
	.sourceStyle({ 
		'font-family': 'MetricWeb,sans-serif',
		'fill': '#6b6e68',
	});

var printFrame = chartFrame()
	.containerClass('ft-printgraphic')
	.backgroundColour('#FFAAFF')
	.width(300)
	.watermark(watermarkPath)
	.titleStyle({
		'font-size': 25,
		'font-family': 'MetricWeb,sans-serif',
	})
	.subtitleStyle({
		'font-size':20,
		'font-family': 'MetricWeb,sans-serif',
	})
	.sourceStyle({ 
		'font-size':14,
		'font-style':'italic',
		'font-family': 'MetricWeb,sans-serif',
	});

var socialFrame = chartFrame()
	.containerClass('ft-socialgraphic')
	.backgroundColour('#FFAAFF')
	.width(300)
	.watermark(watermarkPath)
	.titleStyle({
		'font-size': 25,
		'font-family': 'MetricWeb,sans-serif',
	})
	.subtitleStyle({
		'font-size':20,
		'font-family': 'MetricWeb,sans-serif',
	})
	.sourceStyle({ 
		'font-size':14,
		'font-style':'italic',
		'font-family': 'MetricWeb,sans-serif',
	});

var videoFrame = chartFrame()
	.containerClass('ft-videographic')
	.backgroundColour('#FFAAFF')
	.width(300)
	.watermark(watermarkPath)
	.titleStyle({
		'font-size': 25,
		'font-family': 'MetricWeb,sans-serif',
	})
	.subtitleStyle({
		'font-size':20,
		'font-family': 'MetricWeb,sans-serif',
	})
	.sourceStyle({ 
		'font-size':14,
		'font-style':'italic',
		'font-family': 'MetricWeb,sans-serif',
	});

export { chartFrame as frame };
export { webFrame as webFrame };
export { printFrame as printFrame };
export { socialFrame as socialFrame };
export { videoFrame as videoFrame };