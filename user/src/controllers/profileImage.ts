import { Request, Response } from "express";
import {s3Client} from '../extras/s3Client'
import {PutObjectCommand} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {v4 as uuidv4} from 'uuid'
import { DatabaseError } from "@rhime/common";
import { StatusCodes } from "http-status-codes";


export const uploadProfileImage = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId
        const key = `${userId}/${uuidv4()}.jpeg`
        const command = new PutObjectCommand({
            Bucket: 'rhime-profile-image',
            Key: key,
            ContentType: 'jpeg'
        })
        const preSignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 5*60
        }) 
        res.status(StatusCodes.OK).send({url: preSignedUrl})
    } catch (error) {
        throw new DatabaseError('Error in uploading image to S3')
    }
}


export const deleteProfileImage = async (req: Request, res: Response) => {
    res.sendStatus(StatusCodes.OK)
}

