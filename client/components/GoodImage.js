import React from "react"
import { useState } from "react";

export const GoodImage = ({src, className, Skeleton, ...props}) => {

    const [loadedImage, setLoadedImage] = useState(false);

    return (
        <React.Fragment>
            {(!loadedImage) && (
                <Skeleton />
            )}
            <img onLoad={() => setLoadedImage(true)} src={src} alt=":(" {...props} className={className + `${(!loadedImage)?' hidden':''}`}/>
        </React.Fragment>
    )
}