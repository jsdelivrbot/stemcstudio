import { Theme } from '../../Theme';

const STEMCSTUDIO_DARK = "STEMCstudio Dark";
// const STEMCSTUDIO_LIGHT = "STEMCstudio Light";
const VSCODE_DARK = "Visual Studio Code Dark";
export const DEFAULT_THEME_NAME = STEMCSTUDIO_DARK;

export const themes: Theme[] = [
    {
        name: "Chrome",
        isDark: false,
        cssClass: 'ace-chrome',
        fileName: 'chrome.css'
    },
    {
        name: "Cobalt",
        isDark: true,
        cssClass: 'ace-cobalt',
        fileName: 'cobalt.css'
    },
    {
        name: "Dreamweaver",
        isDark: false,
        cssClass: 'ace-dreamweaver',
        fileName: 'dreamweaver.css'
    },
    {
        name: "Eclipse",
        isDark: false,
        cssClass: 'ace-eclipse',
        fileName: 'eclipse.css'
    },
    {
        name: "GitHub",
        isDark: false,
        cssClass: 'ace-github',
        fileName: 'github.css'
    },
    {
        name: "Monokai",
        isDark: true,
        cssClass: 'ace-monokai',
        fileName: 'monokai.css'
    },
    {
        name: STEMCSTUDIO_DARK,
        isDark: true,
        cssClass: 'ace-stemcstudio-dark',
        fileName: 'stemcstudio_dark.css'
    },
    /*
    {
        name: STEMCSTUDIO_LIGHT,
        isDark: false,
        cssClass: 'ace-stemcstudio-light',
        fileName: 'stemcstudio_light.css'
    },
    */
    {
        name: "TextMate",
        isDark: false,
        cssClass: 'ace-tm',
        fileName: 'textmate.css'
    },
    {
        name: "Twilight",
        isDark: true,
        cssClass: 'ace-twilight',
        fileName: 'twilight.css'
    },
    {
        name: "Vibrant Ink",
        isDark: true,
        cssClass: 'ace-vibrant-ink',
        fileName: 'vibrant_ink.css'
    },
    {
        name: "Visual Studio",
        isDark: false,
        cssClass: 'ace-vs',
        fileName: 'visualstudio.css'
    },
    {
        name: VSCODE_DARK,
        isDark: true,
        cssClass: 'ace-vscode-dark',
        fileName: 'vscode_dark.css'
    },
    {
        name: "Xcode",
        isDark: false,
        cssClass: 'ace-xcode',
        fileName: 'xcode.css'
    },
];
