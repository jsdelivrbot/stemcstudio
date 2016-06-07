import Doodle from '../../services/doodles/Doodle';

/**
 * Returns the contents of the file providing that the fileName exists on the Doodle.
 * If the file does not exits, a warning is logged to the console and we return undefined.
 */
export default function fileContent(fileName: string, doodle: Doodle): string {
    const file = doodle.files[fileName];
    if (file) {
        return file.document.getValue();
    }
    else {
        console.warn(`fileContent(${fileName}), ${fileName} does not exist.`);
        return void 0;
    }
}
