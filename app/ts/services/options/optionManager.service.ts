import { Injectable } from '@angular/core';
import { IOption, LibraryKind } from './IOption';
import { IOptionManager } from './IOptionManager';
import { validate } from '../../utils/validateNpmPackageName';

/**
 * It's a passthru if the package name is valid.
 * Otherwise, it blows up in your face. Nice!
 */
const ensurePackageName = function (packageName: string): string {
    const result = validate(packageName);
    if (result.validForNewPackages && result.validForOldPackages) {
        return packageName;
    }
    else {
        if (result.errors) {
            throw new Error(result.errors.join(' '));
        }
        else if (result.warnings) {
            throw new Error(result.warnings.join(' '));
        }
        else {
            throw new Error(`${packageName} is not a valid package name`);
        }
    }
};

/**
 * Eventually, all TypeScript definition files will be named this way.
 */
const INDEX_DTS = 'index.d.ts';
//
// Getting Angular to work in the browser currently requires hand-coding (flattening) the d.ts files.
// This version is used to reference flattened index.d.ts files specially created as well as to pull
// JavaScript files from a CDN. Keep this in synch with the value in Gruntfile.js 
//
const VERSION_ANGULAR = '4.2.5';
const VERSION_ANGULAR_COMMON = VERSION_ANGULAR;
const VERSION_ANGULAR_COMPILER = VERSION_ANGULAR;
const VERSION_ANGULAR_CORE = VERSION_ANGULAR;
const VERSION_ANGULAR_FORMS = VERSION_ANGULAR;
const VERSION_ANGULAR_HTTP = VERSION_ANGULAR;
const VERSION_ANGULAR_PLATFORM_BROWSER = VERSION_ANGULAR;
const VERSION_ANGULAR_PLATFORM_BROWSER_DYNAMIC = VERSION_ANGULAR;
const VERSION_ANGULAR_ROUTER = VERSION_ANGULAR;
/**
 * 
 */
const VERSION_ANGULAR_IN_MEMORY_WEB_API = '0.3.2';
/**
 * 
 */
const VERSION_ANGULARJS = '1.5.3';
const VERSION_BACONJS = '0.7.89';
const VERSION_BIWASCHEME = '0.6.6';
const VERSION_CSV = '0.9.8';
const VERSION_DAT_GUI = '0.5.0';
const VERSION_DECKJS = '1.1.0';
const VERSION_DOMREADY = '1.0.0';
const VERSION_D3_V3 = '3.5.17';
const VERSION_EIGHT = '7.2.0';
const VERSION_GEOCAS = '1.13.0';
const VERSION_GLMATRIX = '2.3.2';
const VERSION_IMMUTABLE = '3.8.1';
const VERSION_JASMINE = '2.5.2';
const VERSION_JQUERY = '2.1.4';
const VERSION_JSXGRAPH = '0.99.5';
const VERSION_MATTERJS = '0.13.0';
const VERSION_NEWTON = '0.0.43';
const VERSION_PLOTLY = '1.28.2';
const VERSION_REACT = '15.4.2';
const VERSION_REACT_DOM = '15.4.2';
const VERSION_REDUX = '3.6.0';
/**
 * Works with Angular.
 */
const VERSION_RXJS = '5.0.1';
/**
 * Works for standalone RxJS.
 */
const VERSION_RXJS_RX = '5.3.3';
const VERSION_SNAPSVG = '0.5.0';
const VERSION_SOCKETIO_CLIENT = '1.5.1';
const VERSION_STATSJS = '0.16.0';
// const VERSION_SYSTEMJS = '0.19.37';

/**
 * Caution: The progression on cdnjs is...
 * r80, r81, r82, r83, 84, 85, 86, 87, 88, 89
 * Notice that r84 and r85 are missing and that the `r` has been dropped!
 */
const RELEASE_THREEJS = '89';
const VERSION_THREEJS = '0.89.0';

const VERSION_TWO = '0.6.0.1';
const VERSION_UNITS = '1.5.5';
// const VERSION_UNDERSCORE = '1.8.3';
const VERSION_WEBGL_CORE = '1.0.0';

// FIXME: DRY This function is defined in constants.ts?
/**
 * VENDOR_FOLDER_MARKER '/' packageFolder ['@' version] ['/' subFolder] '/' fileName
 */
function vendorFolder(packageFolder: string, version: string | undefined, subFolder: string | undefined, fileName: string): string {
    /**
     * How to keep this synchronized?
     */
    const VENDOR_FOLDER_MARKER = '$VENDOR-FOLDER-MARKER';
    const steps: string[] = [];
    steps.push(VENDOR_FOLDER_MARKER);
    steps.push('/');
    steps.push(packageFolder);
    if (version) {
        steps.push('@');
        steps.push(version);
    }
    if (subFolder) {
        steps.push('/');
        steps.push(subFolder);
    }
    steps.push('/');
    steps.push(fileName);
    return steps.join('');
}

