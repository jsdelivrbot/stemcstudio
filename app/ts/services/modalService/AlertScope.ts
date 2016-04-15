import AlertOptions from './AlertOptions';

interface AlertScope {
    options: AlertOptions;
    close();
}

export default AlertScope;
