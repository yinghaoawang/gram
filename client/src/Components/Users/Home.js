import React  from 'react';
import './Home.css';
import AuthContext from "../../AuthContext";
import PostContentWithState from "./UserProfile/PostModal/PostContentWithState";
import { Link } from 'react-router-dom';
import { scrolledToBottom } from '../../Util'

const apiPath = '/gram-api';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            showCount: -1,
            posts: [],
            postsLoaded: 0,
            finishedLoading: false,
        }
        this.loadMore = this.loadMore.bind(this);
        this.onPostLoaded = this.onPostLoaded.bind(this);
        this.initialShowCount = 10;
        this.incrementShowCount = 10;
    }

    static contextType = AuthContext;

    onPostLoaded() {
        this.setState({postsLoaded: this.state.postsLoaded + 1});
    }

    loadMore(){
        if (this.state.loading) return;
        if (scrolledToBottom() && this.state.postsLoaded == this.state.showCount) {
            // Do load more content here!
            let nextCount = Math.min(this.state.showCount + this.incrementShowCount, this.state.posts.length);
            this.setState({showCount: nextCount});
            if (this.state.postsLoaded == this.state.showCount) this.setState({finishedLoading: true});
        }
    }

    componentDidMount(){
        window.addEventListener('scroll', this.loadMore);
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.loadMore);
    }


    loadInitialPosts() {
        fetch(apiPath + '/posts?follower_id=' + this.context.currUser.id).then(d => d.json()).then((data) => {
            let posts = data.posts;
            posts.sort((a, b) => b.ranking-a.ranking);
            this.setState({posts, showCount: Math.min(this.initialShowCount, posts.length)});
            if (this.state.showCount <= this.initialShowCount) {
                this.setState({finishedLoading: true});
            }
        });
        this.setState({loading: false});
    }

    async componentDidUpdate(prevProps) {
        if (this.context.userLoaded && this.context.currUser == null) {
            this.props.history.push('/gram/login');
        }
        if (this.context.userLoaded && this.context.currUser != null && this.state.loading == true) {
            //await new Promise( res => setTimeout(res, 50000));
            this.loadInitialPosts();
        }
    }

    render() {
        let loading = this.state.loading;
        let posts = this.state.posts;
        return (
            <div className='content'>
                <div className="home-container">
                    {loading == false ? (<div className="post-listings">
                        {
                            posts && this.state.showCount != -1 && posts.map((post, index) => {
                                if (index >= this.state.showCount) return '';
                                else return (
                                    <PostContentWithState hidden={this.state.postsLoaded < this.state.showCount && index > this.state.showCount - this.incrementShowCount - 1}
                                      key={'homepost' + post.id}
                                      onPostLoaded={this.onPostLoaded} useVertical={true}
                                      postId={post.id}/>
                                )
                            })
                        }
                    </div>) : ''
                    }
                    <>
                    { (loading == true || this.state.postsLoaded < this.state.showCount) &&
                        <div className={"loading"} style={this.state.postsLoaded >= this.initialShowCount ? {marginBottom: '60px'} : {}}>
                            <div className="loader-small"></div>
                        </div>
                    }
                    { (loading == false && this.state.posts.length == this.state.showCount && this.state.finishedLoading) &&
                        <div className="center" style={{marginBottom: '65px'}}>
                            <h1>Oh no, you're out of feed</h1>
                            <p>Follow more users to have more content on your feed. Click <Link to='/gram/explore'>explore</Link>&nbsp;
                                to discover new content or <Link to='/gram/top_accounts'>top accounts</Link> to see the highest ranking users.</p>
                        </div>
                        
                    }
                    </>
                </div>
            </div>
        )
    }
}

export default Home;

