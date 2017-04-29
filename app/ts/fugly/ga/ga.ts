/**
 * This is hard-coded in views/layout.pug so we don't get much choice.
 */
const NAMESPACE_GOOGLE_ANALYTICS = 'ga';

/**
 * This is how we register our service.
 */
export const GOOGLE_ANALYTICS_UUID = 'Google Analytics';

export function googleUniversalAnalyticsFactory() {
    // FIXME: Might be better here to get an interface. 
    const service = function googleAnalyticsService(this: any) {
        if (Array.isArray(arguments[0])) {
            for (let i = 0; i < arguments.length; ++i) {
                service.apply(this, arguments[i]);
            }
            return;
        }
        if (window[NAMESPACE_GOOGLE_ANALYTICS]) {
            // TS2339: Property 'apply' does not exist on type 'Window'.
            window[NAMESPACE_GOOGLE_ANALYTICS]['apply'](this, arguments);
        }
    };
    return service;
}
