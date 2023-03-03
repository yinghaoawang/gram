import React from 'react';
import Modal from "../Users/UserProfile/PostModal/Modal";
import './ModalOptions.css';
import AuthContext from "../../AuthContext";

const apiPath = "/gram-api";

class ModalOptions extends React.Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        console.log(this.props.options);
        this.state = {
            userIsFollowing: false,
            toggleUserLoading: false,
            loaded: false
        }
        this.updateUserFollowing = this.updateUserFollowing.bind(this);
        this.unfollowUser = this.unfollowUser.bind(this);
        this.followUser = this.followUser.bind(this);
        this.toggleFollow = this.toggleFollow.bind(this);
        this.goToPost = this.goToPost.bind(this);
    }

    async goToPost() {
        window.history.pushState(null, null, `/gram/post/${this.props.post.id}`);
        window.location.reload();
    }

    async unfollowUser() {
        let user = this.props.user;
        if (this.context.currUser == null || user == null) return;
        try {
            let url = apiPath + '/follows/delete';
            let data = {following_id : user.id, follower_id: this.context.currUser.id}
            let res = await fetch(url,
                {method: "DELETE", body: new URLSearchParams({follow: JSON.stringify(data)})},
            );
            if (res.ok) {
                let followData = await res.json();
                console.log('OK ' + JSON.stringify(followData));
                this.setState({userIsFollowing: false});
            }
        } catch (e) {
            console.error(e);
        }
    }
    async followUser() {
        let user = this.props.user;
        if (this.context.currUser == null || user == null) return;
        try {
            let url = apiPath + '/follows/create';
            let data = {following_id : user.id, follower_id: this.context.currUser.id}
            let res = await fetch(url,
                {method: "POST", body: new URLSearchParams({follow: JSON.stringify(data)})},
            );
            if (res.ok) {
                let followData = await res.json();
                console.log('OK ' + JSON.stringify(followData));
                this.setState({userIsFollowing: true});
            }
        } catch (e) {
            console.error(e);
        }
    }
    async toggleFollow() {
        let user = this.props.user;
        if (this.context.currUser == null || user == null || this.state.toggleUserLoading) return;
        await this.updateUserFollowing();
        this.setState({toggleUserLoading: true});
        try {
            if (this.state.userIsFollowing) {
                await this.unfollowUser();
            } else {
                await this.followUser();
            }
            this.setState({toggleUserLoading: false});
        } catch (e) {
            console.log("error following: " + e.message)
            this.setState({toggleUserLoading: false});
        }
    }

    async updateUserFollowing() {
        try {
            let res = await fetch(apiPath + '/follows?following_id=' + this.props.user.id + '&follower_id=' + this.context.currUser.id);
            if (res.ok) {
                let followsData = await res.json();
                if (followsData.follows.length > 0) {
                    // that means i am following
                    await this.setState({userIsFollowing: true});
                } else {
                    await this.setState({userIsFollowing: false});
                }
            } else {
                console.error('Not OK', res);
                await this.setState({userIsFollowing: false});
            }
        } catch (e) {
            console.error(e);
            await this.setState({userIsFollowing: false});
        }
    }

    async componentDidMount() {
        await this.updateUserFollowing();
        this.setState({loaded: true});
    }


    render() {
        return <Modal onClose={this.props.onClose} show={this.props.show}>
            {
                this.state.loaded && <div className="modal-options-inner">
                    {
                        this.props.options &&  this.props.options.map((option, i) => {
                            let key = "modal-option " + i;
                            if (option == "optionFollowUnfollow") return (
                                <button onClick={this.toggleFollow} className={this.state.toggleUserLoading ? "" : this.state.userIsFollowing ? "option-danger" : "option-good"} key={key}>
                                    { this.state.toggleUserLoading ? <i className="fa fa-spinner fa-spin"></i> : (this.state.userIsFollowing ? "Unfollow" : "Follow") }
                                </button>
                            );
                            else if (option == "optionGoToPost") return <button onClick={this.goToPost} key={key}>Go To Post</button>
                            else if (option == "optionCancel") return <button key={"modal-option " + i} onClick={this.props.onClose}>Cancel</button>;
                        })
                    }

                </div>
            }

        </Modal>
    }
}

export default ModalOptions;