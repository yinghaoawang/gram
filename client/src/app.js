import { BrowserRouter as Router, Redirect, Route, Link, Switch } from 'react-router-dom'
import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './Components/Common/Navbar';
import Footer from './Components/Common/Footer';
import PageNotFound from './Components/Common/PageNotfound';
import TopAccounts from './Components/Users/TopAccounts';
import UserProfile from './Components/Users/UserProfile/UserProfile';
import './App.css';

class App extends React.Component {
    render() {
        return (
            <Router>
                <div className="outermost-container">
                    <Navbar />
                    <Switch>
                            <Route path='/top_accounts' component={TopAccounts} />
                            <Route path='/user/:user_id' component={UserProfile} />
                            <Route path='/404' component={PageNotFound} />
                            <Redirect to='/404' />
                    </Switch>
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default App;

