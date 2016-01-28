import BodyScope from './BodyScope';

interface DownloadScope extends BodyScope {
    doCancel: () => void;
}

export default DownloadScope;
