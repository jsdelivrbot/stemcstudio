import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import ExamplesScope from '../scopes/ExamplesScope';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';

/**
 * The examples are currently not data-driven and not very pretty!
 * 
 * @class ExamplesController
 * @extends AbstractPageController
 */
export default class ExamplesController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$window',
        'GitHubAuthManager',
        'ga',
        'modalDialog',
        'UNIVERSAL_ANALYTICS_TRACKING_ID',
    ];

    constructor(
        $scope: ExamplesScope,
        $window: angular.IWindowService,
        authManager: IGitHubAuthManager,
        ga: UniversalAnalytics.ga,
        modalDialog: ModalDialog,
        UNIVERSAL_ANALYTICS_TRACKING_ID: string) {
        super($scope, $window, authManager, ga, modalDialog, UNIVERSAL_ANALYTICS_TRACKING_ID, 'auto');

        $scope.examples = [
            {
                gistId: '',
                title: "",
                description: "",
                category: ''
            },
            {
                gistId: '6774d1e77202db783182',
                title: "Asteroids",
                description: "The classic computer game originating from M.I.T. and Atari.",
                category: 'Games'
            },
            /*
            {
                gistId: '563f391f711bfcfccac5',
                title: "Game2D",
                description: "(Under Development)",
                category: 'Games'
            },
            */
            {
                gistId: '129a4a31fa803df9e4a5',
                title: "Animating a Scene with Eight.Js",
                description: "Demonstrates high-level 3D graphics and Geometric Algebra computations using the the EIGHT library.",
                category: 'Graphics'
            },
            {
                gistId: '157e85464659bbbd3bac',
                title: "Teaching Computer Graphics with WebGL",
                description: "There are benefits to moving from OpenGL to WebGL for teaching Computer Graphics.",
                category: 'Graphics'
            },
            {
                gistId: '89ee3cf12e4360999510',
                title: "Ray Tracing: The Science behind Computer Animation",
                description: "While WebGL provides a high performance real-time graphics environment, movie-quality animations require Physics calculations based upon Geometric Optics and are often computed off-line taking many hours.",
                category: 'Graphics'
            },
            {
                gistId: '69a4edb74810531611d1',
                title: "WebGL Fundamentals",
                description: "Demonstrates low-level 3D graphics using only the WebGL API.",
                category: 'Graphics'
            },
            {
                gistId: '2d975217f9406177e4a6cd812bd28134',
                title: "Euclidean Plane using JSXGraph",
                description: "JSXGraph is a cross-browser JavaScript library for interactive geometry, function plotting, charting, and data visualization in the web browser.",
                category: 'Mathematics'
            },
            {
                gistId: '5c70bee3c68b2b7a4572',
                title: "Mandelbrot Set Fractals using the GPU",
                description: "Using WebGL and custom shader programs for parallel computations.",
                category: 'Mathematics'
            },
            {
                gistId: '39390d95450ff9159b8e',
                title: "Julia Set Fractals using the GPU",
                description: "Using WebGL and custom shader programs for parallel computations.",
                category: 'Mathematics'
            },
            {
                gistId: '1054e457c4fb6bba3aab1aceb25f1212',
                title: "EightJS Starter Template",
                description: "An example that you can copy to create your own 3D graphics programs using the EIGHT library.",
                category: 'Physics'
            },
            {
                gistId: '1af94bb1db939e36e5f84764b44030af',
                title: "Modeling a Gas",
                description: "This program models a Gas as a collection of Molecules interacting with each other and the walls of a Box through elastic collisions.",
                category: 'Physics'
            },
            {
                gistId: '72b8c2b765792d2fe100',
                title: "Projectile Motion",
                description: "Physics demonstrations and explorations require accessible solutions without having to re-invent graphical components. This example shows how to model projectile motion by composing high-level components in the Eight.Js library.",
                category: 'Physics'
            },
            {
                gistId: 'e5a3cbf25d8972d1b79d',
                title: "Binary Star",
                description: "A two-body simulation demonstrating gravitation, center of mass, and reduced-mass concepts.",
                category: 'Physics'
            },
            {
                gistId: '925701cc2a654bfefcf0',
                title: "Earth-Moon",
                description: "Demonstrates using two viewports to display a scene from different perspectives. Simulates the Earth-Moon gravitation system with directional lighting provided by the sun. The scene is rendered in plan view and and from the Earth.",
                category: 'Physics'
            },
            {
                gistId: 'a1ee16bc6b1c98317ba1',
                title: "Units of Measure",
                description: "The Eight.Js library includes Geometric Algebra measures that include optional units of measure. The units are based upon the seven S.I. base units and is also able to recognize some common derived units.",
                category: 'Physics'
            },
            {
                gistId: 'd51e8b997c6a1de2ce71',
                title: "Basis Labeling",
                description: "This program computes the geometric product of basis elements in G3 and displays the results in a novel way using unicode characters that suggest a geometric interpretation of the basis element.",
                category: 'Physics'
            }
        ];
    }
}
