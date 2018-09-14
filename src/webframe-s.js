import frame from './chartframe.js';

function webFrameS(configObject) {
    const f = frame()
        .autoPosition(true)
        .containerClass('ft-webgraphic-s')
        .backgroundColour('#FFF1E0')
        .blackbar('#000')
        .width(300)
        // .watermark(watermarkPathDark)
        // .watermarkSize(80)
        // .watermarkOffset(-28)
        .margin({ bottom: 90, right: 5, left: 15 })
        .rem(14)
        .plotAdjuster(0)
        .titleStyle({
            'font-size': 20,
            'font-family': 'MetricWeb,sans-serif',
            'font-weight': 400,
            fill: '#000',
        })
        .titleY(32)
        .titleLineHeight(24)
        .subtitleLineHeight(20)
        .subtitleStyle({
            'font-size': 18,
            'font-family': 'MetricWeb,sans-serif',
            fill: '#66605C',
        })
        .subtitleY(64)
        .sourceLineHeight(12)
        .sourcePlotYOffset(38)
        .sourceStyle({
            'font-size': '12px',
            'font-family': 'MetricWeb,sans-serif',
            fill: '#66605C',
        })
        .copyrightStyle({
            'font-size': '12px',
            'font-style': 'italic',
            'font-family': 'MetricWeb,sans-serif',
            fill: '#66605C',
        });

    if (configObject !== undefined) f.attrs(configObject);
    return f;
}

export default webFrameS;
