/**
 *
 */
interface TextSpan {

    /**
     *
     */
    start: number;

    /**
     *
     */
    length: number;
}

/**
 * Computes the end of the span as start + length.
 * This means that the end is the character after the last character.
 */
export function textSpanEnd(span: TextSpan) {
    return span.start + span.length;
}

export default TextSpan;
