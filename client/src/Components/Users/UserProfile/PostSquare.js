import React, { useState } from 'react';
import './PostSquare.css';

const LikeCommentTooltip = ({type, data, tooltipHeader}) => {
    type = type.charAt(0).toUpperCase() + type.slice(1);
    return (<span className="tooltip">
        {type}: {data.length}
        {
            data != null ?
                <span className="tooltiptext">
                    <strong>{tooltipHeader}:</strong><br/>
                    {
                        data.map((d,i) => d.user != null &&
                             <span key={type + " user " +i}>{d.user.username}<br/></span>
                        )
                    }
                </span>:''
        }
        </span>
    )
}

const PostSquare = ({post, imgWidth}) => (
    <>
    { post != null
        ? (<span>
                {post.likes != null &&
                    (<LikeCommentTooltip type='likes' data={post.likes} tooltipHeader='Liked By' />)}
                <br/>
                {post.comments != null &&
                    (<LikeCommentTooltip type='comments' data={post.comments} tooltipHeader='Comments By' />)}
                <img style={{width: imgWidth, height: imgWidth}} src={post.img_url}></img>
            </span>)
        : <span style={{width: imgWidth, height: imgWidth}}></span>
    }
    </>
)

export default PostSquare;
