interface Shareable {
    addRef(): number;
    release(): number;
}

export default Shareable;
