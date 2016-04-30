import app from '../../app';
import ISettingsService from './ISettingsService';

app.factory('settings', [function(): ISettingsService {
    const settings: ISettingsService = {
        theme: 'Twilight',
        indent: 2,
        fontSize: '16px',
        showInvisibles: false,
        showPrintMargin: false,
        displayIndentGuides: false
    };
    return settings;
}]);
