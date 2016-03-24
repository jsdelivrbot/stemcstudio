interface IDoodleConfig {
  uuid: string;
  description?: string;
  dependencies: { [key: string]: string };
  operatorOverloading: boolean;
}

export default IDoodleConfig;
