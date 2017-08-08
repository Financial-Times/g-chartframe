import frame from './chartframe';

function webFrameMDefault(configObject){
   var f = frame()
    .autoPosition(true)
    .containerClass('ft-webgraphic-m-default')
    .backgroundColour('#FFF1E0')
    .blackbar('#000')
    .width(700)
    .height(500)
    // .watermark(watermarkPathDark)
    // .watermarkSize(80)
    // .watermarkOffset(-28)
    .margin({bottom:115, right:5, left:20})
    .rem(20)
    .plotAdjuster(8)
    .titleY(32)
    .titleStyle({
      'font-size':28,
      'font-family': 'MetricWeb,sans-serif',
      'font-weight': 400,
      'fill':'#000',
    })
    .titleLineHeight(28)
    .subtitleLineHeight(28)
    .subtitleStyle({
      'font-size':24,
      'font-family': 'MetricWeb,sans-serif',
      'fill': '#66605C',
    })
    .subtitleY(68)
    .sourceLineHeight(18)
    .sourcePlotYOffset(34)
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

export default webFrameMDefault;

