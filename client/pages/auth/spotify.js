import { SpotifyIcon } from "../../components/icons"
import Link from 'next/link'


import { hof } from "../../utils/hof"

const onClickHandler = async () => {

}


const Spotify = ({...props}) => {


    return (
        <div className="flex flex-row h-screen w-screen bg-gradient-to-l from-lime-500 ">
            <Link href="/api/spotify/authorize" className="mx-auto my-auto flex items-center">
                <div onClick={onClickHandler} className="select-none px-[20px] py-[10px] rounded-[35px] border-[1px] border-slate-300 hover:border-slate-500 shadow-md active:shadow-lg cursor-pointer mx-auto my-auto flex items-center">
                    <div className="pr-[10px]">
                        <SpotifyIcon className="h-[40px] w-[40px]"/>
                    </div>
                    <div className="font-sans text-lg">Authorize Spotify</div>
                </div>
            </Link>
        </div>
    )
}

export default Spotify

export const getServerSideProps = hof( async () => {
    return {
        props: {
            sideBars: false,
            authenticationReq: true,
            authorizationReq: false
        }
    }
})