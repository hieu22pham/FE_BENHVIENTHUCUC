import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Select } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";

import "./ManageSchedule.scss";
import {
    getAllDoctorAction,
    getAllScheduleTimeAction,
    getAllClinicAction,
} from "../../../redux/actions/adminAction";
import { LANGUAGE } from "../../../utils/constants";
import {
    saveBulkScheduleDoctorService,
    getScheduleDoctorByDateServicde,
    deleteScheduleService,
    getDoctorByClinic,
} from "../../../services";
import TableManageSchedules from "./TableManageSchedules";
import * as actions from "../../../redux/actions";

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctor: [],
            selectedDoctor: "",
            currentDate: "",
            rangeTime: [],

            listSchedule: [],
            userType: "admin",

            listClinic: [],
            selectedClinic: "",
        };
    }
    componentDidMount = () => {
        var clickCount = 0
        localStorage.setItem("clickCount", clickCount)
        this.handleGetAllDoctor();
        this.props.getAllSchedule();
        this.props.getAllClinic();

        //Nếu là doctor không cho chọn bác sĩ
        const { userInfo } = this.props;
        if (userInfo) {
            if (userInfo && userInfo.userType === "doctor") {
                this.setState({
                    selectedDoctor: userInfo.id,
                    userType: userInfo.userType,
                });
            }
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listDoctorRedux !== this.props.listDoctorRedux) {
            this.setState({
                listDoctor: this.props.listDoctorRedux,
            });
        }
        //Lấy ra thời gian lưu vào state
        if (
            prevProps.allScheduleTimeRedux !== this.props.allScheduleTimeRedux
        ) {
            // console.log("check rangeTime: ", this.props.allScheduleTimeRedux);
            let data = this.props.allScheduleTimeRedux;
            if (data && data.length > 0) {
                data = data.map((item) => {
                    return {
                        ...item,

                    };
                });
            }
            this.setState({
                rangeTime: data,
            });
        }

        if (prevProps.userInfo !== this.props.userInfo) {
            if (
                this.props.userInfo &&
                this.props.userInfo.userType === "doctor"
            ) {
                this.setState({
                    selectedDoctor: this.props.userInfo.id,
                    userType: this.props.userInfo.userType,
                });
            }
        }

        if (prevProps.listClinicRedux !== this.props.listClinicRedux) {
            this.setState({
                listClinic: this.props.listClinicRedux,
            });
        }
    }

    getAllScheduleDoctor = async (doctorId, date) => {
        let formattedDate = new Date(date).getTime();
        this.props.isShowLoading(true);
        let res = await getScheduleDoctorByDateServicde(doctorId, formattedDate);
        this.props.isShowLoading(false);

        console.log("API Response:", res); // Kiểm tra dữ liệu trả về từ API
        if (res && res.data) {
            this.setState(
                {
                    listSchedule: res.data, // Cập nhật listSchedule
                    currentDate: date,
                },
                () => {
                    console.log("Updated listSchedule:", this.state.listSchedule); // Kiểm tra state
                    const { rangeTime, listSchedule } = this.state;

                    let newArr = rangeTime.map((time) => {
                        let updatedTime = { ...time, isSelected: false };
                        for (const schedule of listSchedule) {
                            if (updatedTime.keyMap === schedule.timeType) {
                                updatedTime.isSelected = true;
                            }
                        }
                        return updatedTime;
                    });

                    this.setState({
                        rangeTime: newArr,
                    });
                }
            );
        }
    };


    handleGetAllDoctor = async () => {
        await this.props.getAllDoctor();
        this.setState({
            listDoctor: this.props.listDoctorRedux,
        });
    };

    handleSelectDoctor = async (value) => {
        localStorage.setItem("IdSelectedDoctor", value)
        this.setState({
            selectedDoctor: value,
        });
    };

    handleSelectDate = async (date) => {
        const { selectedDoctor } = this.state;
        const { language } = this.props;
        this.setState({ currentDate: date });
        const timestamp = moment(date).startOf("day").valueOf();
        localStorage.setItem("dataTime", timestamp)

        if (!selectedDoctor) {
            toast.error(
                `${LANGUAGE.VI === language
                    ? "Yêu cầu chọn bác sĩ!"
                    : "Isvalid selected Doctor!"
                }`
            );
            return;
        }
        await this.getAllScheduleDoctor(selectedDoctor, timestamp);
    };

    handleSelectTime = (data) => {
        let { rangeTime } = this.state;

        // Lấy ra index của item được click
        let updatedRangeTime = rangeTime.map((item) => {
            if (item.id === data.id) {
                return { ...item, isSelected: !item.isSelected };
            }
            return item;
        });

        console.log(updatedRangeTime)

        this.setState({
            rangeTime: updatedRangeTime,
        });
    };


    handleSaveSchedule = async () => {
        var clickCount = 1
        localStorage.setItem("clickCount", clickCount)
        const {
            selectedDoctor,
            currentDate,
            rangeTime,
            numOfPatient,
            listSchedule,
        } = this.state;

        if (!selectedDoctor || !currentDate || !numOfPatient) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const selectedTimes = rangeTime.filter((time) => {
            return (
                time.isSelected &&
                !listSchedule.some((schedule) => schedule.timeType === time.keyMap)
            );
        });

        if (selectedTimes.length === 0) {
            toast.error("Vui lòng chọn ít nhất một khoảng thời gian mới!");
            return;
        }

        const scheduleData = selectedTimes.map((time) => ({
            doctorId: selectedDoctor,
            date: moment(new Date(currentDate)).startOf("day").valueOf(),
            maxNumber: numOfPatient,
            timeType: time.keyMap,
            currentNumber: 0,
        }));

        try {
            this.props.isShowLoading(true);

            const response = await axios.post(
                "http://localhost:8080/api/create-schedule-doctor-by-date",
                scheduleData[0]
            );

            if (response && response.data && response.data.errCode === 0) {
                toast.success("Lưu lịch thành công!");
                // Cập nhật lại danh sách lịch và bảng

                console.log(selectedDoctor, currentDate)
                await this.getAllScheduleDoctor(selectedDoctor, currentDate);
            } else {
                toast.error(response.data.errMessage || "Không thể lưu lịch!");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi lưu lịch!");
        } finally {
            this.props.isShowLoading(false);
        }
    };


    handleDelete = async (data) => {
        const { selectedDoctor, currentDate } = this.state;
        let res = await deleteScheduleService(data.key);
        if (res && res.errCode === 0) {
            toast.success(res.message);
            this.getAllScheduleDoctor(selectedDoctor, currentDate);
        } else {
            toast.error(res.errMessage);
        }
    };

    handleSelectClinic = async (id) => {
        this.setState({
            selectedClinic: id,
        });
        let res = await getDoctorByClinic(id);
        if (res && res.errCode === 0) {
            this.setState({
                listDoctor: res.data,
            });
        }
    };

    handleSelectnumOfPatient = async (event) => {
        const numOfPatient = event.target.value;
        // const { numOfPatient } = this.state;
        const { language } = this.props;
        this.setState({ numOfPatient: numOfPatient });

        if (!numOfPatient) {
            toast.error(
                `${LANGUAGE.VI === language
                    ? "Yêu cầu nhập số lượng bệnh nhân!"
                    : "Isvalid number of patient!"
                }`
            );
            return;
        }
        // await this.getAllScheduleDoctor(numOfPatient, num);
    };

    render() {
        const { Option } = Select;
        const {
            selectedDoctor,
            listDoctor,
            currentDate,
            rangeTime,
            listSchedule,
            listClinic,
            selectedClinic,
        } = this.state;
        const { language, userInfo } = this.props;
        // Tạo một đối tượng Date đại diện cho ngày hiện tại
        var today = new Date();
        // Tạo một đối tượng Date đại diện cho ngày mai
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        return (
            <div className="manage-schedule_container">
                <div className="m-s-title">
                    <FormattedMessage id={"manage-schedule.title"} />
                </div>
                <div className="container">
                    {userInfo && userInfo.userType === "doctor" ? null : (
                        <div className="row">
                            {/* ĐÂY NHẤT display-clinic */}
                            <div className="col-4 mb-3 display-clinic">
                                <label>Chọn phòng khám</label>
                                <Select
                                    showSearch
                                    placeholder="Chọn một mục"
                                    style={{ width: "100%" }}
                                    onChange={this.handleSelectClinic}
                                    value={selectedClinic}
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {/* Render các Option từ dữ liệu API */}
                                    {listClinic &&
                                        listClinic.length &&
                                        listClinic.map((item) => (
                                            <Option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {language === LANGUAGE.VI
                                                    ? item.nameVi
                                                    : item.nameEn}
                                            </Option>
                                        ))}
                                </Select>
                            </div>
                        </div>
                    )}

                    <div className="row">
                        <div className="col-lg-6 col-sm-12 form-group">
                            <label>
                                <FormattedMessage
                                    id={"manage-schedule.choose-doctor"}
                                />
                            </label>
                            <Select
                                showSearch
                                placeholder="Chọn một mục"
                                style={{ width: "100%" }}
                                onChange={this.handleSelectDoctor}
                                value={selectedDoctor}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                disabled={
                                    userInfo && userInfo.userType === "doctor"
                                        ? true
                                        : false
                                }
                            >
                                {/* Render các Option từ dữ liệu API */}

                                {listDoctor.map((item) => (
                                    <Option key={item.id} value={item.id}>
                                        {language === LANGUAGE.VI
                                            ? `${item.lastName
                                            } ${item.firstName}  - ${item.Doctor_Infor
                                                .specialtyData.nameVi
                                                ? item.Doctor_Infor
                                                    .specialtyData
                                                    .nameVi
                                                : ""
                                            }`
                                            : `${item.lastName} ${item.firstName
                                            } - ${item.Doctor_Infor
                                                .specialtyData.nameEn
                                                ? item.Doctor_Infor
                                                    .specialtyData
                                                    .nameEn
                                                : ""
                                            }`}
                                    </Option>

                                ))}
                            </Select>
                            {/* {language === LANGUAGE.VI
                                ? `${item.firstName} ${item.lastName
                                } 
                                            - ${item.nameVi ? item.nameVi : ""
                                }`
                                : `${item.lastName} ${item.firstName
                                } - ${item.nameEn ? item.nameEn : ""
                                }`} */}
                        </div>
                        <div className="col-lg-6 col-sm-12 form-group">
                            <label>
                                <FormattedMessage
                                    id={"manage-schedule.choose-date"}
                                />
                            </label>
                            <br />
                            <DatePicker
                                className="form-control"
                                selected={currentDate}
                                onChange={(date) => {
                                    this.handleSelectDate(date);
                                }}
                                dateFormat="dd/MM/yyyy" // Định dạng ngày tháng thành "dd/mm/yyyy"
                                minDate={tomorrow} // Giới hạn ngày tối thiểu là ngày hiện tại
                                value={currentDate}
                            />
                        </div>
                        <div className="col-lg-4 col-sm-12 form-group">
                            <label>
                                <FormattedMessage
                                    id={"manage-schedule.choose-numOfPatient"}
                                />
                            </label>
                            <br />
                            <input
                                className="form-control"
                                name="maxNumber"
                                type="number"
                                onChange={(num) => {
                                    this.handleSelectnumOfPatient(num)
                                }}

                            />
                        </div>
                        <div className="col-12 pick-hour_container">
                            {/* <FormattedDate value={this.state.currentDate} /> */}
                            {rangeTime &&
                                rangeTime.length > 0 &&
                                rangeTime.map((item) => {
                                    return (
                                        <button
                                            className={`btn btn btn-schedule ${item.isSelected ? "active" : ""
                                                }`}
                                            key={item.id}
                                            onClick={() => {
                                                this.handleSelectTime(item);
                                            }}
                                        >
                                            {language === LANGUAGE.VI
                                                ? item.valueVi
                                                : item.valueEn}
                                        </button>
                                    );
                                })}
                        </div>
                        <div className="col-12 mt-3">
                            <button
                                className="btn btn-primary"
                                onClick={() => this.handleSaveSchedule()}
                            >
                                <FormattedMessage id={"manage-schedule.save"} />
                            </button>
                        </div>
                    </div>

                    <TableManageSchedules
                        data={listSchedule}
                        handleDelete={this.handleDelete}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.appReducer.language,
        listDoctorRedux: state.adminReducer.listDoctor,
        allScheduleTimeRedux: state.adminReducer.allScheduleTime,
        userInfo: state.user.userInfo,
        listClinicRedux: state.adminReducer.clinics,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        isShowLoading: (isLoading) => {
            return dispatch(actions.isLoadingAction(isLoading));
        },
        getAllDoctor: () => {
            return dispatch(getAllDoctorAction());
        },
        getAllSchedule: () => {
            return dispatch(getAllScheduleTimeAction());
        },
        getAllClinic: () => {
            return dispatch(getAllClinicAction());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
