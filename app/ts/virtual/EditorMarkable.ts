import { MarkerRange, MarkerType, MarkerRenderer } from './editor';

export interface EditorMarkable {
    addMarker(range: MarkerRange, clazz: 'ace_active-line' | 'ace_bracket' | 'ace_selection' | 'ace_snippet-marker', type: MarkerType, renderer?: MarkerRenderer | null, inFront?: boolean): number;
    removeMarker(markerId: number): void;
}
