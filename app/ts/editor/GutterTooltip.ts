import { Tooltip } from './Tooltip';

/**
 *
 */
export class GutterTooltip extends Tooltip {

    /**
     *
     */
    constructor(parent: HTMLElement) {
        super(parent);
    }

    /**
     * Override parent to keep the popup inside the editing window.
     */
    setPosition(x: number, y: number): void {
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const width = this.getWidth();
        const height = this.getHeight();
        x += 15;
        y += 15;
        if (x + width > windowWidth) {
            x -= (x + width) - windowWidth;
        }
        if (y + height > windowHeight) {
            y -= 20 + height;
        }
        super.setPosition(x, y);
    }
}
