const nothing = ''
const space = ' '
const hypen = '-'

/**
 * A filter for replacing hyphens and spaces with nothing.
 */
function contiguous() {
    return function(input: string) {
        if (input) {
            return input.replace(hypen, nothing).replace(space, nothing)
        }
    }
}

contiguous['$inject'] = [];

export default contiguous;
