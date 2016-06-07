export default function isLegalW3cIdentifier(fileId: string): boolean {
    return !!fileId.match(/^[A-Za-z][-.:\w]*$/);
}
