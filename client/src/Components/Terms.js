import React from 'react';

import './Terms.css';
class Terms extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="content">
                <div>
                    <h1>Terms of Service</h1>
                    <ul>
                        <li>You don't talk about gram.</li>
                        <li>You don't talk about gram.</li>
                        <li>When someone says stop, or taps out, or goes limp, the fight is over.</li>
                        <li>Only two guys to a fight</li>
                        <li>One fight at a time.</li>
                        <li>No shirts, no shoes.</li>
                        <li>Fights will go on as long as they have to.</li>
                        <li>If this is your fight night at Fight Club, you <em>have</em> to fight.</li>
                    </ul>
                </div>

            </div>
        );
    }
}

export default Terms;
