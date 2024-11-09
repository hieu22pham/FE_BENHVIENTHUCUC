import React, { Component } from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

import "./ManageDoctor.scss";
import {
    getAllDoctorAction,
    getRequiredDoctorInfor,
    saveDetailDoctorAction,
} from "../../../redux/actions/adminAction";
import { CRUD_ACTIONS, LANGUAGE } from "../../../utils/constants";
import { getDetailDoctor } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import TableManageDoctor from "./TableManageDoctor";

const mdParser = new MarkdownIt(/* Markdown-it options */); //convert HTML sang Text

class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //save to markdown table
            contentMarkdown: "",
            contentHTML: "",
            description: "",
            selectedDoctor: null,
            action: CRUD_ACTIONS.CREATE,
            listDoctor: [],
            hasOldData: false,

            //save to doctor_infor table
            listPrice: [],
            selectedPrice: null,
            listPayment: [],
            selectedPayment: null,
            listProvince: [],
            selectedProvince: null,
            listSpecialty: [],
            selectedSpecialty: null,
            listClinic: [],
            selectedClinic: null,
            nameClinic: "",
            addressClinic: "",
            note: "",
        };
    }

    componentDidMount() {
        this.handleGetAllDoctor();
        this.props.getAllDoctorInfor();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listDoctorRedux !== this.props.listDoctorRedux) {
            this.setState({
                listDoctor: this.props.listDoctorRedux,
            });
        }
        if (prevProps.listPriceRedux !== this.props.listPriceRedux) {
            this.setState({
                listPrice: this.props.listPriceRedux,
            });
        }
        if (prevProps.listPaymentRedux !== this.props.listPaymentRedux) {
            this.setState({
                listPayment: this.props.listPaymentRedux,
            });
        }
        if (prevProps.listProvinceRedux !== this.props.listProvinceRedux) {
            this.setState({
                listProvince: this.props.listProvinceRedux,
            });
        }
        if (prevProps.listSpecialtyRedux !== this.props.listSpecialtyRedux) {
            this.setState({
                listSpecialty: this.props.listSpecialtyRedux,
            });
        }
        if (prevProps.listClinicRedux !== this.props.listClinicRedux) {
            this.setState({
                listClinic: this.props.listClinicRedux,
            });
        }
    }

    handleGetAllDoctor = () => {
        this.props.getAllDoctor();

        this.setState({
            listDoctor: this.props.listDoctorRedux,
        });
    };

    //Chú ý đặt arrow func để có thể truy cập this.setState
    handleEditorChange = ({ html, text }) => {
        // console.log("handleEditorChange: ", html, text);
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        });
    };

    handleChangeText = (e) => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleSaveContentMarkdown = async () => {
        // console.log("check state: ", this.state);
        let { hasOldData } = this.state;
        let data = {
            doctorId: this.state.selectedDoctor,
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            action: hasOldData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            priceId: this.state.selectedPrice,
            // paymentId: this.state.selectedPayment,
            paymentId: "PAY1",
            provinceId: this.state.selectedProvince,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            specialtyId: this.state.selectedSpecialty,
            clinicId: this.state.selectedClinic ? this.state.selectedClinic : 0,
        };
        //Gửi cục data lên server để check cần sửa hay tạo mới
        await this.props.saveDetailDoctor(data);
        this.handleGetAllDoctor();

        this.setState({
            contentMarkdown: "",
            contentHTML: "",
            description: "",
            selectedDoctor: "",
            hasOldData: false,

            selectedPrice: null,
            selectedPayment: null,
            selectedProvince: null,
            selectedSpecialty: null,
            selectedClinic: null,
            nameClinic: "",
            addressClinic: "",
            note: "",
        });
    };

    handleSelectDoctor = async (value) => {
        this.setState({
            selectedDoctor: value,
        });

        let response = await getDetailDoctor(value);
        //check xem đã có thông tin chưa
        if (
            response &&
            response.errCode === 0 &&
            response.data &&
            response.data.Markdown
        ) {
            let markdown = response.data.Markdown;

            let addressClinic = "",
                nameClinic = "",
                note = "",
                priceId = null,
                paymentId = null,
                provinceId = null,
                specialtyId = null,
                clinicId = null;

            if (response.data.Doctor_Infor) {
                nameClinic = response.data.Doctor_Infor.nameClinic;
                addressClinic = response.data.Doctor_Infor.addressClinic;
                note = response.data.Doctor_Infor.note;
                priceId = response.data.Doctor_Infor.priceId;
                paymentId = response.data.Doctor_Infor.paymentId;
                provinceId = response.data.Doctor_Infor.provinceId;
                specialtyId = response.data.Doctor_Infor.specialtyId.toString();
                clinicId = response.data.Doctor_Infor.clinicId
                    ? response.data.Doctor_Infor.clinicId.toString()
                    : null;
            }

            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true, //có set là true,

                nameClinic: nameClinic,
                addressClinic: addressClinic,
                note: note,
                selectedPrice: priceId,
                selectedPayment: paymentId,
                selectedProvince: provinceId,
                selectedSpecialty: specialtyId,
                selectedClinic: clinicId,
            });
        } else {
            this.setState({
                contentMarkdown: "",
                contentHTML: "",
                description: "",
                hasOldData: false, //chưa có

                addressClinic: "",
                nameClinic: "",
                note: "",
                selectedPrice: null,
                selectedPayment: null,
                selectedProvince: null,
                selectedSpecialty: null,
                selectedClinic: null,
            });
        }
    };

    handleChangeSelectDoctorInfor = (selectOption, name) => {
        this.setState({
            [name]: selectOption,
        });
    };

    handleEditDoctor = async (data) => {
        this.setState({
            selectedDoctor: data.key,
        });

        let response = await getDetailDoctor(data.key);
        //check xem đã có thông tin chưa
        if (
            response &&
            response.errCode === 0 &&
            response.data &&
            response.data.Markdown
        ) {
            let markdown = response.data.Markdown;

            let addressClinic = "",
                nameClinic = "",
                note = "",
                priceId = null,
                paymentId = null,
                provinceId = null,
                specialtyId = null,
                clinicId = null;

            if (response.data.Doctor_Infor) {
                nameClinic = response.data.Doctor_Infor.nameClinic;
                addressClinic = response.data.Doctor_Infor.addressClinic;
                note = response.data.Doctor_Infor.note;
                priceId = response.data.Doctor_Infor.priceId;
                paymentId = response.data.Doctor_Infor.paymentId;
                provinceId = response.data.Doctor_Infor.provinceId;
                specialtyId = response.data.Doctor_Infor.specialtyId.toString();
                clinicId = response.data.Doctor_Infor.clinicId
                    ? response.data.Doctor_Infor.clinicId.toString()
                    : null;
            }

            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true, //có set là true,

                nameClinic: nameClinic,
                addressClinic: addressClinic,
                note: note,
                selectedPrice: priceId,
                selectedPayment: paymentId,
                selectedProvince: provinceId,
                selectedSpecialty: specialtyId,
                selectedClinic: clinicId,
            });
        } else {
            this.setState({
                contentMarkdown: "",
                contentHTML: "",
                description: "",
                hasOldData: false, //chưa có

                addressClinic: "",
                nameClinic: "",
                note: "",
                selectedPrice: null,
                selectedPayment: null,
                selectedProvince: null,
                selectedSpecialty: null,
                selectedClinic: null,
            });
        }
    };

    render() {
        const { Option } = Select;
        const {
            selectedDoctor,
            selectedPrice,
            selectedProvince,
            selectedPayment,
            selectedSpecialty,
            selectedClinic,
            note,
            nameClinic,
            addressClinic,
            listDoctor,
            hasOldData,
            listPrice,
            listPayment,
            listProvince,
            listSpecialty,
            listClinic,
        } = this.state;
        const { language } = this.props;
        // console.log(language);
        return (
            <div className="manage-doctor-container container">
                <div className="manage-doctor-title">
                    <FormattedMessage id={"admin.manage-doctor.title"} />
                </div>
                <div className="manage-doctor-body">
                    <div className="more-infor row">
                        <div className="content-left col-lg-5 col-sm-12">
                            <label>
                                <FormattedMessage
                                    id={"admin.manage-doctor.select-doctor"}
                                />
                            </label>
                            <br />
                            <Select
                                showSearch
                                placeholder={
                                    <FormattedMessage
                                        id={"admin.manage-doctor.select-doctor"}
                                    />
                                }
                                style={{ width: "100%" }}
                                onChange={this.handleSelectDoctor}
                                value={selectedDoctor}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {/* Render các Option từ dữ liệu API */}
                                {listDoctor.map((item) => (
                                    <Option key={item.id} value={item.id}>
                                        {language === LANGUAGE.VI
                                            ? `${item.firstName} ${item.lastName
                                            } - ${item.Doctor_Infor
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
                        </div>
                        <div className="content-right col-lg-7 col-sm-12">
                            <label htmlFor="description">
                                <FormattedMessage
                                    id={"admin.manage-doctor.intro"}
                                />
                            </label>
                            <textarea
                                id="description"
                                className="form-control"
                                // rows={4}
                                onChange={(e) => {
                                    this.handleChangeText(e);
                                }}
                                value={this.state.description}
                                name="description"
                            ></textarea>
                        </div>
                    </div>
                    <div className="more-infor-extra row mt-3">
                        <div className="col-lg-4 col-sm-12 form-group">
                            <label>
                                <FormattedMessage
                                    id={"admin.manage-doctor.price"}
                                />
                            </label>
                            <br />
                            <Select
                                showSearch
                                placeholder={
                                    <FormattedMessage
                                        id={"admin.manage-doctor.price"}
                                    />
                                }
                                style={{ width: "100%" }}
                                onChange={(value) =>
                                    this.handleChangeSelectDoctorInfor(
                                        value,
                                        "selectedPrice"
                                    )
                                }
                                value={selectedPrice}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {/* Render các Option từ dữ liệu API */}
                                {listPrice.map((item) => (
                                    <Option key={item.id} value={item.keyMap}>
                                        {language === LANGUAGE.VI
                                            ? `${item.valueVi}`
                                            : `${item.valueEn} USD`}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        {/* <div className="col-lg-4 col-sm-12 form-group">
                            <label>
                                <FormattedMessage
                                    id={"admin.manage-doctor.payment"}
                                />
                            </label>
                            <br />
                            <Select
                                showSearch
                                placeholder={
                                    <FormattedMessage
                                        id={"admin.manage-doctor.payment"}
                                    />
                                }
                                style={{ width: "100%" }}
                                onChange={(value) =>
                                    this.handleChangeSelectDoctorInfor(
                                        value,
                                        "selectedPayment"
                                    )
                                }
                                value={selectedPayment}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {listPayment.map((item) => (
                                    <Option key={item.id} value={item.keyMap}>
                                        {language === LANGUAGE.VI
                                            ? item.valueVi
                                            : item.valueEn}
                                    </Option>
                                ))}
                            </Select>
                        </div> */}
                        <div className="col-lg-4 col-sm-12 form-group">
                            <label>
                                <FormattedMessage
                                    id={"admin.manage-doctor.province"}
                                />
                            </label>
                            <br />
                            <Select
                                showSearch
                                placeholder={
                                    <FormattedMessage
                                        id={"admin.manage-doctor.province"}
                                    />
                                }
                                style={{ width: "100%" }}
                                onChange={(value) =>
                                    this.handleChangeSelectDoctorInfor(
                                        value,
                                        "selectedProvince"
                                    )
                                }
                                value={selectedProvince}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {/* Render các Option từ dữ liệu API */}
                                {listProvince.map((item) => (
                                    <Option key={item.id} value={item.keyMap}>
                                        {language === LANGUAGE.VI
                                            ? item.valueVi
                                            : item.valueEn}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        {/* <div className="col-lg-4 col-sm-12 form-group">
                            <label>
                                <FormattedMessage
                                    id={"admin.manage-doctor.name-clinic"}
                                />
                            </label>
                            <br />
                            <input
                                className="form-control"
                                onChange={(event) => {
                                    this.handleChangeText(event);
                                }}
                                value={nameClinic}
                                name="nameClinic"
                            />
                        </div> */}
                        {/* ĐÂY NHẤT */}
                        <div className="col-lg-4 col-sm-12 form-group">
                            <label>
                                <FormattedMessage
                                    id={"admin.manage-doctor.address-clinic"}
                                />
                            </label>
                            <br />
                            <input
                                className="form-control"
                                value={addressClinic}
                                onChange={(event) => {
                                    this.handleChangeText(event);
                                }}
                                name="addressClinic"
                            />
                        </div>
                        <div className="col-lg-4 col-sm-12 form-group">
                            <label>
                                <FormattedMessage
                                    id={"admin.manage-doctor.note"}
                                />
                            </label>
                            <br />
                            <input
                                className="form-control"
                                value={note}
                                onChange={(event) => {
                                    this.handleChangeText(event);
                                }}
                                name="note"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 col-sm-12 form-group">
                            <label>
                                <FormattedMessage
                                    id={"admin.manage-doctor.select-specialty"}
                                />
                            </label>
                            <br />
                            <Select
                                showSearch
                                placeholder={
                                    <FormattedMessage
                                        id={"admin.manage-doctor.specialty"}
                                    />
                                }
                                style={{ width: "100%" }}
                                onChange={(value) =>
                                    this.handleChangeSelectDoctorInfor(
                                        value,
                                        "selectedSpecialty"
                                    )
                                }
                                value={selectedSpecialty}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {/* Render các Option từ dữ liệu API */}
                                {listSpecialty.map((item) => (
                                    <Option key={item.id} value={item.keyMap}>
                                        {language === LANGUAGE.VI
                                            ? item.nameVi
                                            : item.nameEn}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div style={{ display: "none" }} className="col-lg-4 col-sm-12 form-group">
                            <label>
                                <FormattedMessage
                                    id={"admin.manage-doctor.select-clinic"}
                                />
                            </label>
                            <br />
                            <Select
                                showSearch
                                placeholder={
                                    <FormattedMessage
                                        id={"admin.manage-doctor.clinic"}
                                    />
                                }
                                style={{ width: "100%" }}
                                onChange={(value) =>
                                    this.handleChangeSelectDoctorInfor(
                                        value,
                                        "selectedClinic"
                                    )
                                }
                                value={selectedClinic}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {/* Render các Option từ dữ liệu API */}
                                {listClinic.map((item) => (
                                    <Option key={item.id} value={item.keyMap}>
                                        {language === LANGUAGE.VI
                                            ? item.nameVi
                                            : item.nameEn}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        {/* ĐÂY NHẤT */}
                    </div>

                    <div className="manage-doctor-editor mt-3">
                        <MdEditor
                            value={this.state.contentMarkdown}
                            style={{ height: "300px" }}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                        />
                    </div>
                </div>
                <button
                    className={
                        hasOldData === true
                            ? "btn btn-warning mt-3"
                            : "btn btn-primary mt-3"
                    }
                    onClick={() => {
                        this.handleSaveContentMarkdown();
                    }}
                >
                    {hasOldData ? (
                        <FormattedMessage id={"admin.manage-doctor.save"} />
                    ) : (
                        <FormattedMessage id={"admin.manage-doctor.add"} />
                    )}
                </button>
                <TableManageDoctor
                    data={listDoctor}
                    language={language}
                    handleEditDoctorFromParent={this.handleEditDoctor}
                />
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        language: state.appReducer.language,
        listDoctorRedux: state.adminReducer.listDoctor,
        listPriceRedux: state.adminReducer.prices,
        listPaymentRedux: state.adminReducer.payments,
        listProvinceRedux: state.adminReducer.provinces,
        listSpecialtyRedux: state.adminReducer.specialties,
        listClinicRedux: state.adminReducer.clinics,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        getAllDoctor: () => {
            return dispatch(getAllDoctorAction());
        },
        getAllDoctorInfor: () => {
            return dispatch(getRequiredDoctorInfor());
        },
        saveDetailDoctor: (data) => {
            return dispatch(saveDetailDoctorAction(data));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
