import Clipboard from 'clipboard';
import { overlayPage } from '../editor/ext/menu_tools/overlayPage';
import { Editor } from '../editor/Editor';

const ID_CONTENT_ELEMENT = 'greek-keyboard';

const GREEK_CAPITAL_LETTER_ALPHA = 0x0391;
const GREEK_CAPITAL_LETTER_BETA = 0x0392;
const GREEK_CAPITAL_LETTER_GAMMA = 0x0393;
const GREEK_CAPITAL_LETTER_DELTA = 0x0394;
const GREEK_CAPITAL_LETTER_EPSILON = 0x0395;
const GREEK_CAPITAL_LETTER_ZETA = 0x0396;
const GREEK_CAPITAL_LETTER_ETA = 0x0397;
const GREEK_CAPITAL_LETTER_THETA = 0x0398;
const GREEK_CAPITAL_LETTER_LAMBDA = 0x039B;
const GREEK_CAPITAL_LETTER_MU = 0x039C;
const GREEK_CAPITAL_LETTER_NU = 0x039D;
const GREEK_CAPITAL_LETTER_XI = 0x039E;
const GREEK_CAPITAL_LETTER_PI = 0x03A0;
const GREEK_CAPITAL_LETTER_RHO = 0x03A1;
const GREEK_CAPITAL_LETTER_SIGMA = 0x03A3;
const GREEK_CAPITAL_LETTER_TAU = 0x03A4;
const GREEK_CAPITAL_LETTER_PHI = 0x03A6;
const GREEK_CAPITAL_LETTER_CHI = 0x03A7;
const GREEK_CAPITAL_LETTER_PSI = 0x03A8;
const GREEK_CAPITAL_LETTER_OMEGA = 0x03A9;

const GREEK_SMALL_LETTER_ALPHA = 0x03B1;
const GREEK_SMALL_LETTER_BETA = 0x03B2;
const GREEK_SMALL_LETTER_GAMMA = 0x03B3;
const GREEK_SMALL_LETTER_DELTA = 0x03B4;
const GREEK_SMALL_LETTER_EPSILON = 0x03B5;
const GREEK_SMALL_LETTER_ZETA = 0x03B6;
const GREEK_SMALL_LETTER_ETA = 0x03B7;
const GREEK_SMALL_LETTER_THETA = 0x03B8;
const GREEK_SMALL_LETTER_LAMBDA = 0x03BB;
const GREEK_SMALL_LETTER_MU = 0x03BC;
const GREEK_SMALL_LETTER_NU = 0x03BD;
const GREEK_SMALL_LETTER_XI = 0x03BE;
const GREEK_SMALL_LETTER_PI = 0x03C0;
const GREEK_SMALL_LETTER_RHO = 0x03C1;
const GREEK_SMALL_LETTER_SIGMA = 0x03C3;
const GREEK_SMALL_LETTER_TAU = 0x03C4;
const GREEK_SMALL_LETTER_PHI = 0x03C6;
const GREEK_SMALL_LETTER_CHI = 0x03C7;
const GREEK_SMALL_LETTER_PSI = 0x03C8;
const GREEK_SMALL_LETTER_OMEGA = 0x03C9;

const keyMap: { [name: string]: number[] } = {
    "Alpha": [GREEK_CAPITAL_LETTER_ALPHA, GREEK_SMALL_LETTER_ALPHA],
    "Beta": [GREEK_CAPITAL_LETTER_BETA, GREEK_SMALL_LETTER_BETA],
    "Gamma": [GREEK_CAPITAL_LETTER_GAMMA, GREEK_SMALL_LETTER_GAMMA],
    "Delta": [GREEK_CAPITAL_LETTER_DELTA, GREEK_SMALL_LETTER_DELTA],
    "Epsilon": [GREEK_CAPITAL_LETTER_EPSILON, GREEK_SMALL_LETTER_EPSILON],
    "Zeta": [GREEK_CAPITAL_LETTER_ZETA, GREEK_SMALL_LETTER_ZETA],
    "Eta": [GREEK_CAPITAL_LETTER_ETA, GREEK_SMALL_LETTER_ETA],
    "Theta": [GREEK_CAPITAL_LETTER_THETA, GREEK_SMALL_LETTER_THETA],
    "Lambda": [GREEK_CAPITAL_LETTER_LAMBDA, GREEK_SMALL_LETTER_LAMBDA],
    "Mu": [GREEK_CAPITAL_LETTER_MU, GREEK_SMALL_LETTER_MU],
    "Nu": [GREEK_CAPITAL_LETTER_NU, GREEK_SMALL_LETTER_NU],
    "Xi": [GREEK_CAPITAL_LETTER_XI, GREEK_SMALL_LETTER_XI],
    "Pi": [GREEK_CAPITAL_LETTER_PI, GREEK_SMALL_LETTER_PI],
    "Rho": [GREEK_CAPITAL_LETTER_RHO, GREEK_SMALL_LETTER_RHO],
    "Sigma": [GREEK_CAPITAL_LETTER_SIGMA, GREEK_SMALL_LETTER_SIGMA],
    "Tau": [GREEK_CAPITAL_LETTER_TAU, GREEK_SMALL_LETTER_TAU],
    "Phi": [GREEK_CAPITAL_LETTER_PHI, GREEK_SMALL_LETTER_PHI],
    "Chi": [GREEK_CAPITAL_LETTER_CHI, GREEK_SMALL_LETTER_CHI],
    "Psi": [GREEK_CAPITAL_LETTER_PSI, GREEK_SMALL_LETTER_PSI],
    "Omega": [GREEK_CAPITAL_LETTER_OMEGA, GREEK_SMALL_LETTER_OMEGA]
};
const names = Object.keys(keyMap);

