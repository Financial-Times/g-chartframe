import frame from './chartframe';

function webFrameL(configObject){
   var f = frame()
    .autoPosition(true)
    .containerClass('ft-webgraphic-l')
    .backgroundColour('#FFF1E0')
    .width(1180)
    .height(700)
    .blackbar('#000')
    .fullYear(true)
    // .watermark(watermarkPathDark)
    // .watermarkSize(80)
    // .watermarkOffset(-28)
    .margin({bottom:105, right:5, left:20})
    .rem(18)
    .titleY(34)
    .titleStyle({
      'font-size':28,
      'font-family': 'MetricWeb,sans-serif',
      'font-weight': 600,
      'fill':'#000',
    })
    .titleLineHeight(32)
    .subtitleLineHeight(20)
    .subtitleY(67)
    .subtitleStyle({
      'font-size':18,
      'font-family': 'MetricWeb,sans-serif',
      'fill': '#66605C',
    })
    .sourceStyle({
      'font-size': '16px',
      'font-family': 'MetricWeb,sans-serif',
      'fill': '#66605C'
    })
    .copyrightStyle({
      'font-size': '14px',
      'font-style': 'italic',
      'font-family': 'MetricWeb,sans-serif',
      'fill': '#66605C',
    });

    if(configObject !== undefined) f.attrs(configObject);
    return f;
}

export default webFrameL;
