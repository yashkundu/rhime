import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton } from '@mui/material';
import ListLayout from './ConnectedLayouts/listLayout';
import SquareLayout from './ConnectedLayouts/squareLayout';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import {Chip} from '@mui/material';

import Skeleton from '@mui/material/Skeleton';
import { Bars } from 'react-loader-spinner'

import {take} from 'lodash'

import {DEFAULT_PROFILE_IMAGE} from '../config'

import { useEffect, useState } from 'react';
import axios from 'axios';

import { keys, sortBy, filter, map } from 'lodash';

import { GoodImage } from './GoodImage';

import { Bat } from './icons';

const ConnectedUser = ({recUser, enableBtn, afterCurrent, user, getCurUserTopItems , ...props}) => {
    // recUser - Promise<{userId, similarityScore}>

    console.log('ConnectedUser mounted --- ', recUser.currentSide, recUser.nextUserPromise, recUser.canLoadNextPromise)

    const [screen, setScreen] = useState(1)
    const leftClickHandler = () => {
        if(screen>1) setScreen(prev => prev-1)
    }
    const rightClickHandler = () => {
        if(screen<7) setScreen(prev => prev+1)
    }

    const [recUserExists, setRecUserExists] = useState(false)

    const [bottomProfile, setBottomProfile] = useState(null)
    const [userProfile, setUserProfile] = useState(null)
    const [commonTracks, setCommonTracks] = useState(null)
    const [commonArtists, setCommonArtists] = useState(null)
    const [commonGenres, setCommonGenres] = useState(null)
    const [topArtists, setTopArtists] = useState(null)
    const [topTracks, setTopTracks] = useState(null)
    const [topGenres, setTopGenres] = useState(null)

    const [displayGenres, setDisplayGenres] = useState([])




    useEffect(() => {
    console.log('Inside ConnectedUser useEffect')
    console.log('Connected User --- ', recUser);
    if(!recUser.nextUserPromise) {
        setRecUserExists(false)
        return;
    }
    console.log('Pup --- ', recUser);
    recUser.nextUserPromise
    .then(user => {
        if(user===null) {
            setRecUserExists(false);
            return;
        }

        
        setBottomProfile(null)
        setUserProfile(null)
        setTopTracks(null)
        setTopArtists(null)
        setTopGenres(null)
        setCommonTracks(null)
        setCommonArtists(null)
        setCommonGenres(null)
        setDisplayGenres([])
        setScreen(1)

        setRecUserExists(true)
        console.log('RecUser --- ', recUser)
        afterCurrent(recUser.canLoadNextPromise, 1-recUser.currentSide)
        console.log('In useEffect ', recUser.currentSide, user.userId)
        const getProfile = axios.get(`/api/user/${user.userId}/profile`)
        .then(res => {
            const profileObj = {
                ...res.data,
                similarity: user.similarity
            }
            if(!profileObj.profileImage) profileObj.profileImage = DEFAULT_PROFILE_IMAGE;
            return profileObj
        }).catch((err) => (err))

        const minionCount = axios.get(`/api/userGraph/${user.userId}/minionCount`)

        const recommendCount = axios.get(`/api/post/getPostCount/${user.userId}`)

        getProfile.then((profileObj) => {
            setBottomProfile({              //----------------------
                userName: profileObj.userName,
                firstName: profileObj.firstName,
                name: (profileObj.firstName + (profileObj.lastName?profileObj.lastName:'')),
                similarity: profileObj.similarity,
                profileImage: profileObj.profileImage,
                age: profileObj.age
            })
        }).catch(err => console.log(err))

        Promise.all([
            getProfile,
            minionCount,
            recommendCount
        ]).then(([profileObj, {data: {minionCount}}, {data: {count}}]) => {
            setUserProfile({         //--------------------------------------
                ...profileObj,
                minionCount: minionCount,
                recommendCount: count
            })
            enableBtn()
        }).catch(err => console.log(err))

        const getRecUserTopItems = axios.get(`/api/spotify/getTopItems/${user.userId}`)
        .then(res => {
            const obj = {
                tracks: {},
                artists: {},
                genres: {}
            }
            console.log('Top items of User --- ', res.data.items);
            res.data.items.forEach(item => {
                switch (item.type) {
                    case '0':
                        obj.tracks[item.itemId] = item.wt;
                        break;
                    case '1':
                        obj.artists[item.itemId] = item.wt;
                        break;
                    case '2':
                        obj.genres[item.itemId] = item.wt
                        break;
                }
            })
            return obj;
        }).catch(err => (err))

        getRecUserTopItems
        .then((recUserTopItems) => {
            const topTracks = map(sortBy(keys(recUserTopItems.tracks), (key) => {
                return -1*recUserTopItems.tracks[key]
            }), (value) => ({
                itemId: value,
                wt: recUserTopItems.tracks[value]
            }))
            setTopTracks(topTracks)

            const topArtists = map(sortBy(keys(recUserTopItems.artists), (key) => {
                return -1*recUserTopItems.artists[key]
            }), (value) => ({
                itemId: value,
                wt: recUserTopItems.artists[value]
            }))
            setTopArtists(topArtists)

            const topGenres = map(sortBy(keys(recUserTopItems.genres), (key) => {
                return -1*recUserTopItems.genres[key]
            }), (value) => ({
                genre: value,
                wt: recUserTopItems
            }))
            setTopGenres(topGenres)
            setDisplayGenres(take(topGenres, 3))
            
            
        }).catch(err => console.log(err));


        Promise.all([getCurUserTopItems, getRecUserTopItems])
        .then(([curUserTopItems, recUserTopItems]) => {
            const commonTracks = map(sortBy(filter(keys(recUserTopItems.tracks), (key) => (Boolean(curUserTopItems.tracks[key]))), (key) => {
                return -1*curUserTopItems.tracks[key]
            }), (key) => ({
                itemId: key,
                wt: curUserTopItems.tracks[key]
            }));
            setCommonTracks(commonTracks)

            const commonArtists = map(sortBy(filter(keys(recUserTopItems.artists), (key) => (Boolean(curUserTopItems.artists[key]))), (key) => {
                return -1*curUserTopItems.artists[key]
            }), (key) => ({
                itemId: key,
                wt: curUserTopItems.artists[key]
            }));
            setCommonArtists(commonArtists)

            const commonGenres = map(sortBy(filter(keys(recUserTopItems.genres), (key) => (Boolean(curUserTopItems.genres[key]))), (key) => {
                return -1*curUserTopItems.genres[key]
            }), (key) => ({
                genre: key,
                wt: curUserTopItems.genres[key]
            }));
            setCommonGenres(commonGenres)

            console.log('Common Tracks --- ', commonTracks);
            console.log('Common Artists --- ', commonArtists)
            console.log('Common Genres', commonGenres);

        }).catch((err) => (err));

    }).catch(err => {
        console.log(err)
    });   

    }, [recUser])

    const simpleBorder = "flex-grow border-b-[4px]"
    const selectedBorder = "flex-grow border-b-[4px] border-slate-500"

    return (
        <div className="border-[1px] rounded-[35px] border-slate-300 shadow-md relative h-[100%] w-[100%]">
            {(recUserExists) ? (
            <>
                <div className="absolute top-[0%] bg-transparent space-x-[5px] flex justify-between h-[15px] w-[100%] px-[22px]">
                    <div className={(screen===1)?selectedBorder:simpleBorder}></div>
                    <div className={(screen===2)?selectedBorder:simpleBorder}></div>
                    <div className={(screen===3)?selectedBorder:simpleBorder}></div>
                    <div className={(screen===4)?selectedBorder:simpleBorder}></div>
                    <div className={(screen===5)?selectedBorder:simpleBorder}></div>
                    <div className={(screen===6)?selectedBorder:simpleBorder}></div>
                    <div className={(screen===7)?selectedBorder:simpleBorder}></div>
                </div>
                <div className="flex h-[100%]">
                    <div className="absolute bg-transparent shrink-0 h-[100%] flex items-center">
                        <IconButton onClick={leftClickHandler} size="medium">
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <div className="flex-grow h-[100%]">
                        {screen===1 && (<Screen1 displayGenres={displayGenres} userProfile={userProfile} />)}
                        {screen===2 && (<Screen2 bottomProfile={bottomProfile} commonTracks={commonTracks}/>)}
                        {screen===3 && (<Screen3 bottomProfile={bottomProfile} commonArtists={commonArtists}/>)}
                        {screen===4 && (<Screen4 bottomProfile={bottomProfile} commonGenres={commonGenres}/>)}
                        {screen===5 && (<Screen5 bottomProfile={bottomProfile} topTracks={topTracks}/>)}
                        {screen===6 && (<Screen6 bottomProfile={bottomProfile} topArtists={topArtists}/>)}
                        {screen===7 && (<Screen7 bottomProfile={bottomProfile} topGenres={topGenres}/>)}
                    </div>
                    <div className="absolute bg-transparent left-[100%] -translate-x-[100%] shrink-0 h-[100%] flex items-center">
                        <IconButton onClick={rightClickHandler} size="medium">
                            <ChevronRightIcon />  
                        </IconButton>
                    </div>
                </div>
            </>
            ) : (
                <div className='bg-white rounded-[35px] h-[100%] flex flex-col items-center justify-center'>
                    <Bat className='h-[200px] w-[200px]'/>
                    <div>
                        No more recommendations for now :)
                    </div>
                </div>
            )}
            
        </div>
    )
}

