import bubbleIframeMouseMove from './bubbleIframeMouseMove';
import fileContent from './fileContent';
import fileExists from './fileExists';
import { IWindowService } from 'angular';
import readMeHTML from './readMeHTML';
import sd from 'showdown';
import WorkspaceScope from '../../scopes/WorkspaceScope';
import WsModel from '../../modules/wsmodel/services/WsModel';

const FSLASH_STAR = '/*';
const STAR_FSLASH = '*/';

/**
 * 
 */
export default function rebuildMarkdownView(
    workspace: WsModel,
    $scope: WorkspaceScope,
    $window: IWindowService
) {
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

                let html = readMeHTML({});

                const content = iframe.contentDocument || iframe.contentWindow.document;

                const markdownFilePath = workspace.getMarkdownFileChoiceOrBestAvailable();
                if (markdownFilePath && fileExists(markdownFilePath, workspace)) {
                    const markdown: string = fileContent(markdownFilePath, workspace);
                    const converter: sd.Converter = new sd.Converter({ tables: true });
                    const markdownHTML = converter.makeHtml(markdown);
                    html = html.replace('// README.md', markdownHTML);
                }
                if (fileExists('README.css', workspace)) {
                    html = html.replace(`${FSLASH_STAR} README.css ${STAR_FSLASH}`, fileContent('README.css', workspace));
                }

                content.open();
                content.write(html);
                content.close();

                bubbleIframeMouseMove(iframe);
            }
        }
        else {
            // can happen if we use ng-if to kill the element entirely, which we do.
            // console.warn(`There is no element with id '${elementId}'.`)
        }
    }
    catch (e) {
        console.warn(e);
    }
}
