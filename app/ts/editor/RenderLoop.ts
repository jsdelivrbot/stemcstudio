import { requestAnimationFrame } from './lib/event';

/**
 * Batches changes (that force something to be redrawn) in the background.
 */
export class RenderLoop {
    public pending = false;
    private onRender: (changes: number) => void;
    private changes = 0;
    private $window: Window;
    constructor(onRender: (changes: number) => void, $window: Window = window) {
        this.onRender = onRender;
        this.$window = $window;
    }
    schedule(change: number): void {
        this.changes = this.changes | change;
        if (!this.pending && this.changes) {
            this.pending = true;
            requestAnimationFrame(() => {
                this.pending = false;
                let changes: number;
                while (changes = this.changes) {
                    this.changes = 0;
                    this.onRender(changes);
                }
            }, this.$window);
        }
    }
}
