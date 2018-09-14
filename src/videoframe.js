import frame from './chartframe.js';

function videoFrame(configObject) {
    const f = frame()
        .autoPosition(true)
        .backgroundColour('#262a33')
        .containerClass('ft-videographic')
        .width(1920)
        .height(1080)
        .watermark('')
        .margin({ left: 207, right: 207, bottom: 210, top: 233 })
        .rem(48)
        .titleX(207)
        .titleY(130)
        .titleLineHeight(68)
        .titleStyle({
            'font-size': '72px',
            fill: '#ffffff',
            'font-weight': 400,
            'font-family': 'MetricWeb,sans-serif',
        })
        .subtitleX(207)
        .subtitleY(200)
        .subtitleLineHeight(48)
        .subtitleStyle({
            'font-size': '48px',
            fill: '#8e9095',
            'font-weight': 400,
            'font-family': 'MetricWeb,sans-serif',
        })
        .sourceX(207)
        .sourcePlotYOffset(60)
        .sourceLineHeight(38)
        .sourceStyle({
            'font-size': '36px',
            fill: '#8e9095',
            'font-weight': 400,
            'font-family': 'MetricWeb,sans-serif',
        });

    if (configObject !== undefined) f.attrs(configObject);
    return f;
}

export default videoFrame;
