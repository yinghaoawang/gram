import React from 'react';
import AuthContext from "../../../AuthContext";
import './UserProfileDetails.css';
import {Dots} from "../../Common/Parts";
import ModalOptions from "../../Common/ModalOptions";
const apiPath = '/gram-api';

const UserProfileDetails = ({user}) => {
    const [followerCount, setFollowerCount] = React.useState(user.followers.length);
    const [userIsFollowing, setUserIsFollowing] = React.useState(false);
    const [toggleUserLoading, setToggleUserLoading] = React.useState(false);
    const [pageLoaded, setPageLoaded] = React.useState(false);
    const context = React.useContext(AuthContext);
    let updateUserFollowing = async () => {
        if (context.currUser == null) return;
        try {
            let res = await fetch(apiPath + '/follows?following_id=' + user.id + '&follower_id=' + context.currUser.id);
            if (res.ok) {
                let followsData = await res.json();
                if (followsData.follows.length > 0) {
                    // that means i am following
                    setUserIsFollowing(true);
                } else {
                    setUserIsFollowing(false);
                }
            } else {
                console.error('Not OK', res);
                setUserIsFollowing(false);
            }
        } catch (e) {
            console.error(e);
            setUserIsFollowing(false);
        }

    };
    let unfollowUser = async () => {
        if (context.currUser == null) return;
        try {
            let url = apiPath + '/follows/delete';
            let data = {following_id : user.id, follower_id: context.currUser.id}
            let res = await fetch(url,
                {method: "DELETE", body: new URLSearchParams({follow: JSON.stringify(data)})},
            );
            if (res.ok) {
                let followData = await res.json();
                console.log('OK ' + JSON.stringify(followData));
                setFollowerCount(followerCount - 1);
                setUserIsFollowing(false);
            }
        } catch (e) {
            console.error(e);
        }
    }
    let followUser = async () => {
        if (context.currUser == null) return;
        try {
            let url = apiPath + '/follows/create';
            let data = {following_id : user.id, follower_id: context.currUser.id}
            let res = await fetch(url,
                {method: "POST", body: new URLSearchParams({follow: JSON.stringify(data)})},
            );
            if (res.ok) {
                let followData = await res.json();
                console.log('OK ' + JSON.stringify(followData));
                setFollowerCount(followerCount + 1);
                setUserIsFollowing(true);
            }
        } catch (e) {
            console.error(e);
        }
    }
    let toggleFollow = async () => {
        if (context.currUser == null) return;
        if (toggleUserLoading) return;
        await updateUserFollowing();
        setToggleUserLoading(true);
        try {
            if (userIsFollowing) {
                await unfollowUser();
            } else {
                await followUser();
            }
            setToggleUserLoading(false);
        } catch (e) {
            console.log("error following: " + e.message)
            setToggleUserLoading(false);
        }
    }

    const [showModal, setShowModal] = React.useState(false);

    const closeModalOptions = () => {
        setShowModal(false);
        document.body.style.removeProperty('overflow');
    }
    const openModalOptions = () => {
        document.body.style.overflow = "hidden";
        setShowModal(true);
    }

    /*
    const options = [
        "optionFollowUnfollow", "optionCancel"
    ];
     */

    React.useEffect(async () => {
        await updateUserFollowing();
        setPageLoaded(true);
    }, []);
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
                        {pageLoaded &&
                        <span>
                            <button onClick={e => toggleFollow()} className={'follow-button' + (userIsFollowing ? ' button-warning' : '')}>
                                {toggleUserLoading ?
                                    <i className="fa fa-spinner fa-spin"></i>
                                    :
                                    <>{userIsFollowing ? 'Unfollow' : 'Follow'}</>
                                }


                            </button>
                            {userIsFollowing && context.currUser &&
                                <button style={{marginLeft: '8px',}} className="message-button button-lowkey">Message</button>
                            }
                        </span>
                        }
                        {/*<span><div className="infobox-dots-holder"><Dots onClick={openModalOptions}/></div></span>*/}
                        {
                            showModal && <ModalOptions options={options} user={user} onClose={closeModalOptions} show={showModal}/>
                        }
                    </div>

                    <div className="row two">
                        <span className="post-count"><strong>{user.posts != null ? user.posts.length : 0}</strong> posts</span>
                        <span className="follower-count"><strong>{user.followers != null ? followerCount : 0}</strong> followers</span>
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