export default ConnectedUser



const BottomUser = ({bottomProfile}) => {
    const CustomSkeleton = () => {
        return (
            <Skeleton variant="circular" width={44} height={44} />
        )
    }
    return (
        <div className='bg-white flex items-center flex-grow rounded-b-[35px]'>
            <div className='shrink-0 px-4'>
                {(bottomProfile)? (
                    <GoodImage src={bottomProfile.profileImage} className="h-[44px] w-[44px] rounded-full" Skeleton={CustomSkeleton}/>
                ): (
                    <CustomSkeleton />
                )}
                
            </div>
            <div className='flex-grow flex flex-col items-end pr-[40px] justify-center'>
                <div>
                    {(bottomProfile) ? (
                        <>
                            <span className='font-semibold'>{bottomProfile.name}</span>
                            {(bottomProfile.age) && (<span>, {bottomProfile.age}</span>)}
                        </>
                    ) : (
                        <Skeleton variant="rectangular" width={'40%'} height={20} />
                    )}
                    
                </div>
                <div className='text-[15px] text-slate-500 -mt-1'>
                    {(bottomProfile) ? (
                        <span>
                            @{bottomProfile.userName}
                        </span>
                    ) : (
                        <Skeleton variant="rectangular" width={'25%'} height={20} />
                    )}
                </div>
            </div>
        </div>
    )
}

