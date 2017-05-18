import { DoodleRef } from './DoodleRef';
import { OWNER_KEY } from './DoodleRefTable';
import { RESOURCE_KEY } from './DoodleRefTable';
import { TITLE } from './DoodleRefTable';
import { AUTHOR } from './DoodleRefTable';
import { KEYWORDS } from './DoodleRefTable';

/**
 * We don't want the UI to blow up just because the 
 */
function extractString(attributeValue: AWS.AttributeValue): string {
    if (attributeValue) {
        return attributeValue['S'];
    }
    else {
        return void 0;
    }
}

function extractStringArray(attributeValue: AWS.AttributeValue): string[] {
    if (attributeValue) {
        return attributeValue['SS'];
    }
    else {
        return void 0;
    }
}

export function queryToDoodleRef(query: AWS.QueryResult): DoodleRef[] {
    const drs: DoodleRef[] = [];
    const items = query.Items;
    const iLen = items.length;
    for (let i = 0; i < iLen; i++) {
        const item = items[i];
        const owner = item[OWNER_KEY]['S'];
        const gistId = item[RESOURCE_KEY]['S'];
        const title = extractString(item[TITLE]);
        const author = extractString(item[AUTHOR]);
        const keywords = extractStringArray(item[KEYWORDS]);
        const dr: DoodleRef = {
            owner,
            gistId,
            title,
            author,
            keywords
        };
        drs.push(dr);
    }
    return drs;
}
