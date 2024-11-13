
enum ResponseStatus {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

enum HttpStatusCodes {
    OK = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorizedn= 401,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500 
}

enum Network {
    ETHEREUM = 'ETHEREUM',
    TRON = 'TRON'
}

export class varhelper {
    static ResponseStatus = ResponseStatus;
    static HttpStatusCodes = HttpStatusCodes;
    static Network = Network;
}

