/**
 * @class OutputFile
 */
interface OutputFile {

    /**
     * @property name
     * @type string
     */
    name: string;

    /**
     * @property writeByteOrderMark
     * @type boolean
     */
    writeByteOrderMark: boolean;

    /**
     * @property text
     * @type string
     */
    text: string;
}

export default OutputFile;
