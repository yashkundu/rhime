
export abstract class CustomError extends Error{
    abstract statusCode: number;
    abstract serializeError(): {msg: string; field?: string; type?: string, refresh?: boolean}[]

    constructor(message: string){
        super(message)
        Object.setPrototypeOf(this, CustomError.prototype)
    }

}