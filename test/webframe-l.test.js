import * as fs from 'fs';
import * as d3 from 'd3-selection';
import jsdom from 'jsdom';
import webframeL from '../src/webframe-l';

test('webframe-l renders as expected with defaults', () => {
    const { JSDOM } = jsdom;
    const defaultFrame = webframeL();
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const chartContainer = d3.select(dom.window.document.querySelector('svg'));
    chartContainer.call(defaultFrame);
    expect(chartContainer.node()).toMatchSnapshot();
});

test('webframeL with constructor options', () => {
    const frame = webframeL({ title: 'webframeL' });

    expect(frame.title()).toBe('webframeL');
});
