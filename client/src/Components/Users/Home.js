import React  from 'react';
import './Home.css';
import AuthContext from "../../AuthContext";

const apiPath = '/api';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
        }
    }
    static contextType = AuthContext;
    componentDidMount() {
        this.setState({loading: false});
    }

    componentDidUpdate() {
        if (this.context.userLoaded && this.context.currUser == null) {
            this.props.history.push('/login');
        }
    }

    render() {
        let loading = this.state.loading;
        return (
            <div className='content'>
                { loading == false ? (
                    <p>Home</p>
                ) : (
                    <div className="loading">
                        <div className="loader-small"></div>
                    </div>
                )}
            </div>
        )
    }
}

export default Home;

