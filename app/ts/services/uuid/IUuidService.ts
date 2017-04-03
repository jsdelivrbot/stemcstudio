export interface IUuidService {
    generate(): string;
    validate(uuid: string): boolean;
}

export const UUID_SERVICE_UUID = 'uuidService';
