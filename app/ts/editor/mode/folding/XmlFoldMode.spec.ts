import { Document } from 'editor-document';
import { EditSession } from '../../EditSession';
import { setLanguage } from '../../../directives/editor/setLanguage';

describe("XmlFoldMode", function () {
    describe("fold multi line self closing element", function () {
        const doc = new Document([
            '<person',
            '  firstname="fabian"',
            '  lastname="jakobs"/>'
        ]);

        const session = new EditSession(doc);

        session.setFoldStyle("markbeginend");

        session.setUseWorker(false);
        setLanguage(session, 'XML');

        it("should have fold widgets", function () {
            expect(session.getFoldWidget(0)).toBe("start");
            expect(session.getFoldWidget(1)).toBe("");
            expect(session.getFoldWidget(2)).toBe("end");
        });

        it("should have fold ranges", function () {

            expect(session.getFoldWidgetRange(0).start.row).toBe(0);
            expect(session.getFoldWidgetRange(0).start.column).toBe(8);
            expect(session.getFoldWidgetRange(0).end.row).toBe(2);
            expect(session.getFoldWidgetRange(0).end.column).toBe(19);

            expect(session.getFoldWidgetRange(2).start.row).toBe(0);
            expect(session.getFoldWidgetRange(2).start.column).toBe(8);
            expect(session.getFoldWidgetRange(2).end.row).toBe(2);
            expect(session.getFoldWidgetRange(2).end.column).toBe(19);
        });
    });

    describe("fold should skip self closing elements", function () {
        const doc = new Document([
            '<person>',
            '  <attrib value="fabian"/>',
            '</person>'
        ]);

        const session = new EditSession(doc);

        session.setFoldStyle("markbeginend");

        session.setUseWorker(false);
        setLanguage(session, 'XML');

        it("should have fold widgets", function () {
            expect(session.getFoldWidget(0)).toBe("start");
            expect(session.getFoldWidget(1)).toBe("");
            expect(session.getFoldWidget(2)).toBe("end");
        });

        it("should have fold ranges", function () {
            expect(session.getFoldWidgetRange(0).start.row).toBe(0);
            expect(session.getFoldWidgetRange(0).start.column).toBe(8);
            expect(session.getFoldWidgetRange(0).end.row).toBe(2);
            expect(session.getFoldWidgetRange(0).end.column).toBe(0);

            expect(session.getFoldWidgetRange(2).start.row).toBe(0);
            expect(session.getFoldWidgetRange(2).start.column).toBe(8);
            expect(session.getFoldWidgetRange(2).end.row).toBe(2);
            expect(session.getFoldWidgetRange(2).end.column).toBe(0);
        });
    });

    describe("fold should skip multi line self closing elements", function () {
        const doc = new Document([
            '<person>',
            '  <attib',
            '     key="name"',
            '     value="fabian"/>',
            '</person>'
        ]);

        const session = new EditSession(doc);
        session.setFoldStyle("markbeginend");
        session.setUseWorker(false);
        setLanguage(session, 'XML');

        it("should have fold widgets", function () {
            expect(session.getFoldWidget(0)).toBe("start");
            expect(session.getFoldWidget(1)).toBe("start");
            expect(session.getFoldWidget(2)).toBe("");
            expect(session.getFoldWidget(3)).toBe("end");
            expect(session.getFoldWidget(4)).toBe("end");
        });

        it("should have fold ranges", function () {
            expect(session.getFoldWidgetRange(0).start.row).toBe(0);
            expect(session.getFoldWidgetRange(0).start.column).toBe(8);
            expect(session.getFoldWidgetRange(0).end.row).toBe(4);
            expect(session.getFoldWidgetRange(0).end.column).toBe(0);

            expect(session.getFoldWidgetRange(1).start.row).toBe(1);
            expect(session.getFoldWidgetRange(1).start.column).toBe(9);
            expect(session.getFoldWidgetRange(1).end.row).toBe(3);
            expect(session.getFoldWidgetRange(1).end.column).toBe(19);

            expect(session.getFoldWidgetRange(3).start.row).toBe(1);
            expect(session.getFoldWidgetRange(3).start.column).toBe(9);
            expect(session.getFoldWidgetRange(3).end.row).toBe(3);
            expect(session.getFoldWidgetRange(3).end.column).toBe(19);

            expect(session.getFoldWidgetRange(4).start.row).toBe(0);
            expect(session.getFoldWidgetRange(4).start.column).toBe(8);
            expect(session.getFoldWidgetRange(4).end.row).toBe(4);
            expect(session.getFoldWidgetRange(4).end.column).toBe(0);
        });
    });
});



