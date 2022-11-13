import React, {useEffect, useState} from 'react'

import ConnectedUser from '../components/ConnectedUser';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';

import Backdrop from '@mui/material/Backdrop';

import { Bars } from 'react-loader-spinner'

import axios from 'axios';

import {hof} from '../utils/hof'


// the number of rec users to be stored in memory
let counter = 0;
let canLoadNextResolver = null;
let userBuf = [];

const Connect = ({user: curUser, invokeSuccess, invokeFailure, ...props}) => {

    
    const [firstUser, setFirstUser] = useState({})
    const [secondUser, setSecondUser] = useState({})
    const [loading, setLoading] = useState(true)
    const [btnEnabled, setBtnEnabled] = useState(false)

    // disable during loading time or when no recommendations are available
    const disableBtn = () => {
        setBtnEnabled(false);
    }

    const enableBtn = () => {
        setBtnEnabled(true);
    }

    const nextUserPromise = () =>  (new Promise((resolve, reject) => {
        console.log('nextUserPromise --- ')
        if(userBuf.length>0) resolve(userBuf.shift())
        else {
            axios.get('/api/spotify/getUserRecommends')
            .then(res => {
                userBuf = res.data.recommends
                if(userBuf.length>0) resolve(userBuf.shift())
                else resolve(null)
            }).catch(err => {
                resolve(null)
            })
        }
    }));


    // this is a promise
    const getCurUserTopItems = axios.get(`/api/spotify/getTopItems/${curUser.userId}`)
    .then((res) => {
        const obj = {
            tracks: {},
            artists: {},
            genres: {}
        }
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
    }).catch((err) => {
        console.log(err);
    })

    
    useEffect(() => {
        // getting the initial recommends
        console.log('Running useEffect ------ ');
        const first = nextUserPromise()
        setFirstUser({
            nextUserPromise: first,
            canLoadNextPromise: new Promise(resolve => resolve()),
            currentSide: 0
        })

        first.then(() => {
            setLoading(false)
        }).catch((err) => {
            console.log(err);
        })
        
    }, []);

    const getFrontUser = () => {
        return (counter%2===0)?(firstUser):(secondUser);
    }

    const dislikeHandler = () => {
        clickHandler();
        getFrontUser().nextUserPromise.then((recUser) => {
            axios.post(`api/spotify/discardRecommend/${recUser.userId}`)
            .then(() => invokeSuccess('Sccess'))
            .catch((err) => {
                console.log(err)
                invokeFailure('Error')
            })
        })
    }

    const likeHandler = () => {
        clickHandler();
        getFrontUser().nextUserPromise.then((recUser) => {
            Promise.all([
                axios.post(`api/spotify/discardRecommend/${recUser.userId}`),
                axios.post(`api/userGraph/${recUser.userId}/toggleUser`)
            ]).then(() => invokeSuccess('Success'))
            .catch((err) => {
                console.log(err)
                invokeFailure('Error')
            })
        })
    }


    const canLoadNextGenerator = () => (new Promise((resolve, reject) => {
        canLoadNextResolver = resolve;
    }))

    

    const afterCurrent = (canLoadNextPromise, currentSide) => {
        console.log('afterCurrent --- ', currentSide, canLoadNextPromise);
        canLoadNextPromise.then(() => {
            console.log('CurrentSide --- ', currentSide);
            if(currentSide===0) {
                console.log('Setting first user');
                setFirstUser({
                    nextUserPromise: nextUserPromise(),
                    canLoadNextPromise: canLoadNextGenerator(),
                    currentSide: 0
                })
            } else {
                console.log('Setting second user')
                setSecondUser({
                    nextUserPromise: nextUserPromise(),
                    canLoadNextPromise: canLoadNextGenerator(),
                    currentSide: 1
                })
            }
            console.log('canLoadNextResolver --- ', canLoadNextResolver);
        }).catch(err => {
            console.log(err)
        })
    }

    const clickHandler = (e) => {
        console.log('Inside clicke Handler, canLoadNextResolver --- ', canLoadNextResolver);
        disableBtn()
        document.getElementById('toBeRotated').style.transform = `rotateY(${(counter+1)*180}deg)`
        counter++;
        setTimeout(() => {
            canLoadNextResolver()
        }, 700)
    }


    return (
        <div className="flex flex-col h-[90vh] xl:ml-[9%] xl:pl-[230px] lg:ml-[10%] lg:pl-[60px] md:ml-[6%] md:pl-[60px] sm:ml-[6%] sm:pl-[60px] pl-[60px] flex-grow xl:max-w-[950px] lg:max-w-[720px] md:max-w-[600px] sm:max-w-[590px] max-w-[560px] space-y-3">
            
            {/* <ConnectedUser user={user}/> */}

        {(loading)? (
            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
            >
            <Bars
                height="80"
                width="80"
                color="#f98b88"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
            </Backdrop>
        ): (
            <React.Fragment>
                <div className="flip-card mx-auto my-auto h-[80%] w-[75%] bg-transparent">
                    <div id="toBeRotated" className="rounded-[35px] flip-card-inner h-[100%] w-[100%] relative">
                        <div id="firstCard" className="flip-card-front absolute h-[100%] w-[100%]">
                            {/* user - {userId, similarity} */}
                            <ConnectedUser enableBtn={enableBtn} afterCurrent={afterCurrent} getCurUserTopItems={getCurUserTopItems}  recUser={firstUser} {...props}/>
                        </div>
                        <div id="secondCard" className="flip-card-back absolute h-[100%] w-[100%]">
                            <ConnectedUser enableBtn={enableBtn} afterCurrent={afterCurrent} getCurUserTopItems={getCurUserTopItems}  recUser={secondUser} {...props}/>
                        </div>
                    </div>
                </div> 

                {/*  recUser -> {nextUserPromise, canLoadNextPromise} */}

                <LowerButtons likeHandler={likeHandler} dislikeHandler={dislikeHandler} btnEnabled={btnEnabled}/>
            </React.Fragment>
        )}    
            
        </div>
    )
}

export default Connect

const LowerButtons = ({likeHandler, dislikeHandler, btnEnabled}) => {
    return (
        <div className="flex justify-center items-center">
            <div className='bg-white border-[1px] border-slate-300 shadow-lg rounded-[25px] flex space-x-[45px] px-[10px] py-[5px]'>
                <div className='flex justify-center items-center border-[1px] border-black w-[35px] h-[35px] rounded-full'>
                    <IconButton disabled={!btnEnabled} onClick={dislikeHandler} className='flipBtns' color='info'>
                        <ClearIcon />
                    </IconButton>
                </div>
                <div className='flex justify-center items-center border-[1px] border-black w-[35px] h-[35px] rounded-full'>
                    <IconButton disabled={!btnEnabled} onClick={likeHandler} className='flipBtns' color='error'>
                        <FavoriteIcon/>
                    </IconButton>
                </div>
            </div>
        </div>
    )
}


const genres = ['Pop', 'Hip hop', 'Desi Hip hop', 'Blues', 'Metallica', 'Indie', 'Rock', 'RnB', 'K-pop']




export const getServerSideProps = hof( async () => {
    return {
        props: {
            sideBars: true,
            authenticationReq: true,
            authorizationReq: true
        }
    }
})
