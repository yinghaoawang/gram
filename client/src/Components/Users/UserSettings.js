import React from 'react';
import './UserSettings.css';
import {withRouter} from 'react-router-dom';

const apiPath = '/api';

class UserSettings extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="content">
                <div>
                    Hi
                </div>
            </div>
        );
    }
}

export default withRouter(UserSettings);
