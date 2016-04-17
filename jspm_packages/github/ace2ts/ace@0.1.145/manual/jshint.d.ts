interface JsHint {

}

declare var jshint: JsHint;

declare module "jshint" {
  export = jshint;
}