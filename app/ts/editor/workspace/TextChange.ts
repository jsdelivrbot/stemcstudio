import { TextSpan } from './TextSpan';

/**
 *
 */
export interface TextChange<POSITION> {

    /**
     *
     */
    span: TextSpan<POSITION>;

    /**
     *
     */
    newText: string;
}
