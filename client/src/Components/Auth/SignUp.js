import React from 'react';
import { Link } from 'react-router-dom';
import AuthContext from "../../AuthContext";
import './Auth.css';

const apiPath = '/api';

class SignUp extends React.Component{
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            email: '',
            username: '',
            nickname: '',
            password: '',

        };
    }
    static contextType = AuthContext;
    async componentDidUpdate() {
        if (this.context.userLoaded && this.context.currUser != null) {
            this.props.history.push('/');
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        let url = apiPath + "/users/create";
        let data = {
            email: this.state.email,
            username: this.state.username,
            nickname: this.state.nickname,
            password: this.state.password
        }
        fetch(url, {
            method: "POST",
            body: new URLSearchParams({user: JSON.stringify(data)}),
        }).then(res => {
            if (res.ok) {
                console.log('OK', res);
                res.json().then(data => {
                    console.log(data.token);
                    this.props.history.push('/');
                });
            } else {
                if (res.status === 401) {
                    alert(res.statusText);
                }
                console.error('NOT OK', res);
            }
        }).catch(err => {
            console.error('err', err);
        });
    }

    render() {
        return (
            <div className="content">
                <div className="auth-outer-container">
                    <div className="auth margin"></div>
                    <div className="one auth inner-container">
                        <h1>Gram</h1>
                        <h3>Sign up to see photos from your friends.</h3>
                        <form onSubmit={this.handleSubmit} className="auth inputs">
                            <input name="email" type="email" placeholder="Email" onChange={(e) => this.setState({email: e.target.value})} />
                            <input name="username" type="text" placeholder="Username" onChange={(e) => this.setState({username: e.target.value})} />
                            <input name="nickname" type="text" placeholder="Nickname" onChange={(e) => this.setState({nickname: e.target.value})} />
                            <input name="password" type="password" placeholder="Password" onChange={(e) => this.setState({password: e.target.value})} />
                            <br />
                            <button type="submit">Sign Up</button>
                        </form>
                        <div className="auth terms-warning">
                            By signing up, you agree to our <a href="#">Terms</a> .
                        </div>
                    </div>
                    <div className="two auth inner-container">
                        <span>Have an account? <Link to={'/login'}>Login</Link></span>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUp;
