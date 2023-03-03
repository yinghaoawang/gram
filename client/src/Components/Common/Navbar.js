import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import AuthContext from "../../AuthContext";
import './Navbar.css';
import ReactDOM from "react-dom";
import { DEBUG_MODE } from '../../Util';

const apiPath = '/gram-api';

class NavbarAccountDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,
        }

        this.toggleMenu = this.toggleMenu.bind(this);
        this.logout = this.logout.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClickOutside(event) {
        const domNode = ReactDOM.findDOMNode(this);

        if (this.state.showMenu && (!domNode || !domNode.contains(event.target))) {
            this.setState({showMenu: false});
        }
    }

    handleClick(event) {
        if (this.state.showMenu && !this.dropdownBtnRef.contains(event.target)) {
            this.setState({showMenu: false});
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick);
    }

    static contextType = AuthContext;

    toggleMenu(event) {
        event.preventDefault();
        this.setState({
            showMenu: !this.state.showMenu,
        });
    }

    async logout(e) {
        fetch(apiPath + '/users/logout', {
            method: 'POST'
        }).then(async res => {
            await this.context.setCurrUser(null);
            alert('Log out successful.');
            this.props.history.push('/gram/login');
        }).catch(err => {
            console.error('logout err', err);
        });
    }

    render() {
        return (
            <div className="dropdown-menu">
                <div ref={ref => this.dropdownBtnRef = ref} className="dropdown-button">
                    <a onClick={this.toggleMenu}>Account</a>
                </div>

                {
                    this.state.showMenu
                        ? (
                            <div className="dropdown-items">
                                <Link to={"/gram/user/" + this.context.currUser.id}
                                      onClick={e => {e.preventDefault(); window.location.href='/gram/user/' + this.context.currUser.id}}>
                                Profile</Link>
                                <Link to="/gram/accounts/edit" style={{borderBottom: '1px solid rgb(210, 210, 210)'}}>Settings</Link>
                                <a onClick={this.logout}>Log out</a>
                            </div>
                        )
                        : (
                            null
                        )
                }
            </div>
        );
    }
}

NavbarAccountDropdown = withRouter(NavbarAccountDropdown);

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
                { DEBUG_MODE && <div id='console' style={{width: '100%', backgroundColor: 'green', height: '30px', color: 'white'}}></div> }
                <div className="navbar outer">
                    <div className="navbar left">
                        <Link to={'/gram'}>gram</Link>
                        <Link to={'/gram'}><img width="50" src="/gram/public/logo.png" /></Link>
                    </div>
                    <div className="navbar right">
                        <AuthContext.Consumer>
                            { value => value.currUser != null ?
                                <>
                                    <Link to={'/gram'}>Home</Link>
                                    <Link to={'/gram/explore'}>Explore</Link>
                                    {/* <Link to={'#'}>Notifications</Link> */}
                                    <Link to="/gram/post/upload">Upload</Link>

                                    <NavbarAccountDropdown />

                                </> :
                                <>
                                    <Link to={'/gram/login'}>Login</Link>
                                    <Link to={'/gram/signup'}>Sign Up</Link>
                                </> }

                        </AuthContext.Consumer>

                    </div>
                </div>
            </div>
        );
    }
}

export default Navbar;
