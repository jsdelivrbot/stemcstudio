/**
 * Return a random id that's 8 letters long.
 * Given that we use only 26 lowercase letters, 10 numeric digits, '-', '_', ':', and '.', that gives
 * 26*(26+10+4)^7 = 4,259,840,000,000 combinations.
 * What's the probability of a collision? :)
 */
export function uniqueId(): string {
    // IE is case insensitive (in violation of the W3 spec).
    let soup = 'abcdefghijklmnopqrstuvwxyz';
    // First character must be a letter.
    let id = soup.charAt(Math.random() * soup.length);
    // Subsequent characters may include these.
    soup += '0123456789-_:.';
    for (let x = 1; x < 8; x++) {
        id += soup.charAt(Math.random() * soup.length);
    }
    // Don't allow IDs with '--' in them since it might close a comment.
    if (id.indexOf('--') !== -1) {
        id = uniqueId();
    }
    return id;
    // Getting the maximum possible density in the ID is worth the extra code,
    // since the ID is transmitted to the server a lot.
}
