import {StatusCodes} from 'http-status-codes'
import { CustomError } from './customError'
import {ValidationErrorItem} from 'joi'
import { ValidationTypes } from './types/validationTypes'

export class ValidationError extends CustomError{
    statusCode: number = StatusCodes.BAD_REQUEST

    constructor(private errors: ValidationErrorItem[]){
        super('Validation error in the fields')
        Object.setPrototypeOf(this, ValidationError.prototype)
    }

    serializeError(): { msg: string; field?: string | undefined, type?: ValidationTypes | undefined }[] {
        const errors = this.errors.map((error) => {
            let type: ValidationTypes | undefined = undefined
            let msg: string = ''
            if(error.context?.hasOwnProperty('limit')) {
                type = ValidationTypes.INVALID_LENGTH
                msg = `${error.path[0]} is of invalid length.`
            }
            else if(error.context?.hasOwnProperty('regex')) {
                type = ValidationTypes.INVALID_PATTERN
                msg = `${error.path[0]} does not satify the mentioned rules.`
            }
            else if(!error.context?.hasOwnProperty('value')) {
                type = ValidationTypes.NOT_PROVIDED
                msg = `${error.path[0]} is not provided.`
            }
            else if(error.context?.value==='') {
                type = ValidationTypes.EMPTY
                msg = `${error.path[0]} is empty.`
            }
            return {
                msg, 
                type,
                field: String(error.path[0])
            }
        })
        return errors
    }

}