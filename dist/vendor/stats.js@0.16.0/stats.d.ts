// Type definitions for Stats.js 0.16.0
// Project: http://github.com/mrdoob/stats.js

interface Panel {
    dom: HTMLCanvasElement;
    update(value: number, maxValue: number): void;
}

interface PanelFactory {
    new (name: string, fg: string, bg: string): Panel;
}

/**
 * const stats = new Stats();
 * stats.showPanel(1);
 * document.body.appendChild(stats.domElement);
 */
declare class Stats {

    static Panel: PanelFactory;

    REVISION: number;

    domElement: HTMLDivElement;

    /**
     * @param panel
     */
    addPanel(panel: Panel): Panel;

    /**
     * @param id 0: fps, 1: ms, 2: mb, 3+: custom
     */
    showPanel(id: number): void;

    /**
     * Captures the begin time.
     * Call this method at the beginning of the monitoring period.
     */
    begin(): void;

    /**
     * Captures the end time.
     * Updates the display.
     * Call this method at the end of the monitoring period,
     * usually before the call to requestAnimationFrame.
     */
    end(): number;

    /**
     * 
     */
    update(): void;
}

declare module "stats.js" {
    export = Stats;
}
