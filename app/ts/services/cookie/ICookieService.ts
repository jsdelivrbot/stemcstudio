/**
 * 
 */
export interface ICookieService {
    getItem(name: string): string | null;
    hasItem(name: string): boolean;
    removeItem(name: string): void;
    setItem(name: string, value: string, end?: Number | String | Date, path?: string, domain?: string, secure?: string): void;
}

/**
 * The registration token for AngularJS.
 */
export const COOKIE_SERVICE_UUID = 'cookieService';

