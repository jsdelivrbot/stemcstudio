import Doodle from '../services/doodles/Doodle';

export default function(doodle: Doodle): Doodle {
    return doodle;
}
/*
console.log(JSON.stringify(doodle, null, 2))
if (!doodle.files) {
    console.log("Converting...")
    doodle.files = {}
    doodle.files[FILENAME_HTML].content = doodle['html']
    delete doodle['html']
    doodle.files[FILENAME_CODE].content = doodle['code']
    delete doodle['code']
    doodle.files[FILENAME_LIBS].content = doodle['libs']
    delete doodle['libs']
    doodle.files[FILENAME_LESS].content = doodle['less']
    delete doodle['less']
}
console.log("Tweaking HTML...")
if (doodle.files[FILENAME_HTML]) {
    console.log(`Tweaking FILENAME_HTML... ${typeof doodle.files[FILENAME_HTML]}`)
    if (typeof doodle.files[FILENAME_HTML].content !== 'string') {
        doodle.files[FILENAME_HTML].content = "";
    }
}
else {
    console.log("Adding FILENAME_HTML...")
    doodle.files[FILENAME_HTML] = { content: "", language: "HTML" };
}
console.log("Tweaking CODE...")
if (typeof doodle.files[FILENAME_CODE].content !== 'string') {
    doodle.files[FILENAME_CODE].content = "";
}
console.log("Tweaking LIBS...")
if (typeof doodle.files[FILENAME_LIBS].content !== 'string') {
    doodle.files[FILENAME_LIBS].content = "";
}
console.log("Tweaking LESS...")
if (typeof doodle.files[FILENAME_LESS].content !== 'string') {
    doodle.files[FILENAME_LESS].content = "";
}
*/
