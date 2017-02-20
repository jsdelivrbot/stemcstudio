const nothing = '';
const space = ' ';
const hypen = '-';

/**
 * A filter for replacing hyphens and spaces with nothing.
 */
function contiguous() {
    return function filter(input: string): string {
        if (input) {
            return input.replace(hypen, nothing).replace(space, nothing);
        }
        else {
            return input;
        }
    };
}

contiguous['$inject'] = [];

export default contiguous;
