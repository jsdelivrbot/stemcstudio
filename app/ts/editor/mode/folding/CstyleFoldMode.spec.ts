import { Document } from '../../Document';
import { EditSession } from '../../EditSession';

describe("CstyleFoldMode", function () {
    describe("fold comments", function () {
        const doc = new Document([
            '/*',
            'stuff',
            '*/'
        ]);

        const session = new EditSession(doc);

        session.setFoldStyle("markbeginend");

        session.setUseWorker(false);
        session.setLanguage('JavaScript');

        it("should have fold widgets", function () {
            expect(session.getFoldWidget(0)).toBe("start");
            expect(session.getFoldWidget(1)).toBe("");
            expect(session.getFoldWidget(2)).toBe("end");

            expect(session.getFoldWidgetRange(0).start.row).toBe(0);
            expect(session.getFoldWidgetRange(0).start.column).toBe(2);
            expect(session.getFoldWidgetRange(0).end.row).toBe(2);
            expect(session.getFoldWidgetRange(0).end.column).toBe(0);

            expect(session.getFoldWidgetRange(2).start.row).toBe(0);
            expect(session.getFoldWidgetRange(2).start.column).toBe(2);
            expect(session.getFoldWidgetRange(2).end.row).toBe(2);
            expect(session.getFoldWidgetRange(2).end.column).toBe(0);
        });
    });
    describe("fold doc style comments", function () {
        const doc = new Document([
            '/**',
            ' * stuff',
            ' * *** */'
        ]);

        const session = new EditSession(doc);

        session.setFoldStyle("markbeginend");

        session.setUseWorker(false);
        session.setLanguage('JavaScript');

        it("should have fold widgets", function () {
            expect(session.getFoldWidget(0)).toBe("start");
            expect(session.getFoldWidget(1)).toBe("");
            expect(session.getFoldWidget(2)).toBe("end");

            expect(session.getFoldWidgetRange(0).start.row).toBe(0);
            expect(session.getFoldWidgetRange(0).start.column).toBe(2);
            expect(session.getFoldWidgetRange(0).end.row).toBe(2);
            expect(session.getFoldWidgetRange(0).end.column).toBe(7);

            expect(session.getFoldWidgetRange(2).start.row).toBe(0);
            expect(session.getFoldWidgetRange(2).start.column).toBe(2);
            expect(session.getFoldWidgetRange(2).end.row).toBe(2);
            expect(session.getFoldWidgetRange(2).end.column).toBe(7);
        });
    });

    describe("fold sections", function () {
        const doc = new Document([
            '/* section0 */',
            '{',
            '    /* section1 */',
            '    stuff',
            '       ',
            '    /* section2 */',
            '       ',
            '    stuff',
            '       ',
            '     }',
            'foo'
        ]);

        const session = new EditSession(doc);
        session.setFoldStyle("markbegin");
        session.setUseWorker(false);
        session.setLanguage('JavaScript');

        it("should have fold widgets", function () {
            expect(session.getFoldWidgetRange(0, true).start.row).toBe(0);
            expect(session.getFoldWidgetRange(0, true).start.column).toBe(14);
            expect(session.getFoldWidgetRange(0, true).end.row).toBe(10);
            expect(session.getFoldWidgetRange(0, true).end.column).toBe(3);

            expect(session.getFoldWidgetRange(2, true).start.row).toBe(2);
            expect(session.getFoldWidgetRange(2, true).start.column).toBe(18);
            expect(session.getFoldWidgetRange(2, true).end.row).toBe(3);
            expect(session.getFoldWidgetRange(2, true).end.column).toBe(9);

            expect(session.getFoldWidgetRange(5, true).start.row).toBe(5);
            expect(session.getFoldWidgetRange(5, true).start.column).toBe(18);
            expect(session.getFoldWidgetRange(5, true).end.row).toBe(7);
            expect(session.getFoldWidgetRange(5, true).end.column).toBe(9);
        });
    });
});
