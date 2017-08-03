import Edit from './Edit';

export interface Message {
    edits: Edit[];
    collabShadowVersion: number;
}
