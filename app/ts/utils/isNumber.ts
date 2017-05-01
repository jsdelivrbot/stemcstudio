export default function isNumber(arg: any): arg is number {
    return typeof arg === 'number';
}
