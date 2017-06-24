/**
 * Used by the language workers to push back annotations to an editor.
 * The following languages work standalone.....: GLSL, HTML,JSON.
 * The following languages use the workspace...: TypeScript
 * The following languages will transition.....: JavaScript, Python (Typhon)
 */
export interface Annotation {

    /**
     * This does not appear to be used.
     */
    className?: string;

    /**
     * This does not appear to be used.
     */
    html?: string;

    /**
     * A zero-based row indicating where to display the annotation.
     * When the cursor is in the top left corner, the row is 0.
     */
    row: number;

    /**
     * A zero-based column indicating where to display the annotation.
     * When the cursor is in the top left corner, the column is 0.
     */
    column?: number;

    /**
     * FIXME: If this were a string[] we would have consistency with the Gutter?
     */
    text: string;

    /**
     * "error", "info", or "warning".
     * Determines the icon used in the gutter to display the annotation.
     */
    type: 'error' | 'info' | 'warning';
}
