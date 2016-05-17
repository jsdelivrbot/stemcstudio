import Fuzzy from '../../utils/Fuzzy';
import PublishSettings from '../../modules/publish/PublishSettings';

export default class PublishFacts {
    public id_token: Fuzzy<string> = new Fuzzy<string>();
    public indexed: Fuzzy<boolean> = new Fuzzy<boolean>();
    public owner: Fuzzy<string> = new Fuzzy<string>();
    public settings: Fuzzy<PublishSettings> = new Fuzzy<PublishSettings>();
}
