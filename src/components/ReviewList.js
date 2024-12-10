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
    // async componentDidUpdate(prevProps) {
    //     if (prevProps.doctorId !== this.props.doctorId) {
    //         let res = await getDoctorReviewService(this.props.doctorId);
    //         console.log(' GET REVIEW By Nhat Ba: ', res);
    //         if (res && res.errCode === 0) {
    //             this.setState({
    //                 reviews: res.data,
    //             });
    //         }
    //     }
    // }

    enrichReviewsWithPatientNames = async (reviews) => {
        return Promise.all(
            reviews.map(async (review) => {
                if (review.patientId) {
                    try {
                        const response = await fetch(`http://localhost:8080/api/get-infor-user?id=${review.patientId}`);
                        const data = await response.json();
                        console.log("Data: ", data)
                        console.log("Data: ", data.firstName)
                        console.log("Data: ", data.lastName)


                        review.patientName = data.data?.lastName + " " + data.data?.firstName  || "Không xác định"; // Gán tên bệnh nhân
                    } catch (error) {
                        console.error(`Error fetching name for patientId ${review.patientId}:`, error);
                        review.patientName = "Không xác định"; // Gán giá trị mặc định nếu lỗi
                    }
                }
                return review;
            })
        );
    };
    

    async componentDidUpdate(prevProps) {
        if (prevProps.doctorId !== this.props.doctorId) {
            let res = await getDoctorReviewService(this.props.doctorId);
            console.log(`GET REVIEW By Nhat Ba: ${this.props.doctorId}`, res);
            if (res && res.errCode === 0) {
                // Enrich dữ liệu với tên bệnh nhân
                const enrichedReviews = await this.enrichReviewsWithPatientNames(res.data);
                this.setState({
                    reviews: enrichedReviews,
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
                                            {`${review.patientName} `}
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
