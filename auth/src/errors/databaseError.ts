import { StatusCodes } from "http-status-codes";
import { CustomError } from "./customError";

export class DatabaseError extends CustomError{
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR

    constructor(public message: string){
        super(message)
        Object.setPrototypeOf(this, DatabaseError.prototype)
    }

    serializeError(): { msg: string; field?: string | undefined; type?: string | undefined; }[] {
        return [
            {
                msg: this.message
            }
        ]
    }
}