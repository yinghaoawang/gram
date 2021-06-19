import React, { useState, useEffect } from 'react';
import PostSquare from './PostSquare';
import './PostSquareList.css';

let range = [0,1,2];

const PostSquareList = React.forwardRef(({posts, showModal}, ref) => {
    return (
        <>{
            posts && posts.reduce((a, v, i) => {
                // reduces the posts to rows of 3
                if (a.length == 0) a[0] = [];
                let latestRow = a[a.length - 1];
                if (latestRow.length == 3) {
                    a.push([]);
                }
                v.index = i;
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

                            if (post == null) return (
                                <div key={'postrow' + i} className="post-square">
                                    <div className="post-image-container-wrapper">
                                        <span className="post-image-placeholder"></span>
                                    </div>
                                </div>
                            );
                            else if (post && post.hidden) return '';
                            else return (
                                <div key={'postrow' + i} className="post-square">
                                    <div className="post-image-container-wrapper" onClick={e => showModal(post.index)}>
                                        {post != null && (<PostSquare post={post} />)}
                                    </div>
                                </div>
                            )
                        })
                    }
                    </div>
                );
            })
        }</>
    )
});

export default PostSquareList;
