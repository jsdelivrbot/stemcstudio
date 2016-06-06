import ShareOptions from './ShareOptions';

interface ShareScope {
    options: ShareOptions;
    close();
}

export default ShareScope;
