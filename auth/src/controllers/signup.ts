import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../db/collections/userCollection";
import { DatabaseError } from "../errors/databaseError";
import { encrypt } from "../utils/passwordEncryption";

import {nats, UserCreatedEvent, subject, noun, verb} from '@rhime/events'
import { ObjectId } from "bson";



const signup = async (req: Request, res: Response) => {
    const {email, userName, password} = req.body
    const hashedPass = await encrypt(password)
    const user: {email:string; userName: string; password: string; isAuth: boolean; _id?: ObjectId} = {
        email, 
        userName, 
        password: hashedPass,
        isAuth: false
    }
    const userResult = await User.insertOne(user)
    if(!userResult.acknowledged) throw new DatabaseError('Error in inserting user to the database')


    await nats.publish<UserCreatedEvent>(subject(noun.user, verb.created), {
        userId: user._id?.toString() as string,
        userName: userName as string,
        email: email
    })

    res.status(StatusCodes.CREATED).json(userResult)
}

export {signup}