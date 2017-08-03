"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require("aws-sdk");
var DoodleRefTable_1 = require("./DoodleRefTable");
var DoodleRefTable_2 = require("./DoodleRefTable");
var DoodleRefTable_3 = require("./DoodleRefTable");
var DoodleRefTable_4 = require("./DoodleRefTable");
var DoodleRefTable_5 = require("./DoodleRefTable");
var DoodleRefTable_6 = require("./DoodleRefTable");
var DoodleRefTable_7 = require("./DoodleRefTable");
var isArray_1 = require("../../../../utils/isArray");
var isString_1 = require("../../../../utils/isString");
function putDoodleRef(doodle, next) {
    var db = new AWS.DynamoDB();
    var Item = {};
    Item[DoodleRefTable_2.OWNER_KEY] = { S: doodle.owner };
    Item[DoodleRefTable_3.RESOURCE_KEY] = { S: doodle.gistId };
    Item[DoodleRefTable_4.TYPE] = { S: 'Gist' };
    var title = doodle.title;
    if (isString_1.isString(title)) {
        Item[DoodleRefTable_5.TITLE] = { S: title };
    }
    var author = doodle.author;
    if (isString_1.isString(author)) {
        Item[DoodleRefTable_6.AUTHOR] = { S: author };
    }
    var keywords = doodle.keywords;
    if (isArray_1.isArray(keywords)) {
        Item[DoodleRefTable_7.KEYWORDS] = { SS: keywords };
    }
    var params = { TableName: DoodleRefTable_1.TableName, Item: Item };
    db.putItem(params, function (err, data) {
        if (!err) {
            next(void 0, data);
        }
        else {
            console.warn(JSON.stringify(err, null, 2));
            console.warn(JSON.stringify(params, null, 2));
            next(err, void 0);
        }
    });
}
exports.putDoodleRef = putDoodleRef;
//# sourceMappingURL=putDoodleRef.js.map