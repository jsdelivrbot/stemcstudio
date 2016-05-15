import DoodleRef from './DoodleRef';

export default function(query: AWS.QueryResult): DoodleRef[] {
    const drs: DoodleRef[] = [];
    const items = query.Items;
    const iLen = items.length;
    for (let i = 0; i < iLen; i++) {
        const item = items[i];
        const owner = item['owner']['S'];
        const gistId = item['resource']['S'];
        const description = item['description']['S'];
        const dr: DoodleRef = {
            owner,
            gistId,
            description
        };
        drs.push(dr);
    }
    return drs;
}
