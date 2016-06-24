import DebugNodeEventHandler from './DebugNodeEventHandler'
import DefaultNodeEventHandler from './DefaultNodeEventHandler'
import Declaration from './Declaration'

export default class ProgramArgs extends DefaultNodeEventHandler {
  public attributes: Declaration[] = [];
  public constants: Declaration[] = [];
  public uniforms: Declaration[] = [];
  public varyings: Declaration[] = [];
  constructor() {
    super();
  }
  declaration(kind: string, modifiers: string[], type: string, names: string[]) {
    let targets: { [kind: string]: Declaration[] } = {};
    targets['attribute'] = this.attributes;
    targets['const']     = this.constants;
    targets['uniform']   = this.uniforms;
    targets['varying']   = this.varyings;
    let target = targets[kind];
    if (target) {
      names.forEach(function(name) {
          target.push(new Declaration(kind, modifiers, type, name));
      });
    }
    else {
      throw new Error("Unexpected declaration kind: " + kind);
    }
  }
}
