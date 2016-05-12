/**
 * @class StringSet
 */
export default class StringSet {
  // The value isn't really important.
  private data: { [key: string]: boolean } = {};

  /**
   * @class StringSet
   * @constructor
   */
  constructor() {
    // Do nothing.
  }

  /**
   * @method add
   * @param member {string}
   * @return {void}
   */
  add(member: string): void {
    this.data[member] = true;
  }

  /**
   * @method size
   * @return {number}
   */
  size(): number {
    return Object.keys(this.data).length;
  }

  each(callback: (member: string) => void) {
    for (let member in this.data) {
      if (this.data.hasOwnProperty(member)) {
        callback(member);
      }
    }
  }

  toArray(): string[] {
    const members: string[] = [];
    for (let member in this.data) {
      if (this.data.hasOwnProperty(member)) {
        members.push(member);
      }
    }
    return members;
  }
}
