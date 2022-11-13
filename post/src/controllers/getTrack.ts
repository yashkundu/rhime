import { Request, Response } from "express";

import { Track } from "../db/collections/trackCollection";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "@rhime/common";

const getTrack = async (req: Request, res: Response) => {

    const trackId = req.params.trackId

    const track = await Track.findOne({_id: trackId});
    if(!track) throw new NotFoundError('Track not found');

    res.status(StatusCodes.OK).send({
        trackName: track.trackName,
        listenUrl: track.listenUrl,
        image: (track.images as string[])[0] as string,
        artists: track.artists.map(artist => artist.artistName)
    })
}

export {getTrack}