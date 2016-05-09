interface Link<T> {
    data: T;
    next: Link<T>;
    prev: Link<T>;
}

export default class LinkedList<T> {
    head: Link<T>;
    tail: Link<T>;
    length: number;
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = null;
    }

    push(data: T): Link<T> {
        const tail = this.tail
        const head = this.head
        const node: Link<T> = { data: data, prev: tail, next: null };
        if (tail) {
            this.tail.next = node;
        }
        this.tail = node;
        if (!head) {
            this.head = node;
        }
        this.length++;
        return node;
    }

    remove(node: Link<T>): void {
        if (node.prev) {
            node.prev.next = node.next;
        }
        else {
            this.head = node.next;
        }
        if (node.next) {
            node.next.prev = node.prev;
        }
        else {
            this.tail = node.prev;
        }
        this.length--;
    }

    forEach(cb: (data: T) => any): void {
        let head: Link<T> = { data: void 0, next: this.head, prev: void 0 };
        while ((head = head.next)) {
            cb(head.data);
        }
    }

    toArray() {
        let head: Link<T> = { data: void 0, next: this.head, prev: void 0 };
        const ret: Link<T>[] = [];
        while ((head = head.next)) {
            ret.push(head);
        }
        return ret;
    }

    removeByData(data: T): void {
        let head: Link<T> = { data: void 0, next: this.head, prev: void 0 };
        while ((head = head.next)) {
            if (head.data === data) {
                this.remove(head);
                break;
            }
        }
    }

    getByData(data: T) {
        let head: Link<T> = { data: void 0, next: this.head, prev: void 0 };
        while ((head = head.next)) {
            if (head.data === data) {
                return head;
            }
        }
    }

    clear() {
        this.head = this.tail = null;
        this.length = 0;
    }
}
