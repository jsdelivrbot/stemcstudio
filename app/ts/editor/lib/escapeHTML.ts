
/**
 * Replaces [&, ", ', <] with escape sequence.
 */
export default function escapeHTML(str: string): string {
    return str.replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
};
