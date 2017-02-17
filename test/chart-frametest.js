var tape = require("tape");

tape("chartFrame defaults", function(test) {
	var chartFrame = require("../");
	test.equal(chartFrame.frame().title(), 'Title: A description of the charts purpose');

	test.end();
});
