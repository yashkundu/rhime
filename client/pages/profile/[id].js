import React, { useEffect, useState } from "react";
import { ThreeDots  } from 'react-loader-spinner'

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import { Box } from "@mui/system";
import {
  Button,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Snackbar from '@mui/material/Snackbar';
import Skeleton from '@mui/material/Skeleton';

import {ProfilePost} from '../../components/ProfilePost'

import Link from 'next/link'

import {DEFAULT_PROFILE_IMAGE} from '../../config'

import { hof } from "../../utils/hof";

import {useRouter} from 'next/router'

import chunk from 'lodash/chunk'

import axios from "axios";

const SPOTIFY_BATCH_SIZE=50;

// ---------------------------------------------------------------------

let token = null;
let expDate = null;

const refreshAccessToken = async () => {
    try {
        const res = await axios.get('/api/spotify/getToken')
        const data = res.data
        token = data.token
        expDate = new Date(data.expDate)
    } catch (error) {
        console.log(error);
    }
}

const checkAccessToken = async () => {
    if(!token || !expDate || (expDate<new Date(Date.now()))) 
        await refreshAccessToken();
}

// ---------------------------------------------------------------------


const Profile = ({user, invokeSuccess, invokeFailure, ...props}) => {

    const router = useRouter()
    const {id} = router.query

    const fakePromise = new Promise(resolve => resolve({data: {}}))

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState(null);
    const [numMinions, setNumMinions] = useState(0);
    const [hasFollowed, setHasFollowed] = useState(false)
    const [followLoading, setFollowLoading] = useState(false)

    let artists = [];
    let artistIdsLoaded = false;
    let artistDetailsLoaded = false;
    const loadedArtistIds = () => {
        artistIdsLoaded = true;
    }
    const loadedArtistDetails = () => {
        artistDetailsLoaded = true;
    }
    
    let tracks = [];
    let trackIdsLoaded = false;
    let trackDetailsLoaded = false;
    const loadedTrackIds = () => {
        trackIdsLoaded = true;
    }
    const loadedTrackDetails = () => {
        trackDetailsLoaded = true;
    }

    useEffect(() => {
        Promise.all([
            axios.get(`/api/user/${id}/profile`),
            axios.get(`/api/userGraph/${id}/minionCount`),
            axios.get(`/api/userGraph/${id}/messiahCount`),
            ((user.userId!==id) ? axios.get(`/api/userGraph/${id}/isMinion`) : (fakePromise)),
            ((user.userId!==id) ? axios.get(`/api/userGraph/${id}/isMessiah`) : (fakePromise)),
            axios.get(`/api/feed/${id}`)
        ]).then(([{data: profileObj}, {data: {minionCount}}, {data: {messiahCount}}, {data: {isMinion}}, {data: {isMessiah}}, {data: {posts}}]) => {
            console.log('Successfull ...');
            const obj = {...profileObj}
            obj.fullName = (obj.firstName + ' ' + ((obj.lastName)?(obj.lastName):''));
            if(!obj.profileImage) obj.profileImage = DEFAULT_PROFILE_IMAGE;
            obj.minionCount = minionCount
            obj.messiahCount = messiahCount
            obj.isMinion = isMinion
            obj.isMessiah = isMessiah
            setPosts(posts)
            setHasFollowed(isMessiah)
            setNumMinions(minionCount)
            setProfile(obj)
        }).catch(err => {
            console.log('Error ... ');
            console.log(err);
            console.log(err.config);
        })
    }, [])

    const editClickHandler = () => {
        
    }
    
    const [portion, setPortion] = useState(1)

    const toggleFollow = () => (new Promise((resolve, reject) => {
        axios.post(`/api/userGraph/${id}/toggleUser`)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    }))

    const onClickHandler = () => {
        setFollowLoading(true)
        toggleFollow()
        .then(({isFollowing}) => {
            setHasFollowed(isFollowing)
            setNumMinions(prev => (prev + ((isFollowing)?1:-1)))
            invokeSuccess('Success')
        }).catch(err => {
            console.log(err)
            invokeFailure('Error')
        }).finally(() => setFollowLoading(false))
    } 


    return (
        <div className="h-fit xl:ml-[9%] xl:pl-[230px] lg:ml-[10%] lg:pl-[60px] md:ml-[6%] md:pl-[60px] sm:ml-[6%] sm:pl-[60px] pl-[60px] flex-grow xl:max-w-[850px] lg:max-w-[680px] md:max-w-[640px] sm:max-w-[620px] max-w-[630px] space-y-3">
            <Box className="border-l border-r border-gray-400">
                <Box className="bg-white sticky top-0 z-10" borderBottom="1px solid #ccc" padding="8px">
                    <Grid container alignItems="center">
                        <Grid item sx={{ mr: "10px" }}>
                            <Link href="/">
                            <IconButton>
                                <ArrowBackIcon />
                            </IconButton>
                            </Link>
                        </Grid>
                        <Grid item>
                        {(profile) ? (
                            <React.Fragment>
                                <Typography variant="h6">
                                    {profile.firstName}
                                </Typography>
                                <Typography sx={{ fontSize: "12px", color: "#555" }}>
                                    {2} recommends
                                </Typography>{" "}
                            </React.Fragment>
                        
                        ) : (
                            <React.Fragment>
                                <Skeleton animation="wave" height={17} width={130} />
                                <Skeleton animation="wave" height={17} width={100} />
                            </React.Fragment>
                        )}
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <Box position="relative">
                        <img
                        width="100%"
                        src='https://i.ibb.co/wMy9pC3/musical-symbols-wave-white-background-1308-78045.webp'
                        alt="background"
                        />
                    <Box
                        sx={{
                            position: "absolute",
                            top: 120,
                            left: 15,
                            background: "#eee",
                            borderRadius: "50%",
                        }}
                        >
                            {(profile) ? (
                                <img width="150px" src={profile.profileImage} alt="PI" />
                            ) : (
                                <Skeleton animation="wave" variant="circular" width={150} height={150}/>
                            )}
                        
                    </Box>
                </Box>
                    <Box textAlign="right" padding="10px 20px">
                        {(profile) && (
                            ((user.userId===id) ? (
                                <Button onClick={editClickHandler} className="" variant="outlined" startIcon={<EditIcon />}
                                sx={{
                                color: "#f98b88",
                                borderColor: "#f98b88",
                                padding: "7px 12px",
                                borderRadius: "20px",
                                fontSize: "16px",
                                ':hover': {
                                    borderColor: "#f98b88",
                                    fontWeight: 'bold',
                                    backgroundColor: "#f98b88",
                                    color: "#FFFFFF"
                                }
                                }}
                            >
                                Edit
                            </Button>
                            ) : (
                                ((hasFollowed) ?  (

                                    <Button onClick={onClickHandler} disabled={(followLoading)} className="" variant="outlined" startIcon={(followLoading)?(<></>):(<PersonRemoveIcon />)}
                                        sx={{
                                        color: "#6f6e70",
                                        borderColor: "#6f6e70",
                                        padding: (!(followLoading)?("7px 12px"):("7px 53px")),
                                        borderRadius: "20px",
                                        fontSize: "17px",
                                        ':hover': {
                                            borderColor: "#6f6e70",
                                            fontWeight: 'bold',
                                            backgroundColor: "#6f6e70",
                                            color: "#FFFFFF"
                                        }
                                        }}
                                        >
                                        {(followLoading) ? (
                                            <ThreeDots 
                                            height="30"
                                            width="30"
                                            color="#6f6e70"
                                            ariaLabel="tail-spin-loading"
                                            wrapperStyle={{}}
                                            wrapperClass=""
                                            visible={true}
                                        />
                                        ) : (
                                            'Unfollow'
                                        )}
                                    </Button>
                                ) : (
                                    
                                    <Button onClick={onClickHandler} disabled={(followLoading)} className="" variant="outlined" startIcon={(followLoading)?(<></>):(<PersonAddIcon />)}
                                        sx={{
                                        color: "#f98b88",
                                        borderColor: "#f98b88",
                                        padding: (!(followLoading)?("7px 12px"):("7px 41px")),
                                        borderRadius: "20px",
                                        fontSize: "17px",
                                        ':hover': {
                                            borderColor: "#f98b88",
                                            fontWeight: 'bold',
                                            backgroundColor: "#f98b88",
                                            color: "#FFFFFF"
                                        }
                                        }}
                                        >
                                    {(followLoading) ? (
                                        <ThreeDots 
                                        height="30"
                                        width="30"
                                        color="#f98b88"
                                        ariaLabel="tail-spin-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                        visible={true}
                                      />
                                    ) : (
                                        (profile.isMinion)?'Follow back':'Follow'
                                    )}
                                    
                                </Button>
                                    
                                ))
                            ))
                        )}  
                    </Box>
                    <Box padding="10px 20px">
                        {(profile) ? (
                            <React.Fragment>
                                <Typography className="text-[25px]" sx={{ fontWeight: "500" }}>
                                    {profile.fullName}
                                </Typography>
                                <Typography className="text-[20px]" sx={{color: "#555" }}>
                                    @{profile.userName}
                                </Typography>
                                <Typography className="text-[18px]" color="#333" padding="10px 0">
                                    {(profile.bio) && (profile.bio)}
                                </Typography>
                                
                                <Box display="flex">
                                <Typography className="text-[18px] mr-4" color="#555" marginRight="1rem">
                                    <strong className="mr-1" style={{ color: "black" }}>
                                        {profile.messiahCount}
                                    </strong>
                                    Messiahs😇
                                </Typography>
                                <Typography className="text-[18px]" color="#555" marginRight="1rem">
                                    <strong className="mr-1" style={{ color: "black" }}>
                                        {numMinions}
                                    </strong>
                                    Minions🙃
                                </Typography>
                                </Box>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Skeleton className="mt-[40px]" animation="wave" height={17} width="40%" />
                                <Skeleton animation="wave" height={17} width="20%" />
                                <Skeleton className="mt-[25px]" animation="wave" height={18} width="70%" />
                                <Skeleton animation="wave" height={18} width="35%" />
                            </React.Fragment>
                        )}
                        
                    </Box>
                {(profile) && (
                    <React.Fragment>
                        <div className="text-[18px] text-slate-400 my-4 flex justify-center space-x-8 border-b-2 border-slate-200">
                        <div onClick={() => setPortion(1)} className={"pb-2 cursor-pointer hover:text-black" + ((portion===1)?"border-solid border-b-4 border-[#f98b88] text-black":"")}>Recommends</div>
                        <div onClick={() => setPortion(2)} className={"pb-2 cursor-pointer hover:text-black" + ((portion===2)?"border-solid border-b-4 border-[#f98b88] text-black":"")}>Artists</div>
                        <div onClick={() => setPortion(3)} className={"pb-2 cursor-pointer hover:text-black" + ((portion===3)?"border-solid border-b-4 border-[#f98b88] text-black":"")}>Tracks</div>
                        </div>
                        {portion===1 && (<Recommends posts={posts} setPosts={setPosts}/>)}
                        {portion===2 && (<Artists artists={artists} artistIdsLoaded={artistIdsLoaded} loadedArtistIds={loadedArtistIds} artistDetailsLoaded={artistDetailsLoaded} loadedArtistDetails={loadedArtistDetails} userId={user.userId}/>)}
                        {portion===3 && (<Tracks tracks={tracks} trackIdsLoaded={trackIdsLoaded} loadedTrackIds={loadedTrackIds} trackDetailsLoaded={trackDetailsLoaded} loadedTrackDetails={loadedTrackDetails} userId={user.userId}/>)}
                    </React.Fragment>
                )}
                    
                </Box>
            </Box>
        </div>
    )
}

export default Profile

const Recommends = ({posts, setPosts, ...props}) => {
    return (
        <div className="flex flex justify-center items-center space-y-4">
            {posts.map((post) => (
                <ProfilePost key={post} postId={post}/>
             ))}
        </div>
    )
}

const Artists = ({artists, artistIdsLoaded, loadedArtistIds, artistDetailsLoaded, loadedArtistDetails, userId}) => {

    const [artistIdsLoadedState, setArtistIdsLoadedState] = useState(artistIdsLoaded);
    const [artistDetailsLoadedState, setArtistDetailsLoadedState] = useState(artistDetailsLoaded);

    const loadAllArtists = async () => {
        for(const arr of chunk(artists, SPOTIFY_BATCH_SIZE)) {
            const length = arr.length
            const queryParam = arr.reduce((prev, cur) => (prev+`,${cur.artistId}`), '')
            await checkAccessToken()
            const res = await axios.get('https://api.spotify.com/v1/artists', {
                params: {
                    ids: queryParam.substring(1)
                },
                headers: {
                    ['Authorization']: `Bearer ${token}`
                }
            })
            for(let i=0;i<length;i++) {
                arr[i].artistName = res.data.artists[i].name;
                arr[i].imageUrl = (res.data.artists[i].images[1]?.url || DEFAULT_PROFILE_IMAGE);
            }
        }
    }
    
    useEffect(() => {
        if(!artistIdsLoaded) {
            axios.get(`/api/spotify/getTopArtists/${userId}`)
            .then((res) => {
                console.log('Loaded artistIds');
                res.data.artists.forEach(artist => artists.push(artist))
                loadedArtistIds();
                setArtistIdsLoadedState(true);
                loadAllArtists().then(() => {
                    console.log('Loaded artistDetails');
                    loadedArtistDetails();
                    setArtistDetailsLoadedState(true);
                }).catch(error => {
                    console.log('Error in getting artistDetails');
                    console.log(error);
                })
            }).catch(error => {
                console.log('Error in getting artistIds');
                console.log(error)
            })
        } else if(!artistDetailsLoaded) {
            loadAllArtists().then(() => {
                console.log('Loaded artistDetails');
                loadedArtistDetails();
                setArtistDetailsLoadedState(true);
            }).catch(error => {
                console.log('Error in getting artistDetails');
                console.log(error);
            })
        }
    }, [])

    return (
        <div className="p-2">
            <div className="pb-6 text-center font-semibold text-[35px]">Top Artists 🎸</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                {artists.map(artist => (
                    <SingleArtist key={artist.artistName} artist={artist} artistLoaded={artistDetailsLoadedState}/>
                ))}
            </div>
        </div>
    )
}

const SingleArtist = ({artist, artistLoaded}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="flex p-4">
            <div className="mx-auto my-auto">
                <div className="">
                    {artistLoaded ? (
                        <>
                            {(!imageLoaded) && (
                                <Skeleton variant="circular" width={145} height={145} />
                            )}
                            <img onLoad={() => setImageLoaded(true)} src={artist.imageUrl} alt={artist.artistName} className={`rounded-full h-[145px] w-[145px] hover:bg-slate-200 cursor-pointer ${(!imageLoaded)?'hidden':''}`}/>
                        </>
                    ) : (
                        <Skeleton variant="circular" width={145} height={145} />
                    )} 
                </div>
                {artistLoaded ? (
                    <div className="max-w-[120px] text-center">{artist.artistName}</div>
                ) : (
                    <div className="mt-4 flex justify-center"><Skeleton animation="wave" height={15} width={100} /></div>
                )} 
                
            </div>
        </div>
    )
}



