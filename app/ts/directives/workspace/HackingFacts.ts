import Fuzzy from '../../utils/Fuzzy';

export default class HackingFacts {
    public id_token: Fuzzy<string> = new Fuzzy<string>();
    public indexed: Fuzzy<boolean> = new Fuzzy<boolean>();
    public owner: Fuzzy<string> = new Fuzzy<string>();
}
