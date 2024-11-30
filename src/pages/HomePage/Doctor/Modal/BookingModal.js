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
import { useParams } from "react-router-dom";

// const sitekey = "6LdfLC0pAAAAAMKFPIlfXoCqOMhOSBHxYByhydvu";
// const sitekey = "6LcDeigpAAAAAGR-uUlDOI72QqfzYluAjJ-rRMro";
const sitekeyLocal = "6LcDeigpAAAAALF7KPDFg0HCJGvh3tj-pv5F2WcK";
const url = window.location.pathname;
const id = url.pathname; // "/detail-doctor/33"

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
        const storedData = localStorage.getItem("dataTime");

        // Only update storedData state if it has changed
        console.log()
            if (storedData) {
                this.setState({ storedData: storedData }); // Kiểm tra khả dụng với dữ liệu đã parse
            }
        this.checkAvailability(); // Kiểm tra khả dụng với dữ liệu đã parse
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
        this.state.data = date
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

    componentWillUnmount() {
        // Gỡ bỏ listener khi component bị unmount
        window.removeEventListener("storage", this.handleStorageChange);
    }

    handleStorageChange = (event) => {
        if (event.key === "dataTime") {
            const updatedData = event.newValue ? JSON.parse(event.newValue) : null;
            console.log("dataTime đã thay đổi:", updatedData);
        }
    };

    checkAvailability = async () => {
    
        // try {
        //     // Lấy danh sách bệnh nhân
        //     const response1 = await fetch(
        //         `http://localhost:8080/api/get-list-patient-for-doctor?doctorId=${doctorId}&date=${this.state.dataTime}`
        //     );
        //     const data1 = await response1.json();
        //     console.log(data1)
    
        //     // Lấy số lượng tối đa
        //     const response2 = await fetch(
        //         `http://localhost:8080/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${this.state.dataTime}`
        //     );
        //     const data2 = await response2.json();
        //     console.log(data2)

    
        //     if (response1.ok && response2.ok) {
        //         const registeredCount = data1?.data?.length || 0;
        //         const maxNumber = data2?.data?.[0]?.maxNumber || 0;
    
        //         if (registeredCount >= maxNumber) {
        //             this.setState({
        //                 isBookingAvailable: false,
        //                 errorMessage: "Số lượng đăng ký đã vượt quá số lượng tối đa.",
        //             });
        //         } else {
        //             this.setState({
        //                 isBookingAvailable: true,
        //                 errorMessage: "",
        //             });
        //         }
        //     } else {
        //         throw new Error("Không thể lấy dữ liệu từ API.");
        //     }
        // } catch (error) {
        //     console.error("Lỗi khi fetch API:", error);
        //     this.setState({
        //         isBookingAvailable: false,
        //         errorMessage: "Đã xảy ra lỗi khi kiểm tra khả dụng.",
        //     });
        // }
    };

    handleConfirmBooking = async () => {
        //validate input
        const path = window.location.pathname; // Lấy toàn bộ đường dẫn sau domain
        const doctorId = path.split("/").pop();
        const storedData = localStorage.getItem("dataTime");

        console.log(storedData)
        console.log("doctorId", doctorId)

        let birthDay = new Date(this.state.birthDay).getTime(); //timestamp
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let timeType = this.props.dataTime?.timeType 
        console.log("timeType: ", this.props.dataTime?.timeType)

        let doctorName = this.buildDoctorName(this.props.dataTime);

        const response1 = await fetch(
            `http://localhost:8080/api/get-list-patient-for-doctor?doctorId=${doctorId}&date=${storedData}&timeType=${this.props.dataTime?.timeType}`
        );
        const data1 = await response1.json();
        console.log("data1: ", data1)
        console.log("date: ", storedData)

        // Lấy số lượng tối đa
        const response2 = await fetch(
            `http://localhost:8080/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${storedData}`
        );
        const data2 = await response2.json();
        console.log("data2: ", data2)
        const number = parseInt(this.props.dataTime?.timeType.replace(/\D/g, ''), 10)-1; 

            const registeredCount = data1?.data?.length;

             console.log(registeredCount)
             console.log("number: ", number)

             const maxNumber = localStorage.getItem("maxNumberBooking")
             console.log("maxNumber: ", maxNumber)

            if (registeredCount >= maxNumber) {
                this.setState({
                    isBookingAvailable: false,
                    errorMessage: "Số lượng đăng ký đã vượt quá số lượng tối đa.",
                });
            } else {
                this.setState({
                    isBookingAvailable: true,
                    errorMessage: "",
                });
            }

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

        console.log(this.state.dataTime)
        var id = this.state.doctorId

        if (!this.state.isBookingAvailable) {
            alert(this.state.errorMessage);
            return;
        }

        let isValid = this.validateInput();

        
        if (isValid && maxNumber > registeredCount) {
            this.props.isShowLoading(true);
            let res = await postPatientBookAppointmentService(data);
            console.log("res: ", res)
            if (res && res.errCode === 0) {
                this.props.isShowLoading(false);
                toast.success(res.message);
                this.props.handleCloseModalBooking();
                this.resetInput();
                this.setState({
                    recaptchaValue: null,
                });
                const a = 0;
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
                                        className="form-control select-gender1"
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
                                        <b>Nguyễn Văn A</b>
                                    </li>
                                    <li className="text-note">
                                        Vui lòng điền đầy đủ thông tin trước khi xác nhận
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
