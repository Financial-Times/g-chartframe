import frame from './chartframe';
import watermarkPath from './watermarks';

function webFrameS(configObject) {
    const f = frame()
        .autoPosition(true)
        .containerClass('ft-webgraphic-s')
        .backgroundColor('#FFF1E0')
        .blackbar('#000')
        .width(300)
        .watermark(watermarkPath.regular)
        .watermarkHeight(12)
        .watermarkWidth(149)
        .watermarkOffsetX(0)
        .watermarkOffsetY(0)
        .margin({ bottom: 90, right: 5, left: 15 })
        .rem(14)
        .plotAdjuster(0)
        .titleStyle({
            'font-size': '20px',
            'font-family': 'MetricWeb,sans-serif',
            'font-weight': 400,
            fill: '#000',
        })
        .titleY(32)
        .titleLineHeight(24)
        .subtitleLineHeight(20)
        .subtitleStyle({
            'font-size': '18px',
            'font-family': 'MetricWeb,sans-serif',
            fill: '#4d4845',
        })
        .subtitleY(64)
        .sourceLineHeight(12)
        .sourcePlotYOffset(36)
        .sourceStyle({
            'font-size': '14px',
            'font-family': 'MetricWeb,sans-serif',
            fill: '#4d4845',
        });

    if (configObject !== undefined) f.attrs(configObject);
    return f;
}

export default webFrameS;
