import app from '../../app';
import IOption from './IOption';
import IOptionManager from './IOptionManager';

app.factory('options', [
    '$window',
    'doodlesKey',
    'VENDOR_FOLDER_MARKER',
    function (
        $window: angular.IWindowService,
        doodlesKey: string,
        VENDOR_FOLDER_MARKER: string
    ) {

        const VERSION_ANGULARJS = '1.5.3';
        // const VERSION_ASYNC = '1.4.2';
        const VERSION_BACONJS = '0.7.88';
        const VERSION_BIWASCHEME = '0.6.6';
        const VERSION_DAT_GUI = '0.5.0';
        const VERSION_DECKJS = '1.1.0';
        const VERSION_DOMREADY = '1.0.0';
        const VERSION_D3_V3 = '3.5.17';
        const VERSION_EIGHT = '5.0.17';
        const VERSION_GEOCAS = '1.13.0';
        const VERSION_GLMATRIX = '2.3.2';
        const VERSION_JASMINE = '2.4.1';
        const VERSION_JQUERY = '2.1.4';
        const VERSION_JSXGRAPH = '0.99.5';
        const VERSION_PLOTLY = '1.19.2';
        // const VERSION_REQUIREJS = '2.1.9';
        const VERSION_SOCKETIO_CLIENT = '1.5.1';
        const VERSION_STATSJS = '0.16.0';
        const VERSION_SYSTEMJS = '0.19.37';
        const VERSION_THREEJS = '0.82.0';
        const RELEASE_THREEJS = 'r82';
        const VERSION_TWO = '0.6.0';
        const VERSION_UNITS = '1.5.4';
        // const VERSION_UNDERSCORE = '1.8.3';

        // FIXME: DRY This function is defined in constants.ts?
        function vendorFolder(packageFolder: string, version: string, subFolder: string, fileName: string): string {
            const steps: string[] = [];
            steps.push(VENDOR_FOLDER_MARKER);
            steps.push('/');
            steps.push(packageFolder);
            steps.push('@');
            steps.push(version);
            steps.push('/');
            if (subFolder) {
                steps.push(subFolder);
                steps.push('/');
            }
            steps.push(fileName);
            return steps.join('');
        }

        // Functions defining the name of the folder and version being used.
        function angular(fileName: string): string {
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
        function eight(subFolder: string, fileName: string): string {
            return vendorFolder('davinci-eight', VERSION_EIGHT, subFolder, fileName);
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
        function plotly(fileName: string): string {
            return vendorFolder('plotly', VERSION_PLOTLY, void 0, fileName);
        }
        /*
        function requirejs(fileName: string): string {
          return vendorFolder('requirejs', VERSION_REQUIREJS, void 0, fileName);
        }
        */
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
        function units(subFolder: string, fileName: string): string {
            return vendorFolder('davinci-units', VERSION_UNITS, subFolder, fileName);
        }
        // TODO: Make this external.
        let _options: IOption[] = [
            {
                name: 'angular',
                moniker: 'AngularJS',
                description: "HTML enhanced for web apps!",
                homepage: 'https://angularjs.org',
                version: VERSION_ANGULARJS,
                visible: true,
                css: [],
                dts: angular('angular.d.ts'),
                js: [angular('angular.js')],
                minJs: [angular('angular.min.js')],
                dependencies: {}
            },
            /*
            {
                name: 'async',
                moniker: 'async',
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
                name: 'biwascheme',
                moniker: 'BiwaScheme',
                description: "Scheme interpreter written in JavaScript.",
                homepage: 'https://github.com/biwascheme/biwascheme',
                version: VERSION_BIWASCHEME,
                visible: true,
                css: [],
                dts: biwascheme('biwascheme.d.ts'),
                js: [biwascheme('biwascheme.js')],
                minJs: [biwascheme('biwascheme.min.js')],
                dependencies: {}
            },
            {
                name: 'geocas',
                moniker: 'GeoCAS',
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
                name: 'gl-matrix',
                moniker: 'gl-matrix',
                description: "Matrix and Vector library for High Performance WebGL apps.",
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
                name: 'dat-gui',
                moniker: 'dat.GUI',
                description: "dat.gui is a lightweight controller library for JavaScript.",
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
                name: 'davinci-eight',
                moniker: 'EIGHT',
                description: "Mathematical Computer Graphics using WebGL.",
                homepage: 'https://www.stemcstudio.com/docs/davinci-eight/index.html',
                version: VERSION_EIGHT,
                visible: true,
                css: [eight('dist', 'davinci-eight.css')],
                dts: eight('dist', 'davinci-eight.d.ts'),
                js: [eight('dist', 'davinci-eight.js')],
                minJs: [eight('dist', 'davinci-eight.js')],
                dependencies: {}
            },
            {
                name: 'davinci-units',
                moniker: 'UNITS',
                description: "Dimensions, Units and Geometric Algebra.",
                homepage: 'https://www.stemcstudio.com/docs/davinci-units/index.html',
                version: VERSION_UNITS,
                visible: true,
                css: [],
                dts: units('dist', 'davinci-units.d.ts'),
                js: [units('dist', 'davinci-units.js')],
                minJs: [units('dist', 'davinci-units.js')],
                dependencies: {}
            },
            {
                name: 'd3',
                moniker: 'd3',
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
                name: 'DomReady',
                moniker: 'DomReady',
                description: "Browser portable and safe way to know when DOM has loaded.",
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
                name: 'jasmine',
                moniker: 'Jasmine',
                description: "Behavior-Driven JavaScript.",
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
                name: 'jquery',
                moniker: 'jQuery',
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
                name: 'baconjs',
                moniker: 'Bacon.js',
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
                name: 'deck.js',
                moniker: 'deckJS',
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
                name: 'jsxgraph',
                moniker: 'JSXGraph',
                description: "2D Geometry, Plotting, and Visualization.",
                homepage: 'http://jsxgraph.uni-bayreuth.de',
                version: VERSION_JSXGRAPH,
                visible: true,
                css: [],
                dts: jsxgraph('jsxgraph.d.ts'),
                js: [jsxgraph('jsxgraphcore.js')],
                minJs: [jsxgraph('jsxgraphcore.js')],
                dependencies: {}
            },
            {
                name: 'plot.ly',
                moniker: 'plotly',
                description: "The open source JavaScript graphing library that powers plotly.",
                homepage: 'https://plot.ly/javascript/',
                version: VERSION_PLOTLY,
                visible: true,
                css: [],
                dts: plotly('plotly.d.ts'),
                js: [plotly('plotly.js')],
                minJs: [plotly('plotly.min.js')],
                dependencies: {}
            },
            {
                name: 'socket.io-client',
                moniker: 'socket.io-client',
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
                name: 'stats.js',
                moniker: 'Stats',
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
                name: 'systemjs',
                moniker: 'SystemJS',
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
            {
                name: 'three.js',
                moniker: 'Three.js',
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
                name: 'two.js',
                moniker: 'Two.js',
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
                moniker: 'underscore',
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

        const that: IOptionManager = {

            unshift: function (doodle: IOption) {
                return _options.unshift(doodle);
            },

            get length() {
                return _options.length;
            },

            filter: function (callback: (doodle: IOption, index: number, array: IOption[]) => boolean) {
                return _options.filter(callback);
            },

            deleteOption: function (name: string) {
                const options: IOption[] = [];

                let i = 0;
                let found: IOption;
                while (i < _options.length) {
                    if (_options[i].name === name) {
                        found = _options[i];
                    }
                    else {
                        options.push(_options[i]);
                    }
                    i++;
                }

                if (!found) return;

                _options = options;
            }
        };

        return that;
    }]);
