import GistFile from './GistFile';

export default class Gist {
    id: string;
    description: string;
    files: { [name: string]: GistFile };
    html_url: string;
    constructor(id: string, description: string, isPublic: boolean, files: { [name: string]: GistFile }, html_url: string) {
        this.id = id;
        this.description = description;
        this["public"] = isPublic;
        this.files = files;
        this.html_url = html_url;
    }
}
