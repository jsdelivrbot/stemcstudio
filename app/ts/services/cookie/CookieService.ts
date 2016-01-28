interface CookieService {
    getItem(name: string): string;
    hasItem(name: string): boolean;
    removeItem(name: string);
    setItem(name: string, value: string, end?, path?, domain?, secure?): void;
}

export default CookieService;
