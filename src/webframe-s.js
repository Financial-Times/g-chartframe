import frame from './chartframe';

function webFrameS(configObject){
   var f = frame()
    .autoPosition(true)
    .containerClass('ft-webgraphic-s')
    .backgroundColour('#FFF1E0')
    .blackbar('#000')
    .width(300)
    // .watermark(watermarkPathDark)
    // .watermarkSize(80)
    // .watermarkOffset(-28)
    .margin({bottom:90, right:5, left:15})
    .rem(14)
    .titleStyle({
      'font-size':28,
      'font-family': 'MetricWeb,sans-serif',
      'font-weight': 600,
      'fill':'#000',
    })
    .titleLineHeight(32)
    .subtitleLineHeight(20)
    .subtitleStyle({
      'font-size':18,
      'font-family': 'MetricWeb,sans-serif',
      'fill': '#66605C',
    })
    .sourceLineHeight(14)
    .sourcePlotYOffset(34)
    .sourceStyle({
      'font-size': '14px',
      'font-family': 'MetricWeb,sans-serif',
      'fill': '#66605C'
    })
    .copyrightStyle({
      'font-size': '12px',
      'font-style': 'italic',
      'font-family': 'MetricWeb,sans-serif',
      'fill': '#66605C',
    });

    if(configObject !== undefined) f.attrs(configObject);
    return f;
}

export default webFrameS;
