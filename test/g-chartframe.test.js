import * as fs from 'fs';
import * as d3 from 'd3-selection';
import 'd3-transition';
import tape from 'tape';
import jsdom from 'jsdom';
import * as chartFrame from '../index';

tape('chartFrame defaults', (test) => {
    test.equal(chartFrame.frame().title(), 'Title: A description of the charts purpose');
    test.end();
});

tape('chartFrame works outside browser', (test) => {
    const { JSDOM } = jsdom;
    const defaultFrame = chartFrame.frame();
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const chartContainer = d3.select(dom.window.document.querySelector('svg'));
    chartContainer.call(defaultFrame);
    test.equal(chartContainer.select('.chart-title').text(), 'Title: A description of the charts purpose');
    test.end();
});

tape('chartFrame works outside browser in a pure SVG context', (test) => {
    const { JSDOM } = jsdom;
    const defaultFrame = chartFrame.frame();
    const dom = new JSDOM('<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="700" height="500" viewBox="0 0 700 500"></svg>', {
        contentType: 'image/svg+xml',
    });
    const chartContainer = d3.select(dom.window.document.querySelector('svg'));
    chartContainer.call(defaultFrame);
    test.equal(chartContainer.select('.chart-title').text(), 'Title: A description of the charts purpose');
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

tape('chartFrame can have "Save PNG" buttons', (test) => {
    const { JSDOM } = jsdom;
    const defaultFrame = chartFrame.frame(); // enabled by default
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const chartContainer = d3.select(dom.window.document.querySelector('svg'));
    chartContainer.call(defaultFrame);

    test.equal(dom.window.document.querySelectorAll('button').length, 2);
    test.end();
});

tape('chartFrame "Save PNG" buttons can be disabled', (test) => {
    const { JSDOM } = jsdom;
    const defaultFrame = chartFrame.frame().showDownloadPngButtons(false);
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const chartContainer = d3.select(dom.window.document.querySelector('svg'));
    chartContainer.call(defaultFrame);

    test.equal(dom.window.document.querySelectorAll('button').length, 0);
    test.end();
});
