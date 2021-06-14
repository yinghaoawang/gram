import React from 'react';
import './UserProfile.css';
import PostSquareList from './PostSquareList';
import UserProfileDetails from './UserProfileDetails';
import PostModal from "./PostModal/PostModal";


const apiPath = '/api';

class UserProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,
            imgWidth: 0,
            loading: true,
            showingModal: false,
            modalPostIndex: -1,
        }
        this.fetchUser = this.fetchUser.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }
    showModal(postIndex) {
        document.body.style.overflow = "hidden";

        this.setState({
            showingModal: true,
            modalPostIndex: postIndex
        })
    }
    hideModal(e) {
        document.body.style.removeProperty('overflow');

        this.setState({
            showingModal: false,
            modalPostIndex: -1,
        })

    }
    async fetchUser() {
        let user_id = this.props.match.params.user_id;
        if (user_id == null) return;

        let userData = await fetch(apiPath + '/user/' + user_id).then(d => d.json());
        let user = userData.user;
        if (user == null) return;

        let postData = await fetch(apiPath + '/posts?user_id=' + user.id).then(d => d.json());
        let posts = postData.posts;
        let followerData = await fetch(apiPath + '/followers?user_id=' + user.id).then(d => d.json());
        let followers = followerData.followers;
        let followingData = await fetch(apiPath + '/following?user_id=' + user.id).then(d => d.json());
        let following = followingData.following;
        user.followers = followers;
        user.following = following;
        for (let post of posts) {
            let postLikesData = await fetch(apiPath + '/likes?post_id=' + post.id).then(d => d.json());
            let postCommentsData = await fetch(apiPath + '/comments?post_id=' + post.id).then(d => d.json());
            post.likes = [];
            post.comments = [];

            for (let like of postLikesData.likes) {
                /*
                let like_user = await fetch(apiPath + '/user/' + like.user_id).then(d => d.json());
                if (like_user != null) {
                    like.user = like_user.user;
                }
                 */
                post.likes.push(like);
            };

            for (let comment of postCommentsData.comments) {
                /*
                let comment_user = await fetch(apiPath + '/user/' + comment.user_id).then(d => d.json());
                if (comment_user != null) {
                    comment.user = comment_user.user;
                }
                 */
                post.comments.push(comment);
            };
        }
        user.posts = posts;


        if (this.mounted) await this.setState({ user, loading: false })
    }
    componentDidMount() {
        this.mounted = false;
        try {
            this.fetchUser();
            this.mounted = true;
        } catch (e) {
            console.error("Error: " + e.messsage);
        }

    }
    componentWillUnmount() {
    }
    render() {
        let user = this.state.user;
        let loading = this.state.loading;
        return (
            <>
                <div className="content">
                    { loading == false ? (
                        <>

                            <PostModal originalUrl={`/user/${this.props.match.params.user_id}`} user={user} posts={user.posts} onClose={this.hideModal} postIndex={this.state.modalPostIndex} show={this.state.showingModal} />
                            <div className="user-profile outer">
                                <div className="user-profile top info border-bottom">
                                    <UserProfileDetails user={user} />
                                </div>
                                <div className="user-profile bottom posts">
                                    {
                                        user.posts && user.posts.length > 0 ? <PostSquareList showModal={this.showModal} posts={user.posts} />
                                            :
                                            <div className="no-posts">
                                                <i className="fas fa-4x fa-camera"></i>
                                                <h1>No Posts Yet</h1>
                                            </div>
                                    }

                                </div>
                            </div>
                        </>
                    ) :
                        <div className="loading">
                            <div className="loader-small"></div>
                        </div>
                     }
                </div>
            </>
        );
    }
}

export default UserProfile;
