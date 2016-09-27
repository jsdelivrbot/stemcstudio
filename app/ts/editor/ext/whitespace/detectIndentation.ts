import EditSession from '../../EditSession';
import Indentation from './Indentation';

// based on http://www.freehackers.org/Indent_Finder
function $detectIndentation(lines: string[], fallback?: any): Indentation {
    var stats: number[] = [];
    var changes: number[] = [];
    var tabIndents = 0;
    var prevSpaces = 0;
    var max = Math.min(lines.length, 1000);
    for (var i = 0; i < max; i++) {
        var line = lines[i];
        // ignore empty and comment lines
        if (!/^\s*[^*+\-\s]/.test(line))
            continue;

        if (line[0] === "\t")
            tabIndents++;

        var spaces = line.match(/^ */)[0].length;
        if (spaces && line[spaces] !== "\t") {
            var diff = spaces - prevSpaces;
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
        var score = 0;
        for (var i = indent; i < stats.length; i += indent)
            score += stats[i] || 0;
        return score;
    }

    var changesTotal = changes.reduce(function (a, b) { return a + b; }, 0);

    var first = { score: 0, length: 0 };
    var spaceIndents = 0;
    for (var i = 1; i < 12; i++) {
        var score = getScore(i);
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

    if (first.score && first.score > 1.4)
        var tabLength = first.length;

    if (tabIndents > spaceIndents + 1)
        return { ch: "\t", length: tabLength };

    if (spaceIndents > tabIndents + 1)
        return { ch: " ", length: tabLength };
};

export default function detectIndentation(session: EditSession) {
    var lines: string[] = session.getLines(0, 1000);
    var indent: Indentation = $detectIndentation(lines) || {};

    if (indent.ch)
        session.setUseSoftTabs(indent.ch === " ");

    if (indent.length)
        session.setTabSize(indent.length);
    return indent;
}
