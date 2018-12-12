import * as fs from 'fs';
import * as d3 from 'd3-selection';
import jsdom from 'jsdom';
import frame from '../src/chartframe';

test('chartFrame defaults', () => {
    expect(frame().title()).toBe('Title: A description of the charts purpose');
});

test('chartFrame works outside browser', () => {
    const { JSDOM } = jsdom;
    const defaultFrame = frame();
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const chartContainer = d3.select(dom.window.document.querySelector('svg'));
    chartContainer.call(defaultFrame);
    expect(chartContainer.select('.chart-title').text()).toBe('Title: A description of the charts purpose');
});

test('chartFrame can be extended', () => {
    const defaultFrame = frame();
    defaultFrame.extend('llama', 'duck');

    // expect getter
    expect(defaultFrame.llama()).toBe('duck');

    // expect setter
    defaultFrame.llama('quack');
    expect(defaultFrame.llama()).toBe('quack');

    // expect attrs
    expect(defaultFrame.attrs().llama).toBe('quack');
});

test('chartFrame can have "Save PNG" buttons', () => {
    const { JSDOM } = jsdom;
    const defaultFrame = frame(); // enabled by default
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const chartContainer = d3.select(dom.window.document.querySelector('svg'));
    chartContainer.call(defaultFrame);

    expect(dom.window.document.querySelectorAll('button').length).toBe(2);
});

test('chartFrame "Save PNG" buttons can be disabled', () => {
    const { JSDOM } = jsdom;
    const defaultFrame = frame().showDownloadPngButtons(false);
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const chartContainer = d3.select(dom.window.document.querySelector('svg'));
    chartContainer.call(defaultFrame);

    expect(dom.window.document.querySelectorAll('button').length).toBe(0);
});

test("chartframe doesn't add a title element if set to false", () => {
    const { JSDOM } = jsdom;
    const defaultFrame = frame({
        title: false,
        a11yTitle: false,
    });
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const svg = dom.window.document.querySelector('svg');
    d3.select(svg).call(defaultFrame);

    expect(defaultFrame.title()).toBe(false);
    expect(svg.querySelectorAll('title').length).toBe(0);
});

test('chartframe adds a11y stuff', () => {
    const { JSDOM } = jsdom;
    const defaultFrame = frame({
        title: false,
        a11yTitle: 'This is an accessible title',
        a11yDesc: 'This is an extended a11y description',
        watermark: '<text>Holla</text>',
    });

    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const svg = dom.window.document.querySelector('svg');
    d3.select(svg).call(defaultFrame);

    expect(defaultFrame.title()).toBe(false);
    expect(defaultFrame.a11y()).toEqual({
        title: 'This is an accessible title',
        desc: 'This is an extended a11y description',
    });
    expect(defaultFrame.a11yDesc()).toBe('This is an extended a11y description');
    expect(defaultFrame.a11yTitle()).toBe('This is an accessible title');
    expect(svg.querySelectorAll('title').length).toBe(1);
    expect(svg.querySelector('title').textContent.trim()).toBe('This is an accessible title');
    expect(svg.querySelector('desc').textContent.trim()).toBe('This is an extended a11y description');
    expect(svg.getAttribute('aria-labelledby')).toBe('g-chartframe__chart-a11y-title g-chartframe__chart-a11y-desc');
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.querySelector('.chart-plot').getAttribute('role')).toBe('presentation');
    expect(svg.querySelector('.chart-watermark').getAttribute('role')).toBe('presentation');
});
