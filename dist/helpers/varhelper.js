"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.varhelper = void 0;
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["SUCCESS"] = "SUCCESS";
    ResponseStatus["ERROR"] = "ERROR";
})(ResponseStatus || (ResponseStatus = {}));
var HttpStatusCodes;
(function (HttpStatusCodes) {
    HttpStatusCodes[HttpStatusCodes["OK"] = 200] = "OK";
    HttpStatusCodes[HttpStatusCodes["Created"] = 201] = "Created";
    HttpStatusCodes[HttpStatusCodes["BadRequest"] = 400] = "BadRequest";
    HttpStatusCodes[HttpStatusCodes["Unauthorizedn"] = 401] = "Unauthorizedn";
    HttpStatusCodes[HttpStatusCodes["Forbidden"] = 403] = "Forbidden";
    HttpStatusCodes[HttpStatusCodes["NotFound"] = 404] = "NotFound";
    HttpStatusCodes[HttpStatusCodes["InternalServerError"] = 500] = "InternalServerError";
})(HttpStatusCodes || (HttpStatusCodes = {}));
var Network;
(function (Network) {
    Network["ETHEREUM"] = "ETHEREUM";
    Network["TRON"] = "TRON";
})(Network || (Network = {}));
class varhelper {
}
exports.varhelper = varhelper;
varhelper.ResponseStatus = ResponseStatus;
varhelper.HttpStatusCodes = HttpStatusCodes;
varhelper.Network = Network;
//# sourceMappingURL=varhelper.js.map