import XmlMode from './XmlMode';

/**
 * createXmlMode
 */
export default function(workerUrl: string, scriptImports: string[]) {
    return new XmlMode(workerUrl, scriptImports);
}
