/**
 * The format of the error or warning defined by JSHint.
 * The properties have been empirically determined and may need to be refined.
 */
export interface JSHintError {
  name?: 'JSHintError';
  id?: '(error)';
  line: number;
  /**
   * This description?
   */
  raw: string;
  /**
   * The 4-digit error code.
   */
  code: string;
  evidence?: string;
  message?: string;
  character: number;
  scope?: string;
  reason?: string;
  a?: number | string;
  b?: number | string;
  c?: number | string;
  d?: number | string;
}
