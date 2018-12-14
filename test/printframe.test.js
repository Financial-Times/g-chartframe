import * as fs from 'fs';
import * as d3 from 'd3-selection';
import jsdom from 'jsdom';
import printframe from '../src/printframe';

test('printframe renders as expected with defaults', () => {
    const { JSDOM } = jsdom;
    const defaultFrame = printframe();
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const chartContainer = d3.select(dom.window.document.querySelector('svg'));
    chartContainer.call(defaultFrame);
    expect(chartContainer.node()).toMatchSnapshot();
});

test('printframe with constructor options', () => {
    const frame = printframe({ title: 'PrintFrame' });

    expect(frame.title()).toBe('PrintFrame');
});
