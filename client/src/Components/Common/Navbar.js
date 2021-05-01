import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

class Navbar extends React.Component{
    render() {
        return (
            <div className="navbar navbar-outermost-container border-bottom">
                <div className="navbar outer">
                    <div className="navbar left">
                        <Link to={'/'}>gram</Link>
                        <Link to={'/'}><img width="50" src="/public/logo.png" /></Link>
                    </div>
                    <div className="navbar right">
                        <Link to={'#'}>Home</Link>
                        <Link to={'/top_accounts'}>Explore</Link>
                        <Link to={'#'}>Notifications</Link>
                        <Link to={'#'}>Account</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Navbar;
