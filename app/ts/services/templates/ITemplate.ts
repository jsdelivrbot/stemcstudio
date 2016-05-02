import ITemplateFile from './ITemplateFile';

interface ITemplate {
    description: string;
    files: { [name: string]: ITemplateFile };
    dependencies: string[];
    operatorOverloading: boolean;
}

export default ITemplate;
