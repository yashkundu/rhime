import {
    FaceSmileIcon,
    PhotoIcon,
    XIcon,
} from "@heroicons/react/24/outline";


import { useState, useRef } from "react";

export default function Input() {
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const filePickerRef = useRef(null);

    const sendPost = async () => {
        if (loading) return;
        setLoading(true);

        


        if (selectedFile) {
        
        }

        setInput("");
        setSelectedFile(null);
        setLoading(false);
    };

    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
        }

        reader.onload = (readerEvent) => {
        setSelectedFile(readerEvent.target.result);
        };
    };

    function onSignOut() {
    }

    return (
        <>
        {true && (
            <div className="flex  border-b border-gray-200 p-3 space-x-3">
            <img
                onClick={onSignOut}
                src='https://img.freepik.com/free-vector/cheerful-cute-girl-greeting-with-namaste-cartoon-art-illustration_56104-737.jpg?t=st=1663971973~exp=1663972573~hmac=b546ce49404c67580af8da6b1c8f896b546f248ca80023a61e57a3b300033e31'
                alt="user-img"
                className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
            />
            <div className="w-full divide-y divide-gray-200">
                <div className="">
                <textarea
                    className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                    rows="2"
                    placeholder="What's happening?"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                ></textarea>
                </div>
                {selectedFile && (
                <div className="relative">
                    <XIcon
                    onClick={() => setSelectedFile(null)}
                    className="border h-7 text-black absolute cursor-pointer shadow-md border-white m-1 rounded-full"
                    />
                    <img
                    src={selectedFile}
                    alt='/24'
                    className={`${loading && "animate-pulse"}`}
                    />
                </div>
                )}
                <div className="flex items-center justify-between pt-2.5">
                {!loading && (
                    <>
                    <div className="flex">
                        <div
                        className=""
                        onClick={() => filePickerRef.current.click()}
                        >
                        <PhotoIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                        <input
                            type="file"
                            hidden
                            ref={filePickerRef}
                            onChange={addImageToPost}
                        />
                        </div>
                        <FaceSmileIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                    </div>
                    <button
                        onClick={sendPost}
                        disabled={!input.trim()}
                        className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                    >
                        Tweet
                    </button>
                    </>
                )}
                </div>
            </div>
            </div>
        )}
        </>
    );
}