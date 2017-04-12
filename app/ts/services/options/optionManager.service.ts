import { Injectable } from '@angular/core';
import { IOption, LibraryKind } from './IOption';
import { IOptionManager } from './IOptionManager';
import { validate } from '../../utils/validateNpmPackageName';

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

// const VERSION_ANGULAR_CORE = '4.0.1';
// const VERSION_ANGULAR_PLATFORM_BROWSER = '4.0.1';
// const VERSION_ANGULAR_PLATFORM_BROWSER_DYNAMIC = '4.0.1';
const VERSION_ANGULARJS = '1.5.3';
// const VERSION_ASYNC = '1.4.2';
const VERSION_BACONJS = '0.7.89';
const VERSION_BIWASCHEME = '0.6.6';
const VERSION_CSV = '0.9.2';
const VERSION_DAT_GUI = '0.5.0';
const VERSION_DECKJS = '1.1.0';
const VERSION_DOMREADY = '1.0.0';
const VERSION_D3_V3 = '3.5.17';
const VERSION_EIGHT = '6.0.7';
const VERSION_GEOCAS = '1.13.0';
const VERSION_GLMATRIX = '2.3.2';
const VERSION_JASMINE = '2.5.2';
const VERSION_JQUERY = '2.1.4';
const VERSION_JSXGRAPH = '0.99.5';
const VERSION_NEWTON = '0.0.38';
const VERSION_PLOTLY = '1.24.1';
const VERSION_REACT = '15.4.2';
const VERSION_REACT_DOM = '15.4.2';
const VERSION_RxJS = '5.3.0';
const VERSION_SOCKETIO_CLIENT = '1.5.1';
const VERSION_STATSJS = '0.16.0';
const VERSION_SYSTEMJS = '0.19.37';
const VERSION_THREEJS = '0.82.0';
const RELEASE_THREEJS = 'r82';
const VERSION_TWO = '0.6.1';
const VERSION_UNITS = '1.5.5';
// const VERSION_UNDERSCORE = '1.8.3';

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
function angularJS(fileName: string): string {
    return vendorFolder('angular', VERSION_ANGULARJS, void 0, fileName);
}
/*
function async(fileName: string): string {
  return vendorFolder('async', VERSION_ASYNC, void 0, fileName);
}
*/
function baconjs(fileName: string): string {
    return vendorFolder('baconjs', VERSION_BACONJS, void 0, fileName);
}
function biwascheme(fileName: string): string {
    return vendorFolder('biwascheme', VERSION_BIWASCHEME, void 0, fileName);
}
function csv(fileName: string): string {
    return vendorFolder('davinci-csv', VERSION_CSV, void 0, fileName);
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
function eight(fileName: string): string {
    return vendorFolder('davinci-eight', VERSION_EIGHT, void 0, fileName);
}
function geocas(subFolder: string, fileName: string): string {
    return vendorFolder('GeoCAS', VERSION_GEOCAS, subFolder, fileName);
}
function glMatrix(fileName: string): string {
    return vendorFolder('gl-matrix', VERSION_GLMATRIX, void 0, fileName);
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
function newton(fileName: string): string {
    return vendorFolder('davinci-newton', VERSION_NEWTON, void 0, fileName);
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
function RxJS(fileName: string): string {
    return vendorFolder('RxJS', VERSION_RxJS, void 0, fileName);
}
function socketIoClient(fileName: string): string {
    return vendorFolder('socket.io-client', VERSION_SOCKETIO_CLIENT, void 0, fileName);
}
function statsjs(fileName: string): string {
    return vendorFolder('stats.js', VERSION_STATSJS, void 0, fileName);
}
function systemjs(fileName: string): string {
    return vendorFolder('systemjs', VERSION_SYSTEMJS, void 0, fileName);
}
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
            /*
            {
                packageName: '@angular/core',
                moduleName: '@angular/core',
                libraryKind: LibraryKind.UMD,
                globalName: '@angular/core',
                description: "",
                homepage: '',
                version: VERSION_ANGULAR_CORE,
                visible: true,
                css: [],
                dts: `/node_modules/@angular/core/core.d.ts`,
                js: [`/jspm_packages/npm/@angular/core@${VERSION_ANGULAR_CORE}/bundles/core.umd.js`],
                minJs: [`/jspm_packages/npm/@angular/core@${VERSION_ANGULAR_CORE}/bundles/core.umd.min.js`],
                dependencies: {}
            },
            {
                packageName: '@angular/platform-browser',
                moduleName: '@angular/platform-browser',
                libraryKind: LibraryKind.UMD,
                globalName: '@angular/platform-browser',
                description: "",
                homepage: '',
                version: VERSION_ANGULAR_PLATFORM_BROWSER,
                visible: true,
                css: [],
                dts: `node_modules/@angular/platform-browser/platform-browser.d.ts`,
                js: [`jspm_packages/npm/@angular/platform-browser@${VERSION_ANGULAR_PLATFORM_BROWSER}/bundles/platform-browser.umd.js`],
                minJs: [`jspm_packages/npm/@angular/platform-browser@${VERSION_ANGULAR_PLATFORM_BROWSER}/bundles/platform-browser.umd.min.js`],
                dependencies: {}
            },
            {
                packageName: '@angular/platform-browser-dynamic',
                moduleName: '@angular/platform-browser-dynamic',
                libraryKind: LibraryKind.UMD,
                globalName: '@angular/platform-browser-dynamic',
                description: "",
                homepage: '',
                version: VERSION_ANGULAR_PLATFORM_BROWSER_DYNAMIC,
                visible: true,
                css: [],
                dts: `node_modules/@angular/platform-browser/platform-browser-dynamic.d.ts`,
                js: [`jspm_packages/npm/@angular/platform-browser-dynamic@${VERSION_ANGULAR_PLATFORM_BROWSER_DYNAMIC}/bundles/platform-browser-dynamic.umd.js`],
                minJs: [`jspm_packages/npm/@angular/platform-browser-dynamic@${VERSION_ANGULAR_PLATFORM_BROWSER_DYNAMIC}/bundles/platform-browser-dynamic.umd.min.js`],
                dependencies: {}
            },
            */
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
            /*
            {
                name: 'async',
                globalName: 'async',
                description: "Async utilities for node and the browser.",
                homepage: 'https://github.com/caolan/async',
                version: VERSION_ASYNC,
                visible: true,
                dts: async('async.ts'),
                js: async('async.js'),
                minJs: async('async.js'),
                dependencies: {}
            },
            */
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
                packageName: 'davinci-csv',
                moduleName: 'davinci-csv',
                libraryKind: LibraryKind.UMD,
                globalName: 'CSV',
                description: "Comma Separated Value (CSV) Library",
                homepage: 'https://www.stemcstudio.com/docs/davinci-csv/index.html',
                version: VERSION_CSV,
                visible: true,
                css: [],
                dts: csv(INDEX_DTS),
                js: [csv('davinci-csv.js')],
                minJs: [csv('davinci-csv.js')],
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
                packageName: 'davinci-eight',
                moduleName: 'davinci-eight',
                libraryKind: LibraryKind.UMD,
                globalName: 'EIGHT',
                description: "Mathematical Computer Graphics using WebGL.",
                homepage: 'https://www.stemcstudio.com/docs/davinci-eight/index.html',
                version: VERSION_EIGHT,
                visible: true,
                css: [eight('davinci-eight.css')],
                dts: eight(INDEX_DTS),
                js: [eight('davinci-eight.js')],
                minJs: [eight('davinci-eight.js')],
                dependencies: {}
            },
            {
                packageName: 'davinci-newton',
                moduleName: 'davinci-newton',
                libraryKind: LibraryKind.UMD,
                globalName: 'NEWTON',
                description: "Physics Engine and Kinematic Graphing.",
                homepage: 'https://www.stemcstudio.com/docs/davinci-newton/index.html',
                version: VERSION_NEWTON,
                visible: true,
                css: [],
                dts: newton(INDEX_DTS),
                js: [newton('davinci-newton.js')],
                minJs: [newton('davinci-newton.js')],
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
                packageName: ensurePackageName('plot.ly'),
                moduleName: 'plotly',
                libraryKind: LibraryKind.UMD,
                globalName: 'Plotly',
                description: "JavaScript graphing library that powers plotly.",
                homepage: 'https://plot.ly/javascript/',
                version: VERSION_PLOTLY,
                visible: true,
                css: [],
                dts: plotly(INDEX_DTS),
                js: [plotly('plotly.js')],
                minJs: [plotly('plotly.min.js')],
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
                packageName: 'rxjs/Rx',
                moduleName: 'rxjs/Rx',
                libraryKind: LibraryKind.Modular,
                globalName: 'Rx',
                description: "The ReactiveX library for JavaScript.",
                homepage: 'reactivex.io/rxjs/',
                version: VERSION_RxJS,
                visible: true,
                css: [],
                dts: RxJS(INDEX_DTS),
                js: [`https://unpkg.com/@reactivex/rxjs@${VERSION_RxJS}/dist/global/Rx.js`],
                minJs: [`https://unpkg.com/@reactivex/rxjs@${VERSION_RxJS}/dist/global/Rx.js`],
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
            {
                packageName: 'systemjs',
                moduleName: 'systemjs',
                libraryKind: LibraryKind.Global,
                globalName: 'SystemJS',
                description: "Universal dynamic module loader.",
                homepage: 'https://jspm.io',
                version: VERSION_SYSTEMJS,
                visible: false,
                css: [],
                dts: systemjs('system.d.ts'),
                js: [systemjs('system.js')],
                minJs: [systemjs('system.js')],
                dependencies: {}
            },
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
            }
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
