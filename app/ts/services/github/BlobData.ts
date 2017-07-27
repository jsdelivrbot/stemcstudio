/**
 * The payload for a request to POST a Blob.
 */
export interface BlobData {
    /**
     * The new blob's content.
     */
    content: string;
    /**
     * The encoding used for content.
     * Currently, "utf-8" and "base64" are supported.
     * Default: "utf-8".
     */
    encoding?: string;
}
