/**
 * 
 */
interface Annotation {

    /**
     *
     */
    className?: string;

    /**
     *
     */
    html?: string;

    /**
     *
     */
    row: number;

    /**
     *
     */
    column?: number;

    /**
     *
     */
    text: string;

    /**
     *
     */
    type: 'info' | 'warning' | 'error';
}

export default Annotation;
