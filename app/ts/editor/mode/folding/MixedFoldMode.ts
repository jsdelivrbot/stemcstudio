import FoldMode from "./FoldMode";
import EditSession from "../../EditSession";
import Range from "../../Range";

/**
 *
 */
export default class MixedFoldMode extends FoldMode {
    defaultMode: FoldMode;
    subModes: { [name: string]: FoldMode };

    /**
     * @param defaultMode
     * @param subModes
     */
    constructor(defaultMode: FoldMode, subModes: { [name: string]: FoldMode }) {
        super();
        this.defaultMode = defaultMode;
        this.subModes = subModes;
    }

    private $getMode(state: string) {
        if (typeof state !== "string") {
            state = state[0];
        }
        for (const key in this.subModes) {
            if (state.indexOf(key) === 0)
                return this.subModes[key];
        }
        return null;
    }

    private $tryMode(state: string, session: EditSession, foldStyle: string, row: number): string {
        const mode = this.$getMode(state);
        return (mode ? mode.getFoldWidget(session, foldStyle, row) : "");
    }

    getFoldWidget(session: EditSession, foldStyle: string, row: number): string {
        if (row > 0) {
            return (
                this.$tryMode(session.getState(row - 1), session, foldStyle, row) ||
                this.$tryMode(session.getState(row), session, foldStyle, row) ||
                this.defaultMode.getFoldWidget(session, foldStyle, row)
            );
        }
        else {
            return (
                this.$tryMode(session.getState(row), session, foldStyle, row) ||
                this.defaultMode.getFoldWidget(session, foldStyle, row)
            );
        }
    }

    getFoldWidgetRange(session: EditSession, foldStyle: string, row: number): Range {
        let mode = this.$getMode(session.getState(row - 1));

        if (!mode || !mode.getFoldWidget(session, foldStyle, row)) {
            mode = this.$getMode(session.getState(row));
        }

        if (!mode || !mode.getFoldWidget(session, foldStyle, row)) {
            mode = this.defaultMode;
        }

        return mode.getFoldWidgetRange(session, foldStyle, row);
    }
}
