import { GoodImage } from "../GoodImage"
import {take} from 'lodash'

import {ITEMS_LIMIT} from '../../config'
import { useEffect, useState } from "react";

import Skeleton from '@mui/material/Skeleton';

import axios from 'axios'
import {DEFAULT_PROFILE_IMAGE} from '../../config'

import { Bars } from 'react-loader-spinner'

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

const SquareLayout = ({items, isTrack}) => {

    items = take(items, ITEMS_LIMIT);
    const [itemsList, setItemsList] = useState(items)

    const CustomSkeleton = () => {
        return (
            <Skeleton variant="rectangular" width={60} height={60} className='rounded-[15px]'/>
        )
    }

    useEffect(() => {
        if(!items) return;
        (async () => {
            await checkAccessToken();
            axios.get(`https://api.spotify.com/v1/${(isTrack)?'tracks':'artists'}`, {
                params: {
                    ids: items.reduce((prev, cur) => (prev+`,${cur.itemId}`), '').substring(1)
                },
                headers: {
                    ['Authorization']: `Bearer ${token}`
                }
            }).then(res => {
                const newItemsList = [];
                for(let i=0;i<items.length;i++) {
                    newItemsList.push({
                        name: ((isTrack)?(res.data.tracks[i].name):(res.data.artists[i].name)),
                        imageUrl: ((isTrack)?(res.data.tracks[i].album.images[1]?.url):(res.data.artists[i].images[1]?.url)) || DEFAULT_PROFILE_IMAGE,
                        ...(isTrack && {artist: res.data.tracks[i].artists[0]?.name || ''})
                    })
                }
                setItemsList(newItemsList)
            }).catch(err => {
                console.log(err)
            })
        })();
    }, [])

    if(!items) 
        return (
            <Bars
                height="70"
                width="70"
                color="#fff"
                ariaLabel="bars-loading"
                wrapperClass=""
                visible={true}
            />
        )


    return (
        <div className="h-[47vh] overflow-auto grid sm:grid-cols-3 grid-cols-2 gap-[10px] px-[25px] mb-[10px]">
            {itemsList.map(item => (
                <div key={item.name} className="flex flex-col items-center">
                    {(item.imageUrl) ? (
                        <GoodImage src={item.imageUrl} className="h-[60px] w-[60px] rounded-[15px]" Skeleton={CustomSkeleton}/>
                    ) : (
                        <CustomSkeleton />
                    )}
                    
                    {(isTrack)? (
                        <div className="overlay-hidden flex flex-col items-center">
                            {(item.name) ? (
                                <>
                                    <div className="font-semibold">{item.name}</div>
                                    <div>{item.artist}</div>
                                </>
                            ) : (
                                <>
                                    <Skeleton variant="rectangular" width={'80%'} height={15} />
                                    <Skeleton variant="rectangular" width={'75%'} height={15} />
                                </>
                            )}
                            
                        </div>
                    ): (
                        <div className="overlay-hidden text-[12px]">
                            {(item.name) ? (
                                <div>{item.name}</div>
                            ) : (
                                <Skeleton variant="rectangular" width={'70%'} height={14} />
                            )}
                            
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default SquareLayout