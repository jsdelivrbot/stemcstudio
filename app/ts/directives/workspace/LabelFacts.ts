import { Fuzzy } from '../../utils/Fuzzy';
import { LabelSettings } from '../../modules/labelsAndTags/LabelSettings';

export class LabelFacts {
    public settings: Fuzzy<LabelSettings> = new Fuzzy<LabelSettings>();
}
