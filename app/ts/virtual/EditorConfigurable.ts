export interface EditorConfigurable {
    getReadOnly(): boolean;

    getTabSize(): number;
    setTabSize(tabSize: number): void;

    getUseSoftTabs(): boolean;
    setUseSoftTabs(useSoftTabs: boolean): void;
}
