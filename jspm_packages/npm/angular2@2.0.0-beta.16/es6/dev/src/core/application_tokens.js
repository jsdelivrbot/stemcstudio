/* */ 
"format esm";
import { OpaqueToken, Provider } from 'angular2/src/core/di';
import { CONST_EXPR, Math, StringWrapper } from 'angular2/src/facade/lang';
/**
 * A DI Token representing a unique string id assigned to the application by Angular and used
 * primarily for prefixing application attributes and CSS styles when
 * {@link ViewEncapsulation#Emulated} is being used.
 *
 * If you need to avoid randomly generated value to be used as an application id, you can provide
 * a custom value via a DI provider <!-- TODO: provider --> configuring the root {@link Injector}
 * using this token.
 */
export const APP_ID = CONST_EXPR(new OpaqueToken('AppId'));
function _appIdRandomProviderFactory() {
    return `${_randomChar()}${_randomChar()}${_randomChar()}`;
}
/**
 * Providers that will generate a random APP_ID_TOKEN.
 */
export const APP_ID_RANDOM_PROVIDER = CONST_EXPR(new Provider(APP_ID, { useFactory: _appIdRandomProviderFactory, deps: [] }));
function _randomChar() {
    return StringWrapper.fromCharCode(97 + Math.floor(Math.random() * 25));
}
/**
 * A function that will be executed when a platform is initialized.
 */
export const PLATFORM_INITIALIZER = CONST_EXPR(new OpaqueToken("Platform Initializer"));
/**
 * A function that will be executed when an application is initialized.
 */
export const APP_INITIALIZER = CONST_EXPR(new OpaqueToken("Application Initializer"));
/**
 * A token which indicates the root directory of the application
 */
