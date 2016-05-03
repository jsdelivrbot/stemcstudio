import Doodle from '../doodles/Doodle';

interface ICloud {
  downloadGist(gistId: string, callback: (err, doodle?: Doodle) => void);
}

export default ICloud;