const Screen1 = ({userProfile, displayGenres}) => {

    console.log('displayGenres --- ', displayGenres);

    

    const CustomSkeleton = () => {
        return (
            <Skeleton variant="circular" width={120} height={120} className='mx-auto mt-[70px]'/>
        )
    }

    return (
        <div className='h-[100%] bg-slate-100 rounded-[35px] flex flex-col'>
           <div className='flex flex-col items-center h-[100%] w-[100%]'>
                {(userProfile) ? (
                    <>
                        <div className='flex'>
                        <GoodImage src={userProfile.profileImage} className="h-[120px] w-[120px] rounded-full mx-auto mt-[70px]" Skeleton={CustomSkeleton}/>
                        </div>
                        <div className='mt-[30px]'>
                            <span className='font-semibold'>{userProfile.name}</span>
                            {(userProfile.age) && (
                                <span className='text-[15px]'>, {userProfile.age}</span>
                            )}
                        </div>
                        <div className='-mt-[5px] text-[16px]'>@{userProfile.userName}</div>
                        <div className='pt-[8px] mt-[10px] space-x-2'>
                            {displayGenres.map(genre => (
                                <Chip key={genre.genre} icon={<AudiotrackIcon />} label={genre.genre} variant="outlined" size="small" color="primary"/>
                            ))}
                        </div>
                        <div className='mt-[15px] text-slate-600 font-mono text-[15px] font-semibold px-[40px]'>
                            {(userProfile.bio) && (userProfile.bio)}
                        </div>
                        <div className='absolute top-[100%] -translate-y-[100%] bg-gray-200 flex justify-center items-center rounded-b-[35px] h-fit w-[100%] py-[15px]'>
                            <div className='flex flex-col items-center px-[25px] border-r-[1px] border-black'>
                                <div>Minions</div>
                                <div className='font-sans'>{userProfile.minionCount}</div>
                            </div>
                            <div className='flex flex-col items-center px-[25px] border-r-[1px] border-black'>
                                <div>Recommends</div>
                                <div className='font-sans'>{userProfile.recommendCount}</div>
                            </div>
                            <div className='flex flex-col items-center px-[25px]'>
                                <div>Similarity</div>
                                <div className='font-sans'>{String(Math.round(userProfile.similarity*100)) + ' %'}</div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='h-[100%] flex flex-col items-center justify-center'>
                        <Bars
                            height="70"
                            width="70"
                            color="#fff"
                            ariaLabel="bars-loading"
                            wrapperClass=""
                            visible={true}
                        />
                    </div>
                )}
                
            </div> 
        </div>
    )
}

