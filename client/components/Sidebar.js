import Image from "next/image";
import SidebarMenuItem from "./SidebarMenuItem";
import {
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";

import {Menu, MenuItem, Button, Modal, Box} from '@mui/material'
import React from "react";



import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

import MakeRecommend from "./MakeRecommend";

import AudiotrackIcon from '@mui/icons-material/Audiotrack';

import { useRouter } from "next/router";
import { useState } from "react";

import axios from 'axios'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '25px'
};







export default function Sidebar({user}) {
  const router = useRouter();

  

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  

  


  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseBottomOpts = () => {
    setAnchorEl(null)
  }

  const handleProfile = (event) => {
    handleCloseBottomOpts();
    router.push(`profile/${user.userId}`)
  };

  const handleLogout = async (event) => {
    handleCloseBottomOpts();

    await axios.post('/api/auth/signout')
    router.push('/auth/signin')
  };

  return (
    <div className="xl:ml-[9%] lg:ml-[10%] md:ml-[6%] sm:ml-[6%] flex flex-col xl:p-[8px] xl:items-start fixed h-full">
      {/* Rhime Logo */}
      <div className="cursor-pointer hidden mt-3 xl:inline xl:px-1">
        <Image
          width="150"
          height="150"
          alt="Rhime"
          src="https://i.ibb.co/f0MpNGJ/LogoName.png"
          ></Image>
      </div>

      <div className="cursor pointer p-[8px]  xl:hidden">
        <Image
          width="40"
          height="40"
          alt="R"
          src="https://i.ibb.co/gj8njW8/Logo.png"
          ></Image>
      </div>

      {/* Menu */}

      

      <div className="mt-4 mb-2.5">
        <SidebarMenuItem link={'/'} text="Home" Icon={HomeIcon} active />
        <SidebarMenuItem disabled link={''} text="Trending" Icon={TrendingUpIcon} />
        <SidebarMenuItem disabled link={''} text="Notifications" Icon={FavoriteBorderIcon} />
        <SidebarMenuItem link={'/connect'} text="Connect" Icon={PeopleAltIcon} />
        <SidebarMenuItem disabled link={''} text="Saved" Icon={BookmarksIcon} />
        <SidebarMenuItem link={`/profile/${user?.userId}`} text="Profile" Icon={SentimentSatisfiedAltIcon} />

      </div>

      {/* Button */}


            <div onClick={handleOpenModal} className="hoverEffect xl:hidden flex items-center text-gray-700 justify-center xl:justify-start text-lg space-x-3">
              <AudiotrackIcon className="" 
              sx={{
                color: "#f98b88",
                fontSize: 35
              }}/>
            </div>


          <Button onClick={handleOpenModal} className="hidden mt-3 xl:flex" variant="outlined" startIcon={<AudiotrackIcon />}
            sx={{
              color: "#f98b88",
              borderColor: "#f98b88",
              padding: "15px 15px",
              marginLeft: "7px",
              borderRadius: "35px",
              fontSize: "18px",
              ':hover': {
                borderColor: "#f98b88",
                fontWeight: 'bold',
                backgroundColor: "#f98b88",
                color: "#FFFFFF"
              }
            }}
          >
            Recommend
          </Button>

          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <MakeRecommend user={user} handleCloseModal={handleCloseModal}/>
            </Box>
          </Modal>

          {/* Mini-Profile */}

          <Menu
            className="mb-[20px]"
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseBottomOpts}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem className="px-[25px] py-3 text-[21px]" onClick={handleProfile}>😀 Profile</MenuItem>
            <MenuItem className="px-[25px] py-3 text-[21px]" onClick={handleLogout}>👿 Logout</MenuItem>
          </Menu>

          <div className="flex items-end justify-center pb-9 xl:justify-start mt-auto">
            <div onClick={handleClick} className="hoverEffect text-gray-700 flex items-center justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="user-img"
                className="h-11 w-11 rounded-full xl:mr-2"
              />
              <div className="leading-5 hidden xl:inline self-center">
                <h4 className="font-bold">{'yashkundu'}</h4>
                <p className="text-gray-500">@{'mf'}</p>
              </div>
              <EllipsisHorizontalCircleIcon className="h-5 xl:ml-8 hidden xl:inline self-center" />
            </div>
          </div>
    </div>
  );
}