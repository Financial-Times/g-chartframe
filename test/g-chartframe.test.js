import * as fs from 'fs';
import * as d3 from 'd3-selection';
import 'd3-transition';
import tape from 'tape';
import jsdom from 'jsdom';
import * as chartFrame from '../index';

tape('chartFrame defaults', (test) => {
    test.equal(
        chartFrame.frame().title(),
        'Title: A description of the charts purpose',
    );
    test.end();
});

tape('chartFrame works outside browser', (test) => {
    const { JSDOM } = jsdom;
    const defaultFrame = chartFrame.frame();
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const chartContainer = d3.select(dom.window.document.querySelector('svg'));
    chartContainer.call(defaultFrame);
    test.equal(
        chartContainer.select('.chart-title').text(),
        'Title: A description of the charts purpose',
    );
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

tape("chartframe doesn't add a title element if set to false", (test) => {
    const { JSDOM } = jsdom;
    const defaultFrame = chartFrame.frame({
        title: false,
        a11yTitle: false,
    });
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const svg = dom.window.document.querySelector('svg');
    d3.select(svg).call(defaultFrame);

    test.equal(defaultFrame.title(), false);
    test.equal(svg.querySelectorAll('title').length, 0);
    test.end();
});

tape('chartframe adds a11y stuff', (test) => {
    const { JSDOM } = jsdom;
    const defaultFrame = chartFrame.frame({
        title: false,
        a11yTitle: 'This is an accessible title',
        a11yDesc: 'This is an extended a11y description',
    });

    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const svg = dom.window.document.querySelector('svg');

    d3.select(svg).call(defaultFrame);

    test.equal(defaultFrame.title(), false);
    test.deepEqual(defaultFrame.a11y(), {
        title: 'This is an accessible title',
        desc: 'This is an extended a11y description',
    });
    test.equal(defaultFrame.a11yDesc(), 'This is an extended a11y description');
    test.equal(defaultFrame.a11yTitle(), 'This is an accessible title');
    test.equal(svg.querySelectorAll('title').length, 1);
    test.equal(
        svg.querySelector('title').textContent.trim(), // Sometimes textContent includes whitespace
        'This is an accessible title',
    );
    test.equal(
        svg.querySelector('desc').textContent.trim(), // Sometimes textContent includes whitespace
        'This is an extended a11y description',
    );
    test.equal(
        svg.getAttribute('aria-labelledby'),
        'g-chartframe__chart-a11y-title',
    );
    test.equal(
        svg.getAttribute('aria-describedby'),
        'g-chartframe__chart-a11y-desc',
    );
    test.end();
});
