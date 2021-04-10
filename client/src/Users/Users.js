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
        }
        this.fetchUsers = this.fetchUsers.bind(this);
    }
    async fetchUsers() {
        let data = await fetch(apiPath + '/users').then(d => d.json());
        let users = data.users;
        users.map(async (user) => {
            let data = await fetch(apiPath + '/user/' + user.id + '/posts').then(d => d.json());
            let posts = data.posts;
            posts.map(async (post, i) => {
                let data = await fetch(apiPath + '/post/' + post.id + '/all').then(d => d.json());
                posts[i] = post;
            });
            users.find(u => u.id == user.id).posts = posts;
            await this.setState({ users });
        });
    }
    componentDidMount() {
        console.log('fetch');
        this.fetchUsers();
    }
    componentWillUnmount() {
    }
    render() {
        return (
            <div className='content'>
                <div className="users-container">
                    <h2>Users</h2>
                    <div>
                    {
                        this.state.users.map((user) => (
                            <div key={user.id}>
                                <Link to={'/user/' + user.id}>{user.username}</Link>
                            </div>
                        ))
                    }
                    </div>
                </div>
            </div>
        )
    }
}

export default TopAccounts;

/*
                            <h5>Posts</h5>
                            {
                                user.posts ? user.posts.map((post) => {
                                    return (
                                        <div key={'post'+post.id}>
                                            <h6>{new Date(post.timestamp).toLocaleDateString()}</h6>
                                            <img width="200px" src={post.img_url}></img>
                                        </div>
                                )
                                }) : ''
                            }
                            */
