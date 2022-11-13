import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

import { useState, useEffect } from 'react';

import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

import Badge from '@mui/material/Badge';

import axios from 'axios';

export function ProfilePost({postId, ...props}) {

  const [postData, setPostData] = useState({})

  useEffect(() => {
    axios.get(`/api/post/getPost/${postId}`).then((res) => {
        const post = {...(res.data.post)};
        Promise.all([
            axios.get(`/api/post/getTrack/${post.trackId}`),
            axios.get(`/api/likeCount/${postId}`),
            axios.get(`/api/comment/${postId}/count`),
        ]).then(([{data: track}, {data: likes}, {data: comments}]) => {
            post.trackName = track.trackName;
            post.listenUrl = track.listenUrl;
            post.image = track.image;
            post.artists = (track.artists.length>1)?(`${track.artists[0]} & ${track.artists[1]}`):(track.artists[0]);
            post.comments = comments.count;
            post.likes = likes.count;
            setPostData(post);
            console.log(post);
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  }, []);

  return (
    <Card sx={{ maxWidth: 320 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="120"
          image={postData.image}
          alt={postData.trackName}
        />
        <CardContent>
          <div className='text-[25px] font-semibold'>
            {postData.trackName}
          </div>
          <div className='text-[18px] text-slate-600'>
            {postData.artists}
          </div>
          <div className='text-[15px] text-slate-400 mt-2'>
            {'Some random caption drtgsegserg rdghfg erth ehy h3here'}
          </div>
          <div className='mt-4 flex justify-center'>
            <Badge 
              sx={{
                "& .MuiBadge-badge": {
                  color: "#e61e42",
                  backgroundColor: "#ebd5d5",
                  fontSize: 14
                }
              }} 
              showZero
              className='mr-4' 
              badgeContent={postData.likes}>
              <FavoriteIcon style={{color: '#e61e42'}} className='w-8 h-8'/>
            </Badge>
            <Badge 
              sx={{
                "& .MuiBadge-badge": {
                  color: "#000000",
                  backgroundColor: "#d6d6d6",
                  fontSize: 14
                }
              }}
              showZero
              className='ml-4' 
              badgeContent={postData.comments} 
              color="secondary">
              <ChatOutlinedIcon style={{color: '#000000'}} className='w-8 h-8'/>
            </Badge>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
