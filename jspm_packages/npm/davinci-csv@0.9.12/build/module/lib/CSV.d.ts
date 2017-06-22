import { CSVError } from './CSVError';
/**
 * A field in a comma-separated file is either a number, a string, or null.
 */
export declare type Field = number | string | null;
/**
 * A format for relational data.
 */
export interface Data {
    fields: {
        id: string;
    }[];
    records: {
        [fieldId: string]: Field;
    }[];
}
/**
 * Options used for customizing parsing and serialization.
 */
export interface Dialect {
    /**
     * Specifies the delimiter between fields.
     * Default is the comma, </code>','</code>.
     * Used for parsing and serialization.
     */
    fieldDelimiter?: ',' | ';';
    /**
     * Determines whether embedded quotation marks in strings are escaped during <em>serialization</em> by doubling them.
     * Default is <code>true</code>.
     */
    escapeEmbeddedQuotes?: boolean;
    /**
     * Specifies the character used to terminate a line.
     * Default is a single newline character, <code>'\n'</code>.
     * Used for parsing and serialization.
     */
    lineTerminator?: '\n' | '\r' | '\r\n';
    /**
     * The character used for quoting string fields.
     * Default is the double quote, <code>'"'</code>.
     * Used for parsing and serialization.
     */
    quoteChar?: '"' | "'";
    /**
     * Skips the specified number of initial rows during <em>parsing</em>.
     * Default is zero, <code>0</code>.
     */
    skipInitialRows?: number;
    /**
     * Determines whether fields are trimmed during <em>parsing</em>.
     * Default is <code>true</code>.
     */
    trimFields?: boolean;
}
/**
 * Converts from the fields and records structure to an array of arrays.
 * The first row in the output contains the field names in the same order as the input.
 */
export declare function dataToArrays(data: Data): Field[][];
/**
 * Converts from structured data to a string in CSV format of the specified dialect.
 */
export declare function serialize(data: Data | Field[][], dialect?: Dialect): string;
/**
 * Parses a string representation of CSV data into an array of arrays of fields.
 * The dialect may be specified to improve the parsing.
 */
export declare function parse(csvText: string, dialect?: Dialect, errors?: CSVError[]): Field[][];
