//
// TODO: This is probably equivalent to simply exporting.
//
import { LanguageServiceWorker } from "./src/workers/LanguageServiceWorker";
import { Sender } from "./src/lib/Sender";

const main = {
    get LanguageServiceWorker() { return LanguageServiceWorker; },
    get Sender() { return Sender; }
};

export default main;
