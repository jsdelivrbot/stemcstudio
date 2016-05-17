import Fuzzy from '../../utils/Fuzzy';
import LabelSettings from '../../modules/publish/LabelSettings';

export default class LabelFacts {
    public settings: Fuzzy<LabelSettings> = new Fuzzy<LabelSettings>();
}
