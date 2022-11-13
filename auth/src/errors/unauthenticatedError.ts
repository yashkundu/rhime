import { StatusCodes } from "http-status-codes";
import { CustomError } from "./customError";

export class UnauthenticatedError extends CustomError{
    statusCode: number = StatusCodes.UNAUTHORIZED
    refresh: boolean = false;

    constructor(public message: string, refresh: boolean){
        super(message)
        this.refresh = refresh
        Object.setPrototypeOf(this, UnauthenticatedError.prototype)
    }

    serializeError() {
        return [
            {msg: `The user is not authenticated.`, refresh: this.refresh}
        ]
    }

}