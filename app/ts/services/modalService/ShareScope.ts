import ShareOptions from './ShareOptions';

interface ShareScope {
    options: ShareOptions;
    close(): void;
}

export default ShareScope;
