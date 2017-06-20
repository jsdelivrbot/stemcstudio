import { Fuzzy } from '../../utils/Fuzzy';

export class PublishFacts {
    public id_token: Fuzzy<string> = new Fuzzy<string>();
    public indexed: Fuzzy<boolean> = new Fuzzy<boolean>();
    public owner: Fuzzy<string> = new Fuzzy<string>();
    public resource: Fuzzy<string> = new Fuzzy<string>();
    /**
     * The variable that determines whether the flow has completed.
     */
    public completionMessage: Fuzzy<string> = new Fuzzy<string>();
}
