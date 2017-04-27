/**
 * A document monitor is sensitive to the kind of file being monitored.
 * It is responsible for the actions to be taken when monitoring begins and ends,
 * as well as for routing and mapping change events.
 */
export interface DocumentMonitor {
    beginMonitoring(callback: (err: any) => void): void;
    endMonitoring(callback: (err: any) => void): void;
}
