import React from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './UserProfile.css';
import PostSquareList from './PostSquareList';
import UserProfileDetails from './UserProfileDetails';

const apiPath = 'http://localhost:3030';

class UserProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,
            imgWidth: 0,
        }
        this.fetchUser = this.fetchUser.bind(this);
    }
    async fetchUser() {
        let data = await fetch(apiPath + '/users/').then(d => d.json());
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
        await this.setState({ user });
    }
    componentDidMount() {
        this.fetchUser();
    }
    componentWillUnmount() {
    }
    render() {
        let user = this.state.user;
        return (
            <>
                <div className="content">
                    {user != null ? (
                        <div className="user-profile outer">
                            <div className="user-profile top info border-bottom">
                                <UserProfileDetails user={user} />
                            </div>
                            <div className="user-profile bottom posts">
                                <PostSquareList posts={user.posts} />
                            </div>
                        </div>
                    ) : null }
                </div>
            </>
        )
    }
}

export default UserProfile;
