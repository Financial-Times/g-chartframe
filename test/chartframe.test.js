/**
 * @file
 * Base class unit tests
 */

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

test('frame works with multiline title/subtitle/source', () => {
    const { JSDOM } = jsdom;
    const defaultFrame = frame({
        title: 'Multiline|Title',
        subtitle: 'Multiline|Subtitle',
        source: 'Multiline|Source',
    });
    const dom = new JSDOM(fs.readFileSync('test/scaffold.html'));
    const chartContainer = d3.select(dom.window.document.querySelector('svg'));
    chartContainer.call(defaultFrame);
    expect(chartContainer.node()).toMatchSnapshot();
});

test('chartframe#attrs()', () => {
    const defaultFrame = frame();

    const titleSpy = jest.spyOn(defaultFrame, 'title');
    const subtitleSpy = jest.spyOn(defaultFrame, 'subtitle');

    defaultFrame.attrs({
        title: 'yay title',
        subtitle: 'yay subtitle',
    });

    expect(titleSpy).toHaveBeenCalled();
    expect(subtitleSpy).toHaveBeenCalled();
    expect(defaultFrame.title()).toBe('yay title');
    expect(defaultFrame.subtitle()).toBe('yay subtitle');
});

test('frame#a11y()', () => {
    const defaultFrame = frame();
    defaultFrame.a11y({ title: 'test-title', desc: 'test-desc' });
    expect(defaultFrame.a11y()).toEqual({
        title: 'test-title',
        desc: 'test-desc',
    });
});

test('frame#a11yDesc()', () => {
    const defaultFrame = frame();
    defaultFrame.a11yDesc('test');
    expect(defaultFrame.a11yDesc()).toBe('test');
});

test('frame#a11yPlotPresentation()', () => {
    const defaultFrame = frame();
    defaultFrame.a11yPlotPresentation('test');
    expect(defaultFrame.a11yPlotPresentation()).toBe('test');
});

test('frame#a11yTitle()', () => {
    const defaultFrame = frame();
    defaultFrame.a11yTitle('test');
    expect(defaultFrame.a11yTitle()).toBe('test');
});

test('frame#autoPosition()', () => {
    const defaultFrame = frame();
    defaultFrame.autoPosition('test');
    expect(defaultFrame.autoPosition()).toBe('test');
});

test('frame#backgroundColor()', () => {
    const defaultFrame = frame();
    defaultFrame.backgroundColor('test');
    expect(defaultFrame.backgroundColor()).toBe('test');
});

test('frame#backgroundColour()', () => {
    const defaultFrame = frame();
    const bgColorSpy = jest.spyOn(defaultFrame, 'backgroundColor');

    defaultFrame.backgroundColour('test');

    expect(bgColorSpy).toHaveBeenLastCalledWith('test');
    expect(defaultFrame.backgroundColour()).toBe('test');
    expect(defaultFrame.backgroundColor()).toBe('test');
});

test('frame#containerClass()', () => {
    const defaultFrame = frame();
    defaultFrame.containerClass('test');
    expect(defaultFrame.containerClass()).toBe('test');
});

test('frame#copyright()', () => {
    const defaultFrame = frame();
    defaultFrame.copyright('test');
    expect(defaultFrame.copyright()).toBe('test');
});

test('frame#copyrightStyle()', () => {
    const defaultFrame = frame();
    defaultFrame.copyrightStyle('test');
    expect(defaultFrame.copyrightStyle()).toBe('test');
});

test('frame#blackbar()', () => {
    const defaultFrame = frame();
    defaultFrame.blackbar('test');
    expect(defaultFrame.blackbar()).toBe('test');
});

test('frame#goalposts()', () => {
    const defaultFrame = frame();
    defaultFrame.goalposts('test');
    expect(defaultFrame.goalposts()).toBe('test');
});

test('frame#height()', () => {
    const defaultFrame = frame();
    defaultFrame.height(13.7);
    expect(defaultFrame.height()).toBe(13.7);
});

test('frame#width()', () => {
    const defaultFrame = frame();
    defaultFrame.width(13.7);
    expect(defaultFrame.width()).toBe(13.7);
});

test('frame#margin()', () => {
    const defaultFrame = frame();

    defaultFrame.margin({
        left: 13.7,
        right: 13.7,
        top: 13.7,
        bottom: 13.7,
    });
    expect(defaultFrame.margin()).toEqual({
        left: 13.7,
        right: 13.7,
        top: 13.7,
        bottom: 13.7,
    });
});

test('frame#plotAdjuster()', () => {
    const defaultFrame = frame();
    defaultFrame.plotAdjuster('test');
    expect(defaultFrame.plotAdjuster()).toBe('test');
});

test('frame#rem()', () => {
    const defaultFrame = frame();
    defaultFrame.rem('test');
    expect(defaultFrame.rem()).toBe('test');
});

test('frame#showDownloadPngButtons()', () => {
    const defaultFrame = frame();
    expect(defaultFrame.showDownloadPngButtons()).toBe(true);

    defaultFrame.showDownloadPngButtons(false);
    expect(defaultFrame.showDownloadPngButtons()).toBe(false);
});