const Screen2 = ({commonTracks, bottomProfile}) => {
    console.log('Inside screen 2 CommonTracks --- ', commonTracks)
    return (
        <div className='h-[100%] bg-[#D3F65E] rounded-[35px] flex flex-col'>
            <div className='mx-[10px] pt-[7%] pb-[4%] text-center font-semibold text-[25px]'>
                The music we both love 💞
            </div>
            <SquareLayout items={commonTracks} isTrack/>
            <BottomUser bottomProfile={bottomProfile}/>
        </div>

    )
}

const Screen3 = ({commonArtists, bottomProfile}) => {
    return (
        <div className='h-[100%] bg-[#D3F65E] rounded-[35px] flex flex-col'>
            <div className='mx-[10px] pt-[7%] pb-[4%] text-center font-semibold text-[25px]'>
                The artists we both like 🎤
            </div>
            <SquareLayout items={commonArtists} />
            <BottomUser  bottomProfile={bottomProfile}/>
        </div>
    )
}

const Screen4 = ({commonGenres, bottomProfile}) => {
    return (
        <div className='h-[100%] bg-[#FF6CFA] rounded-[35px] flex flex-col'>
            <div className='mx-[10px] pt-[7%] pb-[4%] text-center font-semibold text-[25px]'>
                The genres that unite us 💛
            </div>
            <ListLayout genres={commonGenres} />    
            <BottomUser bottomProfile={bottomProfile}/>        
        </div>
    )
}

const Screen5 = ({topTracks, bottomProfile}) => {
    return (
        <div className='h-[100%] bg-[#FFE455] rounded-[35px] flex flex-col'>
            <div className='mx-[10px] pt-[7%] pb-[4%] text-center font-semibold text-[25px]'>
                My top tracks 🎧
            </div>
            <SquareLayout items={topTracks} isTrack/>
            <BottomUser bottomProfile={bottomProfile}/>
        </div>
    )
}

const Screen6 = ({topArtists, bottomProfile}) => {
    return (
        <div className='h-[100%] bg-[#D3F65E] rounded-[35px] flex flex-col'>
            <div className='mx-[10px] pt-[7%] pb-[4%] text-center font-semibold text-[25px]'>
                My top artists 🎤
            </div>
            <SquareLayout items={topArtists}/>
            <BottomUser bottomProfile={bottomProfile}/>
        </div>
    )
}



const Screen7 = ({topGenres, bottomProfile}) => {
    return (
        <div className='h-[100%] bg-[#FF6CFA] rounded-[35px] flex flex-col'>
            <div className='mx-[10px] pt-[7%] pb-[4%] text-center font-semibold text-[25px]'>
                My music genres 🎶
            </div>
            <ListLayout genres={topGenres} />
            <BottomUser bottomProfile={bottomProfile}/>
        </div>
    )
}