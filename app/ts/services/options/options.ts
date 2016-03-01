import app from '../../app';
import IOption from './IOption';
import IOptionManager from './IOptionManager';

app.factory('options', [
    '$window',
    'doodlesKey',
    'VENDOR_FOLDER_MARKER',
    function(
        $window: angular.IWindowService,
        doodlesKey: string,
        VENDOR_FOLDER_MARKER
    ) {

        const VERSION_ASYNC = '1.4.2'
        const VERSION_DAT_GUI = '0.5.0'
        const VERSION_DECKJS = '1.1.0'
        const VERSION_DOMREADY = '1.0.0'
        const VERSION_D3 = '3.5.5'
        const VERSION_EIGHT = '2.102.0'
        const VERSION_GLMATRIX = '2.3.1'
        const VERSION_JQUERY = '2.1.4'
        const VERSION_JSXGRAPH = '0.99.3'
        const VERSION_PLOTLY = '1.5.2'
        const VERSION_REQUIREJS = '2.1.9'
        const VERSION_STATSJS = '0.0.14'
        const VERSION_THREEJS = '0.72.0'
        const VERSION_TWO = '0.5.0'
        const VERSION_UNDERSCORE = '1.8.3'

        // FIXME: DRY This function is defined in constants.ts?
        function vendorFolder(packageFolder: string, version: string, subFolder: string, fileName: string): string {
            const steps: string[] = []
            steps.push(VENDOR_FOLDER_MARKER)
            steps.push('/')
            steps.push(packageFolder)
            steps.push('@')
            steps.push(version)
            steps.push('/')
            if (subFolder) {
                steps.push(subFolder)
                steps.push('/')
            }
            steps.push(fileName)
            return steps.join('')
        }

        // Functions defining the name of the folder and version being used.
        function async(fileName: string): string {
            return vendorFolder('async', VERSION_ASYNC, void 0, fileName)
        }
        function datGUI(fileName: string): string {
            return vendorFolder('dat-gui', VERSION_DAT_GUI, void 0, fileName)
        }
        function deck(fileName: string): string {
            return vendorFolder('deck.js', VERSION_DECKJS, 'core', fileName)
        }
        function domready(fileName: string): string {
            return vendorFolder('domready', VERSION_DOMREADY, void 0, fileName)
        }
        function d3(fileName: string): string {
            return vendorFolder('d3', VERSION_D3, void 0, fileName)
        }
        function eight(subFolder: string, fileName: string): string {
            return vendorFolder('davinci-eight', VERSION_EIGHT, subFolder, fileName)
        }
        function glMatrix(fileName: string): string {
            return vendorFolder('gl-matrix', VERSION_GLMATRIX, 'dist', fileName);
        }
        function jquery(fileName: string): string {
            return vendorFolder('jquery', VERSION_JQUERY, 'dist', fileName);
        }
        function jsxgraph(fileName: string): string {
            return vendorFolder('jsxgraph', VERSION_JSXGRAPH, void 0, fileName);
        }
        function plotly(fileName: string): string {
            return vendorFolder('plotly', VERSION_PLOTLY, void 0, fileName)
        }
        function requirejs(fileName: string): string {
            return vendorFolder('requirejs', VERSION_REQUIREJS, void 0, fileName);
        }
        function statsjs(fileName: string): string {
            return vendorFolder('stats.js', VERSION_STATSJS, void 0, fileName);
        }
        function threejs(fileName: string): string {
            return vendorFolder('threejs', VERSION_THREEJS, 'build', fileName)
        }
        function two(fileName: string): string {
            return vendorFolder('two', VERSION_TWO, void 0, fileName)
        }
        function underscore(fileName: string): string {
            return vendorFolder('underscore', VERSION_UNDERSCORE, void 0, fileName);
        }
        // TODO: Make this external.
        let _options: IOption[] = [
            /*
            {
                name: 'requirejs',
                moniker: 'RequireJS',
                description: "A file and module loader for JavaScript.",
                homepage: 'http://requirejs.org',
                version: VERSION_REQUIREJS,
                visible: true,
                dts: requirejs('require.d.ts'),
                js: requirejs('require.js'),
                minJs: requirejs('require.js'),
                dependencies: {}
            },
            */
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
            /*
            {
                name: 'gl-matrix',
                moniker: 'gl-matrix',
                description: "Matrix and Vector library for High Performance WebGL apps.",
                homepage: 'http://glmatrix.net',
                version: VERSION_GLMATRIX,
                visible: true,
                dts: glMatrix('gl-matrix.d.ts'),
                js: glMatrix('gl-matrix-min.js'),
                minJs: glMatrix('gl-matrix-min.js'),
                dependencies: {}
            },
            */
            {
                name: 'dat-gui',
                moniker: 'dat.GUI',
                description: "dat.gui is a lightweight controller library for JavaScript.",
                homepage: 'https://github.com/dataarts/dat.gui',
                version: VERSION_DAT_GUI,
                visible: true,
                dts: datGUI('dat-gui.d.ts'),
                js: datGUI('dat-gui.js'),
                minJs: datGUI('dat-gui.min.js'),
                dependencies: {}
            },
            {
                name: 'davinci-eight',
                moniker: 'Eight.js',
                description: "Mathematical Computer Graphics using WebGL.",
                homepage: 'http://www.mathdoodle.io/docs/davinci-eight/index.html',
                version: VERSION_EIGHT,
                visible: true,
                dts: eight('dist', 'davinci-eight.d.ts'),
                js: eight('dist', 'davinci-eight.js'),
                minJs: eight('dist', 'davinci-eight.js'),
                dependencies: {}
            },
            {
                name: 'd3',
                moniker: 'd3',
                description: "Data-Driven Documents.",
                homepage: 'http://d3js.org',
                version: VERSION_D3,
                visible: true,
                dts: d3('d3.d.ts'),
                js: d3('d3.js'),
                minJs: d3('d3.min.js'),
                dependencies: {}
            },
            {
                name: 'DomReady',
                moniker: 'DomReady',
                description: "Browser portable and safe way to know when DOM has loaded.",
                homepage: '',
                version: VERSION_DOMREADY,
                visible: true,
                dts: domready('domready.d.ts'),
                js: domready('domready.js'),
                minJs: domready('domready.js'),
                dependencies: {}
            },
            {
                name: 'jquery',
                moniker: 'jQuery',
                description: "The Write Less, Do More, JavaScript Library.",
                homepage: 'https://jquery.com',
                version: VERSION_JQUERY,
                visible: true,
                dts: jquery('jquery.d.ts'),
                js: jquery('jquery.js'),
                minJs: jquery('jquery.min.js'),
                dependencies: {}
            },
            // FIXME: deck temporarily placed here (after jquery) until dependencies are fixed.
            {
                name: 'deck.js',
                moniker: 'deckJS',
                description: "Modern HTML Presentations.",
                homepage: 'http://imakewebthings.github.com/deck.js',
                version: VERSION_DECKJS,
                visible: true,
                dts: deck('deck.core.d.ts'),
                js: deck('deck.core.js'),
                minJs: deck('deck.core.js'),
                dependencies: { 'jquery': '2.1.4' }
            },
            {
                name: 'jsxgraph',
                moniker: 'JSXGraph',
                description: "2D Geometry, Plotting, and Visualization.",
                homepage: 'http://jsxgraph.uni-bayreuth.de',
                version: VERSION_JSXGRAPH,
                visible: true,
                dts: jsxgraph('jsxgraph.d.ts'),
                js: jsxgraph('jsxgraph.js'),
                minJs: jsxgraph('jsxgraph.min.js'),
                dependencies: {}
            },
            {
                name: 'plot.ly',
                moniker: 'plotly',
                description: "The open source JavaScript graphing library that powers plotly.",
                homepage: 'https://plot.ly/javascript/',
                version: VERSION_PLOTLY,
                visible: true,
                dts: plotly('plotly.d.ts'),
                js: plotly('plotly.js'),
                minJs: plotly('plotly.min.js'),
                dependencies: {}
            },
            {
                name: 'stats.js',
                moniker: 'Stats',
                description: "JavaScript Performance Monitoring.",
                homepage: 'https://github.com/mrdoob/stats.js',
                version: VERSION_STATSJS,
                visible: true,
                dts: statsjs('stats.d.ts'),
                js: statsjs('stats.min.js'),
                minJs: statsjs('stats.min.js'),
                dependencies: {}
            },
            {
                name: 'three.js',
                moniker: 'Three.js',
                description: "JavaScript 3D library.",
                homepage: 'http://threejs.org/',
                version: VERSION_THREEJS,
                visible: true,
                dts: threejs('three.d.ts'),
                js: threejs('three.js'),
                minJs: threejs('three.min.js'),
                dependencies: {}
            },
            {
                name: 'two.js',
                moniker: 'Two.js',
                description: "A two-dimensional drawing api for modern browsers.",
                homepage: 'http://jonobr1.github.io/two.js/',
                version: VERSION_TWO,
                visible: true,
                dts: two('two.d.ts'),
                js: two('two.js'),
                minJs: two('two.min.js'),
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
                dts: underscore('underscore.d.ts'),
                js: underscore('underscore.js'),
                minJs: underscore('underscore.min.js'),
                dependencies: {}
            }
            */
        ];

        const that: IOptionManager = {

            unshift: function(doodle: IOption) {
                return _options.unshift(doodle);
            },

            get length() {
                return _options.length;
            },

            filter: function(callback: (doodle: IOption, index: number, array: IOption[]) => boolean) {
                return _options.filter(callback);
            },

            deleteOption: function(name: string) {
                var options: IOption[] = [];

                var i = 0, found;
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