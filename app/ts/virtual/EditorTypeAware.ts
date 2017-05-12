import { EditorMinimal } from './EditorMinimal';
import { Observable } from 'rxjs/Observable';
import { Position } from './editor';

export interface EditorTypeAware extends EditorMinimal {
    gotoDefinitionEvents: Observable<Position>;
    gotoDefinition(): void;
    isGotoDefinitionAvailable(): boolean;
}
