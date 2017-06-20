const ID_REGEX = /[a-zA-Z_0-9\$\-\u00A2-\uFFFF]/;

export function retrievePrecedingIdentifier(text: string, pos: number, regex?: RegExp): string {
    regex = regex || ID_REGEX;
    const buf: string[] = [];
    for (let i = pos - 1; i >= 0; i--) {
        if (regex.test(text[i]))
            buf.push(text[i]);
        else
            break;
    }
    return buf.reverse().join("");
}
