/**
 * The annotation type determines the graphic used in the gutter.
 */
export type AnnotationType = 'info' | 'warning' | 'error';

/**
 * 
 */
export interface Annotation {

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
    type: AnnotationType;
}
