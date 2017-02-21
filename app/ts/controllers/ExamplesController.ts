import * as angular from 'angular';
import AbstractPageController from './AbstractPageController';
import ExamplesScope from '../scopes/ExamplesScope';
import IGitHubAuthManager from '../services/gham/IGitHubAuthManager';
import { GITHUB_AUTH_MANAGER } from '../services/gham/IGitHubAuthManager';
import ModalDialog from '../services/modalService/ModalDialog';

/**
 * The examples are currently not data-driven and not very pretty!
 */
export default class ExamplesController extends AbstractPageController {

    public static $inject: string[] = [
        '$scope',
        '$window',
        GITHUB_AUTH_MANAGER,
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
        super($window, authManager, modalDialog, 'auto');

        $scope.examples = [
            {
                gistId: '6774d1e77202db783182',
                title: "Asteroids",
                description: "The classic computer game originating from M.I.T. and Atari.",
                imageSrc: '/img/examples/asteroids.png',
                imageAlt: '',
                category: 'CompSci'
            },
            {
                gistId: '129a4a31fa803df9e4a5',
                title: "Animating a Scene with EIGHT",
                description: "Demonstrates high-level 3D graphics and Geometric Algebra computations using the the EIGHT library.",
                imageSrc: '/img/examples/animating-a-scene-with-eight.png',
                imageAlt: '',
                category: 'Graphics'
            },
            {
                gistId: '157e85464659bbbd3bac',
                title: "Teaching Computer Graphics with WebGL",
                description: "There are benefits to moving from OpenGL to WebGL for teaching Computer Graphics.",
                imageSrc: '/img/examples/teaching-computer-graphics.png',
                imageAlt: '',
                category: 'Graphics'
            },
            {
                gistId: '89ee3cf12e4360999510',
                title: "Ray Tracing: The Science behind Computer Animation",
                description: "While WebGL provides a high performance real-time graphics environment, movie-quality animations require Physics calculations based upon Geometric Optics and are often computed off-line taking many hours.",
                imageSrc: '/img/examples/ray-tracing.png',
                imageAlt: '',
                category: 'Graphics'
            },
            {
                gistId: '69a4edb74810531611d1',
                title: "WebGL Fundamentals",
                description: "Demonstrates low-level 3D graphics using only the WebGL API.",
                imageSrc: '/img/examples/webgl-fundamentals.png',
                imageAlt: '',
                category: 'Graphics'
            },
            {
                gistId: '117063c7f0542755cc43b0e82480ba81',
                title: "Alpha Blending in EIGHT",
                description: "Demonstrates how to simulate transparency using WebGL Alpha Blending.",
                imageSrc: '/img/examples/eight-alpha-blending.png',
                imageAlt: 'Opaque red cube cut in half by transparent blue plane.',
                category: 'Graphics'
            },
            {
                gistId: '43c6b33b9c9f9c1806f01710191a4c1a',
                title: "Minecraft Figures",
                description: "Use Minecraft Figures and Mathematics to create games and demonstrations.",
                imageSrc: '/img/examples/minecraft-figures.png',
                imageAlt: 'Batman and Batgirl Minecraft Figures',
                category: 'Graphics'
            },
            {
                gistId: '1bf1ccdd7abd613b12bb792f48e36d4e',
                title: "Homogeneous Model and Geometric Algebra",
                description: "Demonstrates Geometric Algebra in arbitrary higher dimensions using the Multivector type.",
                imageSrc: '/img/examples/h3ga.png',
                imageAlt: 'Red and green points on blue line.',
                category: 'Mathematics'
            },
            {
                gistId: '1fef109875fac0bd77da086727d6832f',
                title: "Local Geometry on a Sphere",
                description: "Explore the consequences of curvature on a sphere.",
                imageSrc: '/img/examples/local-geometry-on-a-sphere.png',
                imageAlt: 'Moving triangle on a unit sphere with parallel translated vector.',
                category: 'Mathematics'
            },
            {
                gistId: '823a7918fec5da1c7b075a0b37445f80',
                title: "Euclidean Plane using WebGL",
                description: "An example that covers Common Core Math, Linear and Geometric Algebra.",
                imageSrc: '/img/examples/euclidean-plane-webgl.png',
                imageAlt: '',
                category: 'Mathematics'
            },
            {
                gistId: '2d975217f9406177e4a6cd812bd28134',
                title: "Euclidean Plane using JSXGraph",
                description: "JSXGraph is a cross-browser JavaScript library for interactive geometry, function plotting, charting, and data visualization in the web browser.",
                imageSrc: '/img/examples/jsxgraph-fitting-a-circle.png',
                imageAlt: '',
                category: 'Mathematics'
            },
            {
                gistId: '8571a36545d10f34bfef',
                title: "Domain Coloring",
                description: "Using WebGL in 2D to visualize complex functions.",
                imageSrc: '/img/examples/domain-coloring.png',
                imageAlt: '',
                category: 'Mathematics'
            },
            {
                gistId: '5c70bee3c68b2b7a4572',
                title: "Mandelbrot Set Fractals using the GPU",
                description: "Using WebGL and custom shader programs for parallel computations.",
                imageSrc: '/img/examples/mandelbrot-set.png',
                imageAlt: '',
                category: 'Mathematics'
            },
            {
                gistId: '39390d95450ff9159b8e',
                title: "Julia Set Fractals using the GPU",
                description: "Using WebGL and custom shader programs for parallel computations.",
                imageSrc: '/img/examples/julia-set.png',
                imageAlt: '',
                category: 'Mathematics'
            },
            {
                gistId: '4ee2ac7a527eeabdca52',
                title: "Fundamental Theorem of Algebra",
                description: "Using the HTML Canvas to visualize complex functions.",
                imageSrc: '/img/examples/fundamental-theorem-of-algebra.png',
                imageAlt: '',
                category: 'Mathematics'
            },
            {
                gistId: 'b045d9390a4cdff7d3b048b0d9bc8bca',
                title: "Newtonian Mechanics",
                description: "Two blocks connected by a spring using the NEWTON Physics engine and realtime graphs.",
                imageSrc: '/img/examples/newton-spring.png',
                imageAlt: 'Two blocks connected by a spring.',
                category: 'Physics'
            },
            {
                gistId: 'fe668d5c9dfa8e5c1984ee1290158b8d',
                title: "Kinematics 1D with Units of Measure",
                description: "A laboratory exploration of particle kinematics in one dimension.",
                imageSrc: '/img/examples/kinematics-1d-with-units.png',
                imageAlt: 'Red, green, and blue arrows showng acceleration, velocity, and displacement.',
                category: 'Physics'
            },
            {
                gistId: '1af94bb1db939e36e5f84764b44030af',
                title: "Modeling a Gas",
                description: "This program models a Gas as a collection of Molecules interacting with each other and the walls of a Box through elastic collisions.",
                imageSrc: '/img/examples/modeling-a-gas.png',
                imageAlt: 'Spheres in a box moving randomly and colliding with each other and the walls.',
                category: 'Physics'
            },
            {
                gistId: '72b08dfb371ea6bed2c71e851e9aa570',
                title: "Projectile Motion with Units of Measure",
                description: "Physics demonstrations and explorations require accessible solutions without having to re-invent graphical components. This example shows how to model projectile motion by composing high-level components in the EIGHT and UNITS libraries.",
                imageSrc: '/img/examples/projectile-motion.png',
                imageAlt: '',
                category: 'Physics'
            },
            {
                gistId: 'd597da590921017c467a17760afbf706',
                title: "Electric Dipole",
                description: "Motion of a proton in proximity to an electric dipole.",
                imageSrc: '/img/examples/electric-dipole.png',
                imageAlt: '',
                category: 'Physics'
            },
            {
                gistId: '723698aac86c1671a94b8fc5c1334025',
                title: "Processing CSV Text Files",
                description: "Describes how to parse CSV data from a text file and render it using Plotly",
                imageSrc: '/img/examples/processing-csv-text-files.png',
                imageAlt: 'A bar chart rendered using Plotly from parsed CSV data',
                category: 'Physics'
            },
            {
                gistId: '54644519dcd556bf8bf779bfa084ced3',
                title: "EIGHT Getting Started",
                description: "An example that you can copy to create your own 3D graphics programs using the EIGHT library.",
                imageSrc: '/img/examples/eight-starter-template.png',
                imageAlt: 'Green cube illuminated by a directional light.',
                category: 'Physics'
            },
            {
                gistId: 'f00a5fe08eb92b854c803184ec26d402',
                title: "Ball in a Box using EIGHT and Units",
                description: "An example made to look like Visual Python but with Units of Measure.",
                imageSrc: '/img/examples/ball-in-a-box-with-units.png',
                imageAlt: 'Ball bouncing off the inside walls of a box.',
                category: 'Physics'
            },
            {
                gistId: '1d23649589c69cd3c4668c5775fcafa3',
                title: "Ball in a Box using three.js and Units",
                description: "An example made to look like Visual Python but with Units of Measure.",
                imageSrc: '/img/examples/ball-in-a-box-with-units.png',
                imageAlt: 'Ball bouncing off the inside walls of a box.',
                category: 'Physics'
            },
            {
                gistId: 'dea0b84d306d956bc5fde22e9c0ba5c1',
                title: "Geometric Algebra",
                description: "An interactive visualization of vectors, bivectors, and trivectors.",
                imageSrc: '/img/examples/eight-parallelepiped.png',
                imageAlt: 'Trivector with arrows along edges.',
                category: 'Physics'
            },
            {
                gistId: 'e5a3cbf25d8972d1b79d',
                title: "Binary Star",
                description: "A two-body simulation demonstrating gravitation, center of mass, and reduced-mass concepts.",
                imageSrc: '/img/examples/binary-star.png',
                imageAlt: '',
                category: 'Physics'
            },
            {
                gistId: '53738fb8d4860437814fe8738a585505',
                title: "Binary Star using the NEWTON Physics Engine",
                description: "A two-body simulation demonstrating gravitation, center of mass, and reduced-mass concepts.",
                imageSrc: '/img/examples/binary-star.png',
                imageAlt: '',
                category: 'Physics'
            },
            {
                gistId: '925701cc2a654bfefcf0',
                title: "Earth-Moon",
                description: "Demonstrates using two viewports to display a scene from different perspectives. Simulates the Earth-Moon gravitation system with directional lighting provided by the sun. The scene is rendered in plan view and and from the Earth.",
                imageSrc: '/img/examples/earth-moon.png',
                imageAlt: '',
                category: 'Physics'
            },
            {
                gistId: '6d337555572454c211182c5b45aed418',
                title: "Units of Measure using NEWTON",
                description: "The NEWTON library includes Geometric Algebra measures that include optional units of measure. The units are based upon the seven S.I. base units and is also able to recognize common derived units.",
                imageSrc: '/img/examples/units-of-measure.png',
                imageAlt: '',
                category: 'Physics'
            },
            {
                gistId: 'd51e8b997c6a1de2ce71',
                title: "Basis Labeling",
                description: "This program computes the geometric product of basis elements in G3 and displays the results in a novel way using unicode characters that suggest a geometric interpretation of the basis element.",
                imageSrc: '/img/examples/basis-labeling.png',
                imageAlt: '',
                category: 'Physics'
            },
            {
                gistId: '1d9c0c563fd57fccf50aca5440972dd6',
                title: "Vector Introduction",
                description: "Explore the relationship between the geometric and algebraic representation of vectors.",
                imageSrc: '/img/examples/vector-introduction.png',
                imageAlt: '',
                category: 'Physics'
            },
            {
                gistId: '87255c18281069067a99d8e020749ca8',
                title: "Vector Decomposition",
                description: "Implement and visualize function and operators on vectors in a cartesian (standard) basis.",
                imageSrc: '/img/examples/vector-decomposition.png',
                imageAlt: '',
                category: 'Physics'
            },
            {
                gistId: 'c9dff10327f8378400b80a95ba2d5629',
                title: "Vectors, Scalars, and Units",
                description: "Create scalar and vector computational representation incorporating units of measure.",
                imageSrc: '/img/examples/vectors-scalars-and-units.png',
                imageAlt: '',
                category: 'Physics'
            },
            {
                gistId: '112227e26f5facf421a40e43703c6956',
                title: "Kinematics and Dynamics",
                description: "A starting point for modeling kinematics and dynamics concepts.",
                imageSrc: '/img/examples/eight-kinematics-and-dynamics.png',
                imageAlt: '',
                category: 'Physics'
            },
            {
                gistId: '300202f132a385aa6663c8ba6bbe9cce',
                title: "Graphing with Plot.ly",
                description: "",
                imageSrc: '/img/examples/plotly-graphing.png',
                imageAlt: '',
                category: 'Mathematics'
            },
            {
                gistId: 'df53295b58127b519c30251d447f0ae2',
                title: "Plotly Error Bars Graph",
                description: "",
                imageSrc: '/img/examples/plotly-error-bars.png',
                imageAlt: '',
                category: 'Physics'
            },
            {
                gistId: '277b6d56f1c03a51d41dd2921480a987',
                title: "GDP and Life Expectancy",
                description: "",
                imageSrc: '/img/examples/plotly-gdp-and-life-expectancy.png',
                imageAlt: '',
                category: 'Mathematics'
            },
            {
                gistId: '8fc17be344fcd68fee452bb7524d2cfd',
                title: "Plotly Contours Graph",
                description: "",
                imageSrc: '/img/examples/plotly-contour-colorscale.png',
                imageAlt: '',
                category: 'Physics'
            },
            {
                gistId: '376b9f7aff2e174a9474dfe87b727066',
                title: "Plotly Histogram Contours Graph",
                description: "",
                imageSrc: '/img/examples/plotly-histogram-contours.png',
                imageAlt: '',
                category: 'Physics'
            },
            {
                gistId: '8cc0338a0bcb1edf900a2074e9aa9cf2',
                title: "Molecule Visualization",
                description: "",
                imageSrc: '/img/examples/molecule.png',
                imageAlt: '',
                category: 'Chemistry'
            }
        ];
    }
}
