import React, { Component } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import { postVerifyBookAppointmentService } from "../../services";
import HomeHeader from "../HomePage/HomeHeader";
import "./VerifyEmail.scss";

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0,
        };
    }
    async componentDidMount() {
        // console.log(">>>> check props form verifyEmail: ", this.props);

        if (this.props.location && this.props.location.search) {
            //Lấy ra các querry string sau dấu ?: http://localhost:3000/verify-booking?token=sj%C4%91jjdkjdjdjj%C4%91&doctorId=2
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get("token");
            let doctorId = urlParams.get("doctorId");

            //Gửi lên server
            let res = await postVerifyBookAppointmentService({
                token: token,
                doctorId: doctorId,
            });

            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode,
                });
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1,
                });
            }

            // console.log(">>>> check token: " + token + " " + doctorId);
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) { }

    render() {
        const { statusVerify, errCode } = this.state;
        return (
            <div>
                <Helmet>
                    <title>{`Xác nhận lịch hẹn`}</title>
                    <meta name="description" content={`Xác nhận lịch hẹn`} />
                </Helmet>
                <HomeHeader />
                <div className="verify-email_container">
                    {statusVerify === false ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="verify-email">
                            {errCode === 0 ? (
                                <div className="verify-email_success">
                                    <p className="success">Đặt lịch khám bệnh thành công!</p>
                                    <div className="success-info">
                                        <p>Vui lòng đến khám đúng giờ để chúng tôi
                                            hỗ trợ tốt nhất cho bạn.
                                        </p>
                                        <p>Xin cảm ơn</p>
                                    </div>
                                </div>

                            ) : (
                                <div className="verify-email_error">
                                    Lịch hẹn không tồn tại hoặc đã được xác
                                    nhận!
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default connect()(VerifyEmail);
