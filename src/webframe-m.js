import frame from './chartframe';

function webFrameM(configObject) {
    const f = frame()
        .autoPosition(true)
        .containerClass('ft-webgraphic-m')
        .backgroundColor('#FFF1E0')
        .blackbar('#000')
        .width(700)
        .height(500)
        .watermark(watermarkPathDark)
        .watermarkSize(80)
        .watermarkOffset(-28)
        .margin({ bottom: 104, right: 5, left: 20 })
        .rem(16)
        .plotAdjuster(4)
        .titleY(32)
        .titleStyle({
            'font-size': '24px',
            'font-family': 'MetricWeb,sans-serif',
            'font-weight': 400,
            fill: '#000',
        })
        .titleLineHeight(28)
        .subtitleLineHeight(20)
        .subtitleStyle({
            'font-size': '18px',
            'font-family': 'MetricWeb,sans-serif',
            fill: '#4d4845',
        })
        .subtitleY(64)
        .sourceLineHeight(16)
        .sourcePlotYOffset(44)
        .sourceStyle({
            'font-size': '14px',
            'font-family': 'MetricWeb,sans-serif',
            fill: '#4d4845',
        });

    if (configObject !== undefined) f.attrs(configObject);
    return f;
}

export default webFrameM;
