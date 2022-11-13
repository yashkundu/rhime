import { StatusCodes } from "http-status-codes";
import { CustomError } from "./customError";

export class BadRequestError extends CustomError{
    statusCode: number = StatusCodes.BAD_REQUEST

    constructor(public message: string){
        super(message)
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }

    serializeError(): { msg: string; field?: string | undefined; type?: string | undefined; }[] {
        return [
            {msg: this.message}
        ]
    }

}