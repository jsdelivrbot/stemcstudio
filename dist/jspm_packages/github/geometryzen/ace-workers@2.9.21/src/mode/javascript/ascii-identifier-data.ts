/**
 *
 */
export const asciiIdentifierStartTable: boolean[] = [];

for (let i = 0; i < 128; i++) {
    asciiIdentifierStartTable[i] =
        i === 36 ||           // $
        i >= 65 && i <= 90 || // A-Z
        i === 95 ||           // _
        i >= 97 && i <= 122;  // a-z
}

/**
 *
 */
export const asciiIdentifierPartTable: boolean[] = [];

for (let i = 0; i < 128; i++) {
    asciiIdentifierPartTable[i] =
        asciiIdentifierStartTable[i] || // $, _, A-Z, a-z
        i >= 48 && i <= 57;        // 0-9
}
