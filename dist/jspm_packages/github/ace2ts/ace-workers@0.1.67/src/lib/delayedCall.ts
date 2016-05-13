import DelayedFunctionCall from "./DelayedFunctionCall";

//
// This function creates a function with additional properties.
//
export default function delayedCall(fcn: () => any, defaultTimeout?: number): DelayedFunctionCall {

  var timer: number = null;

  /**
   * We generally don't call the callback directly.
   * This function has the side-effect of resetting the timer.
   */
  var callbackWrapper = function() {
    timer = null;
    fcn();
  };

  // The pattern being used here is the Named+Stacked Object Literal.
  var _self = <DelayedFunctionCall>function(timeout: number): void {
    if (timer === null) {
      timer = setTimeout(callbackWrapper, timeout || defaultTimeout);
    }
  };

  _self.delay = function(timeout: number): void {
    // TODO: DRY. This is just the same as cancel followed by schedule.
    // Chaining would allow us to narrow down the API?
    // _self.cancel();
    // _self.schedule(timeout);
    timer && clearTimeout(timer);
    timer = setTimeout(callbackWrapper, timeout || defaultTimeout);
  };

  _self.schedule = _self;

  _self.call = function() {
    _self.cancel();
    fcn();
  };

  _self.cancel = function(): void {
    timer && clearTimeout(timer);
    timer = null;
  };

  _self.isPending = function(): boolean {
    return timer !== null;
  };

  return _self;
}