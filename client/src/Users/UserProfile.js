import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './UserProfile.css';

const apiPath = 'http://localhost:3030';

class UserProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,
            imgWidth: 0,
            windowHeight: undefined,
            windowWidth: undefined
        }
        this.fetchUser = this.fetchUser.bind(this);
        this.handleResize = () => {
            let imgWidth = 0;
            let imgElement = document.getElementsByClassName('post-img-container')?.[0];
            if (imgElement != null) {
                imgWidth = imgElement.offsetWidth;
            }
            console.log(imgWidth);
            this.setState({
                imgWidth,
                windowHeight: window.innerHeight,
                windowWidth: window.innerWidth
            });
        }
    }
    async fetchUser() {
        let user_id = this.props.match.params.user_id;
        if (user_id == null) return;
        let userData = await fetch(apiPath + '/user/' + user_id).then(d => d.json());
        let user = userData.user;
        let postData = await fetch(apiPath + '/user/' + user.id + '/posts').then(d => d.json());
        let posts = postData.posts;
        posts.map(async (post, i) => {
            let data = await fetch(apiPath + '/post/' + post.id + '/all').then(d => d.json());
            posts[i] = post;
        });
        user.posts = posts;
        await this.setState({ user });
        this.handleResize();
        this.handleResize();
    }
    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize)
        this.fetchUser();
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }
    render() {
        let user = this.state.user;
        let range = [0,1,2];
        console.log(user);
        return (
            <>
                <div className="content">
                    {user != null ? (
                        <div className="user-profile outer">
                            <div className="user-profile top info border-bottom">
                                <div className="top column one">
                                    <img className="pfp" src={user.pfp_url}></img>
                                </div>
                                <div className="top column two">
                                    <div className="user-details">
                                        <div className="row one">
                                            <span className="username">{user.username}</span>
                                            <span className="follow"><button>Follow</button></span>
                                            <span className="message"><button className="button-lowkey">Message</button></span>
                                        </div>

                                        <div className="row two">
                                            <span className="post-count"><strong>0</strong> posts</span>
                                            <span className="follower-count"><strong>2,699</strong> followers</span>
                                            <span className="following-count"><strong>14,782</strong> following</span>
                                        </div>

                                        <div className="row three">
                                            <span className="about-user">
                                                <div className="info-row nickname">Melo</div>
                                                <div className="info-row group">Athlete</div>
                                                <div className="info-row description">
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque scelerisque laoreet lacus, eget condimentum eros auctor a. Aliquam egestas, leo id convallis gravida, leo augue condimentum nisi, nec convallis metus nisl ac elit. Nam suscipit risus et venenatis lobortis.
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="user-profile bottom posts">
                                {
                                    user.posts ? user.posts.reduce((a, v) => {
                                        // reduces the posts to rows of 3
                                        if (a.length == 0) a[0] = [];
                                        let latestRow = a[a.length - 1];
                                        if (latestRow.length == 3) {
                                            a.push([]);
                                            latestRow = a[a.length - 1];
                                        }
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
                                                            return (
                                                                <div key={'postrow' + i} className="post-square">
                                                                    <div className="post-img-container">
                                                                        { post != null
                                                                            ?  <img style={{width: this.state.imgWidth, height: this.state.imgWidth}} src={post.img_url}></img>
                                                                            : <span style={{width: this.state.imgWidth, height: this.state.imgWidth}}></span>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                            </div>
                                        );
                                    }) : ''
                                }
                            </div>
                        </div>
                    ) : null }
                </div>
            </>
        )
    }
}

export default UserProfile;
