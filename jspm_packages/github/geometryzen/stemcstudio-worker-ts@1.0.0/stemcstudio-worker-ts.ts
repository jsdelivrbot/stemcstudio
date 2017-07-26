import { TypeScriptWorker } from "./src/workers/TypeScriptWorker";
import { Sender } from "./src/lib/Sender";

const main = {
    get TypeScriptWorker() { return TypeScriptWorker; },
    get Sender() { return Sender; }
};

export default main;
