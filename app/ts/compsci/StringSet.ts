export default class StringSet {
    // The value isn't really important.
    private data: { [key: string]: boolean } = {};
    constructor() {

    }
    add(member: string) {
        this.data[member] = true;
    }
    size(): number {
        var count = 0;
        for (var member in this.data) {
            count++;
        }
        return count;
    }
    each(callback: (member: string) => void) {
        for (var member in this.data) {
            callback(member);
        }
    }
    toArray(): string[] {
        var members: string[] = [];
        for (var member in this.data) {
            members.push(member);
        }
        return members;
    }
}