import React, { Component } from "react";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import moment from "moment";
import localization from "moment/locale/vi";
import { Link } from "react-router-dom/cjs/react-router-dom";

import "./ProfileDoctor.scss";
import { getProfileDoctorByIdService } from "../../../services/userService";
import { LANGUAGE } from "../../../utils";

class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {},
        };
    }

    async componentDidMount() {
        let id = this.props.doctorId;
        if (id) {
            let data = await this.getProfileDoctor(id);
            // console.log("check profile doctor from ProfileDoctor: ", res);
            this.setState({
                dataProfile: data,
            });
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.doctorId !== prevProps.doctorId) {
            let data = await this.getProfileDoctor(this.props.doctorId);
            this.setState({
                dataProfile: data,
            });
        }
    }

    getProfileDoctor = async (id) => {
        let result = {};
        if (id) {
            let res = await getProfileDoctorByIdService(id);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }

        return result;
    };

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    renderTimeBooking = (dataTime) => {
        let { language } = this.props;

        if (dataTime && !_.isEmpty(dataTime)) {
            let time =
                language === LANGUAGE.VI
                    ? dataTime.timeData.valueVi
                    : dataTime.timeData.valueEn;

            let date =
                language === LANGUAGE.VI
                    ? this.capitalizeFirstLetter(
                        moment
                            .unix(+dataTime.date / 1000)
                            .format("dddd - DD/MM/YYYY")
                    )
                    : moment
                        .unix(+dataTime.date / 1000)
                        .locale("en")
                        .format("ddd - MM/DD/YYYY");

            return (
                <>
                    <div>{`${time} - ${date}`}</div>
                    <div>
                        <FormattedMessage
                            id={"patient.booking-modal.free-booking"}
                        />
                    </div>
                </>
            );
        }
        return <></>;
    };

    render() {
        let { dataProfile } = this.state;
        let {
            language,
            isShowDescription,
            dataTime,
            isShowLinkDetail,
            isShowPrice,
            doctorId,
        } = this.props;

        let nameVi = "",
            nameEn = "";
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName} `;
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName} `;
        }

        return (
            <div className="profile-doctor_container">
                <div className="intro-doctor">
                    <div
                        className="intro-left"
                        style={{
                            backgroundImage: `url(${dataProfile && dataProfile.image
                                    ? dataProfile.image
                                    : ""
                                })`,
                        }}
                    ></div>
                    <div className="intro-right">
                        <div className="intro-right_up">
                            {language === LANGUAGE.VI ? nameVi : nameEn}
                        </div>
                        <div className="intro-right_down">
                            {isShowDescription === true ? (
                                <>
                                    {dataProfile &&
                                        dataProfile.Markdown &&
                                        dataProfile.Markdown.description && (
                                            <span>
                                                {
                                                    dataProfile.Markdown
                                                        .description
                                                }
                                            </span>
                                        )}
                                </>
                            ) : (
                                <>{this.renderTimeBooking(dataTime)}</>
                            )}
                        </div>
                    </div>
                </div>
                {isShowLinkDetail === true && (
                    <Link
                        to={`/detail-doctor/${doctorId}`}
                        className="view-detail_doctor"
                    >
                        <FormattedMessage
                            id={"patient.booking-modal.text-more"}
                        />
                    </Link>
                )}
                {isShowPrice && (
                    <div className="price">
                        <FormattedMessage
                            id={"patient.booking-modal.text-price"}
                        />
                        {dataProfile.Doctor_Infor &&
                            dataProfile.Doctor_Infor.priceData &&
                            language === LANGUAGE.VI && (
                                <NumberFormat
                                    className={"currency"}
                                    value={
                                        dataProfile.Doctor_Infor.priceData
                                            .valueVi
                                    }
                                    displayType="text"
                                    thousandSeparator={true}
                                    suffix="VND"
                                />
                            )}
                        {dataProfile.Doctor_Infor &&
                            dataProfile.Doctor_Infor.priceData &&
                            language === LANGUAGE.EN && (
                                <NumberFormat
                                    className={"currency"}
                                    value={
                                        dataProfile.Doctor_Infor.priceData
                                            .valueEn
                                    }
                                    displayType="text"
                                    thousandSeparator={true}
                                    suffix="$"
                                />
                            )}
                    </div>
                )}
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        language: state.appReducer.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
