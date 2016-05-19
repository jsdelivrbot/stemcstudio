import {TableName} from '../../controllers/search/DoodleRefTable';
import {OWNER_KEY} from '../../controllers/search/DoodleRefTable';
import {RESOURCE_KEY} from '../../controllers/search/DoodleRefTable';
import {TYPE} from '../../controllers/search/DoodleRefTable';
import {TITLE} from '../../controllers/search/DoodleRefTable';
import {AUTHOR} from '../../controllers/search/DoodleRefTable';
import {KEYWORDS} from '../../controllers/search/DoodleRefTable';
import isArray from '../../utils/isArray';
import isString from '../../utils/isString';
import Doodle from '../../services/doodles/Doodle';

export default function putDoodleRef(doodle: Doodle, next: (err: any) => any) {
    const db = new AWS.DynamoDB();
    // Define an Item object so that we can make use of the symbolic attribute names.
    const Item: { [name: string]: AWS.AttributeValue } = {};
    Item[OWNER_KEY] = { S: doodle.owner };
    Item[RESOURCE_KEY] = { S: doodle.gistId };
    Item[TYPE] = { S: 'Gist' };
    const description = doodle.description;
    if (isString(description)) {
        Item[TITLE] = { S: description };
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
    db.putItem(params, function(err, data) {
        if (!err) {
            // There is nothing to see in the data.
            next(void 0);
        }
        else {
            console.warn(err, err.stack);
            console.warn(JSON.stringify(params, null, 2));
            next(err);
        }
    });
}