// Functions defining the name of the folder and version being used.
/**
 * AngularJS (1.x). Everything goes in the vendor folder.
 */
function angularJS(fileName: string): string {
    return vendorFolder('angularJS', VERSION_ANGULARJS, void 0, fileName);
}
/**
 * Angular (n.x where n > 1). Everything goes in the vendor folder.
 */
function angularCommon(fileName: string): string {
    return vendorFolder('@angular/common', VERSION_ANGULAR_COMMON, void 0, fileName);
}
function angularCompiler(fileName: string): string {
    return vendorFolder('@angular/compiler', VERSION_ANGULAR_COMPILER, void 0, fileName);
}
function angularCore(fileName: string): string {
    return vendorFolder('@angular/core', VERSION_ANGULAR_CORE, void 0, fileName);
}
function angularForms(fileName: string): string {
    return vendorFolder('@angular/forms', VERSION_ANGULAR_FORMS, void 0, fileName);
}
function angularHttp(fileName: string): string {
    return vendorFolder('@angular/http', VERSION_ANGULAR_HTTP, void 0, fileName);
}
function angularPlatformBrowser(fileName: string): string {
    return vendorFolder('@angular/platform-browser', VERSION_ANGULAR_PLATFORM_BROWSER, void 0, fileName);
}
function angularPlatformBrowserDynamic(fileName: string): string {
    return vendorFolder('@angular/platform-browser-dynamic', VERSION_ANGULAR_PLATFORM_BROWSER_DYNAMIC, void 0, fileName);
}
function angularRouter(fileName: string): string {
    return vendorFolder('@angular/router', VERSION_ANGULAR_ROUTER, void 0, fileName);
}
function angularInMemoryWebApi(fileName: string): string {
    return vendorFolder('angular-in-memory-web-api', VERSION_ANGULAR_IN_MEMORY_WEB_API, void 0, fileName);
}
function baconjs(fileName: string): string {
    return vendorFolder('baconjs', VERSION_BACONJS, void 0, fileName);
}
function biwascheme(fileName: string): string {
    return vendorFolder('biwascheme', VERSION_BIWASCHEME, void 0, fileName);
}
function datGUI(fileName: string): string {
    return vendorFolder('dat-gui', VERSION_DAT_GUI, void 0, fileName);
}
function deck(fileName: string): string {
    return vendorFolder('deck.js', VERSION_DECKJS, 'core', fileName);
}
function domready(fileName: string): string {
    return vendorFolder('domready', VERSION_DOMREADY, void 0, fileName);
}
function d3(fileName: string): string {
    return vendorFolder('d3', VERSION_D3_V3, void 0, fileName);
}
function geocas(subFolder: string, fileName: string): string {
    return vendorFolder('GeoCAS', VERSION_GEOCAS, subFolder, fileName);
}
function glMatrix(fileName: string): string {
    return vendorFolder('gl-matrix', VERSION_GLMATRIX, void 0, fileName);
}
function immutable(fileName: string): string {
    return vendorFolder('immutable', VERSION_IMMUTABLE, void 0, fileName);
}
function jasmine(fileName: string): string {
    return vendorFolder('jasmine', VERSION_JASMINE, 'lib', fileName);
}
function jquery(fileName: string): string {
    return vendorFolder('jquery', VERSION_JQUERY, 'dist', fileName);
}
function jsxgraph(fileName: string): string {
    return vendorFolder('jsxgraph', VERSION_JSXGRAPH, void 0, fileName);
}
function matterJs(fileName: string): string {
    return vendorFolder('matter-js', VERSION_MATTERJS, void 0, fileName);
}
function plotly(fileName: string): string {
    return vendorFolder('plotly', VERSION_PLOTLY, void 0, fileName);
}
function react(fileName: string): string {
    return vendorFolder('react', VERSION_REACT, void 0, fileName);
}
function reactDOM(fileName: string): string {
    return vendorFolder('react-dom', VERSION_REACT_DOM, void 0, fileName);
}
function redux(fileName: string): string {
    return vendorFolder('redux', VERSION_REDUX, void 0, fileName);
}
function rxjsRx(fileName: string): string {
    return vendorFolder('RxJS', VERSION_RXJS_RX, void 0, fileName);
}
function snapsvg(fileName: string): string {
    return vendorFolder('snapsvg', VERSION_SNAPSVG, void 0, fileName);
}
function socketIoClient(fileName: string): string {
    return vendorFolder('socket.io-client', VERSION_SOCKETIO_CLIENT, void 0, fileName);
}
function statsjs(fileName: string): string {
    return vendorFolder('stats.js', VERSION_STATSJS, void 0, fileName);
}
/*
function systemjs(fileName: string): string {
    return vendorFolder('systemjs', VERSION_SYSTEMJS, void 0, fileName);
}
*/
function threejs(fileName: string): string {
    return vendorFolder('threejs', VERSION_THREEJS, void 0, fileName);
}
function two(fileName: string): string {
    return vendorFolder('two', VERSION_TWO, void 0, fileName);
}
/*
function underscore(fileName: string): string {
  return vendorFolder('underscore', VERSION_UNDERSCORE, void 0, fileName);
}
*/
function units(fileName: string): string {
    return vendorFolder('davinci-units', VERSION_UNITS, void 0, fileName);
}

