import React, { Component } from "react";
import { Modal, Rate, Input, Button } from "antd";

const { TextArea } = Input;

export default class ReviewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 0,
            comment: "",
        };
    }

    handleRatingChange = (value) => {
        this.setState({
            rating: value,
        });
    };

    handleCommentChange = (event) => {
        this.setState({ comment: event.target.value });
    };

    handleSubmit = () => {
        let data = {
            rating: this.state.rating,
            comment: this.state.comment,
            doctorId: this.props.data.doctorId,
            bookingId: this.props.data.bookingId,
        };

        this.props.onSubmit(data);

        this.setState({
            rating: 0,
            comment: "",
        });

        this.props.onClose();
    };
    render() {
        const { rating, comment } = this.state;
        const { visible, onClose } = this.props;
        return (
            <Modal
                title="Đánh giá"
                open={visible}
                onCancel={onClose}
                footer={[
                    <Button key="cancel" onClick={onClose}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={this.handleSubmit}
                    >
                        Gửi đánh giá
                    </Button>,
                ]}
            >
                <div>
                    <label>{`Đánh giá:  `}</label>
                    <Rate value={rating} onChange={this.handleRatingChange} />
                </div>
                <div>
                    <label>Bình luận:</label>
                    <TextArea
                        value={comment}
                        onChange={this.handleCommentChange}
                    />
                </div>
            </Modal>
        );
    }
}
