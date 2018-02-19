import { IWindowService } from 'angular';
import { AbstractPageController } from './AbstractPageController';
import { ExamplesScope } from '../scopes/ExamplesScope';
import { Category, Level, Example } from '../models/Example';
import { GITHUB_AUTH_MANAGER_UUID, IGitHubAuthManager } from '../services/gham/IGitHubAuthManager';
import { GOOGLE_ANALYTICS_UUID } from '../fugly/ga/ga';
import { ModalDialog } from '../services/modalService/ModalDialog';

//
// The following example shows how to use the ISCEService.
//
/*
    constructor(
        $http: IHttpService,
        $sce: ISCEService,
        $scope: TutorialsScope,
        $templateCache: ITemplateCacheService,
        $window: IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog) {
        super($window, authManager, modalDialog, 'auto');

        $scope.tutorials = [];
        const url = `data/cookbook.json?bust=${Date.now()}`;
        $http.get<Tutorial[]>(url, { cache: $templateCache })
            .then(function (promiseValue) {
                if (Array.isArray(promiseValue.data)) {
                    $scope.tutorials = promiseValue.data.map(function (tutorial) {
                        tutorial.gistUrl = $sce.trustAsResourceUrl(`/#/gists/${tutorial.gistId}?output=embed`);
                        tutorial.showEmbedded = false;
                        return tutorial;
                    });
                }
            })
            .catch(function (err) {
                console.warn(`Unable to get ${url}. Cause: ${err}`);
            });
*/

/**
 * The examples are currently not data-driven and not very pretty!
 */
