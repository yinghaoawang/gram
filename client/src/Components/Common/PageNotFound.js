import React from 'react';
import { Link } from 'react-router-dom';
import './PageNotFound.css';

class PageNotFound extends React.Component{
    render() {
        return (
            <div className="content">
                <div className="pnf-container">
                    <h2>Sorry, this page isn't available</h2>
                    <span>The link you followed may be broken, or the page may have been removed. <Link to={'/'}>Go back to gram</Link></span>
                </div>
            </div>
        );
    }
}

export default PageNotFound;
