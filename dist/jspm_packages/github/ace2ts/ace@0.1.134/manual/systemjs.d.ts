interface Module {
  name: string;
  address: string;
  source?: string;
  metadata?: any;
}

interface ImportedModule {
  default?: any;
}

interface Export {
  (name: string, what: any): void;
}

interface RegisterCallback {
  setters: ((m: Module) => void)[];
  execute: () => void;
}

// This looks like an extension of the Module?
// That may be a coincidence owing to the metadata. 
interface Load {
  name: string;
  deps: string[];
  depMap: { [name: string]: string };
  address: string;
  metadata?: any;
  source?: string;
  kind: string;
}

interface FetchFunction {
  (name: string, address: string, metadata: any): Promise<string>;
}

interface SystemJS {
  import(moduleName: string, normalizedParentName?: string): Promise<ImportedModule>;
  defined: any;
  defaultJSExtensions: boolean;
  amdDefine: () => void;
  amdRequire: () => void;
  baseURL: string;
  /**
   * rules used by the standard locate function.
   */
  paths: { [key: string]: string };
  meta: { [key: string]: Object };
  config: any;

  /**
   * Loader Hook: normalize.
   * Given the import name, provide the normalized name for the resource.
   * FIXME: Does this really return a promise? I think the answer is yes, but I don't know why.
   */
  normalize(name: string, parentName: string, parentAddress: string): Promise<string>;

  /**
   * Loader Hook: locate (formerly resolve).
   * Given the normalized module name, provide the URL for the resource.
   */
  locate(load: { name: string, metadata: any }): string;

  /**
   * Loader Hook: fetch.
   * Given a URL for a resource, fetch its content.
   */
  fetch(load: { name: string; address: string; metadata: any }): Promise<string>;

  /**
   * Loader Hook: translate.
   * Given module source, make any source modifications.
   */
  translate(load: { name: string; address: string; metadata: any; source: string }): string;

  /**
   * Loader Hook: instantiate (formerly link).
   * Given module source, determine its dependencies and how to execute it.
   */
  instantiate(load: { name: string; address: string; metadata: any; source: string }): Load;

  delete(moduleName: string): void;
  /**
   *
   */
  get(moduleName: string): Module;
  has(moduleName: string): boolean;
  register(dependencies: string[], callback: ($__export: Export) => RegisterCallback): void;
  trace: boolean;
  execute: boolean;
  loads: { [moduleName: string]: Load };

  /**
   * Traceur compilation options.
   */
  traceurOptions?: TraceurOptions;

  /**
   * Babel compilation options.
   */
  babelOptions?: any;

  /**
   * TypeScript compilation options.
   */
  typescriptOptions?: any;
}

interface TraceurOptions {
  annotations: boolean,
  arrayComprehension: boolean;
  arrowFunctions: boolean;
  asyncFunctions: boolean;
  asyncGenerators: boolean;
  blockBinding: boolean;
  classes: boolean;
  commentCallback: boolean;
  computedPropertyNames: boolean;
  debug: boolean;
  debugNames: boolean;
  defaultParameters: boolean;
  destructuring: boolean;
  exponentiation: boolean;
  exportFromExtended: boolean;
  forOf: boolean;
  forOn: boolean;
  freeVariableChecker: boolean;
  generatorComprehension: boolean;
  generators: boolean;
  inputSourceMap: boolean;
  jsx: boolean;
  lowResolutionSourceMap: boolean;
  memberVariables: boolean;
  moduleName: string;
  modules: string;
  numericLiterals: boolean;
  outputLanguage: string;
  properTailCalls: boolean;
  propertyMethods: boolean;
  propertyNameShorthand: boolean;
  referrer: string;
  require: boolean;
  restParameters: boolean;
  script: boolean;
  sourceMaps: boolean;
  sourceRoot: boolean;
  spread: boolean;
  symbols: boolean;
  templateLiterals: boolean;
  types: boolean;
  unicodeEscapeSequences: boolean;
  unicodeExpressions: boolean;
  validate: boolean;
}

declare var System: SystemJS;

declare module "systemjs" {
  export = System;
}

declare var __moduleName: string;
