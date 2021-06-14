import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

class Footer extends React.Component{
    render() {
        return (
            <footer>
                <div className="footer-outer-container">
                    <div className="footer-links footer-center">
                        <Link to={'#'}>About</Link>
                        <Link to={'#'}>Privacy</Link>
                        <Link to={'/terms'}>Terms</Link>
                        <Link to={'/top_accounts'}>Top Accounts</Link>
                        <Link to={'#'}>Help</Link>
                    </div>
                    <div className="footer-copyright">
                        <span>© 2021 gram</span>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