@Injectable()
export class OptionManager implements IOptionManager {
    _options: IOption[] = [];
    /**
     *
     */
    constructor() {
        this._options = [
            {
                packageName: '@angular/common',
                moduleName: '@angular/common',
                libraryKind: LibraryKind.Modular,
                globalName: undefined,
                description: "Angular Common",
                homepage: '',
                version: VERSION_ANGULAR_COMMON,
                visible: true,
                css: [],
                dts: angularCommon(INDEX_DTS),
                js: [`https://unpkg.com/@angular/common@${VERSION_ANGULAR_COMMON}/bundles/common.umd.js`],
                minJs: [`https://unpkg.com/@angular/common@${VERSION_ANGULAR_COMMON}/bundles/common.umd.min.js`],
                dependencies: {}
            },
            {
                packageName: '@angular/compiler',
                moduleName: '@angular/compiler',
                libraryKind: LibraryKind.Modular,
                globalName: undefined,
                description: "Angular Compiler",
                homepage: '',
                version: VERSION_ANGULAR_COMPILER,
                visible: true,
                css: [],
                dts: angularCompiler(INDEX_DTS),
                js: [`https://unpkg.com/@angular/compiler@${VERSION_ANGULAR_COMPILER}/bundles/compiler.umd.js`],
                minJs: [`https://unpkg.com/@angular/compiler@${VERSION_ANGULAR_COMPILER}/bundles/compiler.umd.min.js`],
                dependencies: {}
            },
            {
                packageName: '@angular/core',
                moduleName: '@angular/core',
                libraryKind: LibraryKind.Modular,
                globalName: undefined,
                description: "Angular Core",
                homepage: '',
                version: VERSION_ANGULAR_CORE,
                visible: true,
                css: [],
                dts: angularCore(INDEX_DTS),
                js: [`https://unpkg.com/@angular/core@${VERSION_ANGULAR_CORE}/bundles/core.umd.js`],
                minJs: [`https://unpkg.com/@angular/core@${VERSION_ANGULAR_CORE}/bundles/core.umd.min.js`],
                dependencies: {}
            },
            {
                packageName: '@angular/forms',
                moduleName: '@angular/forms',
                libraryKind: LibraryKind.Modular,
                globalName: undefined,
                description: "Angular Forms",
                homepage: '',
                version: VERSION_ANGULAR_FORMS,
                visible: true,
                css: [],
                dts: angularForms(INDEX_DTS),
                js: [`https://unpkg.com/@angular/forms@${VERSION_ANGULAR_FORMS}/bundles/forms.umd.js`],
                minJs: [`https://unpkg.com/@angular/forms@${VERSION_ANGULAR_FORMS}/bundles/forms.umd.min.js`],
                dependencies: {}
            },
            {
                packageName: '@angular/http',
                moduleName: '@angular/http',
                libraryKind: LibraryKind.Modular,
                globalName: undefined,
                description: "Angular Http",
                homepage: '',
                version: VERSION_ANGULAR_HTTP,
                visible: true,
                css: [],
                dts: angularHttp(INDEX_DTS),
                js: [`https://unpkg.com/@angular/http@${VERSION_ANGULAR_HTTP}/bundles/http.umd.js`],
                minJs: [`https://unpkg.com/@angular/http@${VERSION_ANGULAR_HTTP}/bundles/http.umd.min.js`],
                dependencies: {}
            },
            {
                packageName: '@angular/platform-browser',
                moduleName: '@angular/platform-browser',
                libraryKind: LibraryKind.Modular,
                globalName: undefined,
                description: "Angular Platform Browser",
                homepage: '',
                version: VERSION_ANGULAR_PLATFORM_BROWSER,
                visible: true,
                css: [],
                dts: angularPlatformBrowser(INDEX_DTS),
                js: [`https://unpkg.com/@angular/platform-browser@${VERSION_ANGULAR_PLATFORM_BROWSER}/bundles/platform-browser.umd.js`],
                minJs: [`https://unpkg.com/@angular/platform-browser@${VERSION_ANGULAR_PLATFORM_BROWSER}/bundles/platform-browser.umd.min.js`],
                dependencies: {}
            },
            {
                packageName: '@angular/platform-browser-dynamic',
                moduleName: '@angular/platform-browser-dynamic',
                libraryKind: LibraryKind.Modular,
                globalName: undefined,
                description: "Angular Platform Browser Dynamic",
                homepage: '',
                version: VERSION_ANGULAR_PLATFORM_BROWSER_DYNAMIC,
                visible: true,
                css: [],
                dts: angularPlatformBrowserDynamic(INDEX_DTS),
                js: [`https://unpkg.com/@angular/platform-browser-dynamic@${VERSION_ANGULAR_PLATFORM_BROWSER_DYNAMIC}/bundles/platform-browser-dynamic.umd.js`],
                minJs: [`https://unpkg.com/@angular/platform-browser-dynamic@${VERSION_ANGULAR_PLATFORM_BROWSER_DYNAMIC}/bundles/platform-browser-dynamic.umd.min.js`],
                dependencies: {}
            },
            {
                packageName: '@angular/router',
                moduleName: '@angular/router',
                libraryKind: LibraryKind.Modular,
                globalName: undefined,
                description: "Angular Router",
                homepage: '',
                version: VERSION_ANGULAR_ROUTER,
                visible: true,
                css: [],
                dts: angularRouter(INDEX_DTS),
                js: [`https://unpkg.com/@angular/router@${VERSION_ANGULAR_ROUTER}/bundles/router.umd.js`],
                minJs: [`https://unpkg.com/@angular/router@${VERSION_ANGULAR_ROUTER}/bundles/router.umd.min.js`],
                dependencies: {}
            },
            {
                packageName: 'angular-in-memory-web-api',
                moduleName: 'angular-in-memory-web-api',
                libraryKind: LibraryKind.Modular,
                globalName: undefined,
                description: "Angular In Memory Web API",
                homepage: '',
                version: VERSION_ANGULAR_IN_MEMORY_WEB_API,
                visible: true,
                css: [],
                dts: angularInMemoryWebApi(INDEX_DTS),
                js: [`https://unpkg.com/angular-in-memory-web-api@${VERSION_ANGULAR_IN_MEMORY_WEB_API}/bundles/in-memory-web-api.umd.js`],
                minJs: [`https://unpkg.com/angular-in-memory-web-api@${VERSION_ANGULAR_IN_MEMORY_WEB_API}/bundles/in-memory-web-api.umd.js`],
                dependencies: {}
            },
            {
                packageName: ensurePackageName('angular'),
                moduleName: 'ng',
                libraryKind: LibraryKind.Global,
                globalName: 'ng',
                description: "AngularJS: HTML enhanced for web apps!",
                homepage: 'https://angularjs.org',
                version: VERSION_ANGULARJS,
                visible: true,
                css: [],
                dts: angularJS('angular.d.ts'),
                js: [angularJS('angular.js')],
                minJs: [angularJS('angular.min.js')],
                dependencies: {}
            },
            {
                packageName: 'biwascheme',
                moduleName: 'biwascheme',
                libraryKind: LibraryKind.Global,
                globalName: 'BiwaScheme',
                description: "Scheme interpreter written in JavaScript.",
                homepage: 'https://github.com/biwascheme/biwascheme',
                version: VERSION_BIWASCHEME,
                visible: false,
                css: [],
                dts: biwascheme('biwascheme.d.ts'),
                js: [biwascheme('biwascheme.js')],
                minJs: [biwascheme('biwascheme.min.js')],
                dependencies: {}
            },
            {
                packageName: 'geocas',
                moduleName: 'geocas',
                libraryKind: LibraryKind.UMD,
                globalName: 'GeoCAS',
                description: "Geometric Computer Algebra System.",
                homepage: 'https://www.stemcstudio.com/docs/GeoCAS/index.html',
                version: VERSION_GEOCAS,
                visible: true,
                css: [],
                dts: geocas('dist', 'geocas.d.ts'),
                js: [geocas('dist', 'geocas.js')],
                minJs: [geocas('dist', 'geocas.js')],
                dependencies: {}
            },
            {
                packageName: 'gl-matrix',
                moduleName: 'gl-matrix',
                libraryKind: LibraryKind.Global,
                globalName: 'gl-matrix',
                description: "Matrix and Vector library for High Performance WebGL.",
                homepage: 'http://glmatrix.net',
                version: VERSION_GLMATRIX,
                visible: true,
                css: [],
                dts: glMatrix('gl-matrix.d.ts'),
                js: [glMatrix('gl-matrix-min.js')],
                minJs: [glMatrix('gl-matrix-min.js')],
                dependencies: {}
            },
            {
                packageName: 'immutable',
                moduleName: 'immutable',
                libraryKind: LibraryKind.Modular,
                globalName: 'Immutable',
                description: "Immutable Data Collections.",
                homepage: 'https://facebook.github.io/immutable-js/',
                version: VERSION_IMMUTABLE,
                visible: true,
                css: [],
                dts: immutable(INDEX_DTS),
                js: [immutable('immutable.js')],
                minJs: [immutable('immutable.min.js')],
                dependencies: {}
            },
            {
                packageName: 'dat-gui',
                moduleName: 'dat-gui',
                libraryKind: LibraryKind.Global,
                globalName: 'dat.GUI',
                description: "A lightweight controller library for JavaScript.",
                homepage: 'https://github.com/dataarts/dat.gui',
                version: VERSION_DAT_GUI,
                visible: true,
                css: [],
                dts: datGUI('dat-gui.d.ts'),
                js: [datGUI('dat-gui.js')],
                minJs: [datGUI('dat-gui.min.js')],
                dependencies: {}
            },
            {
                packageName: 'davinci-csv',
                moduleName: 'davinci-csv',
                libraryKind: LibraryKind.UMD,
                globalName: 'CSV',
                description: "Comma Separated Value (CSV) Library",
                homepage: 'https://geometryzen.github.io/davinci-csv/',
                version: VERSION_CSV,
                visible: true,
                css: [],
                dts: `https://unpkg.com/davinci-csv@${VERSION_CSV}/build/browser/${INDEX_DTS}`,
                js: [`https://unpkg.com/davinci-csv@${VERSION_CSV}/build/browser/index.js`],
                minJs: [`https://unpkg.com/davinci-csv@${VERSION_CSV}/build/browser/index.js`],
                dependencies: {}
            },
            {
                packageName: 'davinci-eight',
                moduleName: 'davinci-eight',
                libraryKind: LibraryKind.Modular,
                globalName: '',
                description: "Mathematical Computer Graphics using WebGL.",
                homepage: 'https://geometryzen.github.io/davinci-eight/',
                version: VERSION_EIGHT,
                visible: true,
                css: [],
                dts: `https://unpkg.com/davinci-eight@${VERSION_EIGHT}/build/browser/${INDEX_DTS}`,
                js: [`https://unpkg.com/davinci-eight@${VERSION_EIGHT}/build/browser/index.js`],
                minJs: [`https://unpkg.com/davinci-eight@${VERSION_EIGHT}/build/browser/index.js`],
                dependencies: {}
            },
            {
                packageName: 'davinci-newton',
                moduleName: 'davinci-newton',
                libraryKind: LibraryKind.Modular,
                globalName: 'NEWTON',
                description: "Physics Engine and Kinematic Graphing.",
                homepage: 'https://geometryzen.github.io/davinci-newton/',
                version: VERSION_NEWTON,
                visible: true,
                css: [],
                dts: `https://unpkg.com/davinci-newton@${VERSION_NEWTON}/dist/${INDEX_DTS}`,
                js: [`https://unpkg.com/davinci-newton@${VERSION_NEWTON}/dist/davinci-newton.js`],
                minJs: [`https://unpkg.com/davinci-newton@${VERSION_NEWTON}/dist/davinci-newton.min.js`],
                dependencies: {}
            },
            {
                packageName: 'davinci-units',
                moduleName: 'davinci-units',
                libraryKind: LibraryKind.UMD,
                globalName: 'UNITS',
                description: "Dimensions, Units and Geometric Algebra.",
                homepage: 'https://www.stemcstudio.com/docs/davinci-units/index.html',
                version: VERSION_UNITS,
                visible: true,
                css: [],
                dts: units(INDEX_DTS),
                js: [units('davinci-units.js')],
                minJs: [units('davinci-units.js')],
                dependencies: {}
            },
            {
                packageName: 'd3',
                moduleName: 'd3',
                libraryKind: LibraryKind.Global,
                globalName: 'd3',
                description: "Data-Driven Documents.",
                homepage: 'http://d3js.org',
                version: VERSION_D3_V3,
                visible: true,
                css: [],
                dts: d3('d3.d.ts'),
                js: [`https://cdnjs.cloudflare.com/ajax/libs/d3/${VERSION_D3_V3}/d3.js`],
                minJs: [`https://cdnjs.cloudflare.com/ajax/libs/d3/${VERSION_D3_V3}/d3.min.js`],
                dependencies: {}
            },
            {
                packageName: 'DomReady',
                moduleName: 'DomReady',
                libraryKind: LibraryKind.Global,
                globalName: 'DomReady',
                description: "Know when the DOM has loaded.",
                homepage: '',
                version: VERSION_DOMREADY,
                visible: true,
                css: [],
                dts: domready('domready.d.ts'),
                js: [domready('domready.js')],
                minJs: [domready('domready.js')],
                dependencies: {}
            },
            {
                packageName: 'jasmine',
                moduleName: 'jasmine',
                libraryKind: LibraryKind.Global,
                globalName: 'Jasmine',
                description: "Behavior-Driven JavaScript Testing Framework.",
                homepage: 'https://jasmine.github.io',
                version: VERSION_JASMINE,
                visible: true,
                css: [jasmine('jasmine.css')],
                dts: jasmine('jasmine.d.ts'),
                js: [jasmine('jasmine.js'), jasmine('jasmine-html.js')],
                minJs: [jasmine('jasmine.js'), jasmine('jasmine-html.js')],
                dependencies: {}
            },
            {
                packageName: 'jquery',
                moduleName: 'jquery',
                libraryKind: LibraryKind.UMD,
                globalName: '$',
                description: "The Write Less, Do More, JavaScript Library.",
                homepage: 'https://jquery.com',
                version: VERSION_JQUERY,
                visible: true,
                css: [],
                dts: jquery('jquery.d.ts'),
                js: [jquery('jquery.js')],
                minJs: [jquery('jquery.min.js')],
                dependencies: {}
            },
            // FIXME: baconjs temporarily placed here (after jquery) until dependencies are fixed.
            {
                packageName: 'baconjs',
                moduleName: 'baconjs',
                libraryKind: LibraryKind.Global,
                globalName: 'Bacon.js',
                description: "Functional Reactive Programming for JavaScript.",
                homepage: 'https://baconjs.github.io',
                version: VERSION_BACONJS,
                visible: true,
                css: [],
                dts: baconjs('baconjs.d.ts'),
                js: [`https://cdnjs.cloudflare.com/ajax/libs/bacon.js/${VERSION_BACONJS}/Bacon.js`],
                minJs: [`https://cdnjs.cloudflare.com/ajax/libs/bacon.js/${VERSION_BACONJS}/Bacon.min.js`],
                dependencies: { 'jquery': VERSION_JQUERY }
            },
            // FIXME: deck temporarily placed here (after jquery) until dependencies are fixed.
            {
                packageName: 'deck.js',
                moduleName: 'deck.js',
                libraryKind: LibraryKind.Global,
                globalName: 'deckJS',
                description: "Modern HTML Presentations.",
                homepage: 'http://imakewebthings.github.com/deck.js',
                version: VERSION_DECKJS,
                visible: true,
                css: [],
                dts: deck('deck.core.d.ts'),
                js: [deck('deck.core.js')],
                minJs: [deck('deck.core.js')],
                dependencies: { 'jquery': VERSION_JQUERY }
            },
            {
                packageName: 'jsxgraph',
                moduleName: 'jsxgraph',
                libraryKind: LibraryKind.Global,
                globalName: 'JXG',
                description: "Interactive 2D Geometry, Plotting, and Visualization.",
                homepage: 'http://jsxgraph.uni-bayreuth.de',
                version: VERSION_JSXGRAPH,
                visible: true,
                css: [],
                dts: jsxgraph('index.d.ts'),
                // js: [jsxgraph('jsxgraphcore.js')],
                // minJs: [jsxgraph('jsxgraphcore.js')],
                // CDNJS does not deploy the correct version?
                js: [`https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/${VERSION_JSXGRAPH}/jsxgraphcore.js`],
                minJs: [`https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/${VERSION_JSXGRAPH}/jsxgraphcore.js`],
                dependencies: {}
            },
            {
                packageName: ensurePackageName('matter-js'),
                moduleName: 'matter-js',
                libraryKind: LibraryKind.Global,
                globalName: 'Matter',
                description: "Matter.js is a 2D physics engine for the web.",
                homepage: 'brm.io/matter-js/',
                version: VERSION_MATTERJS,
                visible: true,
                css: [],
                dts: matterJs(INDEX_DTS),
                js: [`https://unpkg.com/matter-js@^${VERSION_MATTERJS}/build/matter.js`],
                minJs: [`https://unpkg.com/matter-js@${VERSION_MATTERJS}/build/matter.min.js`],
                dependencies: {}
            },
            {
                packageName: ensurePackageName('plot.ly'),
                moduleName: 'plotly',
                libraryKind: LibraryKind.Modular,
                globalName: '',
                description: "JavaScript graphing library that powers plotly.",
                homepage: 'https://plot.ly/javascript/',
                version: VERSION_PLOTLY,
                visible: true,
                css: [],
                dts: plotly(INDEX_DTS),
                js: [`https://cdn.plot.ly/plotly-${VERSION_PLOTLY}.min.js`],
                minJs: [`https://cdn.plot.ly/plotly-${VERSION_PLOTLY}.min.js`],
                dependencies: {}
            },
            {
                packageName: ensurePackageName('plotly-basic'),
                moduleName: 'plotly',
                libraryKind: LibraryKind.Modular,
                globalName: '',
                description: "Contains the scatter, bar, and pie modules.",
                homepage: 'https://plot.ly/javascript/',
                version: VERSION_PLOTLY,
                visible: true,
                css: [],
                dts: plotly(INDEX_DTS),
                js: [`https://cdn.plot.ly/plotly-basic-${VERSION_PLOTLY}.min.js`],
                minJs: [`https://cdn.plot.ly/plotly-basic-${VERSION_PLOTLY}.min.js`],
                dependencies: {}
            },
            {
                packageName: ensurePackageName('plotly-cartesian'),
                moduleName: 'plotly',
                libraryKind: LibraryKind.Modular,
                globalName: '',
                description: "Contains the scatter, bar, pie, heatmap, histogram, and contour modules.",
                homepage: 'https://plot.ly/javascript/',
                version: VERSION_PLOTLY,
                visible: true,
                css: [],
                dts: plotly(INDEX_DTS),
                js: [`https://cdn.plot.ly/plotly-cartesian-${VERSION_PLOTLY}.min.js`],
                minJs: [`https://cdn.plot.ly/plotly-cartesian-${VERSION_PLOTLY}.min.js`],
                dependencies: {}
            },
            {
                packageName: 'react',
                moduleName: 'react',
                libraryKind: LibraryKind.UMD,
                globalName: 'React',
                description: "A JavaScript library for building user interfaces",
                homepage: 'https://facebook.github.io/react/',
                version: VERSION_REACT,
                visible: true,
                css: [],
                dts: react(INDEX_DTS),
                js: [react('react.js')],
                minJs: [react('react.min.js')],
                dependencies: {}
            },
            {
                packageName: 'react-dom',
                moduleName: 'react-dom',
                libraryKind: LibraryKind.UMD,
                globalName: 'ReactDOM',
                description: "React package for working with the DOM",
                homepage: 'https://facebook.github.io/react/',
                version: VERSION_REACT_DOM,
                visible: true,
                css: [],
                dts: reactDOM(INDEX_DTS),
                js: [reactDOM('react-dom.js')],
                minJs: [reactDOM('react-dom.min.js')],
                dependencies: { 'react': VERSION_REACT }
            },
            {
                packageName: 'redux',
                moduleName: 'redux',
                libraryKind: LibraryKind.Modular,
                globalName: '',
                description: "Predictable state container.",
                homepage: 'redux.js.org',
                version: VERSION_REDUX,
                visible: true,
                css: [],
                dts: redux(INDEX_DTS),
                js: [redux('redux.js')],
                minJs: [redux('redux.min.js')],
                dependencies: {}
            },
            {
                packageName: 'rxjs',
                moduleName: 'rxjs',
                libraryKind: LibraryKind.Modular,
                globalName: 'N/A',
                description: "The ReactiveX library for JavaScript.",
                homepage: 'reactivex.io/rxjs/',
                version: VERSION_RXJS,
                visible: true,
                css: [],
                // Notice that we are using the d.ts from rxjs/Rx
                dts: rxjsRx(INDEX_DTS),
                js: [`https://unpkg.com/rxjs@${VERSION_RXJS}`],
                minJs: [`https://unpkg.com/rxjs@${VERSION_RXJS}`],
                dependencies: {}
            },
            {
                packageName: 'rxjs/Rx',
                moduleName: 'rxjs/Rx',
                libraryKind: LibraryKind.Modular,
                globalName: 'N/A',
                description: "The ReactiveX library for JavaScript.",
                homepage: 'reactivex.io/rxjs/',
                version: VERSION_RXJS_RX,
                visible: true,
                css: [],
                dts: rxjsRx(INDEX_DTS),
                js: [`https://unpkg.com/@reactivex/rxjs@${VERSION_RXJS_RX}/dist/global/Rx.js`],
                minJs: [`https://unpkg.com/@reactivex/rxjs@${VERSION_RXJS_RX}/dist/global/Rx.js`],
                dependencies: {}
            },
            {
                packageName: ensurePackageName('snapsvg'),
                moduleName: 'snapsvg',
                libraryKind: LibraryKind.Global,
                globalName: 'Snap',
                description: "The JavaScript SVG library for the modern web.",
                homepage: 'snapsvg.io',
                version: VERSION_SNAPSVG,
                visible: true,
                css: [],
                dts: snapsvg(INDEX_DTS),
                js: [snapsvg('snap.svg.js')],
                minJs: [snapsvg('snap.svg-min.js')],
                dependencies: {}
            },
            {
                packageName: ensurePackageName('socket.io-client'),
                moduleName: 'socket.io-client',
                libraryKind: LibraryKind.Global,
                globalName: 'socket.io-client',
                description: "Realtime application framework (client)",
                homepage: 'socket.io',
                version: VERSION_SOCKETIO_CLIENT,
                visible: true,
                css: [],
                dts: socketIoClient('socket.io-client.d.ts'),
                js: [socketIoClient('socket.io.js')],
                minJs: [socketIoClient('socket.io.js')],
                dependencies: {}
            },
            {
                packageName: 'stats.js',
                moduleName: 'stats.js',
                libraryKind: LibraryKind.Global,
                globalName: 'Stats',
                description: "JavaScript Performance Monitoring.",
                homepage: 'https://github.com/mrdoob/stats.js',
                version: VERSION_STATSJS,
                visible: true,
                css: [],
                dts: statsjs('stats.d.ts'),
                js: ['https://cdnjs.cloudflare.com/ajax/libs/stats.js/r16/Stats.js'],
                minJs: ['https://cdnjs.cloudflare.com/ajax/libs/stats.js/r16/Stats.min.js'],
                dependencies: {}
            },
            /*
            {
                packageName: 'systemjs',
                moduleName: 'systemjs',
                libraryKind: LibraryKind.Global,
                // System and SystemJS empirically seem to be aliases.
                // However, TypeScript with tsconfig.json property module='system' emits `System.register(...`
                globalName: 'System',
                description: "Universal dynamic module loader.",
                homepage: 'https://jspm.io',
                version: VERSION_SYSTEMJS,
                visible: true,
                css: [],
                dts: systemjs('system.d.ts'),
                js: [systemjs('system.js')],
                minJs: [systemjs('system.js')],
                dependencies: {}
            },
            */
            {
                packageName: 'three.js',
                moduleName: 'three.js',
                libraryKind: LibraryKind.Global,
                globalName: 'THREE',
                description: "JavaScript 3D library.",
                homepage: 'http://threejs.org/',
                version: VERSION_THREEJS,
                visible: true,
                css: [],
                dts: threejs('three.d.ts'),
                js: [`https://cdnjs.cloudflare.com/ajax/libs/three.js/${RELEASE_THREEJS}/three.js`],
                minJs: [`https://cdnjs.cloudflare.com/ajax/libs/three.js/${RELEASE_THREEJS}/three.min.js`],
                dependencies: {}
            },
            {
                packageName: 'two.js',
                moduleName: 'two.js',
                libraryKind: LibraryKind.Global,
                globalName: 'Two.js',
                description: "A two-dimensional drawing api for modern browsers.",
                homepage: 'http://jonobr1.github.io/two.js/',
                version: VERSION_TWO,
                visible: true,
                css: [],
                dts: two('two.d.ts'),
                js: [two('two.js')],
                minJs: [two('two.min.js')],
                dependencies: {}
            },
            /*
            {
                name: 'underscore',
                globalName: 'underscore',
                description: "Functional Programming Library.",
                homepage: 'http://underscorejs.org',
                version: VERSION_UNDERSCORE,
                visible: true,
                css: [],
                dts: underscore('underscore.d.ts'),
                js: underscore('underscore.js'),
                minJs: underscore('underscore.min.js'),
                dependencies: {}
            }
            */
            {
                packageName: 'webgl-core',
                moduleName: 'webgl-core',
                libraryKind: LibraryKind.Modular,
                globalName: '',
                description: "WebGL library with shareable resources and context recovery.",
                homepage: 'https://geometryzen.github.io/webgl-core/',
                version: VERSION_WEBGL_CORE,
                visible: true,
                css: [],
                dts: `https://unpkg.com/webgl-core@${VERSION_WEBGL_CORE}/build/browser/${INDEX_DTS}`,
                js: [`https://unpkg.com/webgl-core@${VERSION_WEBGL_CORE}/build/browser/index.js`],
                minJs: [`https://unpkg.com/webgl-core@${VERSION_WEBGL_CORE}/build/browser/index.js`],
                dependencies: {}
            }
        ];
    }

    /**
     *
     */
    filter(callback: (doodle: IOption, index: number, array: IOption[]) => boolean): IOption[] {
        return this._options.filter(callback);
    }

    /**
     * 
     */
    get(): Promise<IOption[]> {
        return new Promise<IOption[]>((resolve, reject) => {
            resolve(this._options);
        });
    }
}
