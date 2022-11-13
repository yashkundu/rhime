import { Request, Response } from "express";
import {ObjectId} from 'bson'
import { StatusCodes } from "http-status-codes";

import { BadRequestError } from "@rhime/common";

import {mongo} from '../db/mongo'

import { Post, post } from "../db/collections/postCollection";
import { Track, track } from "../db/collections/trackCollection";

import {nats, noun, verb, subject, PostCreatedEvent} from '@rhime/events'

interface postRes extends post {
    _id?: ObjectId
} 


const findAndInsertTrack = async (track: track) => {
    const session = mongo.client.startSession()
    try {
        await session.withTransaction(async () => {
            const trackRes = await Track.findOne({_id: track._id})
            if(!trackRes) {
                await Track.insertOne(track, {session})
            }
        })
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await session.endSession();
    }
}


export const createPost = async (req: Request, res: Response) => {
    if(!req.body.trackName || !req.body.trackId || !req.body.artists) throw new BadRequestError('Invalid request to create post')
    const charLimit = 280;
    if(req.body.caption && req.body.caption.length>charLimit) throw new BadRequestError(`Length of caption cannot be greater than ${charLimit} character`)
    

    const track: track = {
        _id: req.body.trackId,
        trackName: req.body.trackName,
        artists: req.body.artists.map((artist: any) => ({
            artistName: artist.artistName, 
            artistId: artist.artistId
        })),
    }
    if(req.body.listenUrl) track.listenUrl = req.body.listenUrl;
    if(req.body.images) track.images = req.body.images.map((image: string) => image)

    const trackRes = findAndInsertTrack(track);

    const post: postRes = {
        userId: new ObjectId(req.userAuth.userId),
        trackId: req.body.trackId
    }
    if(req.body.caption) post.caption = req.body.caption;
    
    const postRes =  Post.insertOne(post)
    await Promise.all([trackRes, postRes]);

    await nats.publish<PostCreatedEvent>(subject(noun.post, verb.created), {
        postId: post._id?.toString() as string,
        userId: req.userAuth.userId
    })

    res.status(StatusCodes.CREATED).send({post: {
        _id: post._id?.toString(),
    }})
}