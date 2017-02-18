import app from '../../app';
import CookieService from './CookieService';

app.factory('cookie', [
    function (): CookieService {
        return {
            getItem: function (name: string): string {
                const escapedName = encodeURI(name).replace(/[\-\.\+\*]/g, "\\$&");
                return decodeURI(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + escapedName + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
            },
            setItem: function (name: string, value: string, end?, path?, domain?, secure?): void {
                let expires: string;
                if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) {
                    throw new Error("Illegal name");
                }
                if (end) {
                    switch (end.constructor) {
                        case Number:
                            expires = end === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + end;
                            break;
                        case String:
                            expires = "; expires=" + end;
                            break;
                        case Date:
                            expires = "; expires=" + end.toGMTString();
                            break;
                        default:
                            expires = "";
                    }
                } else {
                    expires = "";
                }
                domain = domain ? "; domain=" + domain : "";
                path = path ? "; path=" + path : "";
                secure = secure ? "; secure" : "";
                const cookie = "" + (encodeURI(name)) + "=" + (encodeURI(value)) + expires + domain + path + secure;
                document.cookie = cookie;
            },
            removeItem: function (name: string, path?) {
                if (!name || !this.hasItem(name)) {
                    return false;
                }
                return this.setItem(name, "", new Date(0), path);
            },
            hasItem: function (name: string): boolean {
                return (new RegExp("(?:^|;\\s*)" + encodeURI(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
            }
        };
    }
]);
