import { SparklesIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Post from "./Post";

import axios from "axios";


export default function Feed(props) {
  const [posts, setPosts] = useState([]);
  const [anchorId, setAnchorId] = useState(null);

  useEffect(() => {
    axios.get('/api/feed').then((res) => {
      console.log(res.data);
      setPosts(res.data.posts)
    }).catch((err) => {
      console.log('Error in making /api/feed request');
      console.log(err);
    })
  }, [])
  

  return (
    <div className="h-fit border-gray-200 xl:ml-[9%] xl:pl-[230px] lg:ml-[10%] lg:pl-[60px] md:ml-[6%] md:pl-[60px] sm:ml-[6%] sm:pl-[60px] pl-[60px] flex-grow xl:max-w-[715px] lg:max-w-[535px] md:max-w-[520px] sm:max-w-[520px] max-w-[545px] space-y-3">
      <div className="flex py-2 px-3 sticky top-0 z-10 bg-white border-x-2 rounded-lg border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
        <div className="hoverEffect flex items-center justify-center px-0 ml-auto w-9 h-9">
          <SparklesIcon className="h-5" />
        </div>
      </div>
        {posts.map((post) => (
          <Post key={post} postId={post} {...props}/>
        ))}
    </div>
  );
}