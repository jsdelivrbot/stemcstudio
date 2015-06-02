interface IOption {
  name: string;
  version: string;
  visible: boolean;
  js: string;
  dts: string;
  dependencies: { [name: string]: string };
}