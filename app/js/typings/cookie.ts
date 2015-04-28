interface ICookieService {
  getItem(name: string): string;
  hasItem(name: string): boolean;
  removeItem(name: string);
}