/**
 * This will be a String method in ECMAScript 6.
 * More robust implementations exist.
 * This lightweight function is adapted from MDN.
 */
function startsWith(sourceString: string, searchString: string, position = 0): boolean {
    return sourceString.indexOf(searchString, position) === position;
}

/**
 * Computes the URL for a script tag by examining the `fileName`.
 * Files that begin with the special VENDOR_FOLDER_MARKER constant
 * are assumed to be located in the local `vendor` folder of the domain.
 * Otherwise, the fileName is considered to be the URL of a remote server.
 */
export default function scriptURL(domain: string, fileName: string, VENDOR_FOLDER_MARKER: string): string {
    if (startsWith(fileName, VENDOR_FOLDER_MARKER)) {
        // fileName(s) should be defined as VENDOR_FOLDER_MARKER + '/package/**/*.js'
        return domain + '/vendor' + fileName.substring(VENDOR_FOLDER_MARKER.length);
    }
    else {
        // Cautiously migrate to using Content Delivery Networks.
        if (startsWith(fileName, 'https://')) {
            return fileName;
        }
        /*
        else if (startsWith(fileName, '/node_modules')) {
            return fileName;
        }
        else if (startsWith(fileName, '/jspm_packages')) {
            return fileName;
        }
        */
        else {
            // TODO: While we migrate options, everything is still local.
            return domain + '/js/' + fileName;
        }
    }
}
