import { Document } from 'editor-document';
import { EditSession } from '../editor/EditSession';
import { setLanguage } from '../directives/editor/setLanguage';

describe("HtmlFoldMode", function () {

    describe("fold mixed html and javascript", function () {
        const doc = new Document([
            '<script type="text/javascript"> ',
            'function foo() {',
            '    var bar = 1;',
            '}',
            '</script>'
        ]);

        const session = new EditSession(doc);

        session.setUseWorker(false);
        setLanguage(session, 'HTML');

        session.setFoldStyle("markbeginend");

        // FIXME: See issue #49
        xit("should have fold widgets", function () {
            expect(session.getFoldWidget(0)).toBe("start");
            expect(session.getFoldWidget(1)).toBe("start");
            expect(session.getFoldWidget(2)).toBe("");
            expect(session.getFoldWidget(3)).toBe("end");
            expect(session.getFoldWidget(4)).toBe("end");
        });

        // FIXME: See issue #49
        xit("should have fold ranges", function () {
            // assert.range(session.getFoldWidgetRange(0), 0, 8, 4, 0);
            expect(session.getFoldWidgetRange(0).start.row).toBe(0);
            expect(session.getFoldWidgetRange(0).start.column).toBe(8);
            expect(session.getFoldWidgetRange(0).end.row).toBe(4);
            expect(session.getFoldWidgetRange(0).end.column).toBe(0);
            // assert.range(session.getFoldWidgetRange(4), 0, 8, 4, 0);
            expect(session.getFoldWidgetRange(4).start.row).toBe(0);
            expect(session.getFoldWidgetRange(4).start.column).toBe(8);
            expect(session.getFoldWidgetRange(4).end.row).toBe(4);
            expect(session.getFoldWidgetRange(4).end.column).toBe(0);
            // assert.range(session.getFoldWidgetRange(1), 1, 16, 3, 0);
            expect(session.getFoldWidgetRange(1).start.row).toBe(1);
            expect(session.getFoldWidgetRange(1).start.column).toBe(16);
            expect(session.getFoldWidgetRange(1).end.row).toBe(3);
            expect(session.getFoldWidgetRange(1).end.column).toBe(0);
            // assert.range(session.getFoldWidgetRange(3), 1, 16, 3, 0);
            expect(session.getFoldWidgetRange(3).start.row).toBe(1);
            expect(session.getFoldWidgetRange(3).start.column).toBe(16);
            expect(session.getFoldWidgetRange(3).end.row).toBe(3);
            expect(session.getFoldWidgetRange(3).end.column).toBe(0);
        });
    });

    describe("fold mixed html and css", function () {
        const doc = new Document([
            '<style type="text/css">',
            '    .text-layer {',
            '        font-family: Monaco, "Courier New", monospace;',
            '    }',
            '</style>'
        ]);

        const session = new EditSession(doc);
        session.setUseWorker(false);
        setLanguage(session, 'HTML');
        session.setFoldStyle("markbeginend");

        // FIXME: See issue #49
        xit("should have fold widgets", function () {
            expect(session.getFoldWidget(0)).toBe("start");
            expect(session.getFoldWidget(1)).toBe("start");
            expect(session.getFoldWidget(2)).toBe("");
            expect(session.getFoldWidget(3)).toBe("end");
            expect(session.getFoldWidget(4)).toBe("end");
        });

        // FIXME: See issue #49
        xit("should have fold ranges", function () {
            // assert.range(session.getFoldWidgetRange(0), 0, 7, 4, 0);
            expect(session.getFoldWidgetRange(0).start.row).toBe(0);
            expect(session.getFoldWidgetRange(0).start.column).toBe(7);
            expect(session.getFoldWidgetRange(0).end.row).toBe(4);
            expect(session.getFoldWidgetRange(0).end.column).toBe(0);
            // assert.range(session.getFoldWidgetRange(4), 0, 7, 4, 0);
            expect(session.getFoldWidgetRange(4).start.row).toBe(0);
            expect(session.getFoldWidgetRange(4).start.column).toBe(7);
            expect(session.getFoldWidgetRange(4).end.row).toBe(4);
            expect(session.getFoldWidgetRange(4).end.column).toBe(0);
            // assert.range(session.getFoldWidgetRange(1), 1, 17, 3, 4);
            expect(session.getFoldWidgetRange(1).start.row).toBe(1);
            expect(session.getFoldWidgetRange(1).start.column).toBe(17);
            expect(session.getFoldWidgetRange(1).end.row).toBe(3);
            expect(session.getFoldWidgetRange(1).end.column).toBe(4);
            // assert.range(session.getFoldWidgetRange(3), 1, 17, 3, 4);
            expect(session.getFoldWidgetRange(3).start.row).toBe(1);
            expect(session.getFoldWidgetRange(3).start.column).toBe(17);
            expect(session.getFoldWidgetRange(3).end.row).toBe(3);
            expect(session.getFoldWidgetRange(3).end.column).toBe(4);
        });
    });

    describe("fold should skip self closing elements", function () {
        const doc = new Document([
            '<body>',
            '<br />',
            '</body>'
        ]);

        const session = new EditSession(doc);
        session.setUseWorker(false);
        setLanguage(session, 'HTML');

        session.setFoldStyle("markbeginend");

        it("should have fold widgets", function () {
            expect(session.getFoldWidget(0)).toBe("start");
            expect(session.getFoldWidget(1)).toBe("");
            expect(session.getFoldWidget(2)).toBe("end");
        });

        it("should have fold ranges", function () {
            // assert.range(session.getFoldWidgetRange(0), 0, 6, 2, 0);
            expect(session.getFoldWidgetRange(0).start.row).toBe(0);
            expect(session.getFoldWidgetRange(0).start.column).toBe(6);
            expect(session.getFoldWidgetRange(0).end.row).toBe(2);
            expect(session.getFoldWidgetRange(0).end.column).toBe(0);
            // assert.range(session.getFoldWidgetRange(2), 0, 6, 2, 0);
            expect(session.getFoldWidgetRange(2).start.row).toBe(0);
            expect(session.getFoldWidgetRange(2).start.column).toBe(6);
            expect(session.getFoldWidgetRange(2).end.row).toBe(2);
            expect(session.getFoldWidgetRange(2).end.column).toBe(0);
        });
    });

    describe("fold should skip void elements", function () {
        const doc = new Document([
            '<body>',
            '<br>',
            '</body>'
        ]);

        const session = new EditSession(doc);
        session.setUseWorker(false);
        setLanguage(session, 'HTML');

        session.setFoldStyle("markbeginend");

        it("should have fold widgets", function () {
            expect(session.getFoldWidget(0)).toBe("start");
            expect(session.getFoldWidget(1)).toBe("");
            expect(session.getFoldWidget(2)).toBe("end");
        });

        it("should have fold ranges", function () {
            // assert.range(session.getFoldWidgetRange(0), 0, 6, 2, 0);
            expect(session.getFoldWidgetRange(0).start.row).toBe(0);
            expect(session.getFoldWidgetRange(0).start.column).toBe(6);
            expect(session.getFoldWidgetRange(0).end.row).toBe(2);
            expect(session.getFoldWidgetRange(0).end.column).toBe(0);
            // assert.range(session.getFoldWidgetRange(2), 0, 6, 2, 0);
            expect(session.getFoldWidgetRange(2).start.row).toBe(0);
            expect(session.getFoldWidgetRange(2).start.column).toBe(6);
            expect(session.getFoldWidgetRange(2).end.row).toBe(2);
            expect(session.getFoldWidgetRange(2).end.column).toBe(0);
        });
    });

    describe("fold multiple unclosed elements", function () {
        const doc = new Document([
            '<div>',
            '<p>',
            'juhu',
            '<p>',
            'kinners',
            '</div>'
        ]);

        const session = new EditSession(doc);
        session.traceTokenizer = true;
        session.setUseWorker(false);
        setLanguage(session, 'HTML');

        session.setFoldStyle("markbeginend");

        it("should have fold widgets", function () {
            expect(session.getFoldWidget(0)).toBe("start");
            expect(session.getFoldWidget(1)).toBe("start");
            expect(session.getFoldWidget(2)).toBe("");
            expect(session.getFoldWidget(3)).toBe("start");
            expect(session.getFoldWidget(4)).toBe("");
            expect(session.getFoldWidget(5)).toBe("end");
        });

        it("should have fold ranges", function () {
            // assert.range(session.getFoldWidgetRange(0), 0, 5, 5, 0);
            expect(session.getFoldWidgetRange(0).start.row).toBe(0);
            expect(session.getFoldWidgetRange(0).start.column).toBe(5);
            expect(session.getFoldWidgetRange(0).end.row).toBe(5);
            expect(session.getFoldWidgetRange(0).end.column).toBe(0);
            // assert.range(session.getFoldWidgetRange(5), 0, 5, 5, 0);
            expect(session.getFoldWidgetRange(5).start.row).toBe(0);
            expect(session.getFoldWidgetRange(5).start.column).toBe(5);
            expect(session.getFoldWidgetRange(5).end.row).toBe(5);
            expect(session.getFoldWidgetRange(5).end.column).toBe(0);
        });
    });
});
