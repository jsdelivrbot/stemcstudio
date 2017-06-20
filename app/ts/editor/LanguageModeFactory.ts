//
// Editor Abstraction Layer
//
import { LanguageMode } from '../virtual/editor';

export interface LanguageModeFactory {
    new (workerUrl: string, scriptImports: string[], options?: {}): LanguageMode;
}
