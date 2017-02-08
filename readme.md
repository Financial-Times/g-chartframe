<<<<<<< HEAD


A fork of: http://www.toffeemilkshake.co.uk/chart-frame/

# d3-chart-frame
=======
# d3-chartframe
>>>>>>> tomgp/master

What is it? It's for making the boring but necessary stuff on D3 charts in as painless a fashion as possible.

more information here:  http://www.toffeemilkshake.co.uk/d3-chartframe/

## Installing

If you use NPM, `npm install d3-chartframe`. Otherwise, download the [latest release](https://github.com/d3/d3-foo/releases/latest).

## API Reference

<a href="#margin" name="margin">#</a> frame.<b>margin</b>({ D3 margin convention })

Uses the D3 margin convention to position the plot area, i.e. the bit inside the frame.

```
frame.margin({
  top:20,
  left:20,
  right:20,
  bottom:20
});
```

You can provide just top, or just left or whatever. The rest will be defaults. If you don't provide any arguments the function returns the currently set margins.

<a href="#title" name="title">#</a> frame.<b>title</b>( string )

Set the HTML of the chart's title (if no string is specified returns the current value)


<a href="#subtitle" name="subtitle">#</a> frame.<b>subtitle</b>( string )

Set the HTML of the chart's subtitle (if no string is specified returns the current value).


<a href="#source" name="source">#</a> frame.<b>source</b>( string )

Set the HTML of the chart's source (if no string is specified returns the current value).


<a href="#dimension" name="dimension">#</a> frame.<b>dimension</b>()
Get the size of the available area i.e. size of the SVG without the margins. Returns an object:

```
{
	width:500,
	height:500
}
```


<a href="#titleY" name="titleY">#</a> frame.<b>titleY</b>( position )

Set the Y position of the title (if no position is provided returns the current value).


<a href="#subtitleY" name="subtitleY">#</a> frame.<b>subtitleY</b>( position )

Set the Y position of the subtitle (if no position is provided returns the current value).


<a href="#sourceYOffset" name="sourceYOffset">#</a> frame.<b>sourceYOffset</b>( position )

How much the source is offset from the bottom of the SVG. (if no position is provided returns the current value).


<a href="#width" name="width">#</a> frame.<b>width</b>( size )

Set (or if no argument is specified, retrieve) the width of the available space for the chart frame. 👇


<a href="#height" name="height">#</a> frame.<b>height</b>( size )

Set (or if no argument is specified, retrieve) the height of the available space for the chart frame. 👇


<a href="#watermark" name="watermark">#</a>  frame.<b>watermark</b>( href )

This adds a little icon to the bottom right of the chart for attribution purposes, not really awatermark I suppose. Typically I'd use an external svg file:

```
frame.watermark('external.svg#element-id');
```

<a href="#watermarkSize" name="watermarkSize">#</a> frame.<b>watermarkSize</b>( size )

The size of the icon mentioned above, in pixels.


👉 _Note_: If the chart frame is being called on an SVG element the width, height and title functions will re-write those properties of the parent SVG. If you don't want this to happen you can avoid it by calling the function on a group element instead.

--

Copyright (c) 2015, 2016, Tom G Pearson

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
