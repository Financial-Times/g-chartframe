import frame from './chartframe';
import watermarkPath from './watermarks';

function socialFrame(configObject) {
    const f = frame()
        .autoPosition(true)
        .containerClass('ft-socialgraphic')
        .backgroundColor('#262a33')
        .whitebar('#fff')
        .width(612)
        .height(612)
        .watermark(watermarkPath.light)
        .watermarkHeight(10)
        .watermarkWidth(124)
        .watermarkOffsetX(40)
        .watermarkOffsetY(40)
        .margin({ left: 40, right: 40, bottom: 138, top: 140 })
        .rem(24)
        .titleX(40)
        .titleY(80)
        .titleLineHeight(32)
        .titleStyle({
            'font-size': '30px',
            fill: '#ffffff',
            'font-weight': 400,
            'font-family': 'MetricWeb,sans-serif',
        })
        .subtitleX(40)
        .subtitleY(112)
        .subtitleLineHeight(28)
        .subtitleStyle({
            'font-size': '24px',
            fill: '#8e9095',
            'font-weight': 400,
            'font-family': 'MetricWeb,sans-serif',
        })
        .sourceX(40)
        .sourceLineHeight(20)
        .sourcePlotYOffset(66)
        .sourceStyle({
            'font-size': '20px',
            fill: '#8e9095',
            'font-weight': 400,
            'font-family': 'MetricWeb,sans-serif',
        });

    if (configObject !== undefined) f.attrs(configObject);
    return f;
}

export default socialFrame;
