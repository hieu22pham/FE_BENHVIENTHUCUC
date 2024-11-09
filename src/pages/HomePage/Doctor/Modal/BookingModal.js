import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Modal } from "reactstrap";
import DatePicker from "react-datepicker";
import _ from "lodash";
import { toast } from "react-toastify";
import moment from "moment";
import ReCAPTCHA from "react-google-recaptcha";

import "./BookingModal.scss";
import ProfileDoctor from "../ProfileDoctor";
import * as actions from "../../../../redux/actions";
import { LANGUAGE, validateEmail, validatePhone } from "../../../../utils";
import { postPatientBookAppointmentService } from "../../../../services";

// const sitekey = "6LdfLC0pAAAAAMKFPIlfXoCqOMhOSBHxYByhydvu";
// const sitekey = "6LcDeigpAAAAAGR-uUlDOI72QqfzYluAjJ-rRMro";
const sitekeyLocal = "6LcDeigpAAAAALF7KPDFg0HCJGvh3tj-pv5F2WcK";

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            phoneNumber: "",
            email: "",
            address: "",
            reason: "",
            birthDay: "",
            selectedGender: "",
            doctorId: "",
            timeType: "",
            date: "",
            language: "vi",
            timeString: "",
            doctorName: "",
            addressClinic: "",

            error: {
                fullName: false,
                phoneNumber: false,
                email: false,
                address: false,
                reason: false,
                birthDay: false,
                selectedGender: false,
            },

            genders: "",

            recaptchaValue: null,
        };
    }
    componentDidMount() {
        this.props.getGenders();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.gendersRedux),
            });
        }
        if (prevProps.gendersRedux !== this.props.gendersRedux) {
            this.setState({
                genders: this.buildDataGender(this.props.gendersRedux),
                selectedGender:
                    this.props.gendersRedux &&
                        this.props.gendersRedux.length > 0
                        ? this.props.gendersRedux[0].keyMap
                        : "",
            });
        }
        if (prevProps.dataTime !== this.props.dataTime) {
            this.setState({
                doctorId: this.props.dataTime.doctorId,
                timeType: this.props.dataTime.timeType,
                date: this.props.dataTime.date,
                recaptchaValue: this.props.recaptchaValue,
                addressClinic:
                    this.props.dataTime.doctorData.Doctor_Infor.addressClinic,
            });
        }
    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;

        if (data && data.length > 0) {
            result = data.map((item) => {
                return {
                    lable:
                        language === LANGUAGE.VI ? item.valueVi : item.valueEn,
                    value: item.keyMap,
                };
            });
        }

        return result;
    };

    handleChangeInput = (event, key) => {
        let valueInput = event.target.value;
        let copyState = { ...this.state };
        if (!valueInput) {
            copyState.error[key] = `Không được để trống!`;
        } else {
            copyState.error[key] = null;
        }
        copyState[key] = valueInput;
        this.setState({
            ...copyState,
        });
    };

    handleSelectDate = (date) => {
        let copyState = { ...this.state };
        if (!date) {
            copyState.error.birthDay = "Yêu cầu nhập đúng ngày sinh!";
        } else {
            copyState.birthDay = date;
            copyState.error.birthDay = "";
        }

        this.setState({
            ...copyState,
        });
    };

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    buildTimeBooking = (dataTime) => {
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

            return `${time} - ${date}`;
        }
        return ``;
    };

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name =
                language === LANGUAGE.VI
                    ? `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
                    : `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`;

            return name;
        }
        return ``;
    };

    validateInput = () => {
        let copyState = { ...this.state };
        let isValid = true;
        let arr = [
            "fullName",
            "phoneNumber",
            "email",
            "address",
            "reason",
            "selectedGender",
        ];

        arr.forEach((key) => {
            if (!copyState[key]) {
                copyState.error[key] = `Không được để trống!`;
                isValid = false;
            }
        });

        if (!this.state.birthDay) {
            copyState.error["birthDay"] = `Không được để trống!`;
            isValid = false;
        }

        if (!validateEmail(copyState.email)) {
            copyState.error["email"] = `Email không đúng!`;
            isValid = false;
        }

        if (!validatePhone(copyState.phoneNumber)) {
            copyState.error["phoneNumber"] = `Số điện thoại không đúng!`;
            isValid = false;
        }

        this.setState({
            ...copyState,
        });

        return isValid;
    };

    resetInput = () => {
        this.setState({
            fullName: "",
            phoneNumber: "",
            email: "",
            address: "",
            reason: "",
            birthDay: "",
            selectedGender:
                this.props.gendersRedux && this.props.gendersRedux.length > 0
                    ? this.props.gendersRedux[0].keyMap
                    : "",

            error: {
                fullName: false,
                phoneNumber: false,
                email: false,
                address: false,
                reason: false,
                birthDay: false,
                selectedGender: false,
            },
        });
    };

    handleConfirmBooking = async () => {
        //validate input
        let birthDay = new Date(this.state.birthDay).getTime(); //timestamp
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);

        let data = {
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.state.date,
            gender: this.state.selectedGender,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            birthDay: birthDay,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName,
            addressClinic: this.state.addressClinic,
        };

        let isValid = this.validateInput();

        if (isValid) {
            this.props.isShowLoading(true);
            let res = await postPatientBookAppointmentService(data);
            if (res && res.errCode === 0) {
                this.props.isShowLoading(false);
                toast.success(res.message);
                this.props.handleCloseModalBooking();
                this.resetInput();
                this.setState({
                    recaptchaValue: null,
                });
            } else {
                this.props.isShowLoading(false);
                toast.error(res.errMessage);
            }
        }
    };

    handleRecaptchaChange = (value) => {
        // Có thể có các lệnh xử lý khác ở đây
        try {
            this.setState({
                recaptchaValue: value,
            });
        } catch (error) {
            console.error("Error in handleRecaptchaChange:", error);
        }
    };

    render() {
        const {
            email,
            fullName,
            genders,
            address,
            phoneNumber,
            reason,
            birthDay,
            selectedGender,
        } = this.state;

        const { isOpenModal, handleCloseModalBooking, dataTime } = this.props;

        let doctorId = "";
        //check tồn tại và không rỗng
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId;
        }

        // console.log("check data props from booking modal: ", this.props);
        // console.log("check data props from booking modal: ", this.state);
        // console.log(
        //     "check dataTime form DoctorSchedule: ",
        //     this.props.dataTime
        // );
        return (
            <div>
                <Modal
                    isOpen={isOpenModal}
                    toggle={this.props.handleCloseModalBooking}
                    className="booking-modal-container"
                    size="lg"
                    centered
                >
                    <div className="booking-modal-content">
                        <div className="booking-modal-header">
                            <span className="text-header">
                                <FormattedMessage
                                    id={"patient.booking-modal.title"}
                                />
                            </span>
                            <span className="right">
                                <i
                                    className="fas fa-times"
                                    onClick={handleCloseModalBooking}
                                ></i>
                            </span>
                        </div>
                        <div className="booking-modal-body container">
                            {/* {JSON.stringify(dataTime)} */}
                            <div className="doctor-infor">
                                <ProfileDoctor
                                    doctorId={doctorId}
                                    isShowDescription={false}
                                    dataTime={dataTime}
                                    isShowLinkDetail={false}
                                    isShowPrice={true}
                                />
                            </div>
                            <div className="row">
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage
                                            id={
                                                "patient.booking-modal.fullName"
                                            }
                                        />
                                    </label>
                                    <input
                                        className="form-control"
                                        value={fullName}
                                        onChange={(event) => {
                                            this.handleChangeInput(
                                                event,
                                                "fullName"
                                            );
                                        }}
                                    />

                                    {this.state.error.fullName && (
                                        <span className="error text-danger">
                                            {this.state.error.fullName}
                                        </span>
                                    )}
                                </div>
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage
                                            id={
                                                "patient.booking-modal.phoneNumber"
                                            }
                                        />
                                    </label>
                                    <input
                                        className="form-control"
                                        value={phoneNumber}
                                        onChange={(event) => {
                                            this.handleChangeInput(
                                                event,
                                                "phoneNumber"
                                            );
                                        }}
                                    />
                                    {this.state.error.phoneNumber && (
                                        <span className="error text-danger">
                                            {this.state.error.phoneNumber}
                                        </span>
                                    )}
                                </div>
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage
                                            id={"patient.booking-modal.email"}
                                        />
                                    </label>
                                    <input
                                        className="form-control"
                                        value={email}
                                        onChange={(event) => {
                                            this.handleChangeInput(
                                                event,
                                                "email"
                                            );
                                        }}
                                    />
                                    {this.state.error.email && (
                                        <span className="error text-danger">
                                            {this.state.error.email}
                                        </span>
                                    )}
                                </div>
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage
                                            id={"patient.booking-modal.address"}
                                        />
                                    </label>
                                    <input
                                        className="form-control"
                                        value={address}
                                        onChange={(event) => {
                                            this.handleChangeInput(
                                                event,
                                                "address"
                                            );
                                        }}
                                    />
                                    {this.state.error.address && (
                                        <span className="error text-danger">
                                            {this.state.error.address}
                                        </span>
                                    )}
                                </div>
                                <div className="col-12 form-group">
                                    <label>
                                        <FormattedMessage
                                            id={"patient.booking-modal.reason"}
                                        />
                                    </label>
                                    <input
                                        className="form-control"
                                        value={reason}
                                        onChange={(event) => {
                                            this.handleChangeInput(
                                                event,
                                                "reason"
                                            );
                                        }}
                                    />
                                    {this.state.error.reason && (
                                        <span className="error text-danger">
                                            {this.state.error.reason}
                                        </span>
                                    )}
                                </div>
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage
                                            id={
                                                "patient.booking-modal.birthday"
                                            }
                                        />
                                    </label>
                                    <br></br>
                                    <DatePicker
                                        className="form-control w-full"
                                        selected={birthDay}
                                        onChange={(date) => {
                                            this.handleSelectDate(date);
                                        }}
                                        dateFormat="dd/MM/yyyy" // Định dạng ngày tháng thành "dd/mm/yyyy"
                                        value={birthDay}
                                    />
                                    {this.state.error.birthDay && (
                                        <span className="error text-danger">
                                            {this.state.error.birthDay}
                                        </span>
                                    )}
                                </div>
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage
                                            id={"patient.booking-modal.gender"}
                                        />
                                    </label>
                                    <select
                                        className="form-control"
                                        id="inputGender"
                                        name="gender"
                                        value={selectedGender}
                                        onChange={(event) =>
                                            this.handleChangeInput(
                                                event,
                                                "selectedGender"
                                            )
                                        }
                                    >
                                        {genders &&
                                            genders.length > 0 &&
                                            genders.map((item, index) => {
                                                return (
                                                    <option
                                                        key={index}
                                                        value={item.value}
                                                    >
                                                        {item.lable}
                                                    </option>
                                                );
                                            })}
                                    </select>
                                    {this.state.error.selectedGender && (
                                        <span className="error text-danger">
                                            {this.state.error.selectedGender}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <ReCAPTCHA
                                sitekey={sitekeyLocal}
                                onChange={this.handleRecaptchaChange}
                            />
                            <div className="col-12 mt-3 booking-note">
                                <p className="text-note">
                                    <b>LƯU Ý</b>
                                </p>
                                <p className="text-note">
                                    Thông tin anh/chị cung cấp sẽ được sử dụng
                                    làm hồ sơ khám chữa bệnh, khi điền thông tin
                                    anh chị vui lòng:
                                </p>
                                <ul>
                                    <li className="text-note">
                                        {`Ghi rõ họ và tên, viết hoa chữ cái đầu
                                        tiên ví dụ: `}
                                        <b>Trịnh Bá Nhất</b>
                                    </li>
                                    <li className="text-note">
                                        Điền đầy đủ thông tin trước khi xác nhận
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="booking-modal-footer">
                            <button
                                className="btn btn-booking-confirm"
                                onClick={() => {
                                    this.handleConfirmBooking();
                                }}
                                disabled={
                                    this.state.recaptchaValue ? false : true
                                }
                            >
                                <FormattedMessage
                                    id={"patient.booking-modal.btnConfirm"}
                                />
                            </button>
                            <button
                                className="btn btn-booking-cancle"
                                onClick={handleCloseModalBooking}
                            >
                                <FormattedMessage
                                    id={"patient.booking-modal.btnCancel"}
                                />
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.appReducer.language,
        gendersRedux: state.adminReducer.genders,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        isShowLoading: (isLoading) => {
            return dispatch(actions.isLoadingAction(isLoading));
        },
        getGenders: () => {
            return dispatch(actions.fecthGenderStart());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
