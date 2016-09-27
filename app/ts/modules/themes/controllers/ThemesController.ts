import ThemesDialog from '../contracts/ThemesDialog';
import ThemesDialogModel from '../contracts/ThemesDialogModel';
import ThemeManager from '../ThemeManager';
import {THEMES_DIALOG} from '../constants';
import {THEME_MANAGER} from '../constants';

export default class ThemesController {
    public static $inject: string[] = [
        THEMES_DIALOG,
        THEME_MANAGER
    ];
    constructor(
        private themesDialog: ThemesDialog,
        private themeManager: ThemeManager
    ) {
        // Do nothing yet. 
    }
    public showThemeChoices(): void {
        const theme = this.themeManager.getCurrentTheme();
        const model: ThemesDialogModel = { theme };
        this.themesDialog.open(model).then((model) => {
            console.log(JSON.stringify(model));
            this.themeManager.setCurrentThemeByName(model.theme.name);
        }).catch((reason) => {
            switch (reason) {
                case 'cancel click':
                case 'escape key press':
                case 'backdrop click': {
                    console.log(`reason => ${reason}`);
                    break;
                }
                default: {
                    console.warn(reason);
                }
            }
        });
    }
}
