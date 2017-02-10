# g-chartframe

For making the boring but necessary stuff on D3 charts in as painless a fashion as possible.

## Installation

If you use NPM, `npm install @financial-times/g-chartframe`(er... not yet!). Otherwise, download the [latest release](https://github.com/ft-interactive/g-chartframe/releases/latest).

## Use

Preconfigured frames...

```
const webframe = gChartframe.webFrame;
webframe.title('A simple chart')
	.subtitle('showing some interesting things')
	.source('source: FT research|FT Graphic Tom Pearson');

d3.select('.web-chart-container svg')
	.call(webframe);

webframe.plot()
	...add your visualisation code here...

```

Configure your own frame...
```
const myFrame = gChartframe.frame()
	.width(350)
	.height(350)
	.margin({top:20,left:20,bottom:20,right:20,})
	.title('My totally custom title')
	.subtitle('hello hello hello')

d3.select('.custom-chart-container')
	.append('svg')
	.call(myFrame);
```

## API Reference

![reference image indicating whcih properties refer to which bits of the chart frame](https://raw.githubusercontent.com/ft-interactive/g-chartframe/master/markup-frame.png)



*frame.backgroundColour(_[string]_)*

*frame.containerClass(_[string]_)*

*frame.dimension()*

*frame.height(_[number]_)*

*frame.margin(_[{top:number,left:number,bottom:number,right:number,}]_)*

*frame.plot()*

*frame.source(_[string]_)*

*frame.sourceLineHeight(_[number]_)*

*frame.sourceStyle(_[{attribute:value}]_)*

*frame.sourceX(_[number]_)*

*frame.sourceY(_[number]_)*

*frame.subtitle(_[string]_)*

*frame.subtitleLineHeight(_[number]_)*

*frame.subtitleStyle(_[{attribute:value}]_)*

*frame.subtitleX(_[number]_)*

*frame.subtitleY(_[number]_)*

*frame.title(_[string]_)*

*frame.titleStyle(_[number]_)*

*frame.titleLineHeight(_[number]_)*

*frame.titleX(_[number]_)*

*frame.titleY(_[number]_)*

*frame.units(_[string]_)*

*frame.watermark(_[svgnodes]_)*

*frame.watermarkLocation(_[href]_)*

*frame.width(_[number]_)*


👉 _Note_: If the chart frame is being called on an SVG element the width, height and title functions will re-write those properties of the parent SVG. If you don't want this to happen you can avoid it by calling the function on a group element instead.

--

Copyright (c) 2015, 2016, 2017 Tom G Pearson

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
