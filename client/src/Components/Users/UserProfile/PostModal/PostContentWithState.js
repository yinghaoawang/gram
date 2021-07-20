import React from 'react';
import AuthContext from "../../../../AuthContext";
import {PostContent, PostContentVertical} from "./PostModalParts";


const apiPath = '/api';

class PostContentWithState extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            currPost: null,
            userLikesPost: false,
            currCommentsLoaded: false,
            commentBeingPosted: false,
        }
        this.updateUserLikePost = this.updateUserLikePost.bind(this);

        this.toggleLike = this.toggleLike.bind(this);
        this.postComment = this.postComment.bind(this);

        this.updateUserLikePost = this.updateUserLikePost.bind(this);
        this.updateCurrComments = this.updateCurrComments.bind(this);
        this.postBox = React.createRef();
        this.scrollBox = React.createRef();
    }

    static contextType = AuthContext;

    async fetchPost() {
        let post_id = this.props.postId;
        if (post_id == null) return;

        try {
            let postData = await fetch(apiPath + '/post/' + post_id).then(d => d.json());
            let post = postData.post;
            if (post == null) throw new Error("Post not found");

            post.likes = [];
            post.comments = [];

            let likesData = await fetch(apiPath + '/likes?post_id=' + post_id).then(d => d.json());
            let likes = likesData.likes;
            if (likes != null) post.likes = likes;

            let commentsData = await fetch(apiPath + '/comments?post_id=' + post_id).then(d => d.json());
            let comments = commentsData.comments;
            if (comments != null) post.comments = comments;

            this.setState({currPost: post});
        } catch (e) {
            console.error("error: " + e.message);
        }
    }

    async fetchUser() {
        if (this.state.currPost == null) return;
        let userId = this.state.currPost.user_id;

        try {
            let userData = await fetch(apiPath + '/user/' + userId).then(d => d.json());
            let user = userData.user;
            if (user == null) throw new Error("user not found");

            this.setState({user});
        } catch (e) {
            console.error("error: " + e.message);
        }
    }

    async componentDidMount() {
        await this.fetchPost();
        await this.fetchUser();
        await this.updateUserLikePost();
        await this.setState({loading: false})
        this.updateCurrComments();
        if (this.props.onPostLoaded) {
            this.props.onPostLoaded();
        }
    }

    updateUserLikePost() {
        let currPost = this.state.currPost;
        let currUser = this.context.currUser;
        if (currUser == null || currPost == null) return;

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
        let currPost = this.state.currPost;
        let currUser = this.context.currUser;
        if (currUser == null || currPost == null) return;
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
                await this.setState({currPost});
                this.updateCurrComments();
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
        let currPost = this.state.currPost;
        let currUser = this.context.currUser;
        if (currUser == null || currPost == null) return;
        if (this.state.userLikesPost) {
            // find out which index like is of the post
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
                    await this.setState({currPost});
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
                    await this.setState({currPost});
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
        let currPost = this.state.currPost;
        if (this.state.currPost == null) return;
        for (let comment of currPost.comments) {
            if (comment.user == null) {
                await fetch(apiPath + '/user/' + comment.user_id).then(d => d.json()).then((data) => {
                    comment.user = data.user;
                });
            }
        };

        await this.setState({currCommentsLoaded: true});
        if (this.scrollBox.current) this.scrollBox.current.scrollTop = this.scrollBox.current.scrollHeight;
    }

    render() {
        let currPost = this.state.currPost;
        let user = this.state.user;
        return (
            <div style={this.props.hidden ? {opacity: 0, position: 'absolute'} : {}}>
            {
                this.props.useVertical ?
                    <PostContentVertical dotOptions={this.props.dotOptions} scrollBoxRef={this.scrollBox} postBoxRef={this.postBox} currPost={currPost} currCommentsLoaded={this.state.currCommentsLoaded}
                                 toggleLikeFn={e => this.toggleLike() } userLikesPost={this.state.userLikesPost} clickCommentBtnFn={(e => {this.postBox.current.focus()}).bind(this)}
                                 postCommentFn={this.postComment} commentBeingPosted={this.state.commentBeingPosted} currUser={this.context.currUser} user={user} />

                    : <PostContent dotOptions={this.props.dotOptions} scrollBoxRef={this.scrollBox} postBoxRef={this.postBox} currPost={currPost} currCommentsLoaded={this.state.currCommentsLoaded}
                                   toggleLikeFn={e => this.toggleLike() } userLikesPost={this.state.userLikesPost} clickCommentBtnFn={(e => {this.postBox.current.focus()}).bind(this)}
                                   postCommentFn={this.postComment} commentBeingPosted={this.state.commentBeingPosted} currUser={this.context.currUser} user={user} />
            }
            </div>

        );
    }
}

export default PostContentWithState;
