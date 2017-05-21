
/**
 * Creates a copy of a string with whitespace removed.
 */
export function stripWS(sourceString: string): string {
    return sourceString.replace("\n", "").replace("\t", "").replace("\r", "").replace(" ", "");
}
