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

class PostSquare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    render() {
        let post = this.props.post;
        let imgWidth = this.props.imgWidth;
        return (
            <>
                { post != null
                    ? (<span className="post-image-container">
                    <img className="post-image" style={{width: imgWidth, height: imgWidth}} src={post.img_url}></img>
                    <span className="post-meta">
                        {
                            post.likes != null &&
                            (<span className="meta likes-meta"><i className="fas fa-lg fa-heart"></i>{post.likes.length}</span>)
                        }
                        {
                            post.comments != null &&
                            (<span className="meta comments-meta"><i className="fas fa-lg fa-comment"></i>{post.comments.length}</span>)
                        }
                </span>
            </span>)
                    : <span style={{width: imgWidth, height: imgWidth}}></span>
                }
            </>
        );
    }
}

/*
                {post.likes != null &&
                    (<LikeCommentTooltip type='likes' data={post.likes} tooltipHeader='Liked By' />)}
                <br/>
                {post.comments != null &&
                    (<LikeCommentTooltip type='comments' data={post.comments} tooltipHeader='Comments By' />)}
 */

export default PostSquare;
