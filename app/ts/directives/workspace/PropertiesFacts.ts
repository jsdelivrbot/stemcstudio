import { Fuzzy } from '../../utils/Fuzzy';
import { PropertiesSettings } from '../../modules/properties/PropertiesSettings';

export class PropertiesFacts {
    public settings: Fuzzy<PropertiesSettings> = new Fuzzy<PropertiesSettings>();
}
