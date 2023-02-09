import React from 'react';
import './UserSettings.css';
import {withRouter} from 'react-router-dom';
import AuthContext from "../../../AuthContext";

const apiPath = '/api';

const SettingsRow = (props) => {
    return (
        <div className="settings-right-row">
            <div className="settings-form-label"><div className="settings-form-label-holder"><label htmlFor={"ep-" + props.name}>{props.name}</label></div></div>
            <div className="settings-form-field">
                {!props.input && <input placeholder={props.placeholder || ''} id={"ep-" + props.name} type={props.type || 'text'}></input>}
                {props.input && (<>{props.input}</>)}
                {
                    props.infoText &&
                    <div className="settings-form-info">
                        {props.infoText}
                    </div>
                }
            </div>
        </div>
    );
}

const SettingsPasswordChange = (props) => {
    let {currUser, pfpDefault} = props;
    return (<><div className="settings-right-top">
        <div className="settings-top-img">
            <img src={currUser ? currUser.pfp_url : pfpDefault}/>

        </div>
        <div className="settings-top-name">
            <span className="bigger">{currUser && currUser.username}</span>
        </div>
    </div>
        <form className="settings-form">
            <SettingsRow required type="password" name="Old Password" />
            <SettingsRow required type="password" name="New Password" />
            <SettingsRow required type="password" name="Confirm New Password" />
            <SettingsRow input={<button>Change Password</button>} />
        </form></>);
}

const SettingsEditProfile = (props) => {
    let {currUser, pfpDefault} = props;
    return (<><div className="settings-right-top">
        <div className="settings-top-img">
            <img src={currUser ? currUser.pfp_url : pfpDefault}/>

        </div>
        <div className="settings-top-name">
            <span>{currUser && currUser.username}</span>
            <h4 className="settings-top-pfp-change unselectable">Change Profile Photo</h4>
        </div>
    </div>
        <form className="settings-form">
            <SettingsRow name="Name" placeholder="Name" infoText={<span>Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</span>} />
            <SettingsRow name="Username" placeholder="Username" />
            <SettingsRow name="Group" placeholder="Group" />
            <SettingsRow name="Bio" input={<textarea id={"ep-" + props.name} type="text"></textarea>} infoText={<><h4>Personal Information</h4><span>Provide your personal information, even if the account is used for a business, a pet or something else. This won't be a part of your public profile.</span></>} />
            <SettingsRow name="Email" type="email" placeholder="Email" />
            <SettingsRow input={<button>Submit</button>} />
        </form></>);
}

class UserSettings extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = AuthContext;

    render() {
        let currUser = this.context.currUser;
        let pfpDefault = 'https://api-private.atlassian.com/users/841e0a8c88cc88e84ef9084b0c3e7ddd/avatar';

        return (
            <div className="content">
                <div className="user-settings-container">
                    <div className="user-settings-inner-left">
                        <div className={"settings-tab unselectable " + (!this.props.selected || this.props.selected == 'edit' ? 'selected' : '')}>
                            <a href='/gram/accounts/edit' onClick={e => {e.preventDefault(); window.location.href='/gram/accounts/edit'}}>Edit Profile</a>
                        </div>
                        <div className={"settings-tab unselectable " + (this.props.selected == 'password-change' ? 'selected' : '')}>
                            <a href='/gram/accounts/password/change' onClick={e => {e.preventDefault(); window.location.href='/gram/accounts/password/change'}}>Change Password</a>
                        </div>
                    </div>
                    <div className="user-settings-inner-right">
                        {(!this.props.selected || this.props.selected == 'edit') &&
                                <SettingsEditProfile currUser={currUser} pfpDefault={pfpDefault}/>}
                        {this.props.selected == 'password-change' &&
                                <SettingsPasswordChange currUser={currUser} pfpDefault={pfpDefault} />}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(UserSettings);
