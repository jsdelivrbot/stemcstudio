import { Completion } from "./Completion";

/**
 *
 */
export class CompletionList {

    /**
     *
     */
    public filterText: string;

    /**
     *
     */
    public filtered: Completion[];

    /**
     *
     */
    private all: Completion[];

    /**
     * @param all
     * @param filterText
     */
    constructor(all: Completion[], filterText?: string) {
        this.all = all;
        this.filtered = all;
        this.filterText = filterText || "";
    }

    /**
     * Updates the <code>filtered</code> property of this list of completions.
     *
     * @param filterText
     */
    public setFilter(filterText: string): void {

        let matches: Completion[];

        if (filterText.length > this.filterText.length && filterText.lastIndexOf(this.filterText, 0) === 0) {
            matches = this.filtered;
        }
        else {
            matches = this.all;
        }

        this.filterText = filterText;

        matches = this.filterCompletions(matches, this.filterText);

        matches = matches.sort(function (a: Completion, b: Completion) {
            if (typeof a.exactMatch === 'number'
                && typeof b.exactMatch === 'number'
                && typeof a.score === 'number'
                && typeof b.score === 'number') {
                return b.exactMatch - a.exactMatch || b.score - a.score;
            }
            else {
                return 0;
            }
        });

        // make unique
        let prev: string | null | undefined = null;
        matches = matches.filter(function (item: Completion) {
            const caption = item.value || item.caption;
            if (caption === prev) return false;
            prev = caption;
            return true;
        });

        this.filtered = matches;
    }

    /**
     * @param items
     * @param needle
     */
    private filterCompletions(items: Completion[], needle: string): Completion[] {

        const results: Completion[] = [];
        const upper = needle.toUpperCase();
        const lower = needle.toLowerCase();

        loop: for (let i = 0, length = items.length; i < length; i++) {
            const item: Completion = items[i];
            const caption = item.value || item.caption;
            if (!caption) continue;
            let lastIndex = -1;
            let matchMask = 0;
            let penalty = 0;
            let index: number;
            let distance: number;
            // caption char iteration is faster in Chrome but slower in Firefox, so lets use indexOf
            for (let j = 0; j < needle.length; j++) {
                // TODO add penalty on case mismatch
                const i1 = caption.indexOf(lower[j], lastIndex + 1);
                const i2 = caption.indexOf(upper[j], lastIndex + 1);
                index = (i1 >= 0) ? ((i2 < 0 || i1 < i2) ? i1 : i2) : i2;
                if (index < 0)
                    continue loop;
                distance = index - lastIndex - 1;
                if (distance > 0) {
                    // first char mismatch should be more sensitive
                    if (lastIndex === -1)
                        penalty += 10;
                    penalty += distance;
                }
                matchMask = matchMask | (1 << index);
                lastIndex = index;
            }
            item.matchMask = matchMask;
            item.exactMatch = penalty ? 0 : 1;
            item.score = (item.score || 0) - penalty;
            results.push(item);
        }
        return results;
    }
}
