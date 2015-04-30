interface IOutputFile {
  name: string;
  writeByteOrderMark: boolean;
  text: string;
  sourceMapEntries: any[];
}