const CLASSNAME_GREEK_SYMBOL_BUTTON = 'greek-symbol-button';

/**
 * Shows a Greek Keyboard" using an overlay page.
 * The contentElement is given the DOM identifier 'greek-keyboard'
 */
export function showGreekKeyboard(editor: Editor) {
    // Make sure the menu isn't open already.
    if (!document.getElementById(ID_CONTENT_ELEMENT)) {
        const contentElement = document.createElement('div');
        contentElement.id = ID_CONTENT_ELEMENT;

        const heading = document.createElement('h1');
        heading.innerText = "Greek Symbols";
        contentElement.appendChild(heading);

        const table = document.createElement('table');
        contentElement.appendChild(table);

        /**
         * Keep track of clipboards created so that we can destroy them later.
         */
        const clipboards: Clipboard[] = [];

        for (const name of names) {
            const keyCodes = keyMap[name];
            const letter = makeLetter(name, keyCodes, clipboards);
            const row = tr(letter);
            row.className = 'ace_optionsMenuEntry';
            table.appendChild(row);
        }

        overlayPage(editor, contentElement, '0', '0', '0', null, function () {
            for (const clipboard of clipboards) {
                clipboard.destroy();
            }
            clipboards.length = 0;
        });
    }
}

function tr(children: HTMLTableCellElement[]): HTMLTableRowElement {
    const row = document.createElement('tr');
    for (const child of children) {
        row.appendChild(child);
    }
    return row;
}

function td(children: HTMLElement[]): HTMLTableDataCellElement {
    const cell = document.createElement('td');
    for (const child of children) {
        cell.appendChild(child);
    }
    return cell;
}

function tt(innerText: string): HTMLElement {
    const element = document.createElement('tt');
    element.innerText = innerText;
    return element;
}

function button(type: 'button', children: Node[]): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = type;
    for (const child of children) {
        btn.appendChild(child);
    }
    return btn;
}

function makeLetter(name: string, keyCodes: number[], clipboards: Clipboard[]): HTMLTableDataCellElement[] {
    const tds: HTMLTableDataCellElement[] = [];
    tds.push(td([makeSpan(name, 'ace_optionsMenuCommand')]));

    for (const keyCode of keyCodes) {
        const keyString = String.fromCharCode(keyCode);
        const label = tt(keyString);
        label.className = 'ace_optionsMenuKey';
        const btn = button('button', [label]);
        btn.id = keyString;
        btn.className = CLASSNAME_GREEK_SYMBOL_BUTTON;
        btn.setAttribute('data-clipboard-action', 'copy');
        btn.setAttribute('data-clipboard-text', keyString);

        const clipboard = new Clipboard(btn, {
            // options here: action, target, text.
        });

        clipboard.on('success', function (e: ClipboardEvent) {
            e.clearSelection();
        });

        clipboard.on('error', function (/* e: ClipboardEvent */) {
            console.warn("The text could not be copied to the clipboard.");
        });

        clipboards.push(clipboard);

        /*
        const clickListener = function () {
            console.lg(`${keyString} => ${keyCode.toString(16)}`);
        };

        btn.addEventListener('click', clickListener);
        */
        tds.push(td([btn]));
    }

    return tds;
}

function makeSpan(value: string, className: string): HTMLSpanElement {
    const span = document.createElement('span');
    span.className = className;
    span.innerText = value;
    return span;
}
