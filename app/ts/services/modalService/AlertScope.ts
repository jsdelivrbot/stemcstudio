import { AlertOptions } from './AlertOptions';

interface AlertScope {
    options: AlertOptions;
    close(): void;
}

export default AlertScope;
