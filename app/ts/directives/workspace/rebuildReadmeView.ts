import * as angular from 'angular';
import bubbleIframeMouseMove from './bubbleIframeMouseMove';
import Doodle from '../../services/doodles/Doodle';
import fileContent from './fileContent';
import fileExists from './fileExists';
import readMeHTML from './readMeHTML';
import sd from 'showdown';
import WorkspaceScope from '../../scopes/WorkspaceScope';

const FSLASH_STAR = '/*';
const STAR_FSLASH = '*/';

/**
 * 
 */
export default function rebuildReadmeView(
    doodle: Doodle,
    FILENAME_README: string,
    $scope: WorkspaceScope,
    $window: angular.IWindowService
) {
    try {
        const elementId = 'readme';
        // Kill any existing frames.
        const hostElement: HTMLElement = $window.document.getElementById(elementId);
        if (hostElement) {
            while (hostElement.children.length > 0) {
                hostElement.removeChild(hostElement.firstChild);
            }
            if (doodle && $scope.isReadMeVisible) {
                const iframe: HTMLIFrameElement = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = '0';
                iframe.style.backgroundColor = '#ffffff';

                hostElement.appendChild(iframe);

                let html = readMeHTML({});

                const content = iframe.contentDocument || iframe.contentWindow.document;
                if (fileExists(FILENAME_README, doodle)) {
                    const markdown: string = fileContent(FILENAME_README, doodle);
                    const converter: sd.Converter = new sd.Converter();
                    const markdownHTML = converter.makeHtml(markdown);
                    html = html.replace('// README.md', markdownHTML);
                }
                if (fileExists('README.css', doodle)) {
                    html = html.replace(`${FSLASH_STAR} README.css ${STAR_FSLASH}`, fileContent('README.css', doodle));
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
