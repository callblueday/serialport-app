import React from 'react';
import ReactModal from 'react-modal';

// 消息框
class MessageBox extends React.Component {
    constructor (props) {
        super(props);
    }

    handleOnOK () {
        try {
            this.props.onOK();
        } catch (ex) {
            Console.log(ex);
        }
        this.props.onCancel(); // 保证close
    }

    render () {
        return (
            <ReactModal
                contentLabel={'messag box'}
                isOpen={this.props.visible}

                onRequestClose={() => this.props.onCancel()}>

                <Box>
                </Box>
                {/* title */}

                <Box>
                    {this.props.content}
                    {this.props.children}
                </Box>
                {/* content */}
            </ReactModal>
        );
    }
}

export default MessageBox;
