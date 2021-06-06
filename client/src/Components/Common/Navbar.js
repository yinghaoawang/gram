import React from 'react';
import {Link} from 'react-router-dom';
import AuthContext from "../../AuthContext";
import './Navbar.css';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        console.log("prop");
    }
    static contextType = AuthContext;
    async componentDidUpdate() {

    }

    render() {
        return (
            <div className="navbar navbar-outermost-container border-bottom">
                <div className="navbar outer">
                    <div className="navbar left">
                        <Link to={'/'}>gram</Link>
                        <Link to={'/'}><img width="50" src="/public/logo.png" /></Link>
                    </div>
                    <div className="navbar right">
                        <AuthContext.Consumer>
                            { value => value.currUser != null ?
                                <>
                                    <Link to={'/'}>Home</Link>
                                    <Link to={'/top_accounts'}>Explore</Link>
                                    <Link to={'#'}>Notifications</Link>
                                    <Link to={'#'}>Account</Link>
                                </> :
                                <>
                                    <Link to={'/login'}>Login</Link>
                                    <Link to={'/signup'}>Sign Up</Link>
                                </> }

                        </AuthContext.Consumer>

                    </div>
                </div>
            </div>
        );
    }
}

export default Navbar;
