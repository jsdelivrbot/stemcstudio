import detectMarker from './detectMarker';
import fileContent from './fileContent';
import modeFromName from '../../utils/modeFromName';
import prefixFromPath from '../../utils/prefixFromPath';

import { WsModel } from '../../modules/wsmodel/WsModel';

/**
 * @param marker e.g. SHADERS_MARKER
 * @param language e.g. LANGUAGE_GLSL
 * @param workspace The workspace that provides the files.
 */
export default function replaceMarker(marker: string, language: string, scriptType: (content: string) => string, html: string, workspace: WsModel, inFilePath: string): string {
    const filePaths: string[] = workspace.getFileDocumentPaths().filter(function (filePath: string) {
        return language === modeFromName(filePath);
    });
    const fileTags = filePaths.map((path: string) => {
        const content = fileContent(path, workspace);
        if (typeof content === 'string') {
            const type = scriptType(content);
            return `<script id='${prefixFromPath(path)}' type='${type}'>${content}</script>\n`;
        }
        else {
            return `<script id='${prefixFromPath(path)}'></script>\n`;
        }
    });

    if (detectMarker(marker, workspace, inFilePath)) {
        html = html.replace(marker, fileTags.join(""));
    }
    else {
        if (fileTags.length > 0) {
            console.warn(`Unable to find marker '${marker}' in ${inFilePath} file.`);
        }
    }
    return html;
}
