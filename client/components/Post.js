import Moment from "react-moment";

import React from "react";

import Skeleton from '@mui/material/Skeleton';

import IconButton from '@mui/material/IconButton';
import { SpotifyBlackIcon } from "../components/icons"

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';

import {CommentModal} from './CommentModal'

import Tooltip from '@mui/material/Tooltip';

import MusicNoteIcon from '@mui/icons-material/MusicNote';


import axios from "axios";


  
import { useState, useEffect } from "react";

export default function Post({ postId, ...props }) {

    const [open, setOpen] = useState(false);
    const [initComments, setInitComments] = useState(null);

    const handleOpen = () => {
        if(!initComments) {
            axios.get(`/api/comment/${postId}`).then((res) => {
                console.log('Getting comments : ', res.data);
                setInitComments(res.data.comments)
            }).catch((err) => {
                console.log('Error in making /api/feed request');
                console.log(err);
            })
        }
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    // no. of likes
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState(0);
    const incrComments = () => setComments(prevState => prevState+1);

    // if the user has liked
    const [hasLiked, setHasLiked] = useState(false);
    const [postData, setPostData] = useState(null)
    
    useEffect(() => {
        axios.get(`/api/post/getPost/${postId}`).then((res) => {
            const post = {...(res.data.post)};
            Promise.all([
                axios.get(`/api/post/getTrack/${post.trackId}`),
                axios.get(`/api/user/${post.userId}/profile/forPost`),
                axios.get(`/api/likeCount/${postId}`),
                axios.get(`/api/comment/${postId}/count`),
                axios.get(`/api/like/${postId}`)
            ]).then(([{data: track}, {data: {userName, profileImage}}, {data: likes}, {data: comments}, {data: {isLiked}}]) => {
                post.userName = userName;
                post.trackName = track.trackName;
                post.listenUrl = track.listenUrl;
                post.image = track.image;
                post.artists = (track.artists.length>1)?(`${track.artists[0]} & ${track.artists[1]}`):(track.artists[0]);
                post.profileImage = profileImage;
                
                post.comments = comments.count;
                post.hasLiked = isLiked;
                
                let numLikes = likes.count
                if(isLiked) numLikes = Math.max(1, numLikes)
                post.likes = numLikes;
                setHasLiked(isLiked)
                setLikes(numLikes);
                setComments(comments.count);
                setPostData(post);
                console.log(post);
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }, []);

    function toggleLike() {
        let newHasLiked = !hasLiked
        setHasLiked(newHasLiked)
        let newLikes = postData.likes
        if(newHasLiked!==postData.hasLiked) newLikes += (newHasLiked)?(1):(-1);
        if(newHasLiked) newLikes = Math.max(1, newLikes)
        setLikes(newLikes);
    }

    async function likeClickHandler() {
        
        axios.post(`/api/like/${postId}`, {}, {
            params: {
                type: (!hasLiked)?1:0
            }
        })
        .then(() => {
            console.log('Successfully liked')
        }).catch((err) => {
            console.log('Error in liking');
            console.log(err);
            toggleLike();
        })
        toggleLike();
    }

    return (
        <div className="relative card space-y-2 text-lg">
            {/* Heading */}
            <div className="flex justify-between items-center">
                <div className="mx-2">
                    {(!postData) ? (<Skeleton animation="wave" variant="circular" width={55} height={55}/>) :
                    (<img className="w-[55px] h-[55px] rounded-full cursor-pointer" src={postData.profileImage} alt={'PI'} />)}
                </div>
                <div className="grow mx-2">
                    {(!postData) ? (
                    <>
                        <Skeleton animation="wave" height={17} width="50%" />
                        <Skeleton animation="wave" height={17} width="25%" />
                    </>) :
                    (
                    <div>
                    <h2 className=" font-semibold">{postData.userName}</h2>
                    <span className="text-lg -ml-2"><MusicNoteIcon style={{color: 'black'}} className='w-6 h-6'/>{postData.trackName} - {postData.artists}</span>
                    </div>)}
                </div>
                <div className="mx-2">
                    {(postData) && (
                    <Tooltip title="Listen the song">
                        <IconButton target='_blank' href={postData.listenUrl}>
                            <SpotifyBlackIcon className="w-[30px] h-[30px] cursor-pointer" />
                        </IconButton>
                    </Tooltip>)}
                </div>
            </div>
            {/* Posted Image */}
            <div className="relative">
                {(!postData) ? (<Skeleton sx={{ height: 350 }} animation="wave" variant="rectangular" />) :
                (<img className="w-full" src={postData.image} alt={postData.trackName} />)}
                
            </div>
            {/* Actions */}
            {(!postData) ? (
                <React.Fragment>
                    <Skeleton animation="wave" height={16} />
                    <Skeleton animation="wave" height={16} width="80%" />
                </React.Fragment>
            ) :
            (
            <div className="space-y-2">
                <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                        <IconButton onClick={likeClickHandler}>
                            {(hasLiked)?(
                                <FavoriteIcon style={{color: '#e61e42'}} className='w-8 h-8'/>
                            ):(
                            <FavoriteBorderIcon style={{color: 'black'}} className='w-8 h-8'/>)}
                        </IconButton>
                        <IconButton onClick={handleOpen}>
                            <ChatOutlinedIcon style={{color: 'black'}} className='w-8 h-8'/>
                        </IconButton>
                    </div>
                    <IconButton>
                        <BookmarksOutlinedIcon style={{color: 'black'}} className='w-8 h-8'/>
                    </IconButton>
                </div>
                <span className="px-3 font-semibold">{`${likes} like${(likes!==1) ? 's' : ''}`}</span>
                <p className="px-3">
                    <span className="font-semibold mr-1">{postData.userName} </span>
                    {'Some random caption here'}
                </p>
                <div onClick={handleOpen} className="px-3 text-base text-gray-600 cursor-pointer">
                    {(!comments) || ((comments===1) ?
                        (<span>View the single comment</span>) :
                        (<span>View all the {comments} comments</span>)
                    )}
                </div>
                <h3 className="px-3 text-xs text-gray-600">
                    <Moment 
                        className="mr-1" 
                        date={new Date(postData.createdAt)} 
                        format={'y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]'}
                        filter={(d) => (d.split(',')[0])}
                        trim 
                        durationFromNow/>
                    ago
                </h3>
            </div>
            )}
            

            {/* <div className="h-[1px] relative left-0 right-0 bg-gray-200 -mx-5"></div> */}

            {/* <div className="flex gap-4">
                <input
                className="focus:outline-none w-full"
                type="text"
                placeholder="Add a comment"
                />
                <button className="text-blue-500">Post</button>
            </div> */}
            <CommentModal open={open} handleClose={handleClose} postId={postId} incrComments={incrComments} initComments={initComments}/>
        </div>
    );
}