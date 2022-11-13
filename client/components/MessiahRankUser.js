
export default function MessiahRankUser({...props}) {
    return (
      <a rel="noreferrer" href={'/'} target="_blank">
        <div className="flex items-center justify-between px-4 py-2 space-x-1 hover:bg-gray-200 transition duration-500 ease-out">
          <div className="shrink-0 px-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="user-img"
              className="h-11 w-11 rounded-full"
            />
          </div>  
          <div className="flex-grow">
              <div className="font-semibold">
                @{'yashkundu'}
              </div>
              <div className="text-sm">
                <span className="pr-1 font-medium">67</span>
                <span className="font-normal">Recommends</span>
              </div>
          </div>
        </div>
      </a>
    );
}