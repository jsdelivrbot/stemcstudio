import CopyScope from '../../../scopes/CopyScope';
import IDoodleManager from '../../../services/doodles/IDoodleManager';
import copyDoodleToDoodle from '../../../mappings/copyDoodleToDoodle';
import NavigationService from '../../../modules/navigation/NavigationService';

export default class CopyController {
    public static $inject: string[] = [
        '$scope',
        'doodles',
        'navigation'
    ];
    constructor(
        $scope: CopyScope,
        doodles: IDoodleManager,
        navigation: NavigationService
    ) {
        //
        // The old description provides context for the user dialog.
        //
        $scope.oldDescription = doodles.current().description;

        //
        // The user can change the description.
        //
        $scope.newDescription = doodles.current().description;

        //
        // Copy the current doodle into a new doodle.
        //
        $scope.doOK = function () {
            const original = doodles.current();
            const doodle = doodles.createDoodle();

            copyDoodleToDoodle(original, doodle);

            doodle.author = void 0;
            doodle.created_at = void 0;
            doodle.gistId = void 0;
            doodle.isCodeVisible = original.isCodeVisible;
            doodle.isViewVisible = original.isViewVisible;
            doodle.keywords = original.keywords;
            doodle.lastKnownJs = {};
            doodle.name = 'copy-of-' + original.name;
            doodle.owner = void 0;
            doodle.repo = void 0;
            doodle.updated_at = void 0;
            doodle.version = '0.1.0';

            doodle.description = $scope.newDescription;

            doodles.addHead(doodle);
            doodles.updateStorage();

            navigation.gotoDoodle();
        };

        //
        // Go back to whatever is the current project.
        //
        $scope.doCancel = function () {
            navigation.gotoDoodle();
        };
    }
}
