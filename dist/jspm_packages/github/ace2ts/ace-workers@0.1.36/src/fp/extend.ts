
export default function extend<T>(obj: T, x): T {
    var keys: string[] = Object.keys(x)
    for (var i = 0, iLength = keys.length; i < iLength; i++) {
        var key = keys[i];
        var prop = x[key];
        obj[key] = prop;
    }
    return obj;
}
