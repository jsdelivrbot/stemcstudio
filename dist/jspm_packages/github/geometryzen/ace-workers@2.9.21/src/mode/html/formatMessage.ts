export function formatMessage(format: string, args: { [name: string]: string }) {
    return format.replace(new RegExp('{[0-9a-z-]+}', 'gi'), function (match: string) {
        return args[match.slice(1, -1)] || match;
    });
}
