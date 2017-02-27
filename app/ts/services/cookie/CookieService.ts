interface CookieService {
    getItem(name: string): string | null;
    hasItem(name: string): boolean;
    removeItem(name: string): void;
    setItem(name: string, value: string, end?: Number | String | Date, path?: string, domain?: string, secure?: string): void;
}

export default CookieService;
