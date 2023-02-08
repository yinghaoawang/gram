import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import AuthContext  from "../../AuthContext";

const apiPath = '/api';

class Login extends React.Component{
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            username: '',
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
        let url = apiPath + "/users/login";
        let data = {
            username: this.state.username,
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
                if (res.status === 400) alert('Incorrect username/password combination');
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
                            <input name="username" type="text" placeholder="Username" onChange={(e) => this.setState({username: e.target.value})} />
                            <input name="password" type="password" placeholder="Password" onChange={(e) => this.setState({password: e.target.value})} />
                            <br />
                            <button type="submit">Log In</button>
                        </form>
                        <div className="auth terms-warning">
                            By signing up, you agree to our <a href="#">Terms</a> .
                        </div>
                    </div>
                    <div className="two auth inner-container">
                        <span>Don't have an account? <Link to={'/signup'}>Sign Up</Link></span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
