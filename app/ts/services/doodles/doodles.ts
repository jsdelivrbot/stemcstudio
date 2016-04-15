import app from '../../app';
import Doodle from './Doodle';
import DoodleFile from './DoodleFile';
import IDoodle from './IDoodle';
import IDoodleFile from './IDoodleFile';
import IDoodleManager from './IDoodleManager';
import IUuidService from '../uuid/IUuidService';

function deserialize(doodles: IDoodle[]): Doodle[] {
    const ds: Doodle[] = []
    const iLen = doodles.length
    for (let i = 0; i < iLen; i++) {
        const inDoodle = doodles[i]
        const d = new Doodle()
        d.dependencies = inDoodle.dependencies.slice()
        d.description = inDoodle.description
        d.files = copyFiles(inDoodle.files)
        d.focusEditor = inDoodle.focusEditor
        d.isCodeVisible = inDoodle.isCodeVisible
        d.isViewVisible = inDoodle.isViewVisible
        d.lastKnownJs = inDoodle.lastKnownJs
        d.operatorOverloading = inDoodle.operatorOverloading
        d.uuid = inDoodle.uuid
        ds.push(d)
    }
    return ds
}

function copyFiles(inFiles: { [name: string]: IDoodleFile }): { [name: string]: DoodleFile } {
    const outFiles: { [name: string]: DoodleFile } = {}
    const names: string[] = Object.keys(inFiles)
    const iLen: number = names.length
    for (let i = 0; i < iLen; i++) {
        const name = names[i]
        const inFile = inFiles[name]
        const outFile: DoodleFile = new DoodleFile()
        outFile.content = inFile.content
        outFile.language = inFile.language
        outFiles[name] = outFile
    }
    return outFiles
}

app.factory('doodles', [
    '$window',
    'uuid4',
    'doodlesKey',
    function(
        $window: angular.IWindowService,
        uuid4: IUuidService,
        doodlesKey: string
    ) {

        // The doodles from local storage must be converted into classes in order to support the methods.
        var _doodles: Doodle[] = deserialize($window.localStorage[doodlesKey] !== undefined ? JSON.parse($window.localStorage[doodlesKey]) : []);

        const suggestName = function(): string {
            const UNTITLED = "Doodle";
            // We assume that a doodle with a lower index will have a higher Untitled number.
            // To reduce sorting, sort as a descending sequence and use the resulting first
            // element as the highest number used so far. Add one to that.
            function compareNumbers(a: number, b: number) {
                return b - a;
            }
            const nums: number[] = _doodles.filter(function(doodle: IDoodle) {
                return typeof doodle.description.match(new RegExp(UNTITLED)) !== 'null';
            }).
                map(function(doodle: IDoodle) {
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

            filter: function(callback: (doodle: IDoodle, index: number, array: IDoodle[]) => boolean): Doodle[] {
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

            createDoodle: function(template: Doodle, description?: string): void {
                if (!description) {
                    description = suggestName();
                }
                const doodle: Doodle = new Doodle()
                doodle.uuid = uuid4.generate()
                doodle.description = description
                doodle.operatorOverloading = template.operatorOverloading
                doodle.files = copyFiles(template.files)
                doodle.dependencies = template.dependencies.slice() // make a copy
                _doodles.unshift(doodle)
            },

            makeCurrent: function(uuid: string): void {
                const doodles: Doodle[] = [];

                var i = 0, found;
                while (i < _doodles.length) {
                    if (_doodles[i].uuid === uuid) {
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

            deleteDoodle: function(uuid: string): void {
                const doodles: Doodle[] = [];

                var i = 0, found;
                while (i < _doodles.length) {
                    if (_doodles[i].uuid === uuid) {
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
                $window.localStorage[doodlesKey] = JSON.stringify(_doodles);
            }
        };

        return that;
    }]);
