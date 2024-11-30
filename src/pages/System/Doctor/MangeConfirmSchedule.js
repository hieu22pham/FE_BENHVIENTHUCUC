import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import moment from "moment";
import { FormattedMessage } from "react-intl";

import "./ManagePatient.scss";
import TableManagePatient from "./TableManagePatient";
import { getListPatientForDoctorService } from "../../../services";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import * as actions from "../../../redux/actions";
import TableMangeConfirmSchedule from "./TableMangeConfirmSchedule";

class MangeConfirmSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf("day").valueOf(), //lấy ngày hôm nay, không lấy thời gian
            listPatient: [],
        };
    }

    async componentDidMount() {
        let { userInfor } = this.props;
        if (userInfor) {
            if (this.userInfor && this.userInfor.userType !== "doctor") {
                this.props.history.push(`/system/home`);
            }
            this.props.isShowLoading(true);
            this.getDataPatient();
            this.props.isShowLoading(false);
        }
    }
    
    componentDidUpdate(prevState, prevProps, snapshot) {
        if (prevProps.userInfor !== this.props.userInfor) {
            if (
                this.props.userInfor &&
                this.props.userInfor.userType !== "doctor"
            ) {
                this.props.history.push(`/system/home`);
            }
        }
    }

    getDataPatient = async () => {
        let { userInfor } = this.props;
        let { currentDate } = this.state;
        //Gửi lên dạng timeTamp
        let formattedDate = new Date(currentDate).getTime();

        let res = await getListPatientForDoctorService(
            userInfor.id,
            formattedDate
        );
        if (res && res.errCode === 0) {
            this.setState({
                listPatient: res.data,
            });
        }
    };

    handleSelectDate = async (date) => {
        const timestamp = moment(date).startOf("day").valueOf();
        localStorage.setItem("dataTime", timestamp)
        this.setState(
            {
                currentDate: date,
            },
            async () => {
                this.getDataPatient();
            }
        );
    };

    handleCancle = async (data) => {
        var isConfirmed = window.confirm(
            "Bạn có chắc chắn hủy lịch này không?"
        );

        if (isConfirmed) {
            this.props.isShowLoading(true);
            await this.props.cancleBooking(data.key);
            this.props.isShowLoading(false);
            this.getDataPatient();
        }
    };

    render() {
        const { currentDate } = this.state;
        var today = new Date();
        today.setDate(today.getDate() -1);
        // Tạo một đối tượng Date đại diện cho ngày mai
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        return (
            <div className="manage-patient_container container">
                <div className="m-p-title">
                    <FormattedMessage id={"admin.manage-patient.title"} />
                </div>
                <div className="manage-patient_body row">
                    <div className="col-4 form-group" style={{ zIndex: "2" }}>
                        <label>
                            <FormattedMessage
                                id={"admin.manage-patient.choose-date"}
                            />
                        </label>
                        <br />
                        {/* <DatePicker
                            className="form-control"
                            selected=""
                            onChange={(date) => {
                                this.handleSelectDate(date);
                            }}
                            dateFormat="dd/MM/yyyy" // Định dạng ngày tháng thành "dd/mm/yyyy"
                            minDate={tomorrow}
                            value={currentDate}
                        /> */}
                         <DatePicker
                            className="form-control"
                            selected={new Date(currentDate)} // Đảm bảo selected là kiểu Date
                            onChange={(date) => this.handleSelectDate(date)} // Cập nhật khi chọn ngày
                            dateFormat="dd/MM/yyyy" // Định dạng ngày tháng
                            minDate={new Date()} // Bỏ hạn chế hoặc thiết lập phù hợp
                        />
                    </div>
                </div>
                <TableMangeConfirmSchedule
                    data={this.state.listPatient}
                    language={this.props.language}
                    getDataPatient={this.getDataPatient}
                    handleCancle={this.handleCancle}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.appReducer.language,
        userInfor: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        isShowLoading: (isLoading) => {
            return dispatch(actions.isLoadingAction(isLoading));
        },
        cancleBooking: (id) => {
            return dispatch(actions.cancleBookingAction(id));
        },
    };
};  

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(MangeConfirmSchedule)
);
