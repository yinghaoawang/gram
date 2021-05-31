import {BrowserRouter as Router, Redirect, Route, Link, Switch, withRouter} from 'react-router-dom'
import React from 'react';
import Navbar from './Components/Common/Navbar';
import Footer from './Components/Common/Footer';
import PageNotFound from './Components/Common/PageNotfound';
import TopAccounts from './Components/Users/TopAccounts';
import UserProfile from './Components/Users/UserProfile/UserProfile';
import SignUp from './Components/Auth/SignUp';
import Login from './Components/Auth/Login';
import './App.css';
import AuthContext from "./AuthContext";

@withRouter
class App extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.location != prevProps.location) {
            this.onRouteChanged();
        }
    }
    async onRouteChanged() {
        try {
            let res = await fetch('/api/users/me', {
                method: "GET",
            });
            if (res.ok) {
                let data = await res.json();
                console.log(data);
                if (!this.state.user || this.state.user.id != data.id) {
                    this.setUser(data);
                }
            } else {
                if (res.status == 400) {
                    alert('Session expired, log in again.');
                    this.setUser(null);
                    this.props.history.push('/login');
                }
            }
        } catch(err) {
            console.error('err', err);
        };
    }

    setUser(user) {
        this.setState({user});
    }

    constructor(props) {
        super(props);
        this.state = {
            user: null,
        }
        this.setUser = this.setUser.bind(this);
    }

    render() {

        return (
            <AuthContext.Provider value={{user: this.state.user, setUser: this.setUser}}>

                <Navbar />
                <div className="outermost-container">
                    <Switch>
                            <Route path='/signup' component={SignUp} />
                            <Route path='/login' component={Login} />
                            <Route path='/top_accounts' component={TopAccounts} />
                            <Route path='/user/:user_id' component={UserProfile} />
                            <Route path='/404' component={PageNotFound} />
                            <Redirect to='/404' />
                    </Switch>
                    <Footer />
                </div>
            </AuthContext.Provider>
        );
    }
}

export default App;

