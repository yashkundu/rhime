import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useState, useEffect } from "react";

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import Comment from "./Comment";

import IconButton from '@mui/material/IconButton';
import axios from 'axios';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: 560,
  width: 460,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};

export const CommentModal = ({open, handleClose, postId, initComments, incrComment}) => {

  const [comments, setComments] = useState([]);
  const [anchorId, setAnchorId] = useState(null);
  const [newComment, setNewComment] = useState('')


  useEffect(() => {
    console.log('Setting InitComments ... ');
    if(initComments) setComments(initComments);
    else setComments([])
  }, [initComments])

  const onClickHandler = () => {
    if(newComment.length<1) return;
    axios.post(`/api/comment/${postId}`, {
      text: newComment
    }).then(() => {
      incrComment()
      // add the comment
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <div className="flex flex-col">
            <div className="space-y-4 h-[450px] mt-2 overflow-scroll">
              {comments.map((comment) => (
                <Comment key={comment.commentId} comment={comment}/>
              ))}
            </div>
            <div className="flex mt-3 shrink-0 items-center">
              <div className="shrink-0 px-3">
                <img src={null} alt="PI" className="w-10 h-10 rounded-full"/>
              </div>
              <div className="flex-grow">
                <input value={newComment} onChange={(e) => setNewComment(e.target.value)} type="text" placeholder="Add a comment" className="border-0 focus:border-gray-900 focus:border-b-[3px] border-b-2 border-slate-500 w-[100%]"/>
              </div>
              <div className="shrink-0 px-1 mx-2 cursor-pointer">
              <IconButton onClick={onClickHandler} disabled={newComment.length<1}>
                <AddCircleOutlineIcon className='w-8 h-8'/>
              </IconButton>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
  )

}