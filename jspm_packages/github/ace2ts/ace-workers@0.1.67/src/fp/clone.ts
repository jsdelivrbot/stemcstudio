
export default function clone<T>(x: T): T {
    var keys: string[] = Object.keys(x)
    var result: any = {};
    for (var i = 0, iLength = keys.length; i < iLength; i++) {
        var key = keys[i];
        var prop = x[key];
        result[key] = prop;
    }
    return result;
}
