import React from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './PostModal.css';

const apiPath = '/api';

class PostModal extends React.Component {
    constructor(props) {
        super(props);
        this.goPrevPost = this.goPrevPost.bind(this);
        this.goNextPost = this.goNextPost.bind(this);
        this.state = {
            postIndex: null,
            posts: null,
        }
    }

    componentDidMount() {
        this.setState({posts: this.props.posts});
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.postIndex != prevProps.postIndex) {
            this.setState({postIndex: this.props.postIndex});
        }
    }

    goPrevPost() {
        this.setState({
            postIndex: Math.max(this.state.postIndex - 1, 0)
        });
    }
    goNextPost() {
        this.setState({
            postIndex: Math.min(this.state.postIndex + 1, this.state.posts.length - 1)
        });
    }
    render() {
        let posts = this.state.posts;
        let show = this.props.show;
        let onClose = this.props.onClose;
        let postIndex = this.state.postIndex;
        return (
            <>
                {show == true &&
                    <div className="modal-container">
                        <div className="modal-backdrop" onClick={onClose}>

                        </div>
                        <div className="modal-inner-with-buttons">
                            <div className="modal-button modal-left-button">
                                {
                                    this.state.postIndex > 0 && (<i onClick={e => this.goPrevPost()} style={{paddingRight: '13px'}} className="fas fa-chevron-left"></i>)
                                }

                            </div>
                            <div className="modal-inner">

                                <div className="modal-inner-left">
                                    <img className="modal-img" src={posts != null && postIndex != null ? posts[postIndex].img_url : ''}></img>

                                </div>
                                <div className="modal-inner-right">
                                </div>

                            </div>
                            <div className="modal-button modal-right-button">
                                {
                                    this.state.postIndex < this.state.posts.length - 1 &&<i onClick={e => this.goNextPost()} style={{paddingLeft: '13px'}} className="fas fa-chevron-right"></i>
                                }

                            </div>
                        </div>


                    </div>
                }
            </>
        );
    }
}

export default PostModal;
