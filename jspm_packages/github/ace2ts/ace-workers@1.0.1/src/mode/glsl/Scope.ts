import Node from './Node';
import State from './State';
//import Symbol from  './Symbol';

export default class Scope {
    private state: State;
    private scopes: { [name: string]: State }[];
    private current: { [name: string]: State };
    constructor(state: State) {
        this.state = state
        this.scopes = []
        this.current = null
    }
    enter(s?: any) {
        this.scopes.push(this.current = this.state[0].scope = s || {})
    }
    exit() {
        this.scopes.pop()
        this.current = this.scopes[this.scopes.length - 1]
    }
    define(str: string) {
        this.current[str] = this.state[0]
    }
    find(name: string, fail?: any): State {
        for (var i = this.scopes.length - 1; i > -1; --i) {
            if (this.scopes[i].hasOwnProperty(name)) {
                return this.scopes[i][name]
            }
        }
        return null
    }
}
