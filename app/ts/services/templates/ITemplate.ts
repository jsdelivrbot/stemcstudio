import ITemplateFile from './ITemplateFile';

interface ITemplate {
    name: string;
    description: string;
    files: { [path: string]: ITemplateFile };
    dependencies: string[];
    operatorOverloading: boolean;
}

export default ITemplate;
