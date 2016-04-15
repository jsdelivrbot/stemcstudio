import ConfirmOptions from './ConfirmOptions';

interface ConfirmScope {
    options: ConfirmOptions;
    ok();
    cancel();
}

export default ConfirmScope;
