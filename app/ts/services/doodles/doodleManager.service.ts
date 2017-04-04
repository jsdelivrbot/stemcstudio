import { IWindowService } from 'angular';
import app from '../../app';
import Doodle from './Doodle';
import DoodleFile from './DoodleFile';
import IDoodleDS from './IDoodleDS';
import { DOODLE_MANAGER_SERVICE_UUID, IDoodleManager } from './IDoodleManager';
import IDoodleFile from './IDoodleFile';
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
            d.files[FILENAME_HTML].content = inDoodle[PROPERTY_HTML];
            d.files[FILENAME_HTML].language = <string>modeFromName(FILENAME_HTML);

            d.files[FILENAME_CODE] = new DoodleFile();
            d.files[FILENAME_CODE].content = inDoodle[PROPERTY_CODE];
            d.files[FILENAME_CODE].language = <string>modeFromName(FILENAME_CODE);

            d.files[FILENAME_LIBS] = new DoodleFile();
            d.files[FILENAME_LIBS].content = inDoodle[PROPERTY_LIBS];
            d.files[FILENAME_LIBS].language = <string>modeFromName(FILENAME_LIBS);

            d.files[FILENAME_LESS] = new DoodleFile();
            d.files[FILENAME_LESS].content = inDoodle[PROPERTY_LESS];
            d.files[FILENAME_LESS].language = <string>modeFromName(FILENAME_LESS);
        }
        // FIXME: DRY by copying keys both directions.
        d.gistId = inDoodle.gistId;
        d.owner = inDoodle.owner;
        d.repo = inDoodle.repo;
        d.lastKnownJs = inDoodle.lastKnownJs;
        d.lastKnownJsMap = inDoodle.lastKnownJsMap;
        ds.push(d);
    }
    return ds;
}

function copyFiles(inFiles: { [name: string]: IDoodleFile }): { [name: string]: DoodleFile } {
    const outFiles: { [name: string]: DoodleFile } = {};
    const names: string[] = Object.keys(inFiles);
    const iLen: number = names.length;
    for (let i = 0; i < iLen; i++) {
        const name = names[i];
        const inFile = inFiles[name];
        const outFile: DoodleFile = new DoodleFile();
        outFile.content = inFile.content;
        outFile.isOpen = !!inFile.isOpen;
        outFile.language = inFile.language;
        outFile.htmlChoice = inFile.htmlChoice;
        outFile.markdownChoice = inFile.markdownChoice;
        outFile.raw_url = inFile.raw_url;
        outFile.selected = !!inFile.selected;
        outFiles[name] = outFile;
    }
    return outFiles;
}

app.factory(DOODLE_MANAGER_SERVICE_UUID, [
    '$window',
    'options',
    'doodlesKey',
    function (
        $window: IWindowService,
        options: IOptionManager,
        doodlesKey: string
    ) {

        // The doodles from local storage must be converted into classes in order to support the methods.
        let _doodles: Doodle[] = deserializeDoodles($window.localStorage[doodlesKey] !== undefined ? JSON.parse($window.localStorage[doodlesKey]) : [], options);

        const suggestName = function (): string {
            const UNTITLED = "Project";
            // We assume that a doodle with a lower index will have a higher Untitled number.
            // To reduce sorting, sort as a descending sequence and use the resulting first
            // element as the highest number used so far. Add one to that.
            function compareNumbers(a: number, b: number) {
                return b - a;
            }
            const nums: number[] = _doodles.filter(function (doodle: Doodle): boolean {
                if (typeof doodle.description === 'string') {
                    return !!doodle.description.match(new RegExp(UNTITLED));
                }
                else {
                    // If it does not have a description, ignore it.
                    return false;
                }
            }).
                map(function (doodle: Doodle) {
                    // We know that the doodle has a description, try removing the word in the prefix
                    // and then parse what's left as an integer. We may get NaN, but that's OK.
                    return parseInt((<string>doodle.description).replace(UNTITLED + ' ', '').trim(), 10);
                }).
                filter(function (num) {
                    // Throw away the description that did not parse to numbers.
                    return !isNaN(num);
                });

            // Sort the numbers so that the highest comes out first.
            nums.sort(compareNumbers);

            return UNTITLED + ' ' + (nums.length === 0 ? 1 : nums[0] + 1);
        };

        const that: IDoodleManager = {

            addHead: function (doodle: Doodle): number {
                return _doodles.unshift(doodle);
            },

            addTail: function (doodle: Doodle): number {
                return _doodles.push(doodle);
            },

            get length(): number {
                return _doodles.length;
            },

            filter: function (callback: (doodle: Doodle, index: number, array: Doodle[]) => boolean): Doodle[] {
                return _doodles.filter(callback);
            },

            createDoodle: function (): Doodle {
                return new Doodle(options);
            },

            current: function (): Doodle | undefined {
                if (_doodles.length > 0) {
                    return _doodles[0];
                }
                else {
                    return undefined;
                }
            },

            makeCurrent: function (dude: Doodle): void {
                const doodles: Doodle[] = [];

                let i = 0;
                let found: Doodle | undefined;
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

            deleteDoodle: function (dude: Doodle): void {
                const doodles: Doodle[] = [];

                let i = 0;
                let found: Doodle | undefined;
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

            updateStorage: function (): void {
                $window.localStorage[doodlesKey] = doodlesToString(_doodles);
            }
        };

        return that;
    }]);
