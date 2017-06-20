const tape = require("tape");
const fs = require("fs");
const d3 = require("d3");

tape("chartFrame defaults", function(test) {
	const chartFrame = require("../build/g-chartframe");

	test.equal(chartFrame.frame().title(), 'Title: A description of the charts purpose');
	test.end();
});

tape("chartFrame works outside browser", function(test) {
  const jsdom = require('jsdom');
  const { JSDOM } = jsdom;
	const chartFrame = require("../build/g-chartframe");
  const defaultFrame = chartFrame.frame();
  const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
  const chartContainer = d3.select(dom.window.document.querySelector('body div.chart-container'));
  chartContainer.call(defaultFrame);

  test.equal(chartContainer.select('.chart-title tspan').text(), 'Title: A description of the charts purpose');
	test.end();
});
