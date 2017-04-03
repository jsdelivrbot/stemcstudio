/**
 * 
 */
export interface IBase64Service {
    encode(input: string): string;
    decode(input: string): string;
}

/**
 * The registration token for AngularJS.
 */
export const BASE64_SERVICE_UUID = 'base64Service';
