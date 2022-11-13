import {take} from 'lodash'
import {GENRES_LIMIT} from '../../config'
import { Bars } from 'react-loader-spinner'

const ListLayout = ({genres}) => {
    genres = take(genres, GENRES_LIMIT)

    if(!genres) 
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
        <div className="h-[47vh] overflow-auto flex flex-col items-center mb-[10px]">
            {genres.map(genre => (
                <div key={genre.genre} className="bg-white px-[4px] py-[2px] my-[4px] text-[#FF6CFA] text-[25px] font-semibold">
                    {genre.genre}
                </div>
            ))}
        </div>
    )
}

export default ListLayout