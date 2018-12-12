import * as fs from 'fs';
import * as d3 from 'd3-selection';
import jsdom from 'jsdom';
import webframeMDefault from '../src/webframe-m-default';

test('webframe-m-default renders as expected with defaults', () => {
    const { JSDOM } = jsdom;
    const defaultFrame = webframeMDefault();
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const chartContainer = d3.select(dom.window.document.querySelector('svg'));
    chartContainer.call(defaultFrame);
    expect(chartContainer.node()).toMatchSnapshot();
});
