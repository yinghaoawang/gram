import React  from 'react';
import { Link } from 'react-router-dom';
import './TopAccounts.css';

const apiPath = '/api';

class TopAccounts extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [],
            loading: true,
        }
        this.fetchUsers = this.fetchUsers.bind(this);
    }
    async fetchUsers() {
        let data = await fetch(apiPath + '/users').then(d => d.json());
        let users = data.users;
        if (this.mounted) await this.setState({ users, loading: false }); // antipattern
    }
    componentDidMount() {
        this.mounted = true; // antipattern
        this.fetchUsers();
    }
    componentWillUnmount() {
        this.mounted = false; // antipattern
    }
    render() {
        let loading = this.state.loading;
        return (
            <div className='content'>
                { loading == false ? (
                    <div className="users-outer-container">
                        <div className="users-container">
                            <h2>Top Accounts</h2>
                            <div className="users-list">
                                {
                                    this.state.users.map((user) => (
                                        <span key={user.id}>
                                    <Link to={'/gram/user/' + user.id}>{user.username}</Link>
                                </span>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="loading">
                        <div className="loader-small"></div>
                    </div>
                )
                }
            </div>
        )
    }
}

export default TopAccounts;

