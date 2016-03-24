export default class Repo {
  name: string;
  description: string;
  language: string;
  html_url: string;
  constructor(name, description, language, html_url) {
    this.name = name;
    this.description = description;
    this.language = language;
    this.html_url = html_url;
  }
}
