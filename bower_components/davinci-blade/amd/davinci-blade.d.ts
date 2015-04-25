import Euclidean2 = require('davinci-blade/Euclidean2');
import Euclidean3 = require('davinci-blade/Euclidean3');
import Rational = require('davinci-blade/Rational');
import Dimensions = require('davinci-blade/Dimensions');
import Unit = require('davinci-blade/Unit');
import Measure = require('davinci-blade/Measure');
import Complex = require('davinci-blade/Complex');
import Color = require('davinci-blade/Color');
/**
 * Provides the blade module
 *
 * @module blade
 */
declare var blade: {
    'VERSION': string;
    Color: typeof Color;
    Complex: typeof Complex;
    Euclidean2: typeof Euclidean2;
    Euclidean3: typeof Euclidean3;
    scalarE3: (w: number) => Euclidean3;
    vectorE3: (x: number, y: number, z: number) => Euclidean3;
    bivectorE3: (xy: number, yz: number, zx: number) => Euclidean3;
    Rational: typeof Rational;
    Dimensions: typeof Dimensions;
    Unit: typeof Unit;
    Measure: typeof Measure;
    UNIT_DIMLESS: Unit;
    UNIT_KILOGRAM: Unit;
    UNIT_METER: Unit;
    UNIT_SECOND: Unit;
    UNIT_AMPERE: Unit;
    UNIT_KELVIN: Unit;
    UNIT_MOLE: Unit;
    UNIT_CANDELA: Unit;
    UNIT_COULOMB: Unit;
    UNIT_INCH: Unit;
    UNIT_FOOT: Unit;
    UNIT_YARD: Unit;
    UNIT_MILE: Unit;
    UNIT_POUND: Unit;
    UNIT_NEWTON: Unit;
    UNIT_JOULE: Unit;
    UNIT_WATT: Unit;
    UNIT_VOLT: Unit;
    UNIT_WEBER: Unit;
    UNIT_TESLA: Unit;
    UNIT_OHM: Unit;
    UNIT_SIEMEN: Unit;
    UNIT_FARAD: Unit;
    UNIT_HENRY: Unit;
    UNIT_HERTZ: Unit;
    UNIT_PASCAL: Unit;
    units: {
        meter: Unit;
        kilogram: Unit;
        second: Unit;
    };
};
export = blade;
