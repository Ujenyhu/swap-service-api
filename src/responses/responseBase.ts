import { varhelper } from "../helpers/varhelper";

export class ResponseBase<T> {
    public statusCode: number;
    public status: string;
    public message: string;
    public data?: T;

    constructor(statusCode: number, message: string, status: string, data?: T) {
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
