import React from 'react';
import './PostModal.css';
import {Link} from "react-router-dom";
import AuthContext from "../../../AuthContext";


const apiPath = '/api';

class PostModal extends React.Component {
    constructor(props) {
        super(props);
        this.goPrevPost = this.goPrevPost.bind(this);
        this.goNextPost = this.goNextPost.bind(this);
        this.toggleLike = this.toggleLike.bind(this);
        this.state = {
            postIndex: null,
            posts: null,
            userLikesPost: false,
            currCommentsLoaded: false,
            commentBeingPosted: false,
        }
        this.updateUserLikePost = this.updateUserLikePost.bind(this);
    }

    static contextType = AuthContext;

    componentDidMount() {
        this.setState({posts: this.props.posts});
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.postIndex != prevProps.postIndex) {
            await this.setState({postIndex: this.props.postIndex});
            await this.onPostIndexChange();
        }
    }

    async onPostIndexChange() {
        await this.setState({currCommentsLoaded: false});
        this.updateUserLikePost();
        this.updateCurrComments();

    }

    updateUserLikePost() {
        let currPost = this.state.posts[this.state.postIndex];
        console.log(this.context);
        let currUser = this.context.currUser;
        if (currUser == null) return;

        console.log("checking");
        for (let like of currPost.likes) {
            if (like.user_id == currUser.id) {
                this.setState({userLikesPost: true});
                return;
            }
        };
        this.setState({userLikesPost: false});
    }

    async postComment(message) {
        if (this.state.commentBeingPosted) return;
        let currPost = this.state.posts[this.state.postIndex];
        let currUser = this.context.currUser;
        if (currUser == null) return;
        let originalPostIndex = this.state.postIndex;
        this.setState({commentBeingPosted: true})
        await new Promise(resolve => setTimeout(resolve, 3000));
        let url = apiPath + '/comments/create';
        let data = {user_id: currUser.id, post_id: currPost.id, message}
        await fetch(url, {
            method: "POST",
            body: new URLSearchParams({comment: JSON.stringify(data)}),
        }).then(async res => {
            console.log(res);
            if (res.ok) {
                console.log('OK', res);
                let commentData = await res.json();
                currPost.comments.push(commentData.comment);
                let posts = this.state.posts;
                await this.setState({posts});
                if (this.state.postIndex != originalPostIndex) return;
                this.updateCurrComments();
            } else {
                console.error('NOT OK');
            }
            this.setState({commentBeingPosted: false})
        }).catch(err => {
            console.error('err', err);
            this.setState({commentBeingPosted: false})
        });
    }

    async toggleLike() {
        let currPost = this.state.posts[this.state.postIndex];
        let currUser = this.context.currUser;
        if (currUser == null) return;
        let originalPostIndex = this.state.postIndex;
        if (this.state.userLikesPost) {
            let likeIndex = -1;
            for (let i = 0; i < currPost.likes.length; ++i) {
                let like = currPost.likes[i];
                if (like.user_id == currUser.id && like.post_id == currPost.id) {
                    likeIndex = i;
                    break;
                }
            }
            if (likeIndex < 0) return;

            let url = apiPath + '/likes/delete';
            let data = {id: currPost.likes[likeIndex].id}
            await fetch(url, {
                method: "DELETE",
                body: new URLSearchParams({like: JSON.stringify(data)}),
            }).then(async res => {
                console.log(res);
                if (res.ok) {
                    console.log('OK', res);
                    currPost.likes.splice(likeIndex, 1);
                    let posts = this.state.posts;
                    posts[originalPostIndex] = currPost;
                    await this.setState({posts});
                    if (this.state.postIndex != originalPostIndex) return;
                    this.updateUserLikePost();
                } else {
                    console.error('NOT OK');
                }
            }).catch(err => {
                console.error('err', err);
            });
        } else {
            let url = apiPath + '/likes/create';
            let data = {user_id: currUser.id, post_id: currPost.id }
            await fetch(url, {
                method: "POST",
                body: new URLSearchParams({like: JSON.stringify(data)}),
            }).then(async res => {
                console.log(res);
                if (res.ok) {
                    console.log('OK', res);
                    let likeData = await res.json();
                    currPost.likes.push(likeData.like);
                    let posts = this.state.posts;
                    posts[originalPostIndex] = currPost;
                    await this.setState({posts});
                    if (this.state.postIndex != originalPostIndex) return;
                    this.updateUserLikePost();
                } else {
                    console.error('NOT OK');
                }
            }).catch(err => {
                console.error('err', err);
            });
        }

    }

    async updateCurrComments() {
        let currPost = this.state.posts[this.state.postIndex];
        let originalPostIndex = this.state.postIndex;

        console.log("updating comments");
        console.log(currPost.likes);
        for (let comment of currPost.comments) {
            if (comment.user == null) {
                await fetch(apiPath + '/user/' + comment.user_id).then(d => d.json()).then((data) => {
                    comment.user = data.user;
                });
            }
        };

        if (this.state.postIndex == originalPostIndex) await this.setState({currCommentsLoaded: true});
        this.scrollBox.scrollTop = this.scrollBox.scrollHeight;
    }

    async goPrevPost() {
        await this.setState({
            currCommentsLoaded: false,
            postIndex: Math.max(this.state.postIndex - 1, 0)
        });
        this.updateUserLikePost();
        this.updateCurrComments();
    }
    async goNextPost() {
        await this.setState({
            currCommentsLoaded: false,
            postIndex: Math.min(this.state.postIndex + 1, this.state.posts.length - 1)
        });
        this.updateUserLikePost();
        this.updateCurrComments();
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
            <AuthContext.Consumer>
                {({value}) =>
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
                                                {this.state.currCommentsLoaded ?
                                                <div className="infobox-comment-container" ref={(input) => { this.scrollBox = input; }}>
                                                    {
                                                        posts[postIndex].comments.map(comment => {
                                                            if (comment.user == null) return '';
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
                                                                    {false &&<div className="infobox-comment-right-margin"> <i className="far fa-xs fa-heart"></i></div> }
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>:
                                                    (<div className="loading" style={{display:'flex', alignItems:'center'}}>
                                                    <div className="loader-xsmall"></div>
                                                </div>)}

                                            </div>
                                            <div className="infobox-buttons infobox-center-items">
                                                <i onClick={e => this.toggleLike()} className={(this.state.userLikesPost ? "fas" : "far") + " fa-lg fa-heart"}></i>
                                                <i onClick={e => {this.postBox.focus()}} className="far fa-lg fa-comment"></i>
                                            </div>
                                            <div className="infobox-likes infobox-bold infobox-center-items">
                                                {posts[postIndex].likes.length} likes
                                            </div>
                                            <div className="infobox-date infobox-center-items infobox-border-bottom">
                                                {this.printDate(posts[postIndex].created_at)}
                                            </div>
                                            <div className="infobox-add-comment infobox-center-items">
                                                {
                                                    !this.state.commentBeingPosted ?
                                                        <textarea className="infobox-textarea comment-font " disabled={this.state.commentBeingPosted || this.context.currUser == null} spellCheck="false" ref={(input) => { this.postBox = input; }}  placeholder="Add a comment..."></textarea>
                                                        : <div className="infobox-textarea-loading">
                                                            <div className="floatingBarsG">
                                                                <div className="blockG" id="rotateG_01"></div>
                                                                <div className="blockG" id="rotateG_02"></div>
                                                                <div className="blockG" id="rotateG_03"></div>
                                                                <div className="blockG" id="rotateG_04"></div>
                                                                <div className="blockG" id="rotateG_05"></div>
                                                                <div className="blockG" id="rotateG_06"></div>
                                                                <div className="blockG" id="rotateG_07"></div>
                                                                <div className="blockG" id="rotateG_08"></div>
                                                            </div>
                                                        </div>
                                                }
                                                <a onClick={e => this.postComment(this.postBox.value)} className={"infobox-post-button unselectable" + ((this.state.commentBeingPosted || this.context.currUser == null) && " disabled")}>Post</a>
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
            </>}
            </AuthContext.Consumer>
        );
    }
}

export default PostModal;
