import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import moment from "moment";
import localization from "moment/locale/vi";
import { getScheduleDoctorByDateServicde } from "../../../services/userService";

import { LANGUAGE } from "../../../utils";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvalableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
        };
    }

    async componentDidMount() {
        let allDays = this.getArrDays(this.props.language);
        this.setState({
            allDays: allDays,
        });

        if (this.props.doctorIdFromParent) {
            let allAvalableTime = await this.getTime(
                this.props.doctorIdFromParent,
                allDays[0].value
            );

            this.setState({
                allAvalableTime: allAvalableTime ? allAvalableTime : [],
            });
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            let allDays = this.getArrDays(this.props.language);
            this.setState({
                allDays: allDays,
            });
        }

        if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
            let allAvalableTime = await this.getTime(
                this.props.doctorIdFromParent,
                moment(new Date()).startOf("day").valueOf()
            );

            this.setState({
                allAvalableTime: allAvalableTime,
            });
        }
    }

    //Viết hoa chữ cái đầu
    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    //Hàm cho phép hiển thị 7 ngày sắp tới
    getArrDays = (language) => {
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let obj = {};
            if (language === LANGUAGE.VI) {
                if (i === 0) {
                    const ddMM = moment(new Date())
                        .add(i, "days")
                        .format("DD/MM");
                    let today = `Hôm nay - ${ddMM}`;
                    obj.label = today;
                } else {
                    let labelVi = moment(new Date())
                        .add(i, "days")
                        .format("dddd - DD/MM");
                    obj.label = this.capitalizeFirstLetter(labelVi);
                }
            } else {
                if (i === 0) {
                    const ddMM = moment(new Date())
                        .add(i, "days")
                        .format("DD/MM");
                    let today = `Today - ${ddMM}`;
                    obj.label = today;
                } else {
                    obj.label = moment(new Date())
                        .add(i, "days")
                        .locale("en")
                        .format("ddd - DD/MM");
                }
            }

            obj.value = moment(new Date())
                .add(i, "days")
                .startOf("day") //đầu ngày để ko lấy thời gian
                .valueOf(); //trả về timestamp

            allDays.push(obj);
        }
        return allDays;
    };

    getTime = async (doctorId, date) => {
        let res = await getScheduleDoctorByDateServicde(doctorId, date);
        return res.data;
    };

    handleChangeSelectDate = async (e) => {
        if (
            this.props.doctorIdFromParent &&
            this.props.doctorIdFromParent !== -1
        ) {
            let doctorId = this.props.doctorIdFromParent;
            let date = e.target.value;

            let res = await getScheduleDoctorByDateServicde(doctorId, date);
            // console.log("check response schedule from react: ", res);

            if (res && res.errCode == 0) {
                this.setState({
                    allAvalableTime: res.data,
                });
            }
        }
    };

    //Mở modal
    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time,
            recaptchaValue: null,
        });
        // console.log("check click schedule time: ", time);
    };
    //Tắt modal
    handleCloseModalBooking = () => {
        this.setState({
            isOpenModalBooking: false,
        });
    };

    render() {
        let { language } = this.props;
        let {
            allDays,
            allAvalableTime,
            isOpenModalBooking,
            dataScheduleTimeModal,
            recaptchaValue,
        } = this.state;
        return (
            <>
                <div className="doctor-schedule_container">
                    <div className="schedules-date">
                        <select
                            onChange={(e) => {
                                this.handleChangeSelectDate(e);
                            }}
                        >
                            {allDays &&
                                allDays.length > 0 &&
                                allDays.map((item, index) => {
                                    return (
                                        <option key={index} value={item.value}>
                                            {item.label}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                    <div className="schedules-available_time">
                        <div className="text-calenders">
                            <i className="fas fa-calendar-alt"></i>
                            <span>
                                <FormattedMessage
                                    id={"patient.detail-doctor.schedule"}
                                />
                            </span>
                        </div>
                        <div className="times">
                            {allAvalableTime && allAvalableTime.length > 0 ? (
                                <React.Fragment>
                                    <div className="times-content">
                                        {allAvalableTime.map((item, index) => {
                                            return (
                                                <button
                                                    key={index}
                                                    className={`${
                                                        language === LANGUAGE.VI
                                                            ? "btn-vie"
                                                            : "btn-en"
                                                    }`}
                                                    onClick={() => {
                                                        this.handleClickScheduleTime(
                                                            item
                                                        );
                                                    }}
                                                >
                                                    {language === LANGUAGE.VI
                                                        ? item.timeData.valueVi
                                                        : item.timeData.valueEn}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="book-free">
                                        <span>
                                            <FormattedMessage
                                                id={
                                                    "patient.detail-doctor.choose"
                                                }
                                            />
                                            <i className="far fa-hand-point-up"></i>
                                            <FormattedMessage
                                                id={
                                                    "patient.detail-doctor.book-free"
                                                }
                                            />
                                        </span>
                                    </div>
                                </React.Fragment>
                            ) : (
                                <div className="no-schedule">
                                    <FormattedMessage
                                        id={"patient.detail-doctor.no-schedule"}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <BookingModal
                    isOpenModal={isOpenModalBooking}
                    handleCloseModalBooking={this.handleCloseModalBooking}
                    dataTime={dataScheduleTimeModal}
                    recaptchaValue={recaptchaValue}
                />
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
