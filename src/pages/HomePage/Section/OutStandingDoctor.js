import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Buffer } from "buffer";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";

import { LANGUAGE } from "../../../utils";
import { getTopDoctorAction } from "../../../redux/actions";
import { getTopDoctorHome2Service } from "../../../services/userService";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import * as actions from "../../../redux/actions";

class OutStandingDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
        };
    }

    async componentDidMount() {
        // this.props.loadTopDoctors();
        this.props.isShowLoading(true);
        let res = await getTopDoctorHome2Service(8);
        if (res && res.errCode === 0) {
            this.setState(
                {
                    arrDoctors: res.data,
                },
                () => {
                    this.props.isShowLoading(false);
                }
            );
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
        //     //Khi có thay đổi data thì gọi lại loadTopDoctors
        //     this.setState({ arrDoctors: this.props.topDoctorsRedux });
        //     // this.props.loadTopDoctors();
        // }
    }

    render() {
        const { language } = this.props;
        // console.log("Check props topDoctors from redux: ", topDoctorsRedux);

        const handleDetailDoctor = (doctor) => {
            this.props.history.push(`detail-doctor/${doctor.doctorId}`);
        };

        const renderTopDoctor = () => {
            return this.state.arrDoctors.map((doctor, index) => {
                let imageBase64 = "";
                if (doctor.User.image) {
                    //decode từ base64 để lấy ra ảnh dạng binary
                    imageBase64 = new Buffer(
                        doctor.User.image,
                        "base64"
                    ).toString("binary");
                }
                let nameVi = `${doctor.User.positionData.valueVi}, ${doctor.User.firstName} ${doctor.User.lastName}`;
                let nameEn = `${doctor.User.positionData.valueEn}, ${doctor.User.firstName} ${doctor.User.lastName}`;

                return (
                    <div
                        className="section-customize"
                        key={index}
                        onClick={() => {
                            handleDetailDoctor(doctor);
                        }}
                    >
                        <div className="container-content">
                            <div
                                className="bg-img outstanding-doctor-img"
                                style={{
                                    backgroundImage: `url(${imageBase64})`,
                                }}
                            ></div>
                            <div className="description text-center">
                                <div>
                                    {language === LANGUAGE.VI ? nameVi : nameEn}
                                </div>
                                <span>
                                    {language === LANGUAGE.VI
                                        ? doctor.User.Doctor_Infor.specialtyData
                                            .nameVi
                                        : doctor.User.Doctor_Infor.specialtyData
                                            .nameEn}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            });
        };

        return (
            <div className="section-share section-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="homepage.out-standing-doctor" />
                        </span>
                        <Link
                            to={`/danh-sach/bac-si/danh-cho-ban`}
                            className="btn-section"
                        >
                            <FormattedMessage id="homepage.more-infor" />
                        </Link>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {this.state.arrDoctors &&
                                this.state.arrDoctors.length > 0
                                ? renderTopDoctor()
                                : ""}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        topDoctorsRedux: state.adminReducer.topDoctors,
        language: state.appReducer.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        isShowLoading: (isLoading) => {
            return dispatch(actions.isLoadingAction(isLoading));
        },
        loadTopDoctors: () => {
            return dispatch(getTopDoctorAction());
        },
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor)
);
