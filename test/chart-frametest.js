var tape = require("tape"),
    chartFrame = require("../");

console.log(chartFrame)

tape("chartFrame defaults", function(test) {
var frame = chartFrame.frame()
  test.equal(frame.title(), 'Title: A description of the charts purpose');
  test.equal(frame.subtitle(), 'some supporting information, units perhaps');
  test.equal(frame.source(), 'Source: research');
  test.end();
});
