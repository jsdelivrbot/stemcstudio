import BodyScope from './BodyScope';

interface DownloadScope extends BodyScope {
    isPageF: () => boolean;
    isPageP: () => boolean;
    isPageN: () => boolean;
    isPageL: () => boolean;
    doPageF: () => void;
    doPageP: () => void;
    doPageN: () => void;
    doPageL: () => void;
    doCancel: () => void;
}

export default DownloadScope;
