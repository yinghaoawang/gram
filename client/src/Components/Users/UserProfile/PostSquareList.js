import React, { useState, useEffect } from 'react';
import PostSquare from './PostSquare';
import './PostSquareList.css';

let range = [0,1,2];

const PostSquareList = ({posts}) => {
    const [imgWidth, setImgWidth] = useState();
    const [windowSize, setWindowSize] = useState({width: window.innerWidth, height: window.innerHeight});

    const handleResize = () => {
        let imageWidth = 0;
        let imgElement = document.getElementsByClassName('post-img-container')?.[0];
        if (imgElement != null) {
            imageWidth = imgElement.offsetWidth;
            setImgWidth(imageWidth);
        }
    }

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>{
            posts ? posts.reduce((a, v) => {
                // reduces the posts to rows of 3
                if (a.length == 0) a[0] = [];
                let latestRow = a[a.length - 1];
                if (latestRow.length == 3) {
                    a.push([]);
                    latestRow = a[a.length - 1];
                }
                a[a.length - 1].push(v);
                return a;
            }, [])
            .map((postRow, i) => {
                // display each row of 3
                return (
                    <div key={'postrow'+i} className="post-row">
                    {
                        range.map((i) => {
                            let post = postRow[i];
                            return (
                                <div key={'postrow' + i} className="post-square">
                                <div className="post-img-container">
                                {post != null && (<PostSquare post={post} imgWidth={imgWidth} />)}
                                </div>
                                </div>
                            )
                        })
                    }
                    </div>
                );
            }) : ''
        }</>
    )
}

export default PostSquareList;
