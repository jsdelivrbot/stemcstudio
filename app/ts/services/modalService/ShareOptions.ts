import ModalDialogOptions from './ModalDialogOptions';

interface ShareOptions extends ModalDialogOptions {
    text: string;
    actionButtonText?: string;
    closeButtonText?: string;
}

export default ShareOptions;
