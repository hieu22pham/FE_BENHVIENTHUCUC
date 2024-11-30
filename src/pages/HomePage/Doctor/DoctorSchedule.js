import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import moment from "moment";
import { toast } from "react-toastify";
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
        const { doctorIdFromParent } = this.props;
        
        // Lấy giá trị ngày từ sự kiện (trong trường hợp này là giá trị của select)
        let date = e.target.value;
        localStorage.setItem('dataTime', date);
    
        if (doctorIdFromParent && doctorIdFromParent !== -1) {
            let doctorId = doctorIdFromParent;
            
            try {
                let res = await getScheduleDoctorByDateServicde(doctorId, date);
        
                if (res && res.errCode === 0 && res.data) {
                    this.setState({
                        allAvalableTime: res.data, // Cập nhật tất cả các thời gian khả dụng
                        dataTime: date, // Gán thời gian đầu tiên (hoặc null nếu không có lịch)
                    });
                } else {
                    // Không có lịch khả dụng
                    this.setState({
                        allAvalableTime: [], // Xóa danh sách các thời gian
                        dataTime: null, // Xóa dữ liệu thời gian đã chọn
                    });
                    toast.error("Không có lịch khả dụng cho ngày đã chọn!");
                }
            } catch (error) {
                // Xử lý lỗi khi gọi API
                console.error("Error fetching schedule:", error);
                toast.error("Đã xảy ra lỗi khi tải lịch trình!");
            }
        }
    };
    
    

    //Mở modal
    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time,
            recaptchaValue: null,
            dataScheduleTimeModal: time,
        });

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
                    dataTime={dataScheduleTimeModal} // Truyền thông tin lịch vào modal
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
