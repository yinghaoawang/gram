import {Redirect, Route, Switch, withRouter} from 'react-router-dom'
import React from 'react';
import Navbar from './Components/Common/Navbar';
import Footer from './Components/Common/Footer';
import PageNotFound from './Components/Common/PageNotfound';
import TopAccounts from './Components/Users/TopAccounts';
import UserProfile from './Components/Users/UserProfile/UserProfile';
import SignUp from './Components/Auth/SignUp';
import Login from './Components/Auth/Login';
import Home from './Components/Users/Home';
import Terms from './Components/Terms';
import PostDetails from "./Components/Posts/PostDetails";
import UserSettings from "./Components/Users/UserSettings/UserSettings";
import PostExplore from "./Components/Posts/PostExplore";

import AuthContext from "./AuthContext";

import './App.css';

@withRouter
class App extends React.Component {
    componentDidMount() {
        this.onRouteChanged();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location != prevProps.location) {
            this.onRouteChanged();
        }
    }
    async onRouteChanged() {
        try {
            this.setUserLoaded(false);
            let res = await fetch('/api/users/me', {
                method: "GET",
            });
            if (res.ok) {
                let data = await res.json();
                console.log(data);
                if (!this.state.currUser || this.state.currUser.id != data.id) {
                    this.setCurrUser(data);
                }
            } else {
                if (res.status == 400) {
                    alert('Session expired, log in again.');
                    this.setCurrUser(null);
                    this.props.history.push('/login');
                }
            }
            this.setUserLoaded(true);
        } catch(err) {
            console.error('err', err);
            this.setUserLoaded(true);
        };
    }

    setCurrUser(currUser) {
        this.setState({currUser});
    }

    setUserLoaded(userLoaded) {
        this.setState({userLoaded});
    }

    constructor(props) {
        super(props);
        this.state = {
            currUser: null,
            userLoaded: false,
        }
        this.setCurrUser = this.setCurrUser.bind(this);
    }

    render() {

        return (
            <AuthContext.Provider value={{currUser: this.state.currUser, userLoaded: this.state.userLoaded, setUserLoaded: this.setUserLoaded, setCurrUser: this.setCurrUser}}>

                <Navbar />
                <div className="outermost-container">
                    <Switch>
                            <Route exact path='/' component={Home} />
                            <Route path='/terms' component={Terms} />
                            <Route path='/signup' component={SignUp} />
                            <Route path='/login' component={Login} />
                            <Route path='/explore' component={PostExplore} />
                            <Route path='/accounts/edit' component={UserSettings} />
                            <Route path='/accounts/password/change' render={(props) => (<UserSettings {...props} selected='password-change' />)} />
                            <Route path='/top_accounts' component={TopAccounts} />
                            <Route path='/user/:user_id' component={UserProfile} />
                            <Route path='/post/:post_id' component={PostDetails} />
                            <Route path='/404' component={PageNotFound} />
                            <Route path='/' component={PageNotFound} />
                    </Switch>
                    <Footer />
                </div>
            </AuthContext.Provider>
        );
    }
}

export default App;

