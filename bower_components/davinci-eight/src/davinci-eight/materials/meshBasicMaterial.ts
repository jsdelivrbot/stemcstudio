import material = require('davinci-eight/core/material');

var meshBasicMaterial = function(spec) {
    var api = material(spec);

    return api;
};

export = meshBasicMaterial;
