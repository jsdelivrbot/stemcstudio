export default function mixin(obj, base) {
    for (const key in base) {
        if (base.hasOwnProperty(key)) {
            obj[key] = base[key];
        }
    }
    return obj;
}
