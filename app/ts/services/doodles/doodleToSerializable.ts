import Doodle from './Doodle';
import IDoodleDS from './IDoodleDS';
export default function doodleToSerializable(dude: Doodle): IDoodleDS {
    const data: IDoodleDS = {
        owner: dude.owner,
        repo: dude.repo,
        gistId: dude.gistId,
        lastKnownJs: dude.lastKnownJs,
        files: dude.files,
        trash: dude.trash,
        created_at: dude.created_at,
        updated_at: dude.updated_at
    };
    return data;
}
