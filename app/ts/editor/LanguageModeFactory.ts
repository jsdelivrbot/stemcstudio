import { LanguageMode } from './LanguageMode';

export interface LanguageModeFactory {
    new(workerUrl: string, scriptImports: string[], options?: {}): LanguageMode;
}
