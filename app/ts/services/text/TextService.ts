import ITextService from './ITextService';

/**
 * The TypeScript compiler will transpile this class into a function of the same name.
 * We've got an easy-to-test POJsO here.
 *
 * @class TextService
 */
export default class TextService implements ITextService {
  /**
   * We don't have any dependencies right now, but this is how they would be described
   * so that the AngularJS injector can do its job.
   *
   * @property $inject
   */
  public static $inject: string[] = []

  /**
   * @class TextService
   * @constructor
   */
  constructor() {
    // Do nothing (yet).
    // Does AngularJS use the new operator when creating a service? YES
    // const isConstructor = this instanceof TextService
    // console.log(`TextService isConstructor? => ${isConstructor}`)
  }

  /**
   * @method normalizeWhitespace
   * @param str {string}
   * @return {string}
   */
  normalizeWhitespace(str: string): string {
    // Strip an initial blank whitespace caused from having text nested inside an html tag.
    const stripped = str.replace(/^\n/, '')
    if (stripped.length > 0) {
      // Find the first text with an indent and get the length of the indent.
      const firstIndentLength = new RegExp("(?:^|\n)([ \t\r]+)").exec(stripped)[1].length
      // Use the first indent length as a baseline and normalize all other lines.
      return stripped.replace(new RegExp("(^|\n)[ \t\r]{" + firstIndentLength + "}", 'g'), "$1")
    }
    else {
      return stripped;
    }
  }
}
