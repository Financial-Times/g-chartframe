'use strict';

var d3 = require('d3');
var chartFrame = require('./chartframe.js');

var frame = chartFrame()
	.margin({
		left:0
	});

d3.select('svg')
	.call(frame);

// the g.chart-plot element has been created in the correct place by calling 'frame'
d3.select('g.chart-plot')
	.append('use')
	.attr({
		'xlink:href':'icons.svg#chart-sketch',
		'transform':'scale('+frame.dimension().width/100+','+frame.dimension().height/100+')'
	});