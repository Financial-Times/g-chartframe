import frame from './chartframe';
import watermarkPath from './watermarks';

function printFrame(configObject){
  var f = frame()
    .autoPosition(true)
    .containerClass('ft-printgraphic')
    .backgroundColour('#FFF')
    .goalposts('#000')
    .units('mm')
    .width(112.25) //these are after the units are set so they are converted from mm to px
    .height(68)
    .margin({top:40, left:15, bottom:35, right:7})
    .watermark(watermarkPath.dark)
    .rem(9.6)
    .titleStyle({
      'font-size': '12px',
      'fill': '#000000',
      'font-weight': '600',
      'font-family': 'MetricWeb,sans-serif',
    })
    .titleX(7)
    .titleY(15)
    .titleLineHeight(13)
    .subtitleStyle({
      'fill': '#000000',
      'font-size': '9.6px',
      'font-weight': 400,
      'font-family': 'MetricWeb,sans-serif',
    })
    .subtitleLineHeight(10)
    .subtitleX(7)
    .subtitleY(27)
    .sourceStyle({
        'fill': '#000000',
        'font-size': '7.2px',
        'font-weight': 400,
      'font-family': 'MetricWeb,sans-serif',
    })
    .sourceX(7)
    .sourcePlotYOffset(18)
    .sourceLineHeight(8)
    .watermark('');

    if(configObject !== undefined) f.attrs(configObject);
    return f;
}

export default printFrame;