export const PACKAGE_ROOT_URL = CONST_EXPR(new OpaqueToken("Application Packages Root URL"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fdG9rZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC05RDFpR1FWRy50bXAvYW5ndWxhcjIvc3JjL2NvcmUvYXBwbGljYXRpb25fdG9rZW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsV0FBVyxFQUFFLFFBQVEsRUFBQyxNQUFNLHNCQUFzQjtPQUNuRCxFQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFDLE1BQU0sMEJBQTBCO0FBRXhFOzs7Ozs7OztHQVFHO0FBQ0gsT0FBTyxNQUFNLE1BQU0sR0FBZ0IsVUFBVSxDQUFDLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFFeEU7SUFDRSxNQUFNLENBQUMsR0FBRyxXQUFXLEVBQUUsR0FBRyxXQUFXLEVBQUUsR0FBRyxXQUFXLEVBQUUsRUFBRSxDQUFDO0FBQzVELENBQUM7QUFFRDs7R0FFRztBQUNILE9BQU8sTUFBTSxzQkFBc0IsR0FDL0IsVUFBVSxDQUFDLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFDLFVBQVUsRUFBRSwyQkFBMkIsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDO0FBRTFGO0lBQ0UsTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekUsQ0FBQztBQUVEOztHQUVHO0FBQ0gsT0FBTyxNQUFNLG9CQUFvQixHQUM3QixVQUFVLENBQUMsSUFBSSxXQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0FBRXhEOztHQUVHO0FBQ0gsT0FBTyxNQUFNLGVBQWUsR0FBZ0IsVUFBVSxDQUFDLElBQUksV0FBVyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQztBQUVuRzs7R0FFRztBQUNILE9BQU8sTUFBTSxnQkFBZ0IsR0FDekIsVUFBVSxDQUFDLElBQUksV0FBVyxDQUFDLCtCQUErQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7T3BhcXVlVG9rZW4sIFByb3ZpZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge0NPTlNUX0VYUFIsIE1hdGgsIFN0cmluZ1dyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbi8qKlxuICogQSBESSBUb2tlbiByZXByZXNlbnRpbmcgYSB1bmlxdWUgc3RyaW5nIGlkIGFzc2lnbmVkIHRvIHRoZSBhcHBsaWNhdGlvbiBieSBBbmd1bGFyIGFuZCB1c2VkXG4gKiBwcmltYXJpbHkgZm9yIHByZWZpeGluZyBhcHBsaWNhdGlvbiBhdHRyaWJ1dGVzIGFuZCBDU1Mgc3R5bGVzIHdoZW5cbiAqIHtAbGluayBWaWV3RW5jYXBzdWxhdGlvbiNFbXVsYXRlZH0gaXMgYmVpbmcgdXNlZC5cbiAqXG4gKiBJZiB5b3UgbmVlZCB0byBhdm9pZCByYW5kb21seSBnZW5lcmF0ZWQgdmFsdWUgdG8gYmUgdXNlZCBhcyBhbiBhcHBsaWNhdGlvbiBpZCwgeW91IGNhbiBwcm92aWRlXG4gKiBhIGN1c3RvbSB2YWx1ZSB2aWEgYSBESSBwcm92aWRlciA8IS0tIFRPRE86IHByb3ZpZGVyIC0tPiBjb25maWd1cmluZyB0aGUgcm9vdCB7QGxpbmsgSW5qZWN0b3J9XG4gKiB1c2luZyB0aGlzIHRva2VuLlxuICovXG5leHBvcnQgY29uc3QgQVBQX0lEOiBPcGFxdWVUb2tlbiA9IENPTlNUX0VYUFIobmV3IE9wYXF1ZVRva2VuKCdBcHBJZCcpKTtcblxuZnVuY3Rpb24gX2FwcElkUmFuZG9tUHJvdmlkZXJGYWN0b3J5KCkge1xuICByZXR1cm4gYCR7X3JhbmRvbUNoYXIoKX0ke19yYW5kb21DaGFyKCl9JHtfcmFuZG9tQ2hhcigpfWA7XG59XG5cbi8qKlxuICogUHJvdmlkZXJzIHRoYXQgd2lsbCBnZW5lcmF0ZSBhIHJhbmRvbSBBUFBfSURfVE9LRU4uXG4gKi9cbmV4cG9ydCBjb25zdCBBUFBfSURfUkFORE9NX1BST1ZJREVSOiBQcm92aWRlciA9XG4gICAgQ09OU1RfRVhQUihuZXcgUHJvdmlkZXIoQVBQX0lELCB7dXNlRmFjdG9yeTogX2FwcElkUmFuZG9tUHJvdmlkZXJGYWN0b3J5LCBkZXBzOiBbXX0pKTtcblxuZnVuY3Rpb24gX3JhbmRvbUNoYXIoKTogc3RyaW5nIHtcbiAgcmV0dXJuIFN0cmluZ1dyYXBwZXIuZnJvbUNoYXJDb2RlKDk3ICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjUpKTtcbn1cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCB3aGVuIGEgcGxhdGZvcm0gaXMgaW5pdGlhbGl6ZWQuXG4gKi9cbmV4cG9ydCBjb25zdCBQTEFURk9STV9JTklUSUFMSVpFUjogT3BhcXVlVG9rZW4gPVxuICAgIENPTlNUX0VYUFIobmV3IE9wYXF1ZVRva2VuKFwiUGxhdGZvcm0gSW5pdGlhbGl6ZXJcIikpO1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHdoZW4gYW4gYXBwbGljYXRpb24gaXMgaW5pdGlhbGl6ZWQuXG4gKi9cbmV4cG9ydCBjb25zdCBBUFBfSU5JVElBTElaRVI6IE9wYXF1ZVRva2VuID0gQ09OU1RfRVhQUihuZXcgT3BhcXVlVG9rZW4oXCJBcHBsaWNhdGlvbiBJbml0aWFsaXplclwiKSk7XG5cbi8qKlxuICogQSB0b2tlbiB3aGljaCBpbmRpY2F0ZXMgdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoZSBhcHBsaWNhdGlvblxuICovXG5leHBvcnQgY29uc3QgUEFDS0FHRV9ST09UX1VSTDogT3BhcXVlVG9rZW4gPVxuICAgIENPTlNUX0VYUFIobmV3IE9wYXF1ZVRva2VuKFwiQXBwbGljYXRpb24gUGFja2FnZXMgUm9vdCBVUkxcIikpO1xuIl19