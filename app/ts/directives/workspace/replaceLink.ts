/**
 * Replaces a <link rel="stylesheet" href="${fileName}"> with a <style>css</style>
 */
export function replaceLink(text: string, fileName: string, css: string): string {
    function replacer(match: string, p1: string, p2: string, p3: string) {
        // p1 is <link rel="stylesheet" href="
        // p2 is style.css
        // p3 is ">
        return ['<style>', css, '</style>'].join('\n');
    }
    // Periods are replaced so that they are not treated as any character by the RegExp.
    const escapedFileName = fileName.replace('.', '\.');
    // Notice that after the second delimiters (apos or quot), we enter non greedy mode using ? to prevent consuming following tags.
    const searchValue = new RegExp(`(<link.*href=["'])(${escapedFileName})(["'].*?>)`, 'gi');
    return text.replace(searchValue, replacer);
}
