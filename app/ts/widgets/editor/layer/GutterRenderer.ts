import EditSession from '../EditSession';
import GutterConfig from './GutterConfig';

interface GutterRenderer {
    getText(session: EditSession, row: number): string;
    getWidth(session: EditSession, row: number, config: GutterConfig): number;
}

export default GutterRenderer;
