import { saveSvgAsPng } from "save-svg-as-png";
import * as d3 from "d3-selection";

function chartFrame(configObject) {
    let autoPosition = false;
    let a11yDesc = "A graphic by the Financial Times";
    let a11yPlotPresentation = true;
    let a11yTitle = "A chart";
    let backgroundColor;
    let containerClass = "g-chartframe";
    let copyright = "© FT";
    let copyrightStyle = false;
    let goalposts = false; // goalpost is the bit at the top and bottom of pritn charts
    let blackbar = false; // blackbar the short black bar above web graphics
    let whitebar = false; // whitebar the short white bar above social graphics
    let fullYear = false;
    let showDownloadPngButtons = true;
    let graphicHeight = 400;
    let graphicWidth = 500;
    let plot;
    let plotAdjuster = 0;
    let rem = 18;
    let subtitle = "some supporting information, units perhaps";
    let subtitleLineHeight = 20;
    let subtitleStyle = {};
    let source = "Source: research";
    let sourceLineHeight = 16;
    let sourcePlotYOffset = 46;
    let sourceStyle = {};
    let title = "Title: A description of the charts purpose";
    let titleLineHeight = 32;
    let titleStyle = {};
    let watermarkLocation = "icons.svg#ft-logo";
    let watermarkMarkup = "";
    let watermarkOffsetX = 40;
    let watermarkOffsetY = 0;
    let watermarkWidth = 124;
    let watermarkHeight = 10;
    let units = "px";

    const margin = {
        top: 100,
        left: 1,
        bottom: 20,
        right: 20
    };
    const subtitlePosition = { x: 1, y: 67 };
    const sourcePosition = { x: 1 };
    const titlePosition = { x: 1, y: 30 };
    const convertFrom = {
        mm(x) {
            return x * 2.83464480558843;
        },
        px(x) {
            return x;
        }
    };
    const custom = {};

    /* istanbul ignore next This is already well tested. */
    function attributeStyle(parent, style) {
        Object.keys(style).forEach(attribute => {
            parent.attr(attribute, style[attribute]);
        });
    }

    function frame(p) {
        // overall graphic properties
        p.attr("class", containerClass).attr(
            "font-family",
            "MetricWeb,sans-serif"
        );

        p.attr("role", "img");

        /* istanbul ignore next This is already well tested. */
        if (p.node().nodeName.toLowerCase() === "svg") {
            p.attr("width", graphicWidth)
                .attr("height", graphicHeight)
                .attr(
                    "viewBox",
                    ["0 0", graphicWidth, graphicHeight].join(" ")
                );

            /* istanbul ignore next This is already well tested. */
            if (a11yTitle !== false || title !== false) {
                p.append("title")
                    .text(a11yTitle || title)
                    .attr("id", `${containerClass}__chart-a11y-title`);
                p.attr(
                    "aria-labelledby",
                    `${containerClass}__chart-a11y-title`
                );
            }

            if (a11yDesc !== false) {
                p.append("desc")
                    .text(a11yDesc)
                    .attr("id", `${containerClass}__chart-a11y-desc`);
                p.attr(
                    "aria-labelledby",
                    `${
                        p.attr("aria-labelledby")
                            ? `${p.attr("aria-labelledby")} `
                            : ""
                    }${containerClass}__chart-a11y-desc`
                );
            }
        }

        // background
        if (
            backgroundColor !== undefined &&
            !p.select("#chart-background").size()
        ) {
            // @TODO remove second guard; see #62.
            p.append("rect")
                .attr("role", "presentation")
                .attr("id", "chart-background")
                .attr("class", "chart-background")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", graphicWidth)
                .attr("height", graphicHeight)
                .attr("fill", backgroundColor);
        }

        // 'blackbar' (the short black bar above web graphics) @TODO remove second guard; see #62.
        if (blackbar && !p.selectAll("rect.black-bar").size()) {
            p.append("rect")
                .attr("class", "black-bar")
                .attr("width", 60)
                .attr("height", 4)
                .style("fill", blackbar);
        }

        if (whitebar && !p.selectAll("rect.white-bar").size()) {
            p.append("rect")
                .attr("class", "white-bar")
                .attr("width", 60)
                .attr("height", 4)
                .style("fill", whitebar)
                .attr("transform", `translate(${margin.left},${margin.left})`);
        }

        // 'goalposts' (the bit at the top and the bottom of print charts) @TODO remove second guard; see #62.
        if (goalposts && !p.selectAll("path.chart-goalposts").size()) {
            const goalpostPaths = [
                `M 0, ${graphicHeight} L ${graphicWidth}, ${graphicHeight}`,
                `M 0, 15 L 0, 0 L ${graphicWidth}, 0 L ${graphicWidth}, 15`
            ];

            p.append("path")
                .attr("class", "chart-goalposts")
                .attr("d", goalpostPaths)
                .attr("stroke-width", 0.3)
                .attr("fill", "none")
                .attr("stroke", goalposts);
        }

        /* istanbul ignore next This is already well tested. */
        const titleLineCount = title ? title.split("|").length : 0;
        /* istanbul ignore next This is already well tested. */
        const subtitleLineCount = subtitle ? subtitle.split("|").length : 0;
        /* istanbul ignore next This is already well tested. */
        const sourceLineCount = source ? source.split("|").length : 0;

        // title; @TODO remove existence guard see #62
        if (title && !p.select("text.chart-title").size()) {
            p.append("text")
                .attr("class", "chart-title")
                .attr("id", `${containerClass}title`)
                .call(titleText => {
                    titleText
                        .selectAll("tspan")
                        .data(title.split("|"))
                        .enter()
                        .append("tspan")
                        .text(d => d)
                        .attr(
                            "y",
                            (d, i) => titlePosition.y + i * titleLineHeight
                        )
                        .attr("x", titlePosition.x)
                        .call(attributeStyle, titleStyle);
                });
        }

        // @TODO remove existence guard see #62
        /* istanbul ignore next This is already well tested. */
        if (subtitle && !p.select("text.chart-subtitle").size()) {
            // subtitle
            p.append("text")
                .attr("id", `${containerClass}subtitle`)
                .attr("class", "chart-subtitle")
                .call(subtitleText => {
                    subtitleText
                        .selectAll("tspan")
                        .data(subtitle.split("|"))
                        .enter()
                        .append("tspan")
                        .text(d => d)
                        .attr("id", `${containerClass}subtitle`)
                        .attr("y", (d, i) => {
                            if (titleLineCount > 1) {
                                return (
                                    titlePosition.y +
                                    titleLineCount * titleLineHeight +
                                    subtitleLineHeight * i
                                );
                            }
                            return subtitlePosition.y + i * subtitleLineHeight;
                        })

                        .attr("x", subtitlePosition.x)
                        .call(attributeStyle, subtitleStyle);
                });
        }

        // source; @TODO remove second existence check see #62
        /* istanbul ignore next This is already well tested. */
        if (source && !p.selectAll("text.chart-source").size()) {
            p.append("text")
                .attr("class", "chart-source")
                .attr("id", `${containerClass}source`)
                .call(sourceText => {
                    sourceText
                        .selectAll("tspan")
                        .data(source.split("|"))
                        .enter()
                        .append("tspan")
                        .text(d => d)
                        .attr("id", `${containerClass}source`)
                        .attr("y", (d, i) => {
                            /* istanbul ignore next I don't know how to test this. */
                            if (sourcePosition.y) {
                                return sourcePosition.y + i * sourceLineHeight;
                            }
                            return (
                                graphicHeight -
                                (margin.bottom - sourcePlotYOffset) +
                                sourceLineHeight * 1.5 +
                                i * sourceLineHeight
                            );
                        })
                        .attr("x", sourcePosition.x)
                        .call(attributeStyle, sourceStyle);
                });
        }

        // copyright
        if (copyrightStyle && !p.selectAll("text.chart-copyright").size()) {
            p.append("text")
                .attr("class", "chart-copyright")
                .append("tspan")
                .text(copyright)
                .attr("x", sourcePosition.x)
                .attr("y", () => {
                    /* istanbul ignore next I don't know how to test this. */
                    if (sourceLineCount > 1) {
                        return (
                            graphicHeight -
                            (margin.bottom - sourcePlotYOffset) +
                            sourceLineHeight * 1.125 +
                            sourceLineCount * sourceLineHeight * 1.2
                        );
                    }
                    return (
                        graphicHeight -
                        (margin.bottom - sourcePlotYOffset) +
                        sourceLineHeight * 2.5
                    );
                })
                .call(attributeStyle, copyrightStyle);
        }

        // TODO figure out a way to improve this autoPosition stuff, needs ot be configurable so we don't have to reference specific classes
        if (
            autoPosition &&
            (containerClass === "ft-printgraphic" ||
                containerClass === "ft-socialgraphic" ||
                containerClass === "ft-videographic")
        ) {
            margin.top =
                titlePosition.y +
                titleLineCount * titleLineHeight +
                subtitleLineCount * subtitleLineHeight +
                rem / 3;
        } else if (autoPosition) {
            margin.top =
                titlePosition.y +
                titleLineCount * titleLineHeight +
                subtitleLineCount * subtitleLineHeight +
                28 -
                plotAdjuster;
        }

        // watermark; @TODO remove existence check (#62)
        if (
            watermarkMarkup &&
            !p.selectAll("g.chart-watermark").size() &&
            p.node().ownerDocument.doctype.name !== "svg"
        ) {
            let newWaterOffsetY
            if (containerClass === 'ft-socialgraphic') {
                newWaterOffsetY = graphicWidth - watermarkWidth - watermarkOffsetX
            }
            else {newWaterOffsetY = watermarkOffsetX}
            p.append("g")
                .attr("class", "chart-watermark")
                .html(watermarkMarkup) // This needs to be .text() to work in pure SVG context
                .attr("role", "presentation")
                .attr(
                    "transform",
                    `translate(${newWaterOffsetY},${graphicHeight -
                        watermarkHeight -
                        watermarkOffsetY}) scale(1) `
                );
        }
        // graphicWidth - watermarkWidth - watermarkOffsetX}

        // plot area (where you put the chart itself)
        /* istanbul ignore next I don't know how to test this. */
        if (!p.selectAll("g.chart-plot").size()) {
            plot = p.append("g").attr("class", "chart-plot");
        } else {
            plot = p.select("g.chart-plot");
        }

        plot.attr("transform", `translate(${margin.left},${margin.top})`);

        /* istanbul ignore next This is already well tested. */
        if (a11yPlotPresentation) {
            plot.attr("role", "presentation"); // include this extra role if a11yPlotPresentation
        }

        /* istanbul ignore next */
        if (
            showDownloadPngButtons &&
            p.node().ownerDocument.doctype.name !== "svg"
        ) {
            let parent;
            if (p.node().nodeName.toLowerCase() === "svg") {
                parent = d3.select(p.node().parentNode);
            } else {
                parent = d3.select(p.node());
            }

            // Prevent this from being rendered twice; @TODO remove check (#62)
            if (!parent.selectAll(".button-holder").size()) {
                const holder = parent
                    .append("div")
                    .attr("class", "button-holder");

                holder
                    .append("button")
                    .attr("class", "save-png-button save-png-button__1x")
                    .text("Save as .png")
                    .style("float", "left")
                    .style("opacity", 0.6)
                    .on("click", () => savePNG(p, 1));

                holder
                    .append("button")
                    .attr("class", "save-png-button save-png-button__2x")
                    .style("float", "left")
                    .style("opacity", 0.6)
                    .text("Save as double size .png")
                    .on("click", () => savePNG(p, 2));
            }
        }
    }

    // Setters and getters
    frame.a11y = ({ title: newTitle, desc: newDesc } = {}) => {
        if (newTitle !== undefined) a11yTitle = newTitle;
        if (newDesc !== undefined) a11yDesc = newDesc;
        if (newTitle === undefined && newDesc === undefined) {
            return { title: a11yTitle, desc: a11yDesc };
        }

        return frame;
    };

    frame.a11yDesc = x => {
        if (x === undefined) return a11yDesc;
        a11yDesc = x;
        return frame;
    };

    frame.a11yPlotPresentation = x => {
        if (x === undefined) return a11yPlotPresentation;
        a11yPlotPresentation = x;
        return frame;
    };

    frame.a11yTitle = x => {
        if (x === undefined) return a11yTitle;
        a11yTitle = x;
        return frame;
    };

    frame.autoPosition = x => {
        if (x === undefined) return autoPosition;
        autoPosition = x;
        return frame;
    };

    frame.backgroundColor = x => {
        if (x === undefined) return backgroundColor;
        backgroundColor = x;
        return frame;
    };

    frame.backgroundColour = (...args) => {
        console.error(
            "gChartframe.backgroundColour() is deprecated and will be removed next version."
        );
        console.error("Please use gChartframe.backgroundColor() instead.");
        return frame.backgroundColor(...args);
    };

    frame.blackbar = x => {
        if (x === undefined) return blackbar;
        blackbar = x;
        return frame;
    };

    frame.containerClass = x => {
        if (x === undefined) return containerClass;
        containerClass = x;
        return frame;
    };

    frame.copyright = x => {
        if (x === undefined) return copyright;
        copyright = x;
        return frame;
    };

    frame.copyrightStyle = x => {
        if (x === undefined) return copyrightStyle;
        copyrightStyle = x;
        return frame;
    };

    frame.dimension = () => ({
        width: graphicWidth - (margin.left + margin.right),
        height: graphicHeight - (margin.top + margin.bottom)
    });

    frame.extend = (key, value) => {
        custom[key] = value;
        frame[key] = d => {
            if (d === undefined) return custom[key];
            custom[key] = d;
            return frame;
        };

        return frame;
    };

    frame.fullYear = x => {
        if (x === undefined) return fullYear;
        fullYear = x;
        return frame;
    };

    frame.goalposts = x => {
        if (x === undefined) return goalposts;
        goalposts = x;
        return frame;
    };

    frame.height = x => {
        if (x === undefined) return graphicHeight;
        graphicHeight = convertFrom[units](x);
        return frame;
    };

    frame.margin = x => {
        if (x === undefined) return margin;
        Object.keys(x).forEach(k => {
            margin[k] = x[k];
        });
        return frame;
    };

    frame.plot = () => plot;

    frame.plotAdjuster = x => {
        if (x === undefined) return plotAdjuster;
        plotAdjuster = x;
        return frame;
    };

    frame.rem = x => {
        if (x === undefined) return rem;
        rem = x;
        return frame;
    };

    frame.showDownloadPngButtons = d => {
        if (typeof d === "undefined") return showDownloadPngButtons;
        showDownloadPngButtons = d;

        return frame;
    };

    frame.source = x => {
        if (x === undefined) return source;
        source = x;
        return frame;
    };

    frame.sourceLineHeight = x => {
        if (x === undefined) return sourceLineHeight;
        sourceLineHeight = x;
        return frame;
    };

    frame.sourcePlotYOffset = x => {
        if (x === undefined) return sourcePlotYOffset;
        sourcePlotYOffset = x;
        return frame;
    };

    frame.sourceStyle = x => {
        if (x === undefined) return sourceStyle;
        sourceStyle = x;
        return frame;
    };

    frame.sourceX = x => {
        if (x === undefined) return sourcePosition.x;
        sourcePosition.x = x;
        return frame;
    };

    frame.sourceY = x => {
        if (x === undefined) return sourcePosition.y;
        sourcePosition.y = x;
        return frame;
    };

    frame.subtitle = x => {
        if (x === undefined) return subtitle;
        subtitle = x;
        return frame;
    };

    frame.subtitleLineHeight = x => {
        if (x === undefined) return subtitleLineHeight;
        subtitleLineHeight = x;
        return frame;
    };

    frame.subtitleStyle = x => {
        if (x === undefined) return subtitleStyle;
        subtitleStyle = x;
        return frame;
    };

    frame.subtitleX = x => {
        if (x === undefined) return subtitlePosition.x;
        subtitlePosition.x = x;
        return frame;
    };

    frame.subtitleY = x => {
        if (x === undefined) return subtitlePosition.y;
        subtitlePosition.y = x;
        return frame;
    };

    frame.title = x => {
        if (x === undefined) return title;
        title = x;
        return frame;
    };

    frame.titleStyle = x => {
        if (x === undefined) return titleStyle;
        titleStyle = x;
        return frame;
    };

    frame.titleLineHeight = x => {
        if (x === undefined) return titleLineHeight;
        titleLineHeight = x;
        return frame;
    };

    frame.titleX = x => {
        if (x === undefined) return titlePosition.x;
        titlePosition.x = x;
        return frame;
    };

    frame.titleY = x => {
        if (x === undefined) return titlePosition.y;
        titlePosition.y = x;
        return frame;
    };

    frame.units = x => {
        if (x === undefined) return units;
        units = x;
        return frame;
    };

    frame.watermark = x => {
        if (x === undefined) return watermarkMarkup;
        watermarkLocation = "";
        watermarkMarkup = x;
        return frame;
    };

    frame.watermarkOffsetY = x => {
        if (x === undefined) return watermarkOffsetY;
        watermarkOffsetY = x;
        return frame;
    };

    frame.watermarkOffsetX = x => {
        if (x === undefined) return watermarkOffsetX;
        watermarkOffsetX = x;
        return frame;
    };

    frame.watermarkLocation = x => {
        if (x === undefined) return watermarkLocation;
        watermarkMarkup = "";
        watermarkLocation = x;
        return frame;
    };

    frame.watermarkWidth = x => {
        if (x === undefined) return watermarkWidth;
        watermarkWidth = x;
        return frame;
    };

    frame.watermarkHeight = x => {
        if (x === undefined) return watermarkHeight;
        watermarkHeight = x;
        return frame;
    };

    frame.whitebar = x => {
        if (x === undefined) return whitebar;
        whitebar = x;
        return frame;
    };

    frame.width = x => {
        if (!x) return graphicWidth;
        graphicWidth = convertFrom[units](x);
        return frame;
    };

    frame.attrs = x => {
        if (x === undefined) {
            return Object.assign(
                {},
                {
                    a11yDesc,
                    a11yPlotPresentation,
                    a11yTitle,
                    autoPosition,
                    containerClass,
                    copyright,
                    copyrightStyle,
                    blackbar,
                    backgroundColor,
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
                    watermarkOffsetX,
                    watermarkOffsetY,
                    watermarkHeight,
                    watermarkWidth,
                    whitebar,
                    units
                },
                custom
            );
        }

        Object.keys(x).forEach(setterName => {
            const value = x[setterName];
            /* istanbul ignore next I don't know why this won't cover. */
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
    return (
        functionToCheck &&
        getType.toString.call(functionToCheck) === "[object Function]"
    );
}

const classes = [
    ".annotation",
    ".lines",
    ".highlights",
    ".axis path",
    ".axis text",
    ".axis line",
    ".axis",
    ".baseline",
    ".baseline line",
    ".legend",
    ".legend text",
    ".chart-goalposts",
    ".chart-title",
    ".chart-subtitle",
    ".chart-source",
    ".chart-copyright",
    ".chart-watermark",
    ".annotations-holder",
    ".lines highlighlines",
    ".highlights",
    ".annotation",
    ".annotations-holder line",
    ".annotations-holder text",
    ".line path",
    ".highlights rects"
];

/* istanbul ignore next */
function savePNG(svg, scaleFactor) {
    svg.selectAll(classes.join(", ")).each(function inlineProps() {
        const element = this;
        const computedStyle = getComputedStyle(element, null);

        // loop through and compute inline svg styles
        for (let i = 0; i < computedStyle.length; i += 1) {
            const property = computedStyle.item(i);
            const value = computedStyle.getPropertyValue(property);
            element.style[property] = value;
        }
    });

    saveSvgAsPng(
        svg.node(),
        `${svg
            .select("title")
            .text()
            .replace(/\s/g, "-")
            .toLowerCase()}.png`,
        { scale: scaleFactor }
    );
}

export default chartFrame;
