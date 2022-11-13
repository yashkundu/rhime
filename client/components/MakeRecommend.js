import { useState } from "react"
import React from "react"
import { Autocomplete, TextField } from "@mui/material"

import {Button, Box} from '@mui/material'

import { Audio } from 'react-loader-spinner'

import { useRouter } from 'next/router'

import axios from 'axios'

import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';

let timer;
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

export default function MakeRecommend({user, handleCloseModal}) {

    
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState(null);
    const [caption, setCaption] = useState('')
    const [inputValue, setInputValue] = React.useState('');
    


    const btnClickHandler = (e) => {
        if(!value) return;
        axios.post('/api/post', {
            ...value
        }).then(res => {
            handleCloseModal();
            console.log('Success ... ');
            console.log(res.data);
        }).catch((e) => console.log(e))
    }

    const search = async (txt) => {
        try {
            setLoading(true)
            setOptions([])
            await checkAccessToken();
            let {data} = await axios.get('https://api.spotify.com/v1/search', {
                params: {
                    q: txt,
                    type: 'track',
                    market: 'IN',
                    limit: 5
                },
                headers: {
                    ['Authorization']: `Bearer ${token}`
                }
            })
            const tracks = [];
            data.tracks.items.forEach(track => {
                const obj = {};
                obj.trackName = track.name;
                obj.trackId = track.id;
                obj.listenUrl = track?.external_urls?.spotify
                obj.images = []
                track.album.images.forEach(image => {
                    obj.images.push(image.url)
                })
                obj.artists = []
                track.artists.forEach(artist => {
                    obj.artists.push({
                        artistName: artist.name,
                        artistId: artist.id
                    })
                })
                tracks.push(obj)
            })
            data = null
            setOptions(tracks)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
        
    }
      
    const startTimer = (txt) => {
        clearTimeout(timer)
        timer = setTimeout(async () => {
            await search(txt)
        }, 1000)
    }
    


    return (
        <div className="flex flex-col justify-center items-center">
            <div className="text-[25px] pb-[15px] font-bold">
                Recommend a Song 🎵
            </div>
            <div>
            <Autocomplete
                id="songSearch"
                options={options}
                sx={{ width: 300 }}
                loading={loading}
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                    if(newInputValue) startTimer(newInputValue)
                    else setOptions([])
                }}
                getOptionLabel={(option) => `${option.trackName} (${option.artists[0].artistName})`}
                renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <img
                        loading="lazy"
                        width="40"
                        src={option.images[2]}
                        srcSet={option.images[1]}
                        alt=""
                      />
                      {option.trackName} ({option.artists[0].artistName})
                    </Box>
                  )}
                renderInput={(params) => (
                    <TextField
                        onChange={(e) => setCaption(e.target.value)}
                        value={caption}
                        {...params}
                        label="Search for a song"
                        InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                            {loading ? (
                                <Audio
                                height="20"
                                width="20"
                                color="#6e8072"
                                ariaLabel="audio-loading"
                                wrapperStyle={{}}
                                wrapperClass="wrapper-class"
                                visible={true}
                            />
                            ) : null}
                            {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                        }}
                    />
                )}
            />
            </div>
            <div className="mt-[25px] width-[100%]">
            <textarea className="rounded-[20px] focus:shadow-xl" placeholder="Enter your caption" name="" id="" cols="29" rows="6">
            </textarea>
            </div>
            <div className="mt-[20px] self-end">
            <Button onClick={btnClickHandler} className="" variant="outlined" startIcon={<SpatialAudioOffIcon />}
            sx={{
              color: "#f98b88",
              borderColor: "#f98b88",
              padding: "15px 10px",
              marginLeft: "7px",
              borderRadius: "30px",
              fontSize: "18px",
              ':hover': {
                borderColor: "#f98b88",
                fontWeight: 'bold',
                backgroundColor: "#f98b88",
                color: "#FFFFFF"
              }
            }}
            disabled={!value}
          >
            Share
          </Button>
            </div>
        </div>
    )
}