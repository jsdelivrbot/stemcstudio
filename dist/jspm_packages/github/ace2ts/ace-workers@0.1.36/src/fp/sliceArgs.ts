export default function sliceArgs(args: IArguments, start = 0, end = args.length): any[] {
    var sliced = [];
    for (var i = start; i < end; i++) {
        sliced.push(args[i])
    }
    return sliced;
}