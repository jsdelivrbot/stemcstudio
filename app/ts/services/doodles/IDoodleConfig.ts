/**
 * This is the schema for the package.json file.
 */
interface IDoodleConfig {
  name: string;
  version: string;
  description?: string;
  dependencies: { [key: string]: string };
  operatorOverloading: boolean;
}

export default IDoodleConfig;
