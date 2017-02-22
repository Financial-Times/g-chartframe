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

Set the background colour of the frame. For the single argument you can use the same css color naming schemes that you use in HTML, whether that's color names (that is red), rgb values (that is rgb(255,0,0)), hex values, rgba values, etc. If no argument is specified returns the current value.

```
myFrame.backgroundColour('#00FF00');
```

*frame.containerClass(_[string]_)*

Set the class assigned to the containing SVG element. This allows you to select the frame later and to define CSS styles pertaining only to its contents. If no argument is specified returns the current value.

```
myFrame.containerClass('special-frame');
```
would allow you to target the frames contents in your CSS like this...
```
.special-frame line{
	stroke-width:2;
	stroke:#00FF00;
	stroke-opacity:0.5;
	fill:none;
}
```

*frame.dimension()*

This returns an object with the `height` and `width` of the suggested plot area. This is useful for determining the range of scales.
If no argument is specified returns the current value.

```
const dimension = myFrame.dimension(); // e.g. { width: 200 ,height: 550,}
const horizontalScale = d3.linearScale()
	.range([0, dimension.width]);

const verticalScale = d.lineaScale()
	.range([dimension.height, 0]);
```

*frame.height(_[number]_)*

Set the height for the frames container (typically be an SVG).
If no argument is specified returns the current value.

*frame.margin(_[{top:number,left:number,bottom:number,right:number,}]_)*

Set the margins for the frame follwing the <a href="https://bl.ocks.org/mbostock/3019563">D3 margin convention</a>.
If no argument is specified returns the current value.

*frame.plot()*

This returns a d3 selection of the frames plot group. This is where the graphical elements of the chart can be appended.

```
const plot = myFrame.plot();

plot.selectAll('rect')
	.data(theData)
	.enter()
	.append('rect')
	...

```

*frame.source(_[string]_)*

A string describes the source of the graphic's data, line breaks can be added with the `|` character. The property can also be used to add notes, credits etc. 

```

```

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
