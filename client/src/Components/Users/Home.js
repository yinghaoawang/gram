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
        }
        this.loadMore = this.loadMore.bind(this);
    }

    static contextType = AuthContext;

    loadMore(){
        if (this.loading) return;
        if (window.innerHeight + document.documentElement.scrollTop === document.scrollingElement.scrollHeight) {
            // Do load more content here!
            let nextCount = Math.min(this.state.showCount + 10, this.state.posts.length);
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
                this.setState({posts, showCount: 10});
            });
            this.setState({loading: false});
        }
    }

    render() {
        let loading = this.state.loading;
        let posts = this.state.posts;
        return (
            <div className='content'>
                { loading == false ? (<div className="post-listings">
                    {
                        posts && this.state.showCount != -1 && posts.map((post, index) => {
                            if (index >= this.state.showCount) return '';
                            else return <PostContentWithState key={'homepost'+post.id} useVertical={true} postId={post.id} />
                        })
                    }
                </div>) : (
                    <div className="loading">
                        <div className="loader-small"></div>
                    </div>
                )}
            </div>
        )
    }
}

export default Home;

