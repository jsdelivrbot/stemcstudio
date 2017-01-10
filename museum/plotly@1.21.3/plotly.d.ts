//
// TypeScript definitions for plot.ly 1.21.3
//
// Copyright (c) 2016-2017 David Geo Holmes
// Definitions by: David Geo Holmes <https://github.com/geometryzen>
//
declare module Plotly {

    /**
     * 
     */
    interface Font {
        family?: string;
        size?: number;
        color?: string;
    }

    /**
     *
     */
    interface Annotation {
        showarrow?: boolean;
        text?: string;
        x?: number;
        xref?: string;
        y?: number;
        yref?: string;
    }

    /**
     *
     */
    interface Axis {
        autorange?: boolean | 'reversed';
        autotick?: boolean;
        dtick?: number;
        domain?: number[];
        range?: [number, number];
        rangemode?: 'nonnegative' | 'tozero' | 'normal';
        tick0?: number;
        tickangle?: number;
        ticklen?: number;
        tickwidth?: number;
        title?: string;
        titlefont?: Font;
        type?: 'log';
        showgrid?: boolean;
        showline?: boolean;
        showticklabels?: boolean;
        mirror?: string;
        ticks?: string;
        zeroline?: boolean;
    }

    /**
     *
     */
    interface ColorBar {
        ypad?: number;
    }

    /**
     *
     */
    interface Contours {
        coloring: string;
        end: number;
        showlines: boolean;
        size: number;
        start: number;
    }

    /**
     *
     */
    interface Data {
        autocolorscale?: boolean;
        colorbar?: ColorBar;
        colorscale?: string | (number | string)[][];
        contours?: Contours;
        fill?: 'tonexty' | 'tozeroy';
        marker?: Marker;
        mode?: 'lines' | 'markers' | 'none';
        name?: string;
        ncontours?: number;
        reversescale?: boolean;
        showlegend?: boolean;
        showscale?: boolean;
        type?: 'bar' | 'contour' | 'heatmap' | 'histogram' | 'histogram2dcontour' | 'scatter';
        uid?: string;
        x?: number[];
        error_x?: Error;
        xaxis?: string;
        y?: number[];
        error_y?: Error;
        yaxis?: string;
        z?: number[] | number[][];
        r?: number[];
        t?: number[];
        zmin?: number;
        zmax?: number;
    }

    /**
     * 
     */
    interface Error {
        type?: 'data',
        array?: number[],
        visible?: boolean;
    }

    /**
     *
     */
    interface Layout {
        angularaxis?: {
            tickcolor: string;
        };
        annotations?: Annotation[];
        autosize?: boolean;
        bargap?: number;
        font?: Font;
        hovermode?: 'closest';
        legend?: {
            x: number;
            y: number;
            orientation: 'h';
        };
        showlegend?: boolean;
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
    interface Line {

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
    interface Margin {
        l?: number;
        b?: number;
        t?: number;
        r?: number;
        pad?: number;
    }

    /**
     *
     */
    interface Marker {

        /**
         * Sets the marker color.
         */
        color?: string;

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
         */
        size?: number;

        /**
         * Sets the marker symbol type.
         * Adding 100 is equivalent to appending "-open" to a symbol name.
         * Adding 200 is equivalent to appending "-dot" to a symbol name.
         * Adding 300 is equivalent to appending "-open-dot" or "dot-open" to a symbol name.
         * default: 'circle'
         */
        symbol?: string;
    }

    /**
     * 
     */
    function addTraces(graphDiv: string | HTMLElement, data: Data | Data[], index?: number): void;

    /**
     * 
     */
    function deleteTraces(graphDiv: string | HTMLElement, indexOrIndices: number | number[]): void;

    /**
     * 
     */
    function downloadImage(graphDiv: string | HTMLElement, options: {
        filename: string;
        format: 'png';
        width: number;
        height: number;
    }): void;

    /**
     * 
     */
    function moveTraces(graphDiv: string | HTMLElement, indexOrIndicesFrom: number | number[], indexOrIndicesTo?: number | number[]): void;

    interface PlotOptions {
        showLink?: boolean;
    }

    /**
     * Plot the data. Replaces the previous plot with a new plot.
     */
    function newPlot(graphDiv: string | HTMLElement, data: Data[], layout?: Layout, options?: PlotOptions): void;

    /**
     * Plot the data.
     */
    function plot(graphDiv: string | HTMLElement, data: Data[], layout: Layout, options?: PlotOptions): void;

    /**
     * 
     */
    function purge(graphDiv: string | HTMLElement): void;

    /**
     * 
     */
    function redraw(graphDiv: string | HTMLElement): void;

    /**
     * 
     */
    function relayout(graphDiv: string | HTMLElement, update: any): void;

    /**
     * 
     */
    function restyle(graphDiv: string | HTMLElement, update: any, something?: number | number[]): void;

    /**
     * 
     */
    function toImage(graphDiv: string | HTMLElement, options: {
        format: 'png';
        width: number;
        height: number;
    }): void;
}