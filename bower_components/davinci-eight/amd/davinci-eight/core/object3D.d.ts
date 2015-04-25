import Euclidean3 = require('davinci-blade/Euclidean3');
declare var object3D: () => {
    position: Euclidean3;
    attitude: Euclidean3;
    onContextGain: (gl: any) => void;
    onContextLoss: () => void;
    tearDown: () => void;
    updateMatrix: () => void;
    draw: (projectionMatrix: any) => void;
};
export = object3D;
