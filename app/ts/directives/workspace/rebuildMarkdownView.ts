import { bubbleIframeMouseMove } from './bubbleIframeMouseMove';
import { fileContent } from './fileContent';
import { fileExists } from './fileExists';
import { IWindowService } from 'angular';
import { readMeHTML } from './readMeHTML';
import sd from 'showdown';
import { WorkspaceScope } from '../../scopes/WorkspaceScope';
import { WsModel } from '../../modules/wsmodel/WsModel';

const FSLASH_STAR = '/*';
const STAR_FSLASH = '*/';
/**
 * The indent string is not crucial, but helps with readability of the README HTML template. 
 */
const INDENT_STRING = '  ';

/**
 * 
 */
export function rebuildMarkdownView(
    workspace: WsModel,
    $scope: WorkspaceScope,
    $window: IWindowService
): HTMLIFrameElement | undefined {
    try {
        const elementId = 'readme';
        // Kill any existing frames.
        const hostElement = $window.document.getElementById(elementId);
        if (hostElement) {
            while (hostElement.children.length > 0) {
                if (hostElement.firstChild) {
                    hostElement.removeChild(hostElement.firstChild);
                }
            }
            if (workspace && !workspace.isZombie() && $scope.isMarkdownVisible) {
                const iframe: HTMLIFrameElement = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = '0';
                iframe.style.backgroundColor = '#ffffff';

                hostElement.appendChild(iframe);

                let html = readMeHTML(INDENT_STRING, {});

                const content = iframe.contentDocument || iframe.contentWindow.document;

                const markdownFilePath = workspace.getMarkdownFileChoiceOrBestAvailable();
                if (markdownFilePath && fileExists(markdownFilePath, workspace)) {
                    const markdown = fileContent(markdownFilePath, workspace) as string;
                    const converter: sd.Converter = new sd.Converter({ tables: true });
                    const markdownHTML = converter.makeHtml(markdown);
                    html = html.replace('// README.md', markdownHTML);
                }
                if (fileExists('README.css', workspace)) {
                    const searchValue = `${FSLASH_STAR} README.css ${STAR_FSLASH}`;
                    html = html.replace(searchValue, fileContent('README.css', workspace) as string);
                }

                content.open();
                content.write(html);
                content.close();

                bubbleIframeMouseMove(iframe);

                return iframe;
            }
            else {
                return void 0;
            }
        }
        else {
            // can happen if we use ng-if to kill the element entirely, which we do.
            // console.warn(`There is no element with id '${elementId}'.`)
            return void 0;
        }
    }
    catch (e) {
        console.warn(e);
    }
    return void 0;
}
