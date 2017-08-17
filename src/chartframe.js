function chartFrame(configObject){
	var autoPosition = false,
		backgroundColour,
		containerClass='g-chartframe',

		copyright = '© FT',
		copyrightStyle = false,

		goalposts = false, 	//goalpost is the bit at the top and bottom of pritn charts
		blackbar = false, 	//blackbar the short black bar above web graphics

		fullYear = false,
		graphicHeight = 400,
		graphicWidth = 500,

		margin = {
			top:100,
			left:1,
			bottom:20,
			right:20
		},
		plot,
		plotAdjuster = 0,
		rem = 18,
		subtitle = 'some supporting information, units perhaps',
		subtitleLineHeight = 20,
		subtitlePosition = {x:1, y:67},
		subtitleStyle={},

		source = 'Source: research|FT Graphic Tom Pearson',
		sourceLineHeight = 16,
		sourcePosition = {x:1},
		sourcePlotYOffset = 46,
		sourceStyle={},

		title = 'Title: A description of the charts purpose',
		titleLineHeight = 32,
		titlePosition = {x:1, y:30},
		titleStyle={},

    transition = 0.2,

		watermarkLocation = 'icons.svg#ft-logo',
		watermarkMarkup = '',
		watermarkOffset = 0,
		watermarkSize = 58,

		units = 'px';


	var convertFrom = {
		mm: function(x){return (x * 2.83464480558843); },
		px: function(x){return x; },
	};

	function attributeStyle(parent, style){
		console.log('attributeStyle', parent, style)
	    Object.keys(style).forEach(function(attribute){
	        parent.attr(attribute, style[attribute]);
	    });
	}

	function frame(p){

//overall graphic properties
		p.attr('class', containerClass)
			.attr('font-family','MetricWeb,sans-serif');
			console.log(p)
		if (p.node().nodeName.toLowerCase() == 'svg') {
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

//background
		if(backgroundColour !== undefined){
      p.selectAll('rect.chart-background')
        .data([backgroundColour])
        .enter()
        .append('rect')
        .attr('class','chart-background');

      p.selectAll('rect.chart-background')
        .transition(transition)
				.attr('x', 0)
				.attr('y', 0)
				.attr('width', graphicWidth)
				.attr('height', graphicHeight)
				.attr('fill', backgroundColour);
		};

//	'blackbar' (the short black bar above web graphics)
		if(blackbar) {
			p.append('rect')
				.attr('width', 60)
				.attr('height', 4)
				.style('fill', blackbar)
		}

// 'goalposts' (the bit at the top and the bottom of print charts)
		if(goalposts){
      var goalpostPaths = [
        'M 0, '+graphicHeight+' L '+graphicWidth+', ' + graphicHeight,
        'M 0, 15 L 0, 0 L '+graphicWidth+', 0 L '+graphicWidth+', 15',
      ];

      p.selectAll('path.chart-goalposts')
        .data(goalpostPaths)
        .enter()
        .append('path').attr('class','chart-goalposts');

			p.selectAll('path.chart-goalposts')
        .transition(transition)
				.attr('d',function(d){ return d; })
				.attr('stroke-width', 1)
        .attr('fill','none')
				.attr('stroke', goalposts);
		}

//title
    var titleLineCount = title.split('|').length;
    p.selectAll('text.chart-title')
      .data([title])
      .enter()
      .append('text')
      .attr('class', 'chart-title')
      .attr('id',containerClass+'title')
      .call(function(titleText){
        titleText.selectAll('tspan')
          .data(title.split('|'))
          .enter()
        .append('tspan')
          .html(function(d){ return d; })
          .attr('y',function(d,i){ return (titlePosition.y + (i * titleLineHeight)); })
          .attr('x',titlePosition.x)
          .call(attributeStyle, titleStyle);
      });

    p.selectAll('text.chart-title tspan')
      .html(function(d){ return d; })
      .transition(transition)
        .attr('y', function(d,i){ return (titlePosition.y + (i * titleLineHeight)); })
        .attr('x', titlePosition.x)
        .call(attributeStyle, titleStyle);

    var subtitleLineCount = subtitle.split('|').length;
//subtitle
    p.selectAll('text.chart-subtitle')
      .data([subtitle])
      .enter()
      .append('text')
      .attr('id',containerClass+'subtitle')
      .attr('class', 'chart-subtitle')
      .call(function(subtitleText){
        subtitleText.selectAll('tspan')
          .data(subtitle.split('|'))
          .enter()
        .append('tspan')
          .html(function(d){ return d; })
          .attr('y',function(d,i){
            if(titleLineCount > 1) {
              console.log('yes')
              return (titlePosition.y + (titleLineCount * titleLineHeight) +(subtitleLineHeight*i));
            } else {
              return (subtitlePosition.y + (i * subtitleLineHeight)); }
            })

          .attr('x',subtitlePosition.x)
          .call(attributeStyle, subtitleStyle);
      });

    p.selectAll('text.chart-subtitle tspan')
      .html(function(d){ 
      	return d; })
      .transition(transition)
        .attr('y', function(d,i){
          if(titleLineCount > 1) {
              console.log('yes')
              return (titlePosition.y + (titleLineCount * titleLineHeight) +(subtitleLineHeight*i));
            } else {
              return (subtitlePosition.y + (i * subtitleLineHeight)); }
        })
        .attr('x', subtitlePosition.x)
        .call(attributeStyle, subtitleStyle);

//source
    p.selectAll('text.chart-source')
      .data([source])
      .enter()
      .append('text')
      .attr('class', 'chart-source')
      .attr('id',containerClass+'title')
      .call(function(sourceText){
        sourceText.selectAll('tspan')
          .data(source.split('|'))
          .enter()
        .append('tspan')
          .html(function(d){ return d; })
          .attr('y', function(d,i){
            if(sourcePosition.y){
              return (sourcePosition.y +(i * sourceLineHeight));
            }
            return ((graphicHeight - (margin.bottom - sourcePlotYOffset) + sourceLineHeight*1.5) + ((i) * sourceLineHeight));
          })
          .attr('x',subtitlePosition.x)
          .call(attributeStyle, subtitleStyle);
      });

    p.selectAll('text.chart-source tspan')
      .html(function(d){ return d; })
      .transition(transition)
        .attr('y', function(d,i){
          if(sourcePosition.y){
            return (sourcePosition.y +(i * sourceLineHeight));
          }
          return ((graphicHeight - (margin.bottom - sourcePlotYOffset) + sourceLineHeight*1.5) + ((i) * sourceLineHeight));
        })
        .attr('x', sourcePosition.x)
        .call(attributeStyle, sourceStyle);

    var sourceLineCount = source.split('|').length;
    // copyright
    if(copyrightStyle) {
    	p.selectAll('text.chart-copyright')
	      .data([copyright])
	      .enter()
	      .append('text')
	      .attr('class', 'chart-copyright')
	      .append('tspan')
	      	.html(function(d){ return d; })
	      	.attr('x', sourcePosition.x)
	      	.attr('y', function(d) {
            if(sourceLineCount > 1) {
              return (graphicHeight - (margin.bottom - sourcePlotYOffset) + (sourceLineHeight * 1.125) + (sourceLineCount * sourceLineHeight * 1.2));
            } else {
              return (graphicHeight - (margin.bottom - sourcePlotYOffset) + (sourceLineHeight * 2.5));
            }
          })


          .call(attributeStyle, copyrightStyle);
		}


//TODO figure out a way to improve this autoPosition stuff, needs ot be configurable so we don't have to reference specific classes
    if(autoPosition && (containerClass == 'ft-printgraphic' || containerClass == 'ft-socialgraphic' || containerClass == 'ft-videographic')) {
      margin.top = (titlePosition.y + (titleLineCount * titleLineHeight) + (subtitleLineCount * subtitleLineHeight) + (rem/3))
    } else if(autoPosition) {
      margin.top = (titlePosition.y + (titleLineCount * titleLineHeight) + (subtitleLineCount * subtitleLineHeight) + 28 - plotAdjuster)
    }

//watermark

		p.selectAll('g.chart-watermark')
      .data([0])
      .enter()
      .append('g').attr('class','chart-watermark')
      .html(watermarkMarkup)
			.attr('transform', 'translate('+(graphicWidth-watermarkSize -watermarkOffset)+','+(graphicHeight-watermarkSize-watermarkOffset)+') scale('+watermarkSize/100+') ');

		p.selectAll('g.chart-watermark')
      .html(watermarkMarkup)
      .transition()
			.attr('transform', 'translate('+(graphicWidth-watermarkSize -watermarkOffset)+','+(graphicHeight-watermarkSize-watermarkOffset)+') scale('+watermarkSize/100+') ');

//plot area (where you put the chart itself)
		p.selectAll('g.chart-plot')
      .data([0])
      .enter()
      .append('g')
      .attr('class','chart-plot')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

    plot = p.selectAll('g.chart-plot');

    plot.transition(transition)
      .duration(0)
			.attr('transform','translate(' + margin.left + ',' + margin.top + ')');
	}


//Setters and getters

	frame.autoPosition = function(x){
		if(x == undefined) return autoPosition;
		autoPosition = x;
		return frame;
	};

	frame.backgroundColour = function(x){
		if(x == undefined) return backgroundColour;
		backgroundColour = x;
		return frame;
	};

	frame.blackbar = function(x){
		if(x == undefined) return blackbar;
		blackbar = x;
		return frame;
	}

	frame.containerClass = function(x){
		if(x == undefined) return containerClass;
		containerClass = x;
		return frame;
	};

	frame.copyright = function(x){
		if(x == undefined) return copyright;
		copyright = x;
		return frame;
	};

	frame.copyrightStyle = function(x){
		if(x == undefined) return copyrightStyle;
		copyrightStyle = x;
		return frame;
	};

	frame.dimension = function(){
		return {
			width:graphicWidth-(margin.left+margin.right),
			height:graphicHeight-(margin.top+margin.bottom)
		};
	};

	frame.fullYear = function(x){
		if(x == undefined) return fullYear;
		fullYear = x;
		return frame;
	}

	frame.goalposts = function(x){
		if(x == undefined) return goalposts;
		goalposts = x;
		return frame;
	}

	frame.height = function(x){
		if(x == undefined) return graphicHeight;
		graphicHeight = convertFrom[units](x);
		return frame;
	};

	frame.margin = function(x){
		if(x == undefined) return margin;
		Object.keys(x).forEach(function(k){
			margin[k] = x[k];
		});
		return frame;
	};

	frame.plot = function(){
		return plot;
	};

	frame.plotAdjuster = function(x){
		if(x == undefined) return plotAdjuster;
		plotAdjuster = x;
		return frame;
	};

	frame.rem = function(x){
		if(x == undefined) return rem;
		rem = x;
		return frame;
	};

	frame.source = function(x){
		if(x == undefined) return source;
		source = x;
		return frame;
	};

	frame.sourceLineHeight = function(x){
		if(x == undefined) return sourceLineHeight;
		sourceLineHeight = x;
		return frame;
	};

	frame.sourcePlotYOffset = function(x){
    if(x == undefined) return sourcePlotYOffset;
    sourcePlotYOffset = x;
    return frame;
  };

	frame.sourceStyle = function(x){
		if(x == undefined) return sourceStyle;
		sourceStyle = x;
		return frame;
	};

	frame.sourceX = function(x){
		if(x == undefined) return sourcePosition.x;
		sourcePosition.x = x;
		return frame;
	};

	frame.sourceY = function(x){
		if(x == undefined) return sourcePosition.y;
		sourcePosition.y = x;
		return frame;
	};

	frame.subtitle = function(x){
		if(x == undefined) return subtitle;
		subtitle = x;
		return frame;
	};

	frame.subtitleLineHeight = function(x){
		if(x == undefined) return subtitleLineHeight;
		subtitleLineHeight = x;
		return frame;
	};

	frame.subtitleStyle = function(x){
		if(x == undefined) return subtitleStyle;
		subtitleStyle = x;
		return frame;
	};

	frame.subtitleX = function(x){
		if(x == undefined) return subtitlePosition.x;
		subtitlePosition.x = x;
		return frame;
	};

	frame.subtitleY = function(x){
		if(x == undefined) return subtitlePosition.y;
		subtitlePosition.y = x;
		return frame;
	};

	frame.title = function(x){
		if(x == undefined) return title;
		title = x;
		return frame;
	};

	frame.titleStyle = function(x){
		if(x == undefined) return titleStyle;
		titleStyle = x;
		return frame;
	};

	frame.titleLineHeight = function(x){
		if(x == undefined) return titleLineHeight;
		titleLineHeight = x;
		return frame;
	};

	frame.titleX = function(x){
		if(x == undefined) return titlePosition.x;
		titlePosition.x = x;
		return frame;
	};

	frame.titleY = function(x){
		if(x == undefined) return titlePosition.y;
		titlePosition.y = x;
		return frame;
	};

	frame.units = function(x){
		if(x == undefined) return units
		units = x;
		return frame;
	};

	frame.watermark = function(x){
		if(x == undefined) return watermarkMarkup;
		watermarkLocation = '';
		watermarkMarkup = x;
		return frame;
	};

	frame.watermarkOffset = function(x){
		if(x == undefined) return watermarkOffset;
		watermarkOffset = x;
		return frame;
	};

	frame.watermarkLocation = function(x){
		if(x == undefined) return watermarkLocation;
		watermarkMarkup = '';
		watermarkLocation = x;
		return frame;
	};

	frame.watermarkSize = function(x){
		if(x == undefined) return watermarkSize;
		watermarkSize = x;
		return frame;
	};

	frame.width = function(x){
		if(!x) return graphicWidth;
		graphicWidth = convertFrom[units](x);
		return frame;
	};

  frame.attrs = function(x){
    if(x===undefined)return {
    	autoPosition:autoPosition,
    	axisAlign:axisAlign,
      containerClass:containerClass,
      copyright:copyright,
      copyrightStyle:copyrightStyle,
      blackbar:blackbar,
      goalposts:goalposts,
      graphicHeight:graphicHeight,
      graphicWidth:graphicWidth,
      margin:margin,
      plot:plot,
      plotAdjuster:plotAdjuster,
      rem:rem,
      subtitle:subtitle,
      subtitleLineHeight:subtitleLineHeight,
      subtitlePosition:subtitlePosition,
      subtitleStyle:subtitleStyle,
      source:source,
      sourceLineHeight:sourceLineHeight,
      sourcePosition:sourcePosition,
      sourceStyle:sourceStyle,
      title:title,
      titleLineHeight:titleLineHeight,
      titlePosition:titlePosition,
      titleStyle:titleStyle,
      watermarkLocation:watermarkLocation,
      watermarkMarkup:watermarkMarkup,
      watermarkOffset:watermarkOffset,
      watermarkSize:watermarkSize,
      units:units};

    Object.keys(x).forEach(function(setterName){
      var value = x[setterName];
      if(isFunction(frame[setterName])){
        frame[setterName](value);
      }
    });
    return frame;
  }

  if(configObject !== undefined){
    frame.attrs(configObject);
  }

	return frame;
}

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

export default chartFrame;
