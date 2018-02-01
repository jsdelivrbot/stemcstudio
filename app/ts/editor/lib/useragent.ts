/*
 * I hate doing this, but we need some way to determine if the user is on a Mac
 * The reason is that users have different expectations of their key combinations.
 *
 * Take copy as an example, Mac people expect to use CMD or APPLE + C
 * Windows folks expect to use CTRL + C
 */
export const OS = {
  LINUX: "LINUX",
  MAC: "MAC",
  WINDOWS: "WINDOWS"
};

// this can be called in non browser environments (e.g. from ace/requirejs/text)
// if (typeof navigator != "object") {
//   return;
// }

const os = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
const ua = navigator.userAgent;

// Is the user using a browser that identifies itself as Windows
export const isWin = (os === "win");

// Is the user using a browser that identifies itself as Mac OS
export const isMac = (os === "mac");

// Is the user using a browser that identifies itself as Linux
export const isLinux = (os === "linux");

/**
 * Return an exports.OS constant
 */
export function getOS() {
  if (isMac) {
    return OS.MAC;
  }
  else if (isLinux) {
    return OS.LINUX;
  }
  else {
    return OS.WINDOWS;
  }
}

// Windows Store JavaScript apps (aka Metro apps written in HTML5 and JavaScript) do not use the "Microsoft Internet Explorer" string in their user agent, but "MSAppHost" instead.
export const isIE =
  (navigator.appName === "Microsoft Internet Explorer" || navigator.appName.indexOf("MSAppHost") >= 0)
    ? parseFloat((ua.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[1])
    : parseFloat((ua.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[1]); // for ie

// Is this Firefox or related?
// The cast to any is required to stop the TypeScript compiler from being too smart, concluding that the last window reference has the never type.
export const isGecko = (('Controllers' in window) || ('controllers' in window as any)) && window.navigator.product === "Gecko";
/**
 * Mozilla
 */
export const isMozilla = isGecko;

// oldGecko == rev < 2.0 
export const isOldGecko = isGecko && parseInt((ua.match(/rv\:(\d+)/) || [])[1], 10) < 4;

// Is this Opera 
export const isOpera = ('opera' in window) && Object.prototype.toString.call(window['opera']) === "[object Opera]";

// Is the user using a browser that identifies itself as WebKit 
export const isWebKit = parseFloat(ua.split("WebKit/")[1]) || undefined;

export const isChrome = parseFloat(ua.split(" Chrome/")[1]) || undefined;

export const isChromeOS = ua.indexOf(" CrOS ") >= 0;

export const isAIR = ua.indexOf("AdobeAIR") >= 0;

export const isAndroid = ua.indexOf("Android") >= 0;

export const isIPad = ua.indexOf("iPad") >= 0;

export const isTouchPad = ua.indexOf("TouchPad") >= 0;

export const isMobile = isAndroid || isIPad || isTouchPad;
