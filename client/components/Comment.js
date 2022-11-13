import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { useEffect, useState } from 'react';

import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';

import Moment from "react-moment";

import axios from 'axios'

const Comment = ({comment}) => {

    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [commentData, setCommentData] = useState(null)

    useEffect(() => {

        Promise.all([
            axios.get(`/api/user/${comment.userId}/profile/forPost`),
            axios.get(`/api/likeCount/${comment.commentId}`),
            axios.get(`/api/like/${comment.commentId}`)
        ]).then(([{data: {userName, profileImage}}, {data: likes}, {data: {isLiked}}]) => {
            const commentObj = {...comment}
            commentObj.userName = userName;
            commentObj.profileImage = profileImage;
            commentObj.hasLiked = isLiked
            let numLikes = likes.count;
            if(hasLiked) numLikes = Math.max(), numLikes;
            commentObj.likes = numLikes;
            setLikes(numLikes);
            setHasLiked(isLiked)
            setCommentData(commentObj)
        })


    }, [])

    function toggleLike() {
        let newHasLiked = !hasLiked
        setHasLiked(newHasLiked)
        let newLikes = commentData.likes
        if(newHasLiked!==commentData.hasLiked) newLikes += (newHasLiked)?(1):(-1);
        if(newHasLiked) newLikes = Math.max(1, newLikes)
        setLikes(newLikes);
    }

    async function likeClickHandler() {
        axios.post(`/api/like/${comment.commentId}`, {}, {
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
        <div className="flex justify-center items-center">
            <div className='pl-3 pr-4 shrink-0'>
                {(!commentData) ? (<Skeleton animation="wave" variant="circular" width={47} height={47}/>) 
                : (<img src={commentData.profileImage} alt="User" className="w-[47px] h-[47px] rounded-full"/>)}
            </div>
            <div className='flex-grow'>
                {(commentData) ? (
                <React.Fragment>
                    <div className='break-words max-w-[285px]'>
                        <span className=' mr-3 font-bold'>{commentData.userName}</span>
                        {commentData.text}
                    </div>
                    <div className='font-light text-sm'>
                        <Moment 
                            className="mr-3" 
                            date={new Date(commentData.timeStamp)} 
                            format={'y [y], w [w], d [d], h [h], m [m], s [s]'} 
                            filter={(d) => (d.split(',')[0])}
                            trim 
                            durationFromNow/>
                        {(likes>0) && (
                            <span>{likes} like{(likes>1)?'s':''}</span>
                        )}
                    </div>    
                </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Skeleton animation="wave" height={15} width="85%" />
                        <Skeleton animation="wave" height={15} width="50%" />
                    </React.Fragment>
                )}
            </div>
            
            <div className='px-1 mx-2 pb-1 cursor-pointer'>
            {(commentData) && (
                <IconButton onClick={likeClickHandler}>
                    {(hasLiked)?(
                        <FavoriteIcon style={{color: '#e61e42'}} className='w-[25px] h-[25px]'/>
                    ):(
                    <FavoriteBorderIcon style={{color: 'black'}} className='w-[25px] h-[25px]'/>)}
                </IconButton>
            )}
            </div>
            
            
        </div>
    )
}


export default Comment