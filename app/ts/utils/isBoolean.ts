export default function isBoolean(arg: any): arg is boolean {
    return typeof arg === 'boolean';
}
