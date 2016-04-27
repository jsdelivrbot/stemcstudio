import AbstractLayer from './AbstractLayer';

/**
 * Work In Progress
 *
 * @class PrintMarginLayer
 * @extends AbstractLayer
 */
export default class PrintMarginLayer extends AbstractLayer {

    /**
     * @class PrintMarginLayer
     */
    constructor(parent: HTMLDivElement) {
        super(parent, '"ace_layer ace_text-layer"');
    }
}
