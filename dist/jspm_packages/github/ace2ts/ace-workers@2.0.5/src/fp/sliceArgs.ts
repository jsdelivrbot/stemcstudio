export default function sliceArgs(args: IArguments, start = 0, end = args.length): any[] {
    const sliced = [];
    for (let i = start; i < end; i++) {
        sliced.push(args[i]);
    }
    return sliced;
}