const Tracks = ({tracks, trackIdsLoaded, loadedTrackIds, trackDetailsLoaded, loadedTrackDetails, userId}) => {

    const [trackIdsLoadedState, setTrackIdsLoadedState] = useState(trackIdsLoaded);
    const [trackDetailsLoadedState, setTrackDetailsLoadedState] = useState(trackDetailsLoaded);

    
    const loadAllTracks = async () => {
        for(const arr of chunk(tracks, SPOTIFY_BATCH_SIZE)) {
            const length = arr.length
            const queryParam = arr.reduce((prev, cur) => (prev+`,${cur.trackId}`), '')
            await checkAccessToken()
            const res = await axios.get('https://api.spotify.com/v1/tracks', {
                params: {
                    ids: queryParam.substring(1)
                },
                headers: {
                    ['Authorization']: `Bearer ${token}`
                }
            })
            for(let i=0;i<length;i++) {
                arr[i].trackName = res.data.tracks[i].name;
                arr[i].listenUrl = (res.data.tracks[i]?.external_urls?.spotify || '');
                arr[i].imageUrl = (res.data.tracks[i].album.images[1]?.url || DEFAULT_PROFILE_IMAGE);
                arr[i].artists = res.data.tracks[i].artists.reduce((prev, cur) => (prev + `, ${cur.name}`), '').substring(2)
            }
        }
    }
    
    useEffect(() => {
        if(!trackIdsLoaded) {
            axios.get(`/api/spotify/getTopTracks/${userId}`)
            .then((res) => {
                console.log('Loaded trackIds');
                res.data.tracks.forEach(track => tracks.push(track))
                loadedTrackIds();
                setTrackIdsLoadedState(true);
                loadAllTracks().then(() => {
                    console.log('Loaded trackDetails');
                    loadedTrackDetails();
                    setTrackDetailsLoadedState(true);
                }).catch(error => {
                    console.log('Error in getting trackDetails');
                    console.log(error);
                })
            }).catch(error => {
                console.log('Error in getting trackIds');
                console.log(error)
            })
        } else if(!trackDetailsLoaded) {
            loadAllTracks().then(() => {
                console.log('Loaded trackDetails');
                loadedTrackDetails();
                setTrackDetailsLoadedState(true);
            }).catch(error => {
                console.log('Error in getting trackDetails');
                console.log(error);
            })
        }
    }, [])


    return (
        <div className="p-2">
            <div className="pb-6 text-center font-semibold text-[35px]">Top Tracks 🎶</div>
            <div className="px-4 space-y-6">
                {tracks.map(track => (
                    <SingleTrack key={track.trackName} track={track} trackLoaded={trackDetailsLoadedState}/>
                ))}
            </div>  
        </div>
    )
}

