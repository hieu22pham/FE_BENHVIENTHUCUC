import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Modal } from "reactstrap";
import { toast } from "react-toastify";

import "./RemedyModal.scss";
import { CommonUtils, LANGUAGE } from "../../../utils";
import { sendRemedyService } from "../../../services";
import * as actions from "../../../redux/actions";

class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            imageBase64: "",
            doctorId: "",
            patientId: "",
            description: "",
            date: "",
            timeType: "",
            bookingId: "",
            patientName: "",
        };
    }

    componentDidMount() {
        let { dataModal } = this.props;
        if (dataModal) {
            this.setState({
                email: dataModal.email,
                doctorId: dataModal.doctorId,
                patientId: dataModal.patientId,
                date: dataModal.date,
                timeType: dataModal.timeType,
                bookingId: dataModal.bookingId,
                patientName: dataModal.fullName,
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }

        if (this.props.dataModal !== prevProps.dataModal) {
            let { dataModal } = this.props;
            this.setState({
                email: dataModal.email,
                doctorId: dataModal.doctorId,
                patientId: dataModal.patientId,
                date: dataModal.date,
                timeType: dataModal.timeType,
                bookingId: dataModal.bookingId,
                patientName: dataModal.fullName,
            });
        }
    }

    handleChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    };

    handleChangeImage = async (e) => {
        let data = e.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            });
        }
    };

    handleSendRemedy = async () => {
        let dataSend = {
            email: this.state.email,
            image: this.state.imageBase64,
            doctorId: this.state.doctorId,
            patientId: this.state.patientId,
            description: this.state.description,
            date: this.state.date,
            timeType: this.state.timeType,
            bookingId: this.state.bookingId,
            language: this.props.language,
            patientName: this.state.patientName,
        };

        this.props.isShowLoading(true);
        let res = await sendRemedyService(dataSend);
        if (res && res.errCode === 0) {
            toast.success("Gửi đơn khám bệnh thành công!");
            this.props.handleCloseRemedyModal();
            this.props.isShowLoading(false);
            this.props.handleUpdateData(dataSend.bookingId);
            this.setState({
                email: "",
                imageBase64: "",
                doctorId: "",
                patientId: "",
                description: "",
                date: "",
                timeType: "",
                bookingId: "",
            });
        } else {
            toast.error("Gửi đơn khám bệnh thất bại!");
        }
    };

    render() {
        const { email } = this.state;
        const { isOpenRemedyModal, handleCloseRemedyModal } = this.props;
        return (
            <div>
                <Modal
                    isOpen={isOpenRemedyModal}
                    toggle={handleCloseRemedyModal}
                    className="remedy-modal-container"
                    size="lg"
                    centered
                >
                    <div className="remedy-modal-content">
                        <div className="remedy-modal-header">
                            <span className="text-header">
                                {/* <FormattedMessage
                                    id={"patient.remedy-modal.title"}
                                /> */}
                                Gửi hóa đơn khám bệnh
                            </span>
                            <span className="right">
                                <i
                                    className="fas fa-times"
                                    onClick={handleCloseRemedyModal}
                                ></i>
                            </span>
                        </div>
                        <div className="remedy-modal-body row">
                            <div className="form-group col-6">
                                <label>Email bệnh nhân</label>
                                <input
                                    className="form-control"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        this.handleChangeInput(e, "email");
                                    }}
                                />
                            </div>
                            <div className="form-group col-6">
                                <label>Chọn file đơn thuốc</label>
                                <input
                                    className="form-control-file"
                                    type="file"
                                    onChange={(event) => {
                                        this.handleChangeImage(event);
                                    }}
                                />
                            </div>
                            <div className="form-group col-6">
                                <label>Kết quả</label>
                                <textarea
                                    className="form-control"
                                    onChange={(event) => {
                                        this.handleChangeInput(
                                            event,
                                            "description"
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className="remedy-modal-footer">
                            <button
                                className="btn btn-remedy-confirm"
                                onClick={() => {
                                    this.handleSendRemedy();
                                }}
                            >
                                {/* <FormattedMessage
                                    id={"patient.remedy-modal.btnConfirm"}
                                /> */}
                                Gửi đơn
                            </button>
                            <button
                                className="btn btn-remedy-cancle"
                                onClick={handleCloseRemedyModal}
                            >
                                {/* <FormattedMessage
                                    id={"patient.remedy-modal.btnCancel"}
                                /> */}
                                Hủy
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        isShowLoading: (isLoading) => {
            return dispatch(actions.isLoadingAction(isLoading));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
