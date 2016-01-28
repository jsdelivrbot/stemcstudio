import IDoodle from '../doodles/IDoodle';

interface ICloud {
    downloadGist(token: string, gistId: string, callback: (err, doodle?: IDoodle) => void);
}

export default ICloud;
