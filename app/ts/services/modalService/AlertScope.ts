import { AlertOptions } from './AlertOptions';

export interface AlertScope {
    options: AlertOptions;
    close(): void;
}
