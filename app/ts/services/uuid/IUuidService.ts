interface IUuidService {
    generate(): string;
    validate(uuid: string): boolean;
}

export default IUuidService;
