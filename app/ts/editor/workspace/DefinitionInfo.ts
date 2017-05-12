// import { Position } from './Position';
import { TextSpan } from './TextSpan';

export interface DefinitionInfo<POSITION> {
    fileName: string;
    textSpan: TextSpan<POSITION>;
    kind: string;
    name: string;
    containerKind: string;
    containerName: string;
}
/*
export function toDefinitionAtPosition(definitionInfo: DefinitionInfo): DefintionAtPosition {

}
*/
