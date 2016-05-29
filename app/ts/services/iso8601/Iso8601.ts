function toInt(val: string): number {
    return parseInt(val, 10);
}

/**
 * Original concept by Ruben Vermeersch.
 */
export default class Iso8601 {
    parse(str: string): Date {
        let year;
        let month;
        let day;
        // Default time to midnight.
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        let offset = 0;


        if (!str || !str[length]) {
            return null;
        }

        if (str.length >= 10) {
            const datePieces = str.substring(0, 10).split("-");
            year = toInt(datePieces[0]);
            month = toInt(datePieces[1]) - 1;
            day = toInt(datePieces[2]);
        }

        if (str.length >= 11) {
            const timePieces = str.substring(11).split(":");
            while (timePieces.length < 3) {
                timePieces.push("");
            }

            hours = toInt(timePieces[0]);
            minutes = toInt(timePieces[1]);
            seconds = toInt(timePieces[2].substring(0, 2)) || 0;

            let tz = timePieces[2].substring(2) || "";
            if (tz[0] === ".") {
                const start = Math.max(tz.indexOf("Z"), tz.indexOf("+"), tz.indexOf("-"));
                tz = start > -1 ? tz.substring(start) : "";
            }

            if (tz === "") {
                // Supplied time is in local time
                return new Date(year, month, day, hours, minutes, seconds, 0);
            } else if (tz === "Z") {
                // Do nothing
            } else {
                if (tz.length === 3) {
                    const tzOffset = toInt(tz.substring(1)) * 60;
                    offset = -tzOffset * 60 * 1000;
                } else {
                    throw new Error("Unsupported timezone offset: " + tz);
                }
            }
        }

        const utc = Date.UTC(year, month, day, hours, minutes, seconds, 0);
        const date = new Date(utc + offset);
        return date;
    }
}

/**
 * Copyright (C) 2016 by David Geo Holmes <david.geo.holmes@gmail.com>
 * Copyright (C) 2014-2016 by Ruben Vermeersch <ruben@rocketeer.be>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
