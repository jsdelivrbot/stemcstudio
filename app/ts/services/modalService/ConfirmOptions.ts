import ModalDialogOptions from './ModalDialogOptions';

interface ConfirmOptions extends ModalDialogOptions {
    cancelButtonText?: string;
    actionButtonText?: string;
}

export default ConfirmOptions;
