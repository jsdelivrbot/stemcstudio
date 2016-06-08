import app from '../../app';
// TODO: Decouple from editor.
import Document from '../../editor/Document';
import Doodle from './Doodle';
import DoodleFile from './DoodleFile';
import IDoodleDS from './IDoodleDS';
import IDoodleManager from './IDoodleManager';
import ITemplateFile from '../templates/ITemplateFile';
import IOptionManager from '../options/IOptionManager';
import modeFromName from '../../utils/modeFromName';
import doodlesToString from './doodlesToString';

function deserializeDoodles(doodles: IDoodleDS[], options: IOptionManager): Doodle[] {
    // Version 1.x used a fixed set of four files with properties that were strings.
    const FILENAME_HTML = 'index.html';
    const PROPERTY_HTML = 'html';

    const FILENAME_CODE = 'script.ts';
    const PROPERTY_CODE = 'code';

    const FILENAME_LIBS = 'extras.ts';
    const PROPERTY_LIBS = 'libs';

    const FILENAME_LESS = 'style.less';
    const PROPERTY_LESS = 'less';

    const ds: Doodle[] = [];
    const iLen = doodles.length;
    for (let i = 0; i < iLen; i++) {
        const inDoodle = doodles[i];
        const d = new Doodle(options);
        // The existence of the files property indicates that this is probably a modern version.
        if (inDoodle.files) {
            d.files = copyFiles(inDoodle.files);
        }
        else {
            d.files = {};

            d.files[FILENAME_HTML] = new DoodleFile();
            d.files[FILENAME_HTML].document = new Document(inDoodle[PROPERTY_HTML]);
            d.files[FILENAME_HTML].language = modeFromName(FILENAME_HTML);

            d.files[FILENAME_CODE] = new DoodleFile();
            d.files[FILENAME_CODE].document = new Document(inDoodle[PROPERTY_CODE]);
            d.files[FILENAME_CODE].language = modeFromName(FILENAME_CODE);

            d.files[FILENAME_LIBS] = new DoodleFile();
            d.files[FILENAME_LIBS].document = new Document(inDoodle[PROPERTY_LIBS]);
            d.files[FILENAME_LIBS].language = modeFromName(FILENAME_LIBS);

            d.files[FILENAME_LESS] = new DoodleFile();
            d.files[FILENAME_LESS].document = new Document(inDoodle[PROPERTY_LESS]);
            d.files[FILENAME_LESS].language = modeFromName(FILENAME_LESS);
        }
        // FIXME: DRY by copying keys both directions.
        d.gistId = inDoodle.gistId;
        d.owner = inDoodle.owner;
        d.repo = inDoodle.repo;
        d.lastKnownJs = inDoodle.lastKnownJs;
        ds.push(d);
    }
    return ds;
}

function copyFiles(inFiles: { [name: string]: ITemplateFile }): { [name: string]: DoodleFile } {
    const outFiles: { [name: string]: DoodleFile } = {};
    const names: string[] = Object.keys(inFiles);
    const iLen: number = names.length;
    for (let i = 0; i < iLen; i++) {
        const name = names[i];
        const inFile = inFiles[name];
        const outFile: DoodleFile = new DoodleFile();
        outFile.document = new Document(inFile.content);
        outFile.language = inFile.language;
        outFiles[name] = outFile;
    }
    return outFiles;
}

app.factory('doodles', [
    '$window',
    'options',
    'doodlesKey',
    function(
        $window: angular.IWindowService,
        options: IOptionManager,
        doodlesKey: string
    ) {

        // The doodles from local storage must be converted into classes in order to support the methods.
        var _doodles: Doodle[] = deserializeDoodles($window.localStorage[doodlesKey] !== undefined ? JSON.parse($window.localStorage[doodlesKey]) : [], options);

        const suggestName = function(): string {
            const UNTITLED = "Project";
            // We assume that a doodle with a lower index will have a higher Untitled number.
            // To reduce sorting, sort as a descending sequence and use the resulting first
            // element as the highest number used so far. Add one to that.
            function compareNumbers(a: number, b: number) {
                return b - a;
            }
            const nums: number[] = _doodles.filter(function(doodle: Doodle) {
                return typeof doodle.description.match(new RegExp(UNTITLED)) !== 'null';
            }).
                map(function(doodle: Doodle) {
                    return parseInt(doodle.description.replace(UNTITLED + ' ', '').trim(), 10);
                }).
                filter(function(num) {
                    return !isNaN(num);
                });

            nums.sort(compareNumbers);

            return UNTITLED + ' ' + (nums.length === 0 ? 1 : nums[0] + 1);
        };

        var that: IDoodleManager = {

            unshift: function(doodle: Doodle): number {
                return _doodles.unshift(doodle);
            },

            get length(): number {
                return _doodles.length;
            },

            filter: function(callback: (doodle: Doodle, index: number, array: Doodle[]) => boolean): Doodle[] {
                return _doodles.filter(callback);
            },

            current: function(): Doodle {
                if (_doodles.length > 0) {
                    return _doodles[0];
                }
                else {
                    return undefined;
                }
            },

            makeCurrent: function(dude: Doodle): void {
                const doodles: Doodle[] = [];

                var i = 0, found;
                while (i < _doodles.length) {
                    if (_doodles[i] === dude) {
                        found = _doodles[i];
                    }
                    else {
                        doodles.push(_doodles[i]);
                    }
                    i++;
                }
                if (!found) return;
                doodles.unshift(found);
                _doodles = doodles;
            },

            deleteDoodle: function(dude: Doodle): void {
                const doodles: Doodle[] = [];

                var i = 0, found;
                while (i < _doodles.length) {
                    if (_doodles[i] === dude) {
                        found = _doodles[i];
                    }
                    else {
                        doodles.push(_doodles[i]);
                    }
                    i++;
                }

                if (!found) return;

                _doodles = doodles;
            },

            suggestName: suggestName,

            updateStorage: function(): void {
                $window.localStorage[doodlesKey] = doodlesToString(_doodles);
            }
        };

        return that;
    }]);
