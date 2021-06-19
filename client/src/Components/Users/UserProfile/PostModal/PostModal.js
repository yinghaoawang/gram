import React from 'react';
import './PostModal.css';
import {Link, withRouter} from "react-router-dom";
import AuthContext from "../../../../AuthContext";
import {ModalButtonLeft, ModalButtonRight, PostContent} from "./PostModalParts";

const apiPath = '/api';

class PostModal extends React.Component {
    constructor(props) {
        super(props);
        this.goPrevPost = this.goPrevPost.bind(this);
        this.goNextPost = this.goNextPost.bind(this);
        this.toggleLike = this.toggleLike.bind(this);
        this.postComment = this.postComment.bind(this);
        this.state = {
            postIndex: -1,
            posts: null,
            userLikesPost: false,
            currCommentsLoaded: false,
            commentBeingPosted: false,
        }
        this.updateUserLikePost = this.updateUserLikePost.bind(this);
        this.updateCurrComments = this.updateCurrComments.bind(this);
        this.postBox = React.createRef();
        this.scrollBox = React.createRef();
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
        if (this.state.postIndex != -1) {
            window.history.pushState(null, null, `/post/${this.state.posts[this.state.postIndex].id}`)
        }
    }

    updateUserLikePost() {
        let currPost = this.state.posts[this.state.postIndex];
        let currUser = this.context.currUser;
        if (currUser == null || currPost == null) return;
        console.log("updating likes");
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
                if (this.state.postIndex == originalPostIndex) this.updateCurrComments();

            } else {
                console.error('NOT OK');
            }
            this.setState({commentBeingPosted: false})
        }).catch(err => {
            console.error('err', err);
            this.setState({commentBeingPosted: false})
        });
        this.postBox.current.value = '';
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
                    if (this.state.postIndex == originalPostIndex) this.updateUserLikePost();

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
        if (currPost == null) return;
        let originalPostIndex = this.state.postIndex;

        console.log("updating comments");
        for (let comment of currPost.comments) {
            if (comment.user == null) {
                await fetch(apiPath + '/user/' + comment.user_id).then(d => d.json()).then((data) => {
                    comment.user = data.user;
                });
            }
        };

        if (this.state.postIndex == originalPostIndex) await this.setState({currCommentsLoaded: true});
        if (this.scrollBox.current) this.scrollBox.current.scrollTop = this.scrollBox.current.scrollHeight;
    }

    async goPrevPost() {
        await this.setState({
            currCommentsLoaded: false,
            postIndex: Math.max(this.state.postIndex - 1, 0)
        });
        this.updateUserLikePost();
        this.updateCurrComments();
        window.history.pushState(null, null, `/post/${this.state.posts[this.state.postIndex].id}`)
    }
    async goNextPost() {
        await this.setState({
            currCommentsLoaded: false,
            postIndex: Math.min(this.state.postIndex + 1, this.props.maxIndex != null ? this.props.maxIndex : this.state.posts.length - 1)
        });
        this.updateUserLikePost();
        this.updateCurrComments();
        window.history.pushState(null, null, `/post/${this.state.posts[this.state.postIndex].id}`)
    }

    render() {
        let posts = this.state.posts;
        let show = this.props.show;
        let onClose = () => {
            window.history.pushState(null, null, this.props.originalUrl)
            this.props.onClose();
        }
        let postIndex = this.state.postIndex;
        let currPost = this.state.postIndex != -1 ? this.state.posts[this.state.postIndex] : null;
        return (
            <>
                {show == true &&
                    <div className="modal-container">
                        <div className="modal-backdrop" onClick={onClose}></div>
                        <div className="post-inner-with-buttons">
                            <ModalButtonLeft postIndex={this.state.postIndex} onClick={e => this.goPrevPost()} />
                            <PostContent scrollBoxRef={this.scrollBox} postBoxRef={this.postBox} currPost={posts[postIndex]} currCommentsLoaded={this.state.currCommentsLoaded}
                                toggleLikeFn={e => this.toggleLike() } userLikesPost={this.state.userLikesPost} clickCommentBtnFn={(e => {this.postBox.current.focus()}).bind(this)}
                                postCommentFn={this.postComment} commentBeingPosted={this.state.commentBeingPosted} currUser={this.context.currUser} user={currPost && currPost.user} />
                            <ModalButtonRight maxIndex={this.props.maxIndex != null ? this.props.maxIndex : this.state.posts.length - 1} postIndex={this.state.postIndex} onClick={e => this.goNextPost()} />
                        </div>
                    </div>
                }
            </>
        );
    }
}

export default withRouter(PostModal);
