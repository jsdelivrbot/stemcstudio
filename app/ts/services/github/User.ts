/**
 * @class User
 */
export default class User {
    public name: string;
    public login: string;
    public avatar_url: string;
    constructor(name: string, login: string, avatar_url: string) {
        this.name = name;
        this.login = login;
        this.avatar_url = avatar_url;
    }
}
