import React from 'react';
import Modal from "../Users/UserProfile/PostModal/Modal";

class ModalOptions extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Modal onClose={this.props.onClose} show={this.props.show}>
            <>Modal Options!</>
        </Modal>
    }
}

export default ModalOptions;