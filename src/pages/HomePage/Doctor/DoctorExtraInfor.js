import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";

import "./DoctorExtraInfor.scss";
import { getExtraInforDoctorByIdServicde } from "../../../services";
import { LANGUAGE } from "../../../utils/constants";

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {},
        };
    }

    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInforDoctorByIdServicde(
                this.props.doctorIdFromParent
            );
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data,
                });
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }

        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInforDoctorByIdServicde(
                this.props.doctorIdFromParent
            );
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data,
                });
            }
            // console.log("get ExtraInfor data: ", res);
        }
    }

    showHideDetailInfor = () => {
        this.setState({
            isShowDetailInfor: !this.state.isShowDetailInfor,
        });
    };

    render() {
        let { isShowDetailInfor, extraInfor } = this.state;
        let { language } = this.props;
        return (
            <div className="doctor-extraInfor_container">
                <div className="doctor-extraInfor_header">
                    <div className="text-address">
                        <FormattedMessage
                            id={"patient.extra-infor-doctor.text-address"}
                        />
                    </div>
                    <div className="name-clinic">
                        {extraInfor && extraInfor.nameClinic
                            ? extraInfor.nameClinic
                            : ""}
                    </div>
                    <div className="address-clinic">
                        {extraInfor && extraInfor.addressClinic
                            ? extraInfor.addressClinic
                            : ""}
                    </div>
                </div>
                <div className="doctor-extraInfor_footer">
                    {isShowDetailInfor === false && (
                        <div className="short-infor">
                            <h3>
                                <FormattedMessage
                                    id={"patient.extra-infor-doctor.text-price"}
                                />
                            </h3>
                            <span>
                                {extraInfor &&
                                extraInfor.priceData &&
                                language === LANGUAGE.VI ? (
                                    <NumberFormat
                                        value={extraInfor.priceData.valueVi}
                                        displayType="text"
                                        thousandSeparator={true}
                                        suffix="VND"
                                    />
                                ) : (
                                    ""
                                )}
                                {extraInfor &&
                                extraInfor.priceData &&
                                language === LANGUAGE.EN ? (
                                    <NumberFormat
                                        value={extraInfor.priceData.valueEn}
                                        displayType="text"
                                        thousandSeparator={true}
                                        suffix="$"
                                    />
                                ) : (
                                    ""
                                )}
                            </span>
                            <span
                                className="show-detailInfor_price"
                                onClick={() => {
                                    this.showHideDetailInfor();
                                }}
                            >
                                <FormattedMessage
                                    id={
                                        "patient.extra-infor-doctor.text-view-detail"
                                    }
                                />
                            </span>
                        </div>
                    )}
                    {isShowDetailInfor && (
                        <>
                            <div className="title-price">
                                <FormattedMessage
                                    id={"patient.extra-infor-doctor.text-price"}
                                />
                            </div>
                            <div className="detail-infor">
                                <div className="infor-price">
                                    <span className="text">
                                        <FormattedMessage
                                            id={
                                                "patient.extra-infor-doctor.text-price"
                                            }
                                        />
                                    </span>
                                    <span className="price">
                                        {extraInfor &&
                                        extraInfor.priceData &&
                                        language === LANGUAGE.VI ? (
                                            <NumberFormat
                                                value={
                                                    extraInfor.priceData.valueVi
                                                }
                                                displayType="text"
                                                thousandSeparator={true}
                                                suffix="VND"
                                            />
                                        ) : (
                                            ""
                                        )}
                                        {extraInfor &&
                                        extraInfor.priceData &&
                                        language === LANGUAGE.EN ? (
                                            <NumberFormat
                                                value={
                                                    extraInfor.priceData.valueEn
                                                }
                                                displayType="text"
                                                thousandSeparator={true}
                                                suffix="$"
                                            />
                                        ) : (
                                            ""
                                        )}
                                    </span>
                                </div>
                                <div className="note">
                                    {extraInfor && extraInfor.note
                                        ? extraInfor.note
                                        : ""}
                                </div>
                            </div>
                            <div className="infor-payment">
                                <FormattedMessage
                                    id={
                                        "patient.extra-infor-doctor.text-payment"
                                    }
                                />
                                {extraInfor &&
                                extraInfor.paymentData &&
                                language === LANGUAGE.VI
                                    ? extraInfor.paymentData.valueVi
                                    : ""}
                                {extraInfor &&
                                extraInfor.paymentData &&
                                language === LANGUAGE.EN
                                    ? extraInfor.paymentData.valueEn
                                    : ""}
                            </div>
                            <div className="hide-detailInfor_price">
                                <span
                                    onClick={() => {
                                        this.showHideDetailInfor();
                                    }}
                                >
                                    <FormattedMessage
                                        id={
                                            "patient.extra-infor-doctor.text-hide-price"
                                        }
                                    />
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        doctorDetailRedux: state.user.doctorDetail,
        language: state.appReducer.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
