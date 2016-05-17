/**
 * This is the schema for the package.json file.
 */
interface IDoodleConfig {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies: { [key: string]: string };
  operatorOverloading: boolean;
  keywords: string[];
}

export default IDoodleConfig;
