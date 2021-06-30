import frame from './chartframe';
import watermarkPath from './watermarks';

function webFrameL(configObject) {
    const f = frame()
        .autoPosition(true)
        .containerClass('ft-webgraphic-l')
        .backgroundColor('#FFF1E0')
        .width(1180)
        .height(700)
        .blackbar('#000')
        .fullYear(true)
        .watermark(watermarkPath.regular)
        .watermarkHeight(12)
        .watermarkWidth(149)
        .watermarkOffsetX(0)
        .watermarkOffsetY(0)
        .margin({ bottom: 105, right: 5, left: 20 })
        .rem(18)
        .plotAdjuster(8)
        .titleY(32)
        .titleStyle({
            'font-size': '28px',
            'font-family': 'MetricWeb,sans-serif',
            'font-weight': 400,
            fill: '#000',
        })
        .titleLineHeight(32)
        .subtitleLineHeight(20)
        .subtitleY(64)
        .subtitleStyle({
            'font-size': '20px',
            'font-family': 'MetricWeb,sans-serif',
            fill: '#4d4845',
        })
        .sourceLineHeight(16)
        .sourcePlotYOffset(40)
        .sourceStyle({
            'font-size': '16px',
            'font-family': 'MetricWeb,sans-serif',
            fill: '#4d4845',
        });

    if (configObject !== undefined) f.attrs(configObject);
    return f;
}

export default webFrameL;
