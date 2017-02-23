var tape = require("tape");

tape("chartFrame defaults", function(test) {
	var chartFrame = require("../build/g-chartframe");
	test.equal(chartFrame.frame().title(), 'Title: A description of the charts purpose');

	test.end();
});
