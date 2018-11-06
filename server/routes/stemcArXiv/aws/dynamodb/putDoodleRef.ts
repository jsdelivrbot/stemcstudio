/**
 * Writes a record (Doodle reference) to the AWS DynamoDB table called DoodleRef.
 */
export function putDoodleRef(doodle: { owner: string, gistId: string, title: string, author: string, keywords: string[] }, next: (err: any, data: any) => any) {
    /*
    const db = new AWS.DynamoDB();
    // Define an Item object so that we can make use of the symbolic attribute names.
    const Item: { [name: string]: AWS.AttributeValue } = {};
    Item[OWNER_KEY] = { S: doodle.owner };
    Item[RESOURCE_KEY] = { S: doodle.gistId };
    Item[TYPE] = { S: 'Gist' };
    const title = doodle.title;
    if (isString(title)) {
        Item[TITLE] = { S: title };
    }
    const author = doodle.author;
    if (isString(author)) {
        Item[AUTHOR] = { S: author };
    }
    const keywords = doodle.keywords;
    if (isArray(keywords)) {
        Item[KEYWORDS] = { SS: keywords };
    }
    const params = { TableName, Item };
    db.putItem(params, function (err: AWS.Reason, data: any) {
        if (!err) {
            // There is nothing to see in the data, but we return it anyway.
            next(void 0, data);
        }
        else {
            console.warn(JSON.stringify(err, null, 2));
            console.warn(JSON.stringify(params, null, 2));
            next(err, void 0);
        }
    });
    */
}
