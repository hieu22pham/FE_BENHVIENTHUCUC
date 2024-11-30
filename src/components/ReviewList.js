import React, { Component } from "react";
import { getDoctorReviewService } from "../services";
import "./ReviewList.scss";
import { Rate } from "antd";
import { dateFormat } from "../utils";
import moment from "moment";

export default class ReviewList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reviews: [],
        };
    }
    async componentDidUpdate(prevProps) {
        if (prevProps.doctorId !== this.props.doctorId) {
          console.log("Review id: " , this.props.doctorId)
        //   const doctorIdSelected = localStorage.getItem("doctorIdSelected")
          const path = window.location.pathname; // Lấy toàn bộ đường dẫn sau domain
            const doctorIdSelected = path.split("/").pop();
            let res = await getDoctorReviewService(doctorIdSelected);
            console.log(' GET REVIEW By Nhat Ba: ', res);
            if (res && res.errCode === 0) {
                this.setState({
                    reviews: res.data,
                });
            }
        }
    }

    render() {
        let { reviews } = this.state;
        return (
            <div className="review-list-container container">
                <h2>Phản hồi của bệnh nhân sau khi đi khám</h2>
                <div className="feedback-list">
                    {reviews &&
                        reviews.map((review, index) => {
                            let rating = parseInt(review.rating)
                            return (
                                <div className="feedback-item" key={index}>
                                    <div className="feedback-name">
                                        <strong>
                                            {/* {`${review.lastName} ${review.firstName} `} */}
                                            {review?.lastName || ""} {review?.firstName || ""} 
                                            &nbsp; &nbsp;
                                        </strong>
                                        <a className="feedback-info">
                                            <i className="fas fa-check-circle"></i>
                                            &nbsp; đã khám ngày {moment(review.createdAt).format('DD/MM/yyyy')}
                                        </a>
                                        <div className="rating">
                                            {rating != 0 && rating && (
                                                <Rate
                                                    disabled
                                                    allowHalf
                                                    defaultValue={rating != 0 ? rating : 0}
                                                />
                                            )}

                                        </div>
                                    </div>
                                    <div className="feedback-content">
                                        {review.comment}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }
}
