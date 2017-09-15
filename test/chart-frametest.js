const tape = require('tape');
const fs = require('fs');
const d3 = require('d3');
const chartFrame = require('../build/g-chartframe');
const jsdom = require('jsdom');

tape('chartFrame defaults', (test) => {
    test.equal(chartFrame.frame().title(), 'Title: A description of the charts purpose');
    test.end();
});

tape('chartFrame works outside browser', (test) => {
    const { JSDOM } = jsdom;
    const defaultFrame = chartFrame.frame();
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const chartContainer = d3.select(dom.window.document.querySelector('body div.chart-container'));
    chartContainer.call(defaultFrame);

    test.equal(chartContainer.select('.chart-title tspan').text(), 'Title: A description of the charts purpose');
    test.end();
});

tape('chartFrame can be extended', (test) => {
    const defaultFrame = chartFrame.frame();
    defaultFrame.extend('llama', 'duck');

    // Test getter
    test.equal(defaultFrame.llama(), 'duck');

    // Test setter
    defaultFrame.llama('quack');
    test.equal(defaultFrame.llama(), 'quack');

    // Test attrs
    test.equal(defaultFrame.attrs().llama, 'quack');
    test.end();
});
