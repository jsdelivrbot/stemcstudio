import { AbstractLayer } from './AbstractLayer';
import { refChange } from '../refChange';

export class PrintMarginLayer extends AbstractLayer {

    /**
     * 
     */
    constructor(parent: HTMLDivElement) {
        super(parent, '"ace_layer ace_text-layer"');
        refChange(this.uuid, 'PrintMarginLayer', +1);
    }

    /**
     * 
     */
    dispose(): void {
        refChange(this.uuid, 'PrintMarginLayer', -1);
        super.dispose();
    }
}
