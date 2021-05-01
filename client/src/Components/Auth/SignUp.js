import React from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

const apiPath = 'http://localhost:3030';

class SignUp extends React.Component{
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        let formData = new FormData(e.target);
        let url = apiPath + "/users/create";
        fetch(url, {
            method: "POST",
            body: formData,
            //headers: { "Content-Type": "multipart/form-data" },
        }).then(res => {
            console.log('res', res);
        }).catch(err => {
            console.error('err', err);
        });;
    }

    render() {
        return (
            <div className="content">
                <div className="signup-outer-container">
                    <div className="signup margin"></div>
                    <div className="one signup inner-container">
                        <h1>Gram</h1>
                        <h3>Sign up to see photos from your friends.</h3>
                        <form onSubmit={this.handleSubmit} className="signup inputs">
                            <input name="email" type="email" placeholder="Email" />
                            <input name="username" type="text" placeholder="Username" />
                            <input name="nickname" type="text" placeholder="Nickname" />
                            <input name="password" type="password" placeholder="Password" />
                            <br />
                            <button type="submit">Sign Up</button>
                        </form>
                        <div className="signup terms-warning">
                            By signing up, you agree to our <a href="#">Terms</a> .
                        </div>
                    </div>
                    <div className="two signup inner-container">
                        <span>Have an account? <a href="#">Log in</a></span>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUp;
