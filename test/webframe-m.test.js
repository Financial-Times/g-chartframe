import * as fs from 'fs';
import * as d3 from 'd3-selection';
import jsdom from 'jsdom';
import webframeM from '../src/webframe-m';

test('webframe-m renders as expected with defaults', () => {
    const { JSDOM } = jsdom;
    const defaultFrame = webframeM();
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const chartContainer = d3.select(dom.window.document.querySelector('svg'));
    chartContainer.call(defaultFrame);
    expect(chartContainer.node()).toMatchSnapshot();
});

test('webframeM with constructor options', () => {
    const frame = webframeM({ title: 'webframeM' });

    expect(frame.title()).toBe('webframeM');
});
