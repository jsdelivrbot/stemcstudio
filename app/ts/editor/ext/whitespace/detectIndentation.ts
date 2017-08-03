import { EditSession } from '../../EditSession';
import { Indentation } from './Indentation';

// based on http://www.freehackers.org/Indent_Finder
function $detectIndentation(lines: string[], fallback?: any): Indentation {
    const stats: number[] = [];
    const changes: number[] = [];
    let tabIndents = 0;
    let prevSpaces = 0;
    const max = Math.min(lines.length, 1000);
    for (let i = 0; i < max; i++) {
        let line = lines[i];
        // ignore empty and comment lines
        if (!/^\s*[^*+\-\s]/.test(line))
            continue;

        if (line[0] === "\t")
            tabIndents++;

        const spaces = line.match(/^ */)[0].length;
        if (spaces && line[spaces] !== "\t") {
            const diff = spaces - prevSpaces;
            if (diff > 0 && !(prevSpaces % diff) && !(spaces % diff))
                changes[diff] = (changes[diff] || 0) + 1;

            stats[spaces] = (stats[spaces] || 0) + 1;
        }
        prevSpaces = spaces;

        // ignore lines ending with backslash
        while (i < max && line[line.length - 1] === "\\")
            line = lines[i++];
    }

    function getScore(indent: number): number {
        let score = 0;
        for (let i = indent; i < stats.length; i += indent)
            score += stats[i] || 0;
        return score;
    }

    const changesTotal = changes.reduce(function (a, b) { return a + b; }, 0);

    let first = { score: 0, length: 0 };
    let spaceIndents = 0;
    for (let i = 1; i < 12; i++) {
        let score = getScore(i);
        if (i === 1) {
            spaceIndents = score;
            score = stats[1] ? 0.9 : 0.8;
            if (!stats.length)
                score = 0;
        } else
            score /= spaceIndents;

        if (changes[i])
            score += changes[i] / changesTotal;

        if (score > first.score)
            first = { score: score, length: i };
    }

    const tabLength: number = (first.score && first.score > 1.4) ? first.length : void 0;

    if (tabIndents > spaceIndents + 1)
        return { ch: "\t", length: tabLength };

    if (spaceIndents > tabIndents + 1)
        return { ch: " ", length: tabLength };
}

export function detectIndentation(session: EditSession) {
    const lines: string[] = session.getLines(0, 1000);
    const indent: Indentation = $detectIndentation(lines) || {};

    if (indent.ch)
        session.setUseSoftTabs(indent.ch === " ");

    if (indent.length)
        session.setTabSize(indent.length);
    return indent;
}
