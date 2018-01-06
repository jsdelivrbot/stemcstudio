import { createElement } from "../lib/dom";
import { stringRepeat } from "../lib/lang";
import { isIE } from "../lib/useragent";
import { EventBus } from "../EventBus";
import { EventEmitterClass } from "../lib/EventEmitterClass";
import { refChange } from '../refChange';
import { Shareable } from '../Shareable';

let CHAR_COUNT = 0;

export const changeCharacterSize = 'changeCharacterSize';

// TODO: Can the constants be combined with this type?
export type FontMetricsEventName = 'changeCharacterSize';

/**
 * FontMetrics sets up a timer that repeatedly checks for changes in font sizes.
 * It raises the event 'changeCharacterSize'.
 * It is used by the Renderer and the TextLayer.
 */
export class FontMetrics implements EventBus<FontMetricsEventName, any, FontMetrics>, Shareable {
    private el: HTMLDivElement;
    private $main: HTMLDivElement;
    private $measureNode: HTMLDivElement;
    public $characterSize = { width: 0, height: 0 };
    private charSizes: { [ch: string]: number };
    public allowBoldFonts: boolean;
    private $pollSizeChangesTimer: number;
    private eventBus: EventEmitterClass<FontMetricsEventName, any, FontMetrics>;
    private refCount = 1;
    /**
     * 
     */
    protected readonly uuid = `${Math.random()}`;

    /**
     * @param parent
     * @param pollingInterval
     */
    // FIXME: The interval should be being used to configure the polling interval (normally 500ms)
    constructor(parent: HTMLElement, pollingInterval: number) {
        refChange(this.uuid, 'FontMetrics', +1);
        this.eventBus = new EventEmitterClass<FontMetricsEventName, any, FontMetrics>(this);

        this.el = <HTMLDivElement>createElement("div");
        this.$setMeasureNodeStyles(this.el.style, true);

        this.$main = <HTMLDivElement>createElement("div");
        this.$setMeasureNodeStyles(this.$main.style);

        this.$measureNode = <HTMLDivElement>createElement("div");
        this.$setMeasureNodeStyles(this.$measureNode.style);

        this.el.appendChild(this.$main);
        this.el.appendChild(this.$measureNode);
        parent.appendChild(this.el);

        if (!CHAR_COUNT) {
            this.$testFractionalRect();
        }
        this.$measureNode.innerHTML = stringRepeat("X", CHAR_COUNT);

        this.$characterSize = { width: 0, height: 0 };
        this.checkForSizeChanges();
    }

    protected destructor(): void {
        clearInterval(this.$pollSizeChangesTimer);
        if (this.el && this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
    }

    addRef(): number {
        refChange(this.uuid, 'FontMetrics', +1);
        this.refCount++;
        return this.refCount;
    }

    release(): number {
        refChange(this.uuid, 'FontMetrics', -1);
        this.refCount--;
        if (this.refCount === 0) {
            this.destructor();
        }
        return this.refCount;
    }

    /**
     * Returns a function that will remove the event handler.
     */
    on(eventName: FontMetricsEventName, callback: (event: any, source: FontMetrics) => any): () => void {
        return this.eventBus.on(eventName, callback, false);
    }

    /**
     * 
     */
    off(eventName: FontMetricsEventName, callback: (event: any, source: FontMetrics) => any): void {
        this.eventBus.off(eventName, callback);
    }

    private $testFractionalRect(): void {
        const el = <HTMLDivElement>createElement("div");
        this.$setMeasureNodeStyles(el.style);
        el.style.width = "0.2px";
        document.documentElement.appendChild(el);
        const w = el.getBoundingClientRect().width;
        CHAR_COUNT = (w > 0 && w < 1) ? 50 : 100;
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }

    private $setMeasureNodeStyles(style: CSSStyleDeclaration, isRoot?: boolean): void {
        style.width = style.height = "auto";
        style.left = style.top = "0px";
        style.visibility = "hidden";
        style.position = "absolute";
        style.whiteSpace = "pre";

        if (isIE < 8) {
            style["font-family"] = "inherit";
        }
        else {
            style.font = "inherit";
        }
        style.overflow = isRoot ? "hidden" : "visible";
    }

    public checkForSizeChanges(): void {
        const size = this.$measureSizes();
        if (size && (this.$characterSize.width !== size.width || this.$characterSize.height !== size.height)) {
            this.$measureNode.style.fontWeight = "bold";
            try {
                const boldSize = this.$measureSizes();
                if (boldSize) {
                    this.allowBoldFonts = boldSize.width === size.width && boldSize.height === size.height;
                }
                else {
                    this.allowBoldFonts = false;
                }
            }
            finally {
                this.$measureNode.style.fontWeight = "";
            }
            this.$characterSize = size;
            this.charSizes = Object.create(null);
            // const ws = "xiXbm".split("").map(this.$measureCharWidth, this);
            /**
             * @event changeCharacterSize
             */
            this.eventBus._emit(changeCharacterSize, { data: size });
        }
    }

    public $pollSizeChanges(): number {
        if (this.$pollSizeChangesTimer) {
            return this.$pollSizeChangesTimer;
        }
        return this.$pollSizeChangesTimer = window.setInterval(() => {
            this.checkForSizeChanges();
        }, 500);
    }

    public setPolling(val: boolean): void {
        if (val) {
            this.$pollSizeChanges();
        }
        else {
            if (this.$pollSizeChangesTimer) {
                clearInterval(this.$pollSizeChangesTimer);
                this.$pollSizeChangesTimer = 0;
            }
        }
    }

    private $measureSizes(): { width: number; height: number } | null {
        let size: { height: number; width: number };
        if (CHAR_COUNT === 50) {
            let rect: ClientRect;
            try {
                rect = this.$measureNode.getBoundingClientRect();
            }
            catch (e) {
                rect = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 };
            }
            size = {
                height: rect.height,
                width: rect.width / CHAR_COUNT
            };
        }
        else {
            size = {
                height: this.$measureNode.clientHeight,
                width: this.$measureNode.clientWidth / CHAR_COUNT
            };
        }
        // width and height can be null if the editor is not visible or detached from the document.
        if (size.width === 0 || size.height === 0) {
            return null;
        }
        return size;
    }

    private $measureCharWidth(ch: string): number {
        this.$main.innerHTML = stringRepeat(ch, CHAR_COUNT);
        const rect = this.$main.getBoundingClientRect();
        return rect.width / CHAR_COUNT;
    }

    public getCharacterWidth(ch: string): number {
        let w = this.charSizes[ch];
        if (w === void 0) {
            w = this.charSizes[ch] = this.$measureCharWidth(ch) / this.$characterSize.width;
        }
        return w;
    }
}
