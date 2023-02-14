import React, {useImperativeHandle} from 'react';
import './PostExplore.css';
import PostSquareList from "../Users/UserProfile/PostSquareList";
import PostModal from "../Users/UserProfile/PostModal/PostModal";
import { scrolledToBottom } from '../../Util';

const apiPath = '/api';

class PostExplore extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            showingModal: false,
            modalPostIndex: -1,
            posts: null,
            loadingNewPosts: false,
            postsLoaded: 0,
            showingCount: 0,
        }
        this.initialShowCount = 18;
        this.incrementShowCount = 18;
        this.postSquareListRef = React.createRef();
        this.fetchPosts = this.fetchPosts.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    loadMore() {
        if (this.loading) return;
        if (scrolledToBottom() && this.state.postsLoaded == this.state.showCount) {
            // Do load more content here!
            this.loadNextPosts();
        }
    }

    async loadNextPosts() {
        let nextCount = this.initialShowCount;
        if (this.state.postsLoaded > 0) nextCount = Math.min(this.state.showCount + this.incrementShowCount, this.state.posts.length);
        await this.setState({loadingNewPosts: true, showCount: nextCount});
        let promises = [];
        for (let i = this.state.postsLoaded; i < this.state.showCount; ++i) {
            let post = this.state.posts[i];
            let likesPromise = fetch(apiPath + '/likes?post_id=' + post.id).then(d => d.json());
            let commentsPromise = fetch(apiPath + '/comments?post_id=' + post.id).then(d => d.json());
            let userPromise = fetch(apiPath + '/user/' + post.user_id).then(d => d.json());
            promises.push(Promise.all([likesPromise, commentsPromise, userPromise]).then(values => {
                post.likes = values[0].likes;
                post.comments = values[1].comments;
                post.user = values[2].user;
                post.hidden = false;
            }));
        }
        //await new Promise( res => setTimeout(res, 50000));
        await Promise.all(promises).then(values => {
            this.setState({posts: this.state.posts, loadingNewPosts: false, postsLoaded: this.state.showCount});
        });
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

    async fetchPosts() {
        let postData = await fetch(apiPath + '/posts').then(d => d.json());
        let posts = postData.posts;
        posts.sort((a, b) => b.ranking - a.ranking);

        for (let post of posts) {
            post.hidden = true;
            /*
            let postLikesData = await fetch(apiPath + '/likes?post_id=' + post.id).then(d => d.json());
            let postCommentsData = await fetch(apiPath + '/comments?post_id=' + post.id).then(d => d.json());
            let postUserData = await fetch(apiPath + '/user/' + post.user_id).then(d => d.json());
            post.likes = [];
            post.comments = [];

            for (let like of postLikesData.likes) {
                post.likes.push(like);
            };

            for (let comment of postCommentsData.comments) {
                post.comments.push(comment);
            };
            post.user = postUserData.user;
            */
        }

        if (this.mounted) {
            await this.setState({loading: false, posts})
            await this.loadNextPosts();
        }
    }

    async componentDidMount() {
        this.mounted = true;
        try {
            await this.fetchPosts();
        } catch (e) {
            console.error("Error: " + e.messsage);
        }
    }

    componentWillMount() {
        window.addEventListener('scroll', this.loadMore);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.loadMore);
        this.mounted = false;
    }

    render() {
        let posts = this.state.posts;
        let loading = this.state.loading;
        return (
            <>
                <div className="content">
                    <div className="post-container">
                        {loading == false && (
                            <>

                                <PostModal originalUrl={`/gram/explore`} posts={posts} onClose={this.hideModal}
                                           maxIndex={this.state.postsLoaded - 1} postIndex={this.state.modalPostIndex} show={this.state.showingModal}/>
                                {
                                    this.state.postsLoaded >= this.initialShowCount &&
                                    <div className="user-profile outer">
                                        <div className="user-profile bottom posts">
                                            {
                                                posts && posts.length > 0 ?
                                                    <PostSquareList ref={this.postSquareListRef} showModal={this.showModal}
                                                                    posts={posts}/>
                                                    :
                                                    <div className="no-posts">
                                                        <i className="fas fa-4x fa-camera"></i>
                                                        <h1>No Posts Yet</h1>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                }
                            </>
                        )
                        }
                        <>
                            {(loading == true || this.state.loadingNewPosts) &&
                            <div className={"loading"}>
                                <div className="loader-small"></div>
                            </div>
                            }
                        </>

                    </div>


                </div>
            </>
        );
    }
}

export default PostExplore;
