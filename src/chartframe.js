var watermarkPath = '<path id="logo" d="M1.502 1.5h97.996v98h-97.996v-98zm46.127 23.686h1.866l-.287-9.762h-36.988v1.675c1.18.063 2.074.151 2.68.263.606.112 1.148.359 1.627.742s.797.909.957 1.579c.159.67.239 1.595.239 2.775v30.193c0 1.18-.08 2.097-.239 2.747-.16.654-.479 1.181-.957 1.562-.479.383-1.037.639-1.675.766-.638.128-1.547.208-2.728.239v1.723h20.958v-1.723c-1.468-.031-2.568-.111-3.302-.239-.734-.127-1.372-.383-1.914-.766-.542-.382-.893-.908-1.053-1.562-.16-.65-.239-1.567-.239-2.747v-14.451h3.302c2.967 0 5.136.454 6.507 1.364 1.372.908 2.281 2.623 2.728 5.144h1.675v-15.647h-1.675c-.287 1.627-.71 2.84-1.268 3.637-.558.798-1.443 1.372-2.656 1.723-1.212.352-2.982.527-5.311.527h-3.302v-14.021c0-.894.16-1.491.479-1.794.319-.304.973-.455 1.962-.455h6.699c2.201 0 3.972.096 5.312.287s2.448.566 3.326 1.125c.877.558 1.539 1.212 1.985 1.961.447.75.877 1.795 1.292 3.135zm42.107 0h2.249l-.909-9.762h-38.805l-.909 9.762h2.249c.702-2.393 1.658-4.075 2.871-5.049 1.212-.973 2.982-1.459 5.312-1.459h5.454v33.974c0 1.18-.079 2.097-.239 2.747-.159.654-.502 1.181-1.028 1.562-.526.383-1.141.639-1.843.766-.701.128-1.738.208-3.109.239v1.723h21.341v-1.723c-1.372-.031-2.417-.111-3.135-.239-.718-.127-1.34-.383-1.866-.766-.526-.382-.869-.908-1.028-1.562-.159-.65-.239-1.567-.239-2.747v-33.974h5.455c2.328 0 4.099.486 5.311 1.459 1.21.973 2.167 2.656 2.868 5.049z"/>';

function chartFrame(){
	var plot,
		margin = {
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
		units = 'px',
		sourceStyle={},
		titleStyle={},
		subtitleStyle={};	

	function attributeStyle(parent, style){
	    Object.keys(style).forEach(function(attribute){
	        parent.attr(attribute, style[attribute]);
	    });
	}

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
			.html(title)
			.call(attributeStyle, titleStyle);

		p.append('text')
			.attr('class','chart-subtitle')
			.attr('dy',subtitleY+units)
			.html(subtitle)
			.call(attributeStyle, subtitleStyle);

		p.append('text')
			.attr('class','chart-source')
			.attr('dy',height + sourceYOffset+units)
			.html(source)
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
			.attr('transform','translate('+(width-watermarkSize)+','+(height-watermarkSize)+') scale('+watermarkSize/100+') ');	
		
		plot = p
			.append('g')
				.attr('class','chart-plot')
				.attr('transform','translate(' + margin.left + ',' + margin.top + ')');
	}

	frame.plot = function(){
		return plot;
	}

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

	frame.titleStyle = function(o){
		if(!o) return titleStyle;
		titleStyle = o;
		return frame;
	}

	frame.subtitle = function(s){
		if(!s) return subtitle;
		subtitle = s;
		return frame;
	};

	frame.subtitleStyle = function(o){
		if(!o) return subtitleStyle;
		subtitleStyle = o;
		return frame;
	}

	frame.source = function(s){
		if(!s) return source;
		source = s;
		return frame;
	};

	frame.sourceStyle = function(o){
		if(!o) return sourceStyle;
		sourceStyle = o;
		return frame;
	}

	frame.sourceYOffset = function(n){
		if(!n) return sourceYOffset;
		sourceYOffset = n;
		return frame;
	}

	return frame;
}

var webFrame = chartFrame()
	.watermark(watermarkPath)
	.titleStyle({
		'font-size':25
	})
	.subtitleStyle({
		'font-size':20
	})
	.sourceStyle({ 
		'font-style':'italic'
	});

export { chartFrame as frame };
export { webFrame as webFrame };