const SingleTrack = ({track, trackLoaded}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div onClick={() => window.open(track.listenUrl, "_blank")} className="flex items-center hover:bg-slate-200 cursor-pointer">
            <div className="shrink-0 ">
                {trackLoaded ? (
                    <>
                        {(!imageLoaded) && (
                            <Skeleton variant='rectangular' width={65} height={65} />
                        )}
                        <img onLoad={() => setImageLoaded(true)} src={track.imageUrl} alt={track.trackName} className={`w-[65px] h-[65px] ${(!imageLoaded)?'hidden':''}`}/>
                    </>
                ) : (
                    <Skeleton variant="rectangular" width={65} height={65} />
                )} 
                
            </div>
            <div className="flex-grow px-3">
                {trackLoaded ? (
                    <>
                        <div className="font-semibold text-lg">{track.trackName}</div>
                        <div className="text-sm">{track.artists}</div>
                    </>
                ) : (
                    <>
                        <Skeleton animation="wave" height={15} width={'65%'} />
                        <Skeleton animation="wave" height={12} width={'40%'} />
                    </>
                )} 
                
            </div>
        </div>
    )
}

export const getServerSideProps = hof( async () => {
    return {
        props: {
            sideBars: true,
            authenticationReq: true,
            authorizationReq: true
        }
    }
})