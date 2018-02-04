import { fileContent } from './fileContent';
import { modeFromName } from '../../utils/modeFromName';
import { prefixFromPath } from '../../utils/prefixFromPath';

import { WsModel } from '../../modules/wsmodel/WsModel';
import { LanguageModeId } from '../../editor/LanguageMode';

/**
 * @param language e.g. LANGUAGE_GLSL
 * @param workspace The workspace that provides the files.
 */
export function insertBeforeClosingHeadTag(language: LanguageModeId, scriptType: (content: string) => string, html: string, workspace: WsModel, inFilePath: string): string {
    const filePaths: string[] = workspace.getFileSessionPaths().filter(function (filePath: string) {
        return language === modeFromName(filePath);
    });
    const scriptTags = filePaths.map((path: string) => {
        const content = fileContent(path, workspace);
        if (typeof content === 'string') {
            const type = scriptType(content);
            return `<script id='${prefixFromPath(path)}' type='${type}'>${content}</script>\n`;
        }
        else {
            return `<script id='${prefixFromPath(path)}'></script>\n`;
        }
    });

    return html.replace('</head>', `${scriptTags.join("")}</head>`);
}
