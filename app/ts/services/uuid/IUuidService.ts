interface IUuidService {
    generate(): string;
    vaidate(uuid: string): boolean;
}

export default IUuidService;