export class ExamplesController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$window',
        GITHUB_AUTH_MANAGER_UUID,
        GOOGLE_ANALYTICS_UUID,
        'modalDialog'
    ];

    constructor(
        $scope: ExamplesScope,
        $window: IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog) {
        super($window, authManager, modalDialog, 'auto');

        $scope.examples = [
            {
                gistId: '0100337c6f05e65bceda326a5fe011ed',
                title: "Conway's Game of Life",
                description: "The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.",
                imageSrc: '/img/examples/conway-game-of-life.png',
                imageAlt: 'A grid of colured square cells.',
                category: 'Programming',
                level: 'Beginner'
            },
            {
                gistId: '54644519dcd556bf8bf779bfa084ced3',
                title: "Getting Started with 3D graphics",
                description: "An example that you can copy to create your own 3D graphics programs using the EIGHT library.",
                imageSrc: '/img/examples/eight-starter-template.png',
                imageAlt: 'Green cube illuminated by a directional light.',
                category: 'Graphics',
                level: 'Beginner'
            },
            {
                gistId: '129a4a31fa803df9e4a5',
                title: "Animating a 3D Scene",
                description: "Demonstrates high-level 3D graphics and Geometric Algebra computations using the the EIGHT library.",
                imageSrc: '/img/examples/animating-a-scene-with-eight.png',
                imageAlt: '',
                category: 'Graphics',
                level: 'Intermediate'
            },
            {
                gistId: '157e85464659bbbd3bac',
                title: "Teaching Computer Graphics with WebGL",
                description: "There are benefits to moving from OpenGL to WebGL for teaching Computer Graphics.",
                imageSrc: '/img/examples/teaching-computer-graphics.png',
                imageAlt: '',
                category: 'Graphics',
                level: 'Beginner'
            },
            {
                gistId: '89ee3cf12e4360999510',
                title: "Ray Tracing: The Science behind Computer Animation",
                description: "While WebGL provides a high performance real-time graphics environment, movie-quality animations require Physics calculations based upon Geometric Optics and are often computed off-line taking many hours.",
                imageSrc: '/img/examples/ray-tracing.png',
                imageAlt: '',
                category: 'Graphics',
                level: 'Intermediate'
            },
            {
                gistId: '2761d71e9950ebe26d8a9671b9134d34',
                title: "Explore the Midpoint Quadrilateral of a Quadrilateral",
                description: "JSXGraph is a cross-browser JavaScript library for interactive geometry, function plotting, charting, and data visualization in the web browser.",
                imageSrc: '/img/examples/jsxgraph-midpoint-quadrilateral.png',
                imageAlt: '',
                category: 'Mathematics',
                level: 'Beginner'
            },
            {
                gistId: '20040a2f087e7c66fe72d87e0017b509',
                title: "Differentiation",
                description: "Demonstrates the approximation of the derivative.",
                imageSrc: '/img/examples/differentiation.png',
                imageAlt: 'Graphs of the 0th, 1st and 2nd derivatives of a function.',
                category: 'Mathematics',
                level: 'Intermediate'
            },
            {
                gistId: 'b197467076ccccb1afc996b3b70747b9',
                title: "Gradient Descent Algorithm",
                description: "The gradient descent algorithm is used to fit a model to some data.",
                imageSrc: '/img/examples/gradient-descent.png',
                imageAlt: 'Graph of the cost function decreasing per iteration.',
                category: 'Mathematics',
                level: 'Intermediate'
            },
            {
                gistId: '1bf1ccdd7abd613b12bb792f48e36d4e',
                title: "Homogeneous Model and Geometric Algebra",
                description: "Demonstrates Geometric Algebra in arbitrary higher dimensions using the Multivector type.",
                imageSrc: '/img/examples/h3ga.png',
                imageAlt: 'Red and green points on blue line.',
                category: 'Mathematics',
                level: 'Expert'
            },
            {
                gistId: '1fef109875fac0bd77da086727d6832f',
                title: "Local Geometry on a Sphere",
                description: "Explore the consequences of curvature on a sphere.",
                imageSrc: '/img/examples/local-geometry-on-a-sphere.png',
                imageAlt: 'Moving triangle on a unit sphere with parallel translated vector.',
                category: 'Mathematics',
                level: 'Advanced'
            },
            {
                gistId: '2d975217f9406177e4a6cd812bd28134',
                title: "Euclidean Plane using JSXGraph",
                description: "JSXGraph is a cross-browser JavaScript library for interactive geometry, function plotting, charting, and data visualization in the web browser.",
                imageSrc: '/img/examples/jsxgraph-fitting-a-circle.png',
                imageAlt: '',
                category: 'Mathematics',
                level: 'Intermediate'
            },
            {
                gistId: '8571a36545d10f34bfef',
                title: "Domain Coloring",
                description: "Using WebGL in 2D to visualize complex functions.",
                imageSrc: '/img/examples/domain-coloring.png',
                imageAlt: '',
                category: 'Mathematics',
                level: 'Intermediate'
            },
            {
                gistId: '5c70bee3c68b2b7a4572',
                title: "Mandelbrot Set Fractals using the GPU",
                description: "Using WebGL and custom shader programs for parallel computations.",
                imageSrc: '/img/examples/mandelbrot-set.png',
                imageAlt: '',
                category: 'Mathematics',
                level: 'Intermediate'
            },
            {
                gistId: 'b045d9390a4cdff7d3b048b0d9bc8bca',
                title: "Newtonian Mechanics",
                description: "Two blocks connected by a spring using the NEWTON Physics engine and realtime graphs.",
                imageSrc: '/img/examples/newton-spring.png',
                imageAlt: 'Two blocks connected by a spring.',
                category: 'Physics',
                level: 'Intermediate'
            },
            {
                gistId: 'fe668d5c9dfa8e5c1984ee1290158b8d',
                title: "Kinematics 1D with Units of Measure",
                description: "A laboratory exploration of particle kinematics in one dimension.",
                imageSrc: '/img/examples/kinematics-1d-with-units.png',
                imageAlt: 'Red, green, and blue arrows showng acceleration, velocity, and displacement.',
                category: 'Physics',
                level: 'Intermediate'
            },
            {
                gistId: '1af94bb1db939e36e5f84764b44030af',
                title: "Modeling a Gas",
                description: "This program models a Gas as a collection of Molecules interacting with each other and the walls of a Box through elastic collisions.",
                imageSrc: '/img/examples/modeling-a-gas.png',
                imageAlt: 'Spheres in a box moving randomly and colliding with each other and the walls.',
                category: 'Physics',
                level: 'Intermediate'
            },
            {
                gistId: '72b08dfb371ea6bed2c71e851e9aa570',
                title: "Projectile Motion with Units of Measure",
                description: "Physics demonstrations and explorations require accessible solutions without having to re-invent graphical components. This example shows how to model projectile motion by composing high-level components in the EIGHT and UNITS libraries.",
                imageSrc: '/img/examples/projectile-motion.png',
                imageAlt: '',
                category: 'Physics',
                level: 'Intermediate'
            },
            {
                gistId: 'd597da590921017c467a17760afbf706',
                title: "Electric Dipole",
                description: "Motion of a proton in proximity to an electric dipole.",
                imageSrc: '/img/examples/electric-dipole.png',
                imageAlt: '',
                category: 'Physics',
                level: 'Intermediate'
            },
            {
                gistId: '723698aac86c1671a94b8fc5c1334025',
                title: "Processing CSV Text Files",
                description: "Describes how to parse CSV data from a text file and render it using Plotly",
                imageSrc: '/img/examples/processing-csv-text-files.png',
                imageAlt: 'A bar chart rendered using Plotly from parsed CSV data',
                category: 'Physics',
                level: 'Beginner'
            },
            {
                gistId: 'e5a3cbf25d8972d1b79d',
                title: "Binary Star",
                description: "A two-body simulation demonstrating gravitation, center of mass, and reduced-mass concepts.",
                imageSrc: '/img/examples/binary-star.png',
                imageAlt: '',
                category: 'Physics',
                level: 'Intermediate'
            },
            {
                gistId: '6d337555572454c211182c5b45aed418',
                title: "Units of Measure using NEWTON",
                description: "The NEWTON library includes Geometric Algebra measures that include optional units of measure. The units are based upon the seven S.I. base units and is also able to recognize common derived units.",
                imageSrc: '/img/examples/units-of-measure.png',
                imageAlt: '',
                category: 'Physics',
                level: 'Intermediate'
            },
            {
                gistId: 'd51e8b997c6a1de2ce71',
                title: "Basis Labeling",
                description: "This program computes the geometric product of basis elements in G3 and displays the results in a novel way using unicode characters that suggest a geometric interpretation of the basis element.",
                imageSrc: '/img/examples/basis-labeling.png',
                imageAlt: '',
                category: 'Physics',
                level: 'Intermediate'
            },
            {
                gistId: '300202f132a385aa6663c8ba6bbe9cce',
                title: "Graphing with Plot.ly",
                description: "",
                imageSrc: '/img/examples/plotly-graphing.png',
                imageAlt: '',
                category: 'Visualization',
                level: 'Intermediate'
            },
            {
                gistId: 'df53295b58127b519c30251d447f0ae2',
                title: "Plotly Error Bars Graph",
                description: "",
                imageSrc: '/img/examples/plotly-error-bars.png',
                imageAlt: '',
                category: 'Visualization',
                level: 'Intermediate'
            },
            {
                gistId: '277b6d56f1c03a51d41dd2921480a987',
                title: "GDP and Life Expectancy",
                description: "",
                imageSrc: '/img/examples/plotly-gdp-and-life-expectancy.png',
                imageAlt: '',
                category: 'Visualization',
                level: 'Intermediate'
            },
            {
                gistId: '8fc17be344fcd68fee452bb7524d2cfd',
                title: "Plotly Contours Graph",
                description: "",
                imageSrc: '/img/examples/plotly-contour-colorscale.png',
                imageAlt: '',
                category: 'Visualization',
                level: 'Intermediate'
            },
            {
                gistId: '376b9f7aff2e174a9474dfe87b727066',
                title: "Plotly Histogram Contours Graph",
                description: "",
                imageSrc: '/img/examples/plotly-histogram-contours.png',
                imageAlt: '',
                category: 'Visualization',
                level: 'Intermediate'
            }
            //
            // 3DMol loads from an HTTP endpoint, which is disallowed from HTTPS.
            //
            /*
            {
                gistId: '8cc0338a0bcb1edf900a2074e9aa9cf2',
                title: "Molecule Visualization",
                description: "",
                imageSrc: '/img/examples/molecule.png',
                imageAlt: '',
                category: 'Chemistry'
            }
            */
        ];

        $scope.categories = categories($scope.examples);
        $scope.levels = levels($scope.examples);
    }

    /**
     *
     */
    $onInit(): void {
        // This is being called, every time I go to the Examples page.
    }

    /**
     *
     */
    $onDestroy(): void {
        // However, this method is NOT called.
        console.warn("ExamplesController.$onDestroy");
    }
}

/**
 * Infers the categories in use from the examples.
 */
function categories(examples: Example[]): Category[] {
    const categoryMap: { [category: string]: number } = {};
    for (const example of examples) {
        const category = example.category;
        if (categoryMap[category]) {
            categoryMap[category] += 1;
        }
        else {
            categoryMap[category] = 1;
        }
    }
    return Object.keys(categoryMap) as Category[];
}

/**
 * Infers the levels in use from the examples.
 */
function levels(examples: Example[]): Level[] {
    const levelSet: { [level: string]: Level } = {};
    for (const example of examples) {
        const level = example.level;
        levelSet[level] = level;
    }
    return Object.keys(levelSet).map(function mapKeyToLevel(key) { return levelSet[key]; });
} 
