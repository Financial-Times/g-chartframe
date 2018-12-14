import * as fs from 'fs';
import * as d3 from 'd3-selection';
import jsdom from 'jsdom';
import socialframe from '../src/socialframe';

test('socialframe renders as expected with defaults', () => {
    const { JSDOM } = jsdom;
    const defaultFrame = socialframe();
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const chartContainer = d3.select(dom.window.document.querySelector('svg'));
    chartContainer.call(defaultFrame);
    expect(chartContainer.node()).toMatchSnapshot();
});

test('socialframe with constructor options', () => {
    const frame = socialframe({ title: 'socialframe' });

    expect(frame.title()).toBe('socialframe');
});
