import React from 'react';
import './PostModal.css';
import {Link} from "react-router-dom";


const apiPath = '/api';

class PostModal extends React.Component {
    constructor(props) {
        super(props);
        this.goPrevPost = this.goPrevPost.bind(this);
        this.goNextPost = this.goNextPost.bind(this);
        this.state = {
            postIndex: null,
            posts: null,
        }
    }

    componentDidMount() {
        this.setState({posts: this.props.posts});
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.postIndex != prevProps.postIndex) {
            this.setState({postIndex: this.props.postIndex});
        }
    }

    goPrevPost() {
        this.setState({
            postIndex: Math.max(this.state.postIndex - 1, 0)
        });
    }
    goNextPost() {
        this.setState({
            postIndex: Math.min(this.state.postIndex + 1, this.state.posts.length - 1)
        });
    }
    printDate(date) {
        let d = new Date(date);
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
       return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }
    printDateDiff(startDate, endDate) {
        const diffInMs   = new Date(endDate) - new Date(startDate)
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        return Math.floor(diffInDays);
    }
    render() {
        let posts = this.state.posts;
        let show = this.props.show;
        let onClose = this.props.onClose;
        let postIndex = this.state.postIndex;
        let user = this.props.user;
        return (
            <>
                {show == true &&
                    <div className="modal-container">
                        <div className="modal-backdrop" onClick={onClose}>

                        </div>
                        <div className="modal-inner-with-buttons">
                            <div className="modal-button modal-left-button">
                                {
                                    this.state.postIndex > 0 ? (<i onClick={e => this.goPrevPost()} className="fas fa-chevron-left"></i>)
                                        : (<i style={{opacity: 0}} className="fas fa-chevron-left click-through"></i>)
                                }

                            </div>
                            <div className="modal-inner">


                                <div className="modal-inner-left">
                                    <img className="modal-img" src={posts != null && postIndex != null ? posts[postIndex].img_url : ''}></img>

                                </div>
                                <div className="modal-inner-right">
                                    <div className="infobox-top infobox-border-bottom">
                                        { user &&
                                        <div className="infobox-header">
                                            <Link to={'/user/' + user.id} className="infobox-link infobox-bold infobox-center-items" onClick={e => {e.preventDefault(); window.location.href='/user/' + user.id}}>
                                                <img className="infobox-pfp" src={user.pfp_url}></img>
                                                <span className="infobox-username">{user.username}</span>
                                            </Link>
                                        </div>
                                        }

                                    </div>
                                    <div className="infobox-bottom">
                                        {posts != null && postIndex != null ? (<>
                                            <div className="infobox-scrolling-comments infobox-border-bottom">
                                                <div className="infobox-comment-container">
                                                    {
                                                        posts[postIndex].comments.map(comment => {
                                                            return (
                                                                <div key={"post"+postIndex+"comment"+comment.id} className="infobox-comment">
                                                                    <div className="infobox-comment-left">
                                                                        <Link to={'/user/' +comment.user.id} onClick={(e) => {e.preventDefault(); window.location.href='/user/' +comment.user.id}}>
                                                                            <img src={comment.user.pfp_url}></img>
                                                                        </Link>
                                                                    </div>
                                                                    <div style={{display:"inline"}} className="infobox-comment-right comment-font">
                                                                        <Link to={'/user/' +comment.user.id} onClick={(e) => {e.preventDefault(); window.location.href='/user/' +comment.user.id}}>
                                                                            <span className="infobox-bold">{comment.user.username}</span>
                                                                        </Link>&nbsp;<span>{comment.message}</span>

                                                                        <div className="infobox-comment-date">{this.printDateDiff(comment.created_at, Date.now())}d</div>
                                                                    </div>
                                                                    <div className="infobox-comment-right-margin"><i className="far fa-xs fa-heart"></i></div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>

                                            </div>
                                            <div className="infobox-buttons infobox-center-items">
                                                <i className="far fa-lg fa-heart"></i>
                                                <i className="far fa-lg fa-comment"></i>
                                            </div>
                                            <div className="infobox-likes infobox-bold infobox-center-items">
                                                {posts[postIndex].likes.length} likes
                                            </div>
                                            <div className="infobox-date infobox-center-items infobox-border-bottom">
                                                {this.printDate(posts[postIndex].created_at)}
                                            </div>
                                            <div className="infobox-add-comment infobox-center-items">
                                                <textarea className="infobox-textarea comment-font" spellCheck="false" placeholder="Add a comment..."></textarea>
                                                <a className="infobox-post-button unselectable">Post</a>
                                            </div>
                                            </>): ''
                                        }
                                    </div>
                                </div>

                            </div>
                            <div className="modal-button modal-right-button">
                                {
                                    this.state.postIndex < this.state.posts.length - 1 ? <i onClick={e => this.goNextPost()} className="fas fa-chevron-right"></i>
                                        : (<i style={{opacity: 0}} className="fas fa-chevron-left click-through"></i>)
                                }

                            </div>
                        </div>


                    </div>
                }
            </>
        );
    }
}

export default PostModal;
