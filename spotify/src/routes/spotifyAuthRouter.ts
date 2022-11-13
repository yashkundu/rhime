import express from 'express'
const router = express.Router()

import { paramObjectIdValidator } from '@rhime/common'

import { notSpotifyAuthorized } from '../middlewares/notSpotifyAuthorized'
import { spotifyAuthorized } from '../middlewares/spotifyAuthorized'
import { checkAccessToken } from '../middlewares/checkAccessToken'

import { authorize } from '../controllers/authorize'
import {callback} from '../controllers/callback'
import {getAccessToken} from '../controllers/getAccessToken'
import {getTopArtists} from '../controllers/getTopArtists'
import {getTopTracks} from '../controllers/getTopTracks'
import { getTopItems } from '../controllers/getTopItems'

import {getUserRecommends} from '../controllers/getUserRecommends'
import {discardRecommend} from '../controllers/discardRecommend'


router.get('/authorize', notSpotifyAuthorized , authorize);
router.get('/callback', notSpotifyAuthorized, callback);
router.get('/getToken', checkAccessToken, getAccessToken);
router.get('/getTopArtists/:userId', spotifyAuthorized, paramObjectIdValidator('userId'), spotifyAuthorized, getTopArtists);
router.get('/getTopTracks/:userId', spotifyAuthorized, paramObjectIdValidator('userId'), getTopTracks);
router.get('/getTopItems/:userId', spotifyAuthorized, paramObjectIdValidator('userId'), getTopItems);
router.get('/getUserRecommends', spotifyAuthorized, getUserRecommends)
router.post('/discardRecommend/:userId', paramObjectIdValidator('userId'), spotifyAuthorized, discardRecommend)


export {router as spotifyAuthRouter}