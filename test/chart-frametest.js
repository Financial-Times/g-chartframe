var tape = require("tape");

tape("chartFrame defaults", function(test) {
	var chartFrame = require("../");
	console.log('CF' , chartFrame);
	
	var frame = chartFrame.webframe()
	test.equal(frame.title(), 'Title: A description of the charts purpose');
	test.equal(frame.subtitle(), 'some supporting information, units perhaps');
	test.equal(frame.source(), 'Source: research');
	test.end();
});
