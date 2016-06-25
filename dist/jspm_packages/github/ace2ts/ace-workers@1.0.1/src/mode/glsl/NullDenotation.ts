import Symbol from './Symbol'

/**
 * A nud does not care about tokens to the left.
 */
interface NullDenotation {
    (): Symbol
}

export default NullDenotation
