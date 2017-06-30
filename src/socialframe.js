import frame from './chartframe';
import watermarkPath from './watermarks';

function socialFrame(configObject){
  var f = frame()
    .autoPosition(true)
    .containerClass('ft-socialgraphic')
    .backgroundColour('#212121')
    .width(560)
    .height(750)
    .watermark(watermarkPath.light)
    .watermarkOffset(25)
    .margin({left:50, right:40, bottom:138, top:140})
    .rem(28)
    .titleX(50)
    .titleY(72)
    .titleLineHeight(38)
    .titleStyle({
      'font-size': '38px',
      'fill': '#ffffff',
      'font-weight': 600,
      'fill-opacity': 0.9,
      'font-family': 'MetricWeb,sans-serif',
    })
    .subtitleX(50)
    .subtitleY(110)
    .subtitleLineHeight(28)
    .subtitleStyle({
      'font-size': '28px',
      'fill': '#ffffff',
      'font-weight': 400,
      'fill-opacity': 0.7,
      'font-family': 'MetricWeb,sans-serif',
    })
    .sourceX(50)
    .sourceLineHeight(25)
    .sourceStyle({
      'font-size': '25px',
      'fill': '#ffffff',
      'font-weight': 400,
      'fill-opacity': 0.5,
      'font-family': 'MetricWeb,sans-serif',
    });

  if(configObject !== undefined) f.attrs(configObject);
  return f;
}

export default socialFrame;
