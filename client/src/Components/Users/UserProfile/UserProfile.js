import React from 'react';
import './UserProfile.css';
import PostSquareList from './PostSquareList';
import UserProfileDetails from './UserProfileDetails';
import PostModal from "./PostModal";


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
        })
    }
    async fetchUser() {
        let data = await fetch(apiPath + '/users').then(d => d.json());
        let users = data.users;
        let user_id = this.props.match.params.user_id;
        if (user_id == null) return;

        let userData = await fetch(apiPath + '/user/' + user_id).then(d => d.json());
        let user = userData.user;
        if (user == null) return;

        let postData = await fetch(apiPath + '/user/' + user.id + '/posts').then(d => d.json());
        let posts = postData.posts;
        let followerData = await fetch(apiPath + '/user/' + user.id + '/followers').then(d => d.json());
        let followers = followerData.followers;
        let followingData = await fetch(apiPath + '/user/' + user.id + '/following').then(d => d.json());
        let following = followingData.following;
        user.followers = followers;
        user.following = following;
        for (let post of posts) {
            let data = await fetch(apiPath + '/post/' + post.id + '/all').then(d => d.json());
            post.likes = [];
            data.post.likes.map(like => {
                let like_user = users.find(u => u.id == like.user_id);
                if (like_user != null) {
                    like.user = like_user;
                }
                post.likes.push(like);
            });
            post.comments = [];
            data.post.comments.map(comment => {
                let comment_user = users.find(u => u.id == comment.user_id);
                if (comment_user != null) {
                    comment.user = comment_user;
                }
                post.comments.push(comment);
            });
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

                            <PostModal user={user} posts={user.posts} onClose={this.hideModal} postIndex={this.state.modalPostIndex} show={this.state.showingModal} />
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
