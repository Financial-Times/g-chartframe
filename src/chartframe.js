function chartFrame(configObject) {
    let autoPosition = false;
    let backgroundColour;
    let containerClass = 'g-chartframe';
    let copyright = '© FT';
    let copyrightStyle = false;
    let goalposts = false; // goalpost is the bit at the top and bottom of pritn charts
    let blackbar = false; // blackbar the short black bar above web graphics
    let fullYear = false;
    let graphicHeight = 400;
    let graphicWidth = 500;
    let plot;
    let plotAdjuster = 0;
    let rem = 18;
    let subtitle = 'some supporting information, units perhaps';
    let subtitleLineHeight = 20;
    let subtitleStyle = {};
    let source = 'Source: research|FT Graphic Tom Pearson';
    let sourceLineHeight = 16;
    let sourcePlotYOffset = 46;
    let sourceStyle = {};
    let title = 'Title: A description of the charts purpose';
    let titleLineHeight = 32;
    let titleStyle = {};
    let watermarkLocation = 'icons.svg#ft-logo';
    let watermarkMarkup = '';
    let watermarkOffset = 0;
    let watermarkSize = 58;
    let units = 'px';

    const margin = {
        top: 100,
        left: 1,
        bottom: 20,
        right: 20,
    };
    const subtitlePosition = { x: 1, y: 67 };
    const sourcePosition = { x: 1 };
    const titlePosition = { x: 1, y: 30 };
    const transition = 0.2;
    const convertFrom = {
        mm(x) { return (x * 2.83464480558843); },
        px(x) { return x; },
    };
    const custom = {};

    function attributeStyle(parent, style) {
        Object.keys(style).forEach((attribute) => {
            parent.attr(attribute, style[attribute]);
        });
    }

    function frame(p) {
        // overall graphic properties
        p.attr('class', containerClass)
            .attr('font-family', 'MetricWeb,sans-serif');
        if (p.node().nodeName.toLowerCase() === 'svg') {
            p.transition(transition)
                .attr('width', graphicWidth)
                .attr('height', graphicHeight)
                .attr('viewBox', ['0 0', graphicWidth, graphicHeight].join(' '));

            p.selectAll('title')
                .data([title])
                .enter()
                .append('title');

            p.selectAll('title').text(title);
        }

        // background
        if (backgroundColour !== undefined) {
            p.selectAll('rect.chart-background')
                .data([backgroundColour])
                .enter()
                .append('rect')
                .attr('id', 'chart-background')
                .attr('class', 'chart-background');

            p.selectAll('rect.chart-background')
                .transition(transition)
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', graphicWidth)
                .attr('height', graphicHeight)
                .attr('fill', backgroundColour);
        }

        // 'blackbar' (the short black bar above web graphics)
        if (blackbar) {
            p.append('rect')
                .attr('width', 60)
                .attr('height', 4)
                .style('fill', blackbar);
        }

        // 'goalposts' (the bit at the top and the bottom of print charts)
        if (goalposts) {
            const goalpostPaths = [
                `M 0, ${graphicHeight} L ${graphicWidth}, ${graphicHeight}`,
                `M 0, 15 L 0, 0 L ${graphicWidth}, 0 L ${graphicWidth}, 15`,
            ];

            p.selectAll('path.chart-goalposts')
                .data(goalpostPaths)
                .enter()
                .append('path')
                .attr('class', 'chart-goalposts');

            p.selectAll('path.chart-goalposts')
                .transition(transition)
                .attr('d', d => d)
                .attr('stroke-width', 0.3)
                .attr('fill', 'none')
                .attr('stroke', goalposts);
        }

        // title
        const titleLineCount = title.split('|').length;
        p.selectAll('text.chart-title')
            .data([title])
            .enter()
            .append('text')
            .attr('class', 'chart-title')
            .attr('id', `${containerClass}title`)
            .call((titleText) => {
                titleText.selectAll('tspan')
                    .data(title.split('|'))
                    .enter()
                    .append('tspan')
                    .html(d => d)
                    .attr('y', (d, i) => (titlePosition.y + (i * titleLineHeight)))
                    .attr('x', titlePosition.x)
                    .call(attributeStyle, titleStyle);
            });

        p.selectAll('text.chart-title tspan')
            .html(d => d)
            .transition(transition)
            .attr('y', (d, i) => (titlePosition.y + (i * titleLineHeight)))
            .attr('x', titlePosition.x)
            .call(attributeStyle, titleStyle);

        const subtitleLineCount = subtitle.split('|').length;
        // subtitle
        p.selectAll('text.chart-subtitle')
            .data([subtitle])
            .enter()
            .append('text')
            .attr('id', `${containerClass}subtitle`)
            .attr('class', 'chart-subtitle')
            .call((subtitleText) => {
                subtitleText.selectAll('tspan')
                    .data(subtitle.split('|'))
                    .enter()
                    .append('tspan')
                    .html(d => d)
                    .attr('id', `${containerClass}subtitle`)
                    .attr('y', (d, i) => {
                        if (titleLineCount > 1) {
                            return (titlePosition.y + (titleLineCount * titleLineHeight) + (subtitleLineHeight * i));
                        }
                        return (subtitlePosition.y + (i * subtitleLineHeight));
                    })

                    .attr('x', subtitlePosition.x)
                    .call(attributeStyle, subtitleStyle);
            });

        p.selectAll('text.chart-subtitle tspan')
            .html(d => d)
            .transition(transition)
            .attr('y', (d, i) => {
                if (titleLineCount > 1) {
                    return (titlePosition.y + (titleLineCount * titleLineHeight) + (subtitleLineHeight * i));
                }
                return (subtitlePosition.y + (i * subtitleLineHeight));
            })
            .attr('x', subtitlePosition.x)
            .call(attributeStyle, subtitleStyle);

        // source
        p.selectAll('text.chart-source')
            .data([source])
            .enter()
            .append('text')
            .attr('class', 'chart-source')
            .attr('id', `${containerClass}source`)
            .call((sourceText) => {
                sourceText.selectAll('tspan')
                    .data(source.split('|'))
                    .enter()
                    .append('tspan')
                    .html(d => d)
                    .attr('id', `${containerClass}source`)
                    .attr('y', (d, i) => {
                        if (sourcePosition.y) {
                            return (sourcePosition.y + (i * sourceLineHeight));
                        }
                        return ((graphicHeight - (margin.bottom - sourcePlotYOffset) + sourceLineHeight * 1.5) + ((i) * sourceLineHeight)); // eslint-disable-line
                    })
                    .attr('x', subtitlePosition.x)
                    .call(attributeStyle, subtitleStyle);
            });

        p.selectAll('text.chart-source tspan')
            .html(d => d)
            .transition(transition)
            .attr('y', (d, i) => {
                if (sourcePosition.y) {
                    return (sourcePosition.y + (i * sourceLineHeight));
                }
                return ((graphicHeight - (margin.bottom - sourcePlotYOffset) + sourceLineHeight * 1.5) + ((i) * sourceLineHeight)); // eslint-disable-line
            })
            .attr('x', sourcePosition.x)
            .call(attributeStyle, sourceStyle);

        const sourceLineCount = source.split('|').length;
        // copyright
        if (copyrightStyle) {
            p.selectAll('text.chart-copyright')
                .data([copyright])
                .enter()
                .append('text')
                .attr('class', 'chart-copyright')
                .append('tspan')
                .html(d => d)
                .attr('x', sourcePosition.x)
                .attr('y', () => {
                    if (sourceLineCount > 1) {
                        return (graphicHeight - (margin.bottom - sourcePlotYOffset) + (sourceLineHeight * 1.125) + (sourceLineCount * sourceLineHeight * 1.2)); // eslint-disable-line
                    }
                    return (graphicHeight - (margin.bottom - sourcePlotYOffset) + (sourceLineHeight * 2.5)); // eslint-disable-line
                })


                .call(attributeStyle, copyrightStyle);
        }


        // TODO figure out a way to improve this autoPosition stuff, needs ot be configurable so we don't have to reference specific classes
        if (autoPosition && (containerClass === 'ft-printgraphic' || containerClass === 'ft-socialgraphic' || containerClass === 'ft-videographic')) {
            margin.top = (titlePosition.y + (titleLineCount * titleLineHeight) + (subtitleLineCount * subtitleLineHeight) + (rem / 3));
        } else if (autoPosition) {
            margin.top = (titlePosition.y + (titleLineCount * titleLineHeight) + (subtitleLineCount * subtitleLineHeight) + 28 - plotAdjuster); // eslint-disable-line
        }

        // watermark

        p.selectAll('g.chart-watermark')
            .data([0])
            .enter()
            .append('g')
            .attr('class', 'chart-watermark')
            .html(watermarkMarkup)
            .attr('transform', `translate(${graphicWidth - watermarkSize - watermarkOffset},${graphicHeight - watermarkSize - watermarkOffset}) scale(${watermarkSize / 100}) `);

        p.selectAll('g.chart-watermark')
            .html(watermarkMarkup)
            .transition()
            .attr('transform', `translate(${graphicWidth - watermarkSize - watermarkOffset},${graphicHeight - watermarkSize - watermarkOffset}) scale(${watermarkSize / 100}) `);

        // plot area (where you put the chart itself)
        p.selectAll('g.chart-plot')
            .data([0])
            .enter()
            .append('g')
            .attr('class', 'chart-plot')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        plot = p.selectAll('g.chart-plot');

        plot.transition(transition)
            .duration(0)
            .attr('transform', `translate(${margin.left},${margin.top})`);
    }


    // Setters and getters

    frame.autoPosition = (x) => {
        if (x === undefined) return autoPosition;
        autoPosition = x;
        return frame;
    };

    frame.backgroundColour = (x) => {
        if (x === undefined) return backgroundColour;
        backgroundColour = x;
        return frame;
    };

    frame.blackbar = (x) => {
        if (x === undefined) return blackbar;
        blackbar = x;
        return frame;
    };

    frame.containerClass = (x) => {
        if (x === undefined) return containerClass;
        containerClass = x;
        return frame;
    };

    frame.copyright = (x) => {
        if (x === undefined) return copyright;
        copyright = x;
        return frame;
    };

    frame.copyrightStyle = (x) => {
        if (x === undefined) return copyrightStyle;
        copyrightStyle = x;
        return frame;
    };

    frame.dimension = () => ({
        width: graphicWidth - (margin.left + margin.right),
        height: graphicHeight - (margin.top + margin.bottom),
    });

    frame.extend = (key, value) => {
        custom[key] = value;
        frame[key] = (d) => {
            if (d === undefined) return custom[key];
            custom[key] = d;
            return frame;
        };
    };

    frame.fullYear = (x) => {
        if (x === undefined) return fullYear;
        fullYear = x;
        return frame;
    };

    frame.goalposts = (x) => {
        if (x === undefined) return goalposts;
        goalposts = x;
        return frame;
    };

    frame.height = (x) => {
        if (x === undefined) return graphicHeight;
        graphicHeight = convertFrom[units](x);
        return frame;
    };

    frame.margin = (x) => {
        if (x === undefined) return margin;
        Object.keys(x).forEach((k) => {
            margin[k] = x[k];
        });
        return frame;
    };

    frame.plot = () => plot;

    frame.plotAdjuster = (x) => {
        if (x === undefined) return plotAdjuster;
        plotAdjuster = x;
        return frame;
    };

    frame.rem = (x) => {
        if (x === undefined) return rem;
        rem = x;
        return frame;
    };

    frame.source = (x) => {
        if (x === undefined) return source;
        source = x;
        return frame;
    };

    frame.sourceLineHeight = (x) => {
        if (x === undefined) return sourceLineHeight;
        sourceLineHeight = x;
        return frame;
    };

    frame.sourcePlotYOffset = (x) => {
        if (x === undefined) return sourcePlotYOffset;
        sourcePlotYOffset = x;
        return frame;
    };

    frame.sourceStyle = (x) => {
        if (x === undefined) return sourceStyle;
        sourceStyle = x;
        return frame;
    };

    frame.sourceX = (x) => {
        if (x === undefined) return sourcePosition.x;
        sourcePosition.x = x;
        return frame;
    };

    frame.sourceY = (x) => {
        if (x === undefined) return sourcePosition.y;
        sourcePosition.y = x;
        return frame;
    };

    frame.subtitle = (x) => {
        if (x === undefined) return subtitle;
        subtitle = x;
        return frame;
    };

    frame.subtitleLineHeight = (x) => {
        if (x === undefined) return subtitleLineHeight;
        subtitleLineHeight = x;
        return frame;
    };

    frame.subtitleStyle = (x) => {
        if (x === undefined) return subtitleStyle;
        subtitleStyle = x;
        return frame;
    };

    frame.subtitleX = (x) => {
        if (x === undefined) return subtitlePosition.x;
        subtitlePosition.x = x;
        return frame;
    };

    frame.subtitleY = (x) => {
        if (x === undefined) return subtitlePosition.y;
        subtitlePosition.y = x;
        return frame;
    };

    frame.title = (x) => {
        if (x === undefined) return title;
        title = x;
        return frame;
    };

    frame.titleStyle = (x) => {
        if (x === undefined) return titleStyle;
        titleStyle = x;
        return frame;
    };

    frame.titleLineHeight = (x) => {
        if (x === undefined) return titleLineHeight;
        titleLineHeight = x;
        return frame;
    };

    frame.titleX = (x) => {
        if (x === undefined) return titlePosition.x;
        titlePosition.x = x;
        return frame;
    };

    frame.titleY = (x) => {
        if (x === undefined) return titlePosition.y;
        titlePosition.y = x;
        return frame;
    };

    frame.units = (x) => {
        if (x === undefined) return units;
        units = x;
        return frame;
    };

    frame.watermark = (x) => {
        if (x === undefined) return watermarkMarkup;
        watermarkLocation = '';
        watermarkMarkup = x;
        return frame;
    };

    frame.watermarkOffset = (x) => {
        if (x === undefined) return watermarkOffset;
        watermarkOffset = x;
        return frame;
    };

    frame.watermarkLocation = (x) => {
        if (x === undefined) return watermarkLocation;
        watermarkMarkup = '';
        watermarkLocation = x;
        return frame;
    };

    frame.watermarkSize = (x) => {
        if (x === undefined) return watermarkSize;
        watermarkSize = x;
        return frame;
    };

    frame.width = (x) => {
        if (!x) return graphicWidth;
        graphicWidth = convertFrom[units](x);
        return frame;
    };

    frame.attrs = (x) => {
        if (x === undefined) {
            return Object.assign({}, {
                autoPosition,
                // axisAlign, // @FIX This is undef?
                containerClass,
                copyright,
                copyrightStyle,
                blackbar,
                goalposts,
                graphicHeight,
                graphicWidth,
                margin,
                plot,
                plotAdjuster,
                rem,
                subtitle,
                subtitleLineHeight,
                subtitlePosition,
                subtitleStyle,
                source,
                sourceLineHeight,
                sourcePosition,
                sourceStyle,
                title,
                titleLineHeight,
                titlePosition,
                titleStyle,
                watermarkLocation,
                watermarkMarkup,
                watermarkOffset,
                watermarkSize,
                units,
            }, custom);
        }

        Object.keys(x).forEach((setterName) => {
            const value = x[setterName];
            if (isFunction(frame[setterName])) {
                frame[setterName](value);
            }
        });
        return frame;
    };

    if (configObject !== undefined) {
        frame.attrs(configObject);
    }

    return frame;
}

function isFunction(functionToCheck) {
    const getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

export default chartFrame;
