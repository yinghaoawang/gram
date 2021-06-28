import React from 'react';
import './Modal.css';
import {Link, withRouter} from "react-router-dom";
import AuthContext from "../../../../AuthContext";
import {ModalButtonLeft, ModalButtonRight, PostContent} from "./PostModalParts";
import ReactDOM from "react-dom";

const apiPath = '/api';

class Modal extends React.Component {
    // this bad, i couldn't think of another way to do this since refs kept referring to the first one created
    constructor(props) {
        super(props);
        this.state = {}
        this.handleClick = this.handleClick.bind(this);
    }


    handleClick(e) {
        this.props.onClose(e);
    }

    render() {
        let show = this.props.show;
        let domNode = document.body;
        return ReactDOM.createPortal(
            <>
                {show == true &&
                <div className="modal-container">
                    <div onClick={this.handleClick} className={"modal-backdrop"}></div>
                    {this.props.children}
                </div>
                }
            </>,
            domNode
        );
    }
}

export default withRouter(Modal);
