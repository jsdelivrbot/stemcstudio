/**
 *
 */
export class StringSet {
  // The value isn't really important.
  private data: { [key: string]: boolean } = {};

  constructor() {
    // Do nothing.
  }

  add(member: string): void {
    this.data[member] = true;
  }

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
