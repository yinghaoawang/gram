import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './TopAccounts.css';

const apiPath = 'http://localhost:3030';

class TopAccounts extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [],
            mounted: false // antipattern
        }
        this.fetchUsers = this.fetchUsers.bind(this);
    }
    async fetchUsers() {
        let data = await fetch(apiPath + '/users').then(d => d.json());
        let users = data.users;
        if (this.mounted) await this.setState({ users }); // antipattern
    }
    componentDidMount() {
        this.mounted = true; // antipattern
        this.fetchUsers();
    }
    componentWillUnmount() {
        this.mounted = false; // antipattern
    }
    render() {
        return (
            <div className='content'>
                <div className="users-outer-container">
                    <div className="users-container">
                        <h2>Top Accounts</h2>
                        <div className="users-list">
                        {
                            this.state.users.map((user) => (
                                <span key={user.id}>
                                    <Link to={'/user/' + user.id}>{user.username}</Link>
                                </span>
                            ))
                        }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TopAccounts;

