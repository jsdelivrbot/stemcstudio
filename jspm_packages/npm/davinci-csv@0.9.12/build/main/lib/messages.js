/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorCode;
(function (ErrorCode) {
    /**
     * Unexpected apostrophe.
     */
    ErrorCode[ErrorCode["E001"] = 1] = "E001";
    /**
     * Unexpected quote.
     */
    ErrorCode[ErrorCode["E002"] = 2] = "E002";
    /**
     * Unexpected character.
     */
    ErrorCode[ErrorCode["E003"] = 3] = "E003";
    /**
     * Unexpected digit.
     */
    ErrorCode[ErrorCode["E004"] = 4] = "E004";
    /**
     * Missing closing apostrophe.
     */
    ErrorCode[ErrorCode["E005"] = 5] = "E005";
    /**
     * Missing closing quote.
     */
    ErrorCode[ErrorCode["E006"] = 6] = "E006";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
exports.messages = {};
exports.messages[ErrorCode.E001] = { code: 'E001', desc: "Unexpected apostrophe." };
exports.messages[ErrorCode.E002] = { code: 'E002', desc: "Unexpected quote." };
exports.messages[ErrorCode.E003] = { code: 'E003', desc: "Unexpected character." };
exports.messages[ErrorCode.E004] = { code: 'E004', desc: "Unexpected digit." };
exports.messages[ErrorCode.E005] = { code: 'E005', desc: "Missing closing apostrophe." };
exports.messages[ErrorCode.E006] = { code: 'E006', desc: "Missing closing quote." };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL21lc3NhZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBWSxTQXlCWDtBQXpCRCxXQUFZLFNBQVM7SUFDakI7O09BRUc7SUFDSCx5Q0FBUSxDQUFBO0lBQ1I7O09BRUc7SUFDSCx5Q0FBUSxDQUFBO0lBQ1I7O09BRUc7SUFDSCx5Q0FBUSxDQUFBO0lBQ1I7O09BRUc7SUFDSCx5Q0FBUSxDQUFBO0lBQ1I7O09BRUc7SUFDSCx5Q0FBUSxDQUFBO0lBQ1I7O09BRUc7SUFDSCx5Q0FBUSxDQUFBO0FBQ1osQ0FBQyxFQXpCVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQXlCcEI7QUFPWSxRQUFBLFFBQVEsR0FBb0MsRUFBRSxDQUFDO0FBRTVELGdCQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQztBQUM1RSxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLENBQUM7QUFDdkUsZ0JBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxDQUFDO0FBQzNFLGdCQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQztBQUN2RSxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLDZCQUE2QixFQUFFLENBQUM7QUFDakYsZ0JBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSx3QkFBd0IsRUFBRSxDQUFDIn0=