interface ICookieService {
  getItem(name: string): string;
  hasItem(name: string): boolean;
  removeItem(name: string);
  setItem(name: string, value: string);
}