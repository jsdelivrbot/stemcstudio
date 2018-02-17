//
// TypeScript definitions for plotly.js 1.33.1
// Project: https://github.com/plotly/plotly.js
// Copyright (c) 2016-2018 David Geo Holmes
// Definitions by: David Geo Holmes <https://github.com/geometryzen>
//

/**
 * 
 */
export interface Font {
    family?: string;
    size?: number;
    color?: string;
}

/**
 *
 */
export interface Annotation {
    showarrow?: boolean;
    text?: string;
    x?: number;
    xanchor?: 'left' | 'center' | 'right';
    xref?: string;
    y?: number;
    yanchor?: 'bottom' | 'middle' | 'top';
    yref?: string;
    font?: Font;
}

/**
 *
 */
export interface Axis {
    autorange?: boolean | 'reversed';
    autotick?: boolean;
    dtick?: number;
    domain?: number[];
    gridwidth?: number;
    linecolor?: string;
    linewidth?: number;
    range?: [number, number];
    rangemode?: 'nonnegative' | 'tozero' | 'normal';
    tick0?: number;
    tickangle?: number;
    tickcolor?: string;
    tickfont?: Font;
    ticklen?: number;
    ticks?: 'outside' | '';
    tickwidth?: number;
    title?: string;
    /**
     * The font used for the axis title.
     */
    titlefont?: Font;
    type?: 'log';
    showgrid?: boolean;
    showline?: boolean;
    showticklabels?: boolean;
    mirror?: string;
    zeroline?: boolean;
}

/**
 *
 */
export interface ColorBar {
    ypad?: number;
}

/**
 *
 */
export interface Contours {
    coloring: string;
    end: number;
    showlines: boolean;
    size: number;
    start: number;
}

/**
 *
 */
export interface Data {
    autocolorscale?: boolean;
    colorbar?: ColorBar;
    colorscale?: string | (number | string)[][];
    connectgaps?: boolean;
    contours?: Contours;
    fill?: 'tonexty' | 'tozeroy';
    hoverinfo?: 'none';
    line?: {
        color?: string;
        dash?: 'dashdot' | 'dot' | 'solid';
        shape?: 'hv' | 'hvh' | 'linear' | 'spline' | 'vhv';
        width?: number;
    }
    marker?: Marker;
    mode?: 'lines' | 'markers' | 'none' | 'lines+markers';
    name?: string;
    ncontours?: number;
    reversescale?: boolean;
    showlegend?: boolean;
    showscale?: boolean;
    type?: 'bar' | 'contour' | 'heatmap' | 'histogram' | 'histogram2dcontour' | 'scatter' | 'scatterternary';
    uid?: string;
    x?: number[] | number[][] | string[];
    y?: number[] | number[][] | string[];
    z?: number[] | number[][] | string[];
    error_x?: Error;
    xaxis?: string;
    error_y?: Error;
    yaxis?: string;
    r?: number[];
    t?: number[];
    zmin?: number;
    zmax?: number;
    a?: number[];
    b?: number[];
    c?: number[];
    text?: string[] | number[];
    textposition?: 'auto';
    width?: number | number[];
}

/**
 * 
 */
export interface Error {
    type?: 'data',
    array?: number[],
    visible?: boolean;
}

/**
 *
 */
export interface Layout {
    angularaxis?: {
        tickcolor: string;
    };
    annotations?: Annotation[];
    autosize?: boolean;
    bargap?: number;
    font?: Font;
    hovermode?: 'closest';
    legend?: {
        bgcolor?: string;
        bordercolor?: string;
        borderwidth?: number;
        font?: Font;
        orientation?: 'h' | 'v';
        traceorder?: 'normal' | 'reversed';
        x?: number;
        y?: number;
        yref?: 'paper'
    };
    showlegend?: boolean;
    ternary?: {
        sum: number;
        aaxis: Axis;
        baxis: Axis;
        caxis: Axis;
        bgcolor: string;
    }
    title?: string;
    traceorder?: 'normal';
    margin?: Margin;
    xaxis?: Axis;
    yaxis?: Axis;
    xaxis2?: Axis;
    yaxis2?: Axis;
    width?: number;
    height?: number;
    paper_bgcolor?: string;
    plot_bgcolor?: string;
    orientation?: number;
}

/**
 *
 */
export interface Line {

    /**
     * Sets the color of the lines bounding the marker points.
     * default: '#444'
     */
    color?: string;

    /**
     * Sets the width (in px) of the lines bounding the marker points.
     * default: 0
     */
    width?: number;
    outlierwidth?: number;
    outliercolor?: string;
}

/**
 *
 */
export interface Margin {
    autoexpand?: boolean;
    l?: number;
    b?: number;
    t?: number;
    r?: number;
    pad?: number;
}

/**
 *
 */
export interface Marker {

    /**
     * Sets the marker color.
     */
    color?: string | string[];

    /**
     * 
     */
    line?: {
        /**
         * 
         */
        color?: string;
        /**
         * 
         */
        width?: number;
    };

    /**
     * Sets the color of the outlier sample points.
     * default: rgba(0, 0, 0, 0)
     */
    outliercolor?: string;

    /**
     * Sets the marker opacity.
     * Must be a number between or equal to 0 and 1.
     * default: 1
     */
    opacity?: number;

    /**
     * Sets the marker size (in px).
     * Must be a number greater than or equal to 0.
     * default: 6
     * This can also be an array of numbers corresponding to each data point.
     */
    size?: number | number[];

    /**
     * 
     */
    sizemin?: number;

    /**
     * 
     */
    sizemode?: 'area' | 'diameter';

    /**
     * 
     */
    sizeref?: number;

    /**
     * Sets the marker symbol type.
     * Adding 100 is equivalent to appending "-open" to a symbol name.
     * Adding 200 is equivalent to appending "-dot" to a symbol name.
     * Adding 300 is equivalent to appending "-open-dot" or "dot-open" to a symbol name.
     * default: 'circle'
     */
    symbol?: number | string;
}

/**
 * 
 */
export function addTraces(graphDiv: string | HTMLElement, data: Data | Data[], index?: number): void;

/**
 * 
 */
export function deleteTraces(graphDiv: string | HTMLElement, indexOrIndices: number | number[]): void;

/**
 * 
 */
export function downloadImage(graphDiv: string | HTMLElement, options: {
    filename: string;
    format: 'png';
    width: number;
    height: number;
}): void;

/**
 * 
 */
export function moveTraces(graphDiv: string | HTMLElement, indexOrIndicesFrom: number | number[], indexOrIndicesTo?: number | number[]): void;

export interface PlotOptions {
    showLink?: boolean;
}

/**
 * Plot the data. Replaces the previous plot with a new plot.
 */
export function newPlot(graphDiv: string | HTMLElement, data: Data[], layout?: Layout, options?: PlotOptions): void;

/**
 * Plot the data.
 */
export function plot(graphDiv: string | HTMLElement, data: Data[], layout: Layout, options?: PlotOptions): void;

/**
 * 
 */
export function purge(graphDiv: string | HTMLElement): void;

/**
 * 
 */
export function redraw(graphDiv: string | HTMLElement): void;

/**
 * 
 */
export function relayout(graphDiv: string | HTMLElement, update: any): void;

/**
 * 
 */
export function restyle(graphDiv: string | HTMLElement, update: any, something?: number | number[]): void;

/**
 * 
 */
export function toImage(graphDiv: string | HTMLElement, options: {
    format: 'png';
    width: number;
    height: number;
}): void;