test('frame#subtitle()', () => {
    const defaultFrame = frame();
    defaultFrame.subtitle('test');
    expect(defaultFrame.subtitle()).toBe('test');
});

test('frame#subtitleLineHeight()', () => {
    const defaultFrame = frame();
    defaultFrame.subtitleLineHeight('test');
    expect(defaultFrame.subtitleLineHeight()).toBe('test');
});

test('frame#subtitleX()', () => {
    const defaultFrame = frame();
    defaultFrame.subtitleX(13.7);
    expect(defaultFrame.subtitleX()).toBe(13.7);
});

test('frame#subtitleY()', () => {
    const defaultFrame = frame();
    defaultFrame.subtitleY(13.7);
    expect(defaultFrame.subtitleY()).toBe(13.7);
});

test('frame#subtitleStyle()', () => {
    const defaultFrame = frame();
    defaultFrame.subtitleStyle('test');
    expect(defaultFrame.subtitleStyle()).toBe('test');
});

test('frame#source()', () => {
    const defaultFrame = frame();
    defaultFrame.source('test');
    expect(defaultFrame.source()).toBe('test');
});

test('frame#sourceLineHeight()', () => {
    const defaultFrame = frame();
    defaultFrame.sourceLineHeight('test');
    expect(defaultFrame.sourceLineHeight()).toBe('test');
});

test('frame#sourcePlotYOffset()', () => {
    const defaultFrame = frame();
    defaultFrame.sourcePlotYOffset(13.7);
    expect(defaultFrame.sourcePlotYOffset()).toBe(13.7);
});

test('frame#sourceX()', () => {
    const defaultFrame = frame();
    defaultFrame.sourceX(13.7);
    expect(defaultFrame.sourceX()).toBe(13.7);
});

test('frame#sourceY()', () => {
    const defaultFrame = frame();
    defaultFrame.sourceY(13.7);
    expect(defaultFrame.sourceY()).toBe(13.7);
});

test('frame#sourceStyle()', () => {
    const defaultFrame = frame();
    defaultFrame.sourceStyle('test');
    expect(defaultFrame.sourceStyle()).toBe('test');
});

test('frame#title()', () => {
    const defaultFrame = frame();
    defaultFrame.title('test');
    expect(defaultFrame.title()).toBe('test');
});

test('frame#titleLineHeight()', () => {
    const defaultFrame = frame();
    defaultFrame.titleLineHeight('test');
    expect(defaultFrame.titleLineHeight()).toBe('test');
});

test('frame#titleX()', () => {
    const defaultFrame = frame();
    defaultFrame.titleX(13.7);
    expect(defaultFrame.titleX()).toBe(13.7);
});

test('frame#titleY()', () => {
    const defaultFrame = frame();
    defaultFrame.titleY(13.7);
    expect(defaultFrame.titleY()).toBe(13.7);
});

test('frame#titleStyle()', () => {
    const defaultFrame = frame();
    defaultFrame.titleStyle('test');
    expect(defaultFrame.titleStyle()).toBe('test');
});

test('frame#watermarkLocation()', () => {
    const defaultFrame = frame();
    defaultFrame.watermarkLocation('test');
    expect(defaultFrame.watermarkLocation()).toBe('test');
});

test('frame#watermark()', () => {
    const defaultFrame = frame();
    defaultFrame.watermark('test');
    expect(defaultFrame.watermark()).toBe('test');
});

test('frame#watermarkOffsetX()', () => {
    const defaultFrame = frame();
    defaultFrame.watermarkOffsetX('test');
    expect(defaultFrame.watermarkOffsetX()).toBe('test');
});

test('frame#watermarkOffsetY()', () => {
    const defaultFrame = frame();
    defaultFrame.watermarkOffsetY('test');
    expect(defaultFrame.watermarkOffsetY()).toBe('test');
});

test('frame#watermarkHeight()', () => {
    const defaultFrame = frame();
    defaultFrame.watermarkHeight('test');
    expect(defaultFrame.watermarkHeight()).toBe('test');
});

test('frame#watermarkWidth()', () => {
    const defaultFrame = frame();
    defaultFrame.watermarkWidth('test');
    expect(defaultFrame.watermarkWidth()).toBe('test');
});

test('frame#whitebar()', () => {
    const defaultFrame = frame();
    defaultFrame.whitebar('test');
    expect(defaultFrame.whitebar()).toBe('test');
});

test('frame#units()', () => {
    const defaultFrame = frame();
    defaultFrame.units('test');
    expect(defaultFrame.units()).toBe('test');
});

test('frame#units()', () => {
    const defaultFrame = frame();
    defaultFrame.units('test');
    expect(defaultFrame.units()).toBe('test');
});

test('frame#fullYear()', () => {
    const defaultFrame = frame();

    expect(defaultFrame.fullYear()).toBe(false);

    defaultFrame.fullYear(true);
    expect(defaultFrame.fullYear()).toBe(true);
});
