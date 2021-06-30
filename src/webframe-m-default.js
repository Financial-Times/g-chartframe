import frame from './chartframe';
import watermarkPath from './watermarks';

function webFrameMDefault(configObject) {
    const f = frame()
        .autoPosition(true)
        .containerClass('ft-webgraphic-m-default')
        .backgroundColor('#FFF1E0')
        .blackbar('#000')
        .width(700)
        .height(500)
        .watermark(watermarkPath.regular)
        .watermarkSize(80)
        .watermarkOffset(-28)
        .margin({ bottom: 115, right: 5, left: 20 })
        .rem(20)
        .plotAdjuster(8)
        .titleY(32)
        .titleStyle({
            'font-size': '24px',
            'font-family': 'MetricWeb,sans-serif',
            'font-weight': 400,
            fill: '#000',
        })
        .titleLineHeight(28)
        .subtitleLineHeight(28)
        .subtitleStyle({
            'font-size': '18px'
            'font-family': 'MetricWeb,sans-serif',
            fill: '#4d4845',
        })
        .subtitleY(68)
        .sourceLineHeight(18)
        .sourcePlotYOffset(40)
        .sourceStyle({
            'font-size': '14px',
            'font-family': 'MetricWeb,sans-serif',
            fill: '#4d4845',
        })
        .copyrightStyle({
            'font-size': '14px',
            'font-style': 'italic',
            'font-family': 'MetricWeb,sans-serif',
            fill: '#66605C',
        });

    if (configObject !== undefined) f.attrs(configObject);
    return f;
}

export default webFrameMDefault;
