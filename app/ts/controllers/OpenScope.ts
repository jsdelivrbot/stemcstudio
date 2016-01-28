import BodyScope from './BodyScope';

interface OpenScope extends BodyScope {
    doClose: () => void;
    doOpen: (uuid: string) => void;
    doDelete: (uuid: string) => void;
}

export default OpenScope;
