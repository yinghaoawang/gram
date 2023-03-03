import React from 'react';
import './PostDetails.css';
import {withRouter} from 'react-router-dom';
import PostContentWithState from "../Users/UserProfile/PostModal/PostContentWithState";


const apiPath = '/gram-api';

class PostDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            console.log('Route change!');
            window.location.reload();
        }
    }

    render() {
        const options = [
            "optionFollowUnfollow", "optionCancel"
        ];
        return (
            <div className="content">
                <div className="post-details-container">
                    <PostContentWithState dotOptions={options} postId={this.props.match.params.post_id} />
                </div>
            </div>
        );
    }
}

export default withRouter(PostDetails);
