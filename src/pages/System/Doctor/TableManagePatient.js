import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Table, Space, Input } from "antd";
import { LANGUAGE } from "../../../utils";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import _ from "lodash";

export default class TableManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameFilter: "",
            filteredData: [],
            isOpenRemedyModal: false,
            dataModal: {},

            dataPatients: [],
        };
    }

    componentDidMount() {
        this.setState({
            // dataPatients: this.props.getDataPatient(),
            dataPatients: this.props.data,
        });
    }

    componentDidUpdate(prevProps) {
        // Kiểm tra xem props.dataPatients đã thay đổi
        if (prevProps.data !== this.props.data) {
            // Cập nhật danh sách dữ liệu khi props.dataPatients thay đổi
            this.setState({
                dataPatients: this.props.data,
            });
        }
    }

    buildTimeRemedy = (dataTime) => {
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

    handleConfirm = (patient) => {
        let data = {
            bookingId: patient.bookingId,
            doctorId: patient.doctorId,
            patientId: patient.patientId,
            email: patient.email,
            date: patient.date,
            timeType: patient.timeType,
            fullName: patient.fullName,
        };
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data,
        });
    };

    handleCloseRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
        });
    };

    handleUpdateData = (bookingId) => {
        // Xử lý xóa dữ liệu và sau đó cập nhật dataPatients
        const updatedDataPatients = this.state.dataPatients.filter(
            (item) => item.id !== bookingId
        );
        this.setState({ dataPatients: updatedDataPatients });
    };

    render() {
        let { language } = this.props;
        let { nameFilter, filteredData, dataPatients } = this.state;

        //Tạo key props khi render
        const dataSource =
            dataPatients &&
            dataPatients.length > 0 &&
            dataPatients.map((item) => {
                return {
                    key: item.id,
                    bookingId: item.id,
                    doctorId: item.doctorId,
                    patientId: item.patientId,
                    email: item.patientData.email,
                    fullName: item.patientData.lastName,
                    address: item.patientData.address,
                    phoneNumber: item.patientData.phoneNumber,
                    birthday: moment
                        .unix(+item.patientData.birthday / 1000)
                        .format("DD/MM/YYYY"),
                    genderValueVi: item.patientData.genderData.valueVi,
                    genderValueEn: item.patientData.genderData.valueEn,
                    timeTypeValueVi: item.timeTypeDataPatient.valueVi,
                    timeTypeValueEn: item.timeTypeDataPatient.valueEn,
                    reason: item.reason,
                    date: item.date,
                    timeType: item.timeType,
                };
            });

        //Tạo columns
        const columns = [
            {
                title: "Email",
                dataIndex: "email",
                key: "email",
                defaultSortOrder: "descend",
                sorter: (a, b) => a.id - b.id,
            },
            {
                title: language === LANGUAGE.EN ? "FullName" : "Họ và tên",
                dataIndex: "fullName",
                key: "fullName",
                filterDropdown: () => (
                    <div style={{ padding: 8 }}>
                        <Input
                            placeholder="Search name"
                            value={nameFilter}
                            onChange={(e) =>
                                this.setState({
                                    nameFilter: e.target.value,
                                })
                            }
                            onPressEnter={handleFilter}
                        />
                    </div>
                ),
            },
            {
                title:
                    language === LANGUAGE.EN ? "Phone Number" : "Số điện thoại",
                dataIndex: "phoneNumber",
                key: "phoneNumber",
            },
            {
                title: language === LANGUAGE.EN ? "Address" : "Địa chỉ",
                dataIndex: "address",
                key: "address",
            },
            {
                title: language === LANGUAGE.EN ? "BirthDay" : "Ngày sinh",
                dataIndex: "birthday",
                key: "birthday",
            },
            {
                title: language === LANGUAGE.EN ? "Gender" : "Giới tính",
                dataIndex:
                    language === LANGUAGE.EN
                        ? "genderValueEn"
                        : "genderValueVi",
                key: "gender",
            },
            {
                title:
                    language === LANGUAGE.EN
                        ? "Appointment time"
                        : "Thời gian lịch hẹn khám",
                dataIndex:
                    language === LANGUAGE.EN
                        ? "timeTypeValueEn"
                        : "timeTypeValueVi",
                key: "gender",
            },
            {
                title:
                    language === LANGUAGE.EN
                        ? "Reason for examination"
                        : "Lý do",
                dataIndex: "reason",
                key: "reason",
            },
            {
                title: "Action",
                key: "action",
                render: (_, record) => (
                    <Space size="middle">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                this.handleConfirm(record);
                            }}
                        >
                            <FormattedMessage id={"actions.confirm"} />
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                this.props.handleCancle(record);
                            }}
                        >
                            <FormattedMessage id={"actions.cancel"} />
                        </button>
                    </Space>
                ),
            },
        ];

        // Hàm xử lý bộ lọc
        const handleFilter = () => {
            let filteredData = dataSource;
            if (nameFilter) {
                filteredData = filteredData.filter((record) => {
                    return record.fullName
                        .toLowerCase()
                        .includes(nameFilter.toLowerCase());
                });
            }

            this.setState({ filteredData }, () => {
                console.log(this.state.filteredData);
            });
        };

        return (
            <>
                <div className="mt-5">
                    <Table
                        dataSource={
                            filteredData &&
                            filteredData.length > 0 &&
                            nameFilter !== ""
                                ? filteredData
                                : dataSource
                        }
                        columns={columns}
                        bordered
                        title={() => (
                            <h3>
                                {/* <FormattedMessage id={"manage-user.listUser"} /> */}
                                Danh sách lịch hẹn
                            </h3>
                        )}
                    />
                </div>
                <RemedyModal
                    isOpenRemedyModal={this.state.isOpenRemedyModal}
                    handleCloseRemedyModal={this.handleCloseRemedyModal}
                    dataModal={this.state.dataModal}
                    handleUpdateData={this.handleUpdateData}
                />
            </>
        );
    }
}
