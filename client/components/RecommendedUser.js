import Chip from '@mui/material/Chip';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const RecommendedUser = ({props}) => {
    return (
        <div className="flex items-center justify-center mb-2">
            <div className="shrink-0 px-3">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="user-img"
                    className="h-10 w-10 rounded-full"
                />
            </div>  
            <div className="flex-grow mb-2 mb-solid">
                <div className="font-semibold">Yash Kundu</div>
                <div className="font-light text-sm">(@{'yashkundu'})</div>
                <div className="pt-1 pb-2 border-b-[1px] border-black">
                    <Chip className='mr-2' variant="outlined" label="Pop" color="info" size="small" icon={<MusicNoteIcon />} />
                    <Chip className='mr-2' variant="outlined" label="Metallica" color="info" size="small" icon={<MusicNoteIcon />} />
                </div>
            </div>
            <div className="shrink-0 px-3">
                <button className="px-2 py-1 rounded-[18px] bg-[#f98b88] hover:bg-[#e30913] text-white">Follow</button>
            </div>
        </div>
    )
}

export default RecommendedUser