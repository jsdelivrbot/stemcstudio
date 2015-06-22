interface IUuidService {
  generate(): string;
  vaidate(uuid: string): boolean;
}