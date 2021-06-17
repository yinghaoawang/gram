import React  from 'react';
import './Home.css';
import AuthContext from "../../AuthContext";
import PostModal from "./UserProfile/PostModal/PostModal"
import PostContentWithState from "./UserProfile/PostModal/PostContentWithState";
const apiPath = '/api';


class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            showCount: -1,
            posts: [],
            postsLoaded: 0,
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
        if (this.loading) return;
        if (window.innerHeight + document.documentElement.scrollTop === document.scrollingElement.scrollHeight
            && this.state.postsLoaded == this.state.showCount) {
            // Do load more content here!
            let nextCount = Math.min(this.state.showCount + this.incrementShowCount, this.state.posts.length);
            this.setState({showCount: nextCount});
        }
    }

    componentWillMount(){
        window.addEventListener('scroll', this.loadMore);
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.loadMore);
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        if (this.context.userLoaded && this.context.currUser == null) {
            this.props.history.push('/login');
        }
        if (this.context.userLoaded && this.context.currUser != null && this.state.loading == true) {
            fetch(apiPath + '/posts?follower_id=' + this.context.currUser.id).then(d => d.json()).then((data) => {
                let posts = data.posts;
                posts.sort((a, b) => b.ranking-a.ranking);
                this.setState({posts, showCount: this.initialShowCount});
            });
            this.setState({loading: false});
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
                        <div className={"loading"}>
                            <div className="loader-small"></div>
                        </div>
                    }
                    </>
                </div>
            </div>
        )
    }
}

export default Home;

