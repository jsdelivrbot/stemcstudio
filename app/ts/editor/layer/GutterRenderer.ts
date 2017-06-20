import { EditSession } from '../EditSession';
import { GutterConfig } from './GutterConfig';

export interface GutterRenderer {
    getText(session: EditSession, row: number): string;
    getWidth(session: EditSession, row: number, config: GutterConfig): number;
}
