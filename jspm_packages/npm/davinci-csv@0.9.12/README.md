# davinci-csv
Comma Separated Value (CSV) Library for JavaScript with TypeScript d.ts files.

# Getting Started

The following code illustrates the basic flow. For a working example see [STEMCstudio](https://www.stemcstudio.com).
Look for examples with `CSV` in the title. 

## Example.

```typescript
import {parse, Dialect, Field} from 'davinci-csv'

/**
 * Parse CSV from the contents of a script tag with the specified identifier.
 */
function csvFromScriptElementId(id: string, dialect?: Dialect): Field[][] {
    const dataElement = document.getElementById(id)
    if (dataElement) {
        const csvText = dataElement.innerText
        return parse(csvText, dialect)
    }
    else {
        throw new Error(`${id} is not a valid element id`)
    }
}
```
