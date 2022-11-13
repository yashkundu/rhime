import { StatusCodes } from "http-status-codes";
import { CustomError } from "./customError";

export class ForbiddenError extends CustomError{
    statusCode: number = StatusCodes.FORBIDDEN

    constructor(public message: string){
        super(message)
        Object.setPrototypeOf(this, ForbiddenError.prototype)
    }

    serializeError(): { msg: string; field?: string | undefined; type?: string | undefined; }[] {
        return [
            {msg: this.message}
        ]
    }

}