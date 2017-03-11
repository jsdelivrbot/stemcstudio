import ITemplateFile from './ITemplateFile';

interface ITemplate {
    name: string;
    description: string;
    files: { [path: string]: ITemplateFile };
    dependencies: string[];
    noLoopCheck: boolean;
    operatorOverloading: boolean;
}

export default ITemplate;
