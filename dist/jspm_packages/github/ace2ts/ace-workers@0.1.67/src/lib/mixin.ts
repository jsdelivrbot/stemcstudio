export default function mixin(obj, base) {
    for (var key in base) {
        obj[key] = base[key];
    }
    return obj;
}
