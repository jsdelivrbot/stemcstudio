import { BasicToken } from "./Token";
import Position from "./Position";
import Range from './Range';

/**
 * A Range which has been decorated with a few extra properties.
 * It's also an element in the Tabstop array.
 * TOOD: Should this be called a TabstopMarker?
 */
export interface TabstopRange extends Range {
    /**
     * Used in TabstopManager but is it dead code?
     */
    fmtString?: string;

    /**
     * 
     */
    linked: boolean;

    /**
     * When the marker is added to the session, it is identified by this number.
     * This property is set to null when the marker is removed.
     */
    markerId: number | null;

    /**
     * TODO: TabstopRange or TabstopToken?
     */
    original: TabstopRange;

    /**
     * The tabstop that this range belongs to.
     */
    tabstop: Tabstop;

    // Trying stuff...But it does not make sense.
    fmt?: string;
    type?: string;
    value?: string;
}

export const UPPERCASE_NEXT_LETTER = 'u';
export const LOWERCASE_NEXT_LETTER = 'l';
export const UPPERCASE_UNTIL_CHANGE = 'U';
export const LOWERCASE_UNTIL_CHANGE = 'L';
export const END_CHANGE_CASE = 'E';

export type ChangeCase = 'u' | 'l' | 'U' | 'L' | 'E';

/**
 * 
 */
export class ChangeCaseElement {
    constructor(public changeCase: ChangeCase, public local: boolean) {
        // Do nothing.
    }
}

export interface TmFormatToken {
    skip?: boolean | TabstopToken;
    processed?: number;
    text?: string;
    fmtString?: string;
    elseBranch?: TabstopToken;
    expectIf?: boolean;
}

export interface TmFormatPart {
    tabstopId?: number;
    start?: Position;
    end?: Position;
}

export interface TmFormat {
    guard: string;
    flag?: string;
    fmt: string;
}

export interface TabstopIndex {
    tabstopId: number;
}

export interface TabstopText {
    text: string;
}

/**
 * TODO: Something needs to be required?
 */
export interface TabstopToken extends BasicToken {
    skip?: boolean | TabstopToken;
    processed?: number;
    text?: string;
    fmtString?: string;
    elseBranch?: TabstopToken;
    expectIf?: boolean;
    tabstopId?: number;
    flag?: string;
    guard?: string;
    fmt: string;
}

/**
 * TODO; Was this "enhanced"" to be an array? Can it be simplified?
 */
export type TabstopValue = string | (string | TmFormatPart)[];

/**
 *
 */
export interface Tabstop extends Array<TabstopRange> {

    /**
     *
     */
    firstNonLinked: TabstopRange;

    /**
     *
     */
    hasLinkedRanges: boolean;

    /**
     *
     */
    value: TabstopValue;

    /**
     *
     */
    index: number;
}

export default Tabstop;
