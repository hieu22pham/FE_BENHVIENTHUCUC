import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Table, Space, Input } from "antd";
import { LANGUAGE } from "../../../utils";

export default class TableManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameFilter: "",
            filteredData: [],
        };
    }

    handleEditUser = (user) => {
        //Gửi data sang parent để lưu data vào form
        this.props.handleEditUserFromParent(user);
    };
    render() {
        let { data, language } = this.props;
        let { nameFilter, filteredData } = this.state;

        //Tạo key props khi render
        const dataSource =
            data &&
            data.length > 0 &&
            data.map((item) => {
                return { ...item, key: item.id, role: item.Role?.valueVi };
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
                title: language === LANGUAGE.EN ? "First Name" : "Tên",
                dataIndex: "firstName",
                key: "firstName",
            },
            {
                title: language === LANGUAGE.EN ? "Last Name" : "Họ",
                dataIndex: "lastName",
                key: "lastName",
            },
            {
                title: language === LANGUAGE.EN ? "Role" : "Vai trò",
                dataIndex: "role",
                key: "role",
                render: (_, record) => <span>{record.role}</span>,
                sorter: (a, b) => {
                    return a.roleId.localeCompare(b.roleId);
                },
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
                            <FormattedMessage id={"actions.edit"} />
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                // console.log(record.id);
                                this.props.deleteUser(record.id);
                            }}
                        >
                            <FormattedMessage id={"actions.delete"} />
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
                    return record.email
                        .toLowerCase()
                        .includes(nameFilter.toLowerCase());
                });
            }
            this.setState({ filteredData });
        };

        return (
            <div className="container mt-5">
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
                            <FormattedMessage id={"manage-user.listUser"} />
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
