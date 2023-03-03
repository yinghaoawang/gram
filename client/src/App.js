import {Redirect, Route, Switch, withRouter } from 'react-router-dom'
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
import UserPostUpload from "./Components/Users/UserPostUpload";

import AuthContext from "./AuthContext";

import './App.css';


const apiPath = '/gram-api'

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
            let res = await fetch(apiPath + '/users/me', {
                method: "GET",
            });
            if (res.ok) {
                let data = await res.json();
                if (!this.state.currUser || this.state.currUser.id != data.id) {
                    this.setCurrUser(data);
                }
            } else {
                if (res.status == 400) {
                    alert('Session expired, log in again.');
                    this.setCurrUser(null);
                    this.props.history.push('/gram/login');
                }
            }
            this.setUserLoaded(true);
        } catch(err) {
            console.error('err');
            console.error(err);
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
                    <Switch basename={'/gram'}>
                            <Route exact path='/gram' component={Home} />
                            <Route path='/gram/terms' component={Terms} />
                            <Route path='/gram/signup' component={SignUp} />
                            <Route path='/gram/login' component={Login} />
                            <Route path='/gram/explore' component={PostExplore} />
                            <Route path='/gram/accounts/edit' component={UserSettings} />
                            <Route path='/gram/accounts/password/change' render={(props) => (<UserSettings {...props} selected='password-change' />)} />
                            <Route path='/gram/top_accounts' component={TopAccounts} />
                            <Route path='/gram/user/:user_id' component={UserProfile} />
                            <Route path='/gram/post/upload' component={UserPostUpload} />
                            <Route path='/gram/post/:post_id' component={PostDetails} />
                            <Route path='/gram/404' component={PageNotFound} />
                            <Route path='/gram/' component={PageNotFound} />
                    </Switch>
                    <Footer />
                </div>
            </AuthContext.Provider>
        );
    }
}

export default App;

