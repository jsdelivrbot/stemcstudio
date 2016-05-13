//
// TypeScript definitions for plot.ly 1.5.2
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
        title?: string;
        showline?: boolean;
        mirror?: string;
        ticks?: string;
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
        /**
         * 'bar', 'scatter'
         */
        type?: string;
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
    function plot(element: HTMLElement, data: Data[], layout: Layout): void
}