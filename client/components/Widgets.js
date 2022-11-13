import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import MessiahRankUser from "./MessiahRankUser";
import RecommendedUser from "./RecommendedUser";
import { useState } from "react";


export default function Widgets({ newsResults, randomUsersResults }) {
  const [articleNum, setArticleNum] = useState(3);
  const [randomUserNum, setRandomUserNum] = useState(3);
  return (
    <div className="lg:w-[420px] hidden md:w-[300px] md:inline ml-6 space-y-5 max-w-md">
      <div className="w-[90%] sticky top-0 bg-white py-1.5 z-5">
        <div className="flex items-center p-3 rounded-full relative xl:w-[100%]">
          <MagnifyingGlassIcon className="h-5 z-5 text-gray-500" />
          <input
            className="absolute inset-0 rounded-full pl-11 border-gray-500 text-gray-700 focus:shadow-lg focus:bg-white bg-gray-100 "
            type="text"
            placeholder="Search Rhime"
          />
        </div>
      </div>

      <div className="text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2 w-[90%] xl:w-[90%]">
        <div className="text-xl font-bold px-4 pb-3">Top Messiahs 😇</div>
          <MessiahRankUser/>
          <MessiahRankUser/>
        <button
          onClick={() => setArticleNum(articleNum + 3)}
          className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
        >
          Show more
        </button>
      </div>
      <div className="sticky top-16 text-gray-700 space-y-2 bg-gray-100 pt-2 rounded-xl w-[90%] xl:w-[90%]">
        <h4 className="font-bold text-xl px-4 pb-3">Find your Music Messiahs 😉</h4>
        <RecommendedUser/>
        <RecommendedUser/>
        <button
          onClick={() => setRandomUserNum(randomUserNum + 3)}
          className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
        >
          Show more
        </button>
      </div>
    </div>
  );
}