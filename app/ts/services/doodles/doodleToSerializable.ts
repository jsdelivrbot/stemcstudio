import Doodle from './Doodle';
import DoodleFile from './DoodleFile';
import IDoodleDS from './IDoodleDS';
import IDoodleFile from './IDoodleFile';

function mapDoodleFileToIDoodleFile(doodleFile: DoodleFile): IDoodleFile {
    const result: IDoodleFile = {
        content: doodleFile.content,
        sha: doodleFile.sha,
        language: doodleFile.language,
        preview: doodleFile.preview,
        raw_url: doodleFile.raw_url,
        size: doodleFile.size,
        truncated: doodleFile.truncated,
        type: doodleFile.type
    };
    return result;
}

function mapDoodleFilesToIDoodleFiles(files: { [path: string]: DoodleFile }): { [path: string]: IDoodleFile } {
    const result: { [path: string]: IDoodleFile } = {};
    const paths = Object.keys(files);
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        result[path] = mapDoodleFileToIDoodleFile(files[path]);
    }
    return result;
}

export default function doodleToSerializable(dude: Doodle): IDoodleDS {
    const data: IDoodleDS = {
        owner: dude.owner,
        repo: dude.repo,
        gistId: dude.gistId,
        lastKnownJs: dude.lastKnownJs,
        files: mapDoodleFilesToIDoodleFiles(dude.files),
        trash: mapDoodleFilesToIDoodleFiles(dude.trash),
        created_at: dude.created_at,
        updated_at: dude.updated_at
    };
    return data;
}
