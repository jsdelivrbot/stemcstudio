import { ICookieService } from './ICookieService';
import { Injectable } from '@angular/core';

@Injectable()
export class CookieService implements ICookieService {
    getItem(name: string): string | null {
        const escapedName = encodeURI(name).replace(/[\-\.\+\*]/g, "\\$&");
        return decodeURI(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + escapedName + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    }
    hasItem(name: string): boolean {
        return (new RegExp("(?:^|;\\s*)" + encodeURI(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }
    removeItem(name: string, path?: string): void {
        if (!name || !this.hasItem(name)) {
            return;
        }
        this.setItem(name, "", new Date(0), path);
    }
    setItem(name: string, value: string, end?: String | Number | Date, path?: string, domain?: string, secure?: string): void {
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
                    expires = "; expires=" + (<Date>end).toUTCString();
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
    }
}
