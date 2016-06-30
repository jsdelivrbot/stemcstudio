//
// TypeScript definitions for plot.ly 1.14.1
//
// Copyright (c) 2016 David Geo Holmes
// Definitions by: David Geo Holmes <https://github.com/geometryzen>
//
declare module Plotly {

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
        autorange?: boolean;
        title?: string;
        type?: 'log';
        showgrid?: boolean;
        showline?: boolean;
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
        colorscale?: (number | string)[][];
        contours?: Contours;
        marker?: Marker;
        name?: string;
        reversescale?: boolean;
        showscale?: boolean;
        type?: 'bar' | 'scatter';
        uid?: string;
        x: number[];
        y: number[];
        z?: number[];
        zmin?: number;
        zmax?: number;
    }

    /**
     *
     */
    interface Layout {
        annotations?: Annotation[];
        title?: string;
        margin?: Margin;
        xaxis?: Axis;
        yaxis?: Axis;
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

    /**
     * 
     */
    function newPlot(graphDiv: string | HTMLElement, data: Data[], layout: Layout): void;

    /**
     * Plotly.plot is like newPlot, but it isn't idempotent (you can't call it multiple times in a row).
     */
    function plot(graphDiv: string | HTMLElement, data: Data[], layout: Layout): void;

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