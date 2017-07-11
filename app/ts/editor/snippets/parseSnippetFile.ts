import { Snippet } from '../Snippet';
/**
 * Note: The format of the string is critical (tabs, newlines, etc).
 */
export function parseSnippetFile(str: string): Snippet[] {

    str = str.replace(/\r/g, "");

    const list: Snippet[] = [];

    let snippet: Snippet = { content: void 0 };

    // Group 1 is like { \s \S }
    // Group 2 is like \S
    // Group 3 is like .
    // Group 4 is like \n \t .
    const re: RegExp = /^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;

    let m: RegExpExecArray | null;

    while (m = re.exec(str)) {

        if (m[1]) {
            try {
                snippet = JSON.parse(m[1]);
                list.push(snippet);
            }
            catch (e) {
                // Ignore.
            }
        }
        if (m[4]) {
            snippet.content = m[4].replace(/^\t/gm, "");
            list.push(snippet);
            snippet = { content: void 0 };
        }
        else {
            const key: string = m[2];
            const val: string = m[3];
            if (typeof key === 'string') {
                if (key === "regex") {
                    const guardRe = /\/((?:[^\/\\]|\\.)*)|$/g;
                    snippet.guard = (guardRe.exec(val) as RegExpExecArray)[1];
                    snippet.trigger = (guardRe.exec(val) as RegExpExecArray)[1];
                    snippet.endTrigger = (guardRe.exec(val) as RegExpExecArray)[1];
                    snippet.endGuard = (guardRe.exec(val) as RegExpExecArray)[1];
                }
                else if (key === "snippet") {
                    snippet.tabTrigger = (val.match(/^\S*/) as RegExpExecArray)[0];
                    if (!snippet.name) {
                        snippet.name = val;
                    }
                }
                else {
                    snippet[key] = val;
                }
            }
            else {
                // key is undefined.
            }
        }
    }
    return list;
}

export default parseSnippetFile;
