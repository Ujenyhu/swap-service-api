"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseBase = void 0;
class ResponseBase {
    constructor(statusCode, message, status, data) {
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
exports.ResponseBase = ResponseBase;
//# sourceMappingURL=responseBase.js.map