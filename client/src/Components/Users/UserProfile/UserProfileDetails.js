import React from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './UserProfileDetails.css';

const UserProfileDetails = ({user}) => {
    return (<>
        {user != null && (
            <>
            <div className="top column one">
                <img className="pfp" src={user.pfp_url}></img>
            </div>
            <div className="top column two">
                <div className="user-details">
                    <div className="row one">
                        <span className="username">{user.username}</span>
                        <span>
                            <button>Follow</button><button style={{marginLeft: '8px',}} className="button-lowkey">Message</button>
                        </span>
                    </div>

                    <div className="row two">
                        <span className="post-count"><strong>{user.posts != null ? user.posts.length : 0}</strong> posts</span>
                        <span className="follower-count"><strong>{user.followers != null ? user.followers.length : 0}</strong> followers</span>
                        <span className="following-count"><strong>{user.following != null ? user.following.length: 0}</strong> following</span>
                    </div>

                    <div className="row three">
                        <span className="about-user">
                            <div className="info-row nickname">{user.nickname}</div>
                            <div className="info-row group">{user.group}</div>
                            <div className="info-row description">
                                {user.description != null
                                    ? user.description
                                    : ''
                                }
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            </>
        )}
    </>);
}

export default UserProfileDetails;
