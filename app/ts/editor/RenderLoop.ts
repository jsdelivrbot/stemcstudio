import { requestAnimationFrame } from './lib/event';

/**
 * Batches changes (that force something to be redrawn) in the background.
 */
export default class RenderLoop {
    public pending: boolean = false;
    private onRender: (changes: number) => void;
    private changes: number = 0;
    private $window: Window;
    constructor(onRender: (changes: number) => void, $window: Window = window) {
        this.onRender = onRender;
        this.$window = $window;
    }
    schedule(change: number): void {
        this.changes = this.changes | change;
        if (!this.pending && this.changes) {
            this.pending = true;
            var self = this;
            requestAnimationFrame(function() {
                self.pending = false;
                var changes: number;
                while (changes = self.changes) {
                    self.changes = 0;
                    self.onRender(changes);
                }
            }, this.$window);
        }
    }
}
