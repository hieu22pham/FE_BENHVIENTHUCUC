import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Table, Space, Input } from "antd";
import { LANGUAGE } from "../../../utils";

export default class TableManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameFilter: "",
            emailFilter: "",
            specialtyFilter: "",
            filteredData: [],
        };
    }

    componentDidUpdate(prevProps) {}

    handleEditUser = (doctor) => {
        //Gửi data sang parent để lưu data vào form
        this.props.handleEditDoctorFromParent(doctor);
    };
    render() {
        let { data, language } = this.props;
        let { nameFilter, filteredData, emailFilter, specialtyFilter } =
            this.state;

        //Tạo key props khi render
        const dataSource =
            data &&
            data.length > 0 &&
            data.map((item) => {
                return {
                    ...item,
                    key: item.id,
                    fullName: `${item.firstName} ${item.lastName}`,
                    specialtyVi: `${
                        item.Doctor_Infor.specialtyData.nameVi
                            ? item.Doctor_Infor.specialtyData.nameVi
                            : ""
                    }`,
                    specialtyEn: `${
                        item.Doctor_Infor.specialtyData.nameEn
                            ? item.Doctor_Infor.specialtyData.nameEn
                            : ""
                    }`,
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
                filterDropdown: () => (
                    <div style={{ padding: 8 }}>
                        <Input
                            placeholder="Search email"
                            value={emailFilter}
                            onChange={(e) =>
                                this.setState({
                                    emailFilter: e.target.value,
                                })
                            }
                            onPressEnter={handleFilter}
                        />
                    </div>
                ),
            },
            {
                title: language === LANGUAGE.EN ? "First Name" : "Họ",
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
                title: language === LANGUAGE.EN ? "Specialty" : "Chuyên khoa",
                key: "specialty",
                render: (_, record) => {
                    let specialty =
                        language === LANGUAGE.VI
                            ? record.specialtyVi
                            : record.specialtyEn;

                    return specialty;
                },
                filterDropdown: () => (
                    <div style={{ padding: 8 }}>
                        <Input
                            placeholder="Search name"
                            value={specialtyFilter}
                            onChange={(e) =>
                                this.setState({
                                    specialtyFilter: e.target.value,
                                })
                            }
                            onPressEnter={handleFilter}
                        />
                    </div>
                ),
            },
            {
                title: "Action",
                key: "action",
                render: (_, record) => (
                    <Space size="middle">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                this.handleEditUser(record);
                            }}
                        >
                            <i className="fas fa-info"></i>
                        </button>
                    </Space>
                ),
            },
        ];

        // Hàm xử lý bộ lọc
        const handleFilter = () => {
            let filteredData = dataSource;
            if (emailFilter) {
                filteredData = filteredData.filter((record) => {
                    return (
                        (emailFilter === "" ||
                            record.email
                                .toLowerCase()
                                .includes(emailFilter.toLowerCase())) &&
                        (nameFilter === "" ||
                            record.fullName
                                .toLowerCase()
                                .includes(nameFilter.toLowerCase())) &&
                        (language === LANGUAGE.VI
                            ? specialtyFilter === "" ||
                              record.specialtyVi
                                  .toLowerCase()
                                  .includes(specialtyFilter.toLowerCase())
                            : specialtyFilter === "" ||
                              record.specialtyEn
                                  .toLowerCase()
                                  .includes(specialtyFilter.toLowerCase()))
                    );
                });
            }
            this.setState({ filteredData }, () => {
                console.log(this.state);
            });
        };

        return (
            <div className="container mt-5">
                <Table
                    dataSource={
                        filteredData &&
                        filteredData.length > 0 &&
                        emailFilter !== ""
                            ? filteredData
                            : dataSource
                    }
                    columns={columns}
                    bordered
                    title={() => (
                        <h3>
                            <FormattedMessage
                                id={"admin.manage-doctor.listDoctor"}
                            />
                        </h3>
                    )}
                    pagination={{
                        defaultPageSize: 5, // Số lượng bản ghi hiển thị trên mỗi trang
                        showSizeChanger: true, // Hiển thị chọn kích thước trang
                        pageSizeOptions: ["5", "10", "15"], // Các tùy chọn kích thước trang
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`, // Hiển thị tổng số bản ghi
                    }}
                    // responsive={{ xs: 28, sm: 12, md: 8, lg: 6 }} // Tùy chỉnh các breakpoints
                />
            </div>
        );
    }
}
