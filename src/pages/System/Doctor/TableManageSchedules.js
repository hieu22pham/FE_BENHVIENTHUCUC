import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Table, Space, Input } from "antd";
import { LANGUAGE } from "../../../utils";
import moment from "moment";
import _ from "lodash";
import { connect } from "react-redux";

class TableManageSchedules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredData: [],

            dataSchedules: [],
        };
    }

    componentDidMount() {
        this.setState({
            dataSchedules: this.props.data,
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                dataSchedules: this.props.data,
            });
        }
    }

    render() {
        let { language } = this.props;
        let { dataSchedules } = this.state;

        //Tạo key props khi render
        const dataSource =
            dataSchedules &&
            dataSchedules.length > 0 &&
            dataSchedules.map((item) => {
                return {
                    key: item.id,
                    maxNumber: item.maxNumber,
                    timeEn: item.timeData.valueEn,
                    timeVi: item.timeData.valueVi,
                    createdAt: moment(item.createdAt).format(
                        "YYYY-MM-DD HH:mm:ss"
                    ),
                };
            });

        //Tạo columns
        const columns = [
            {
                title: language === LANGUAGE.EN ? "Time" : "Khung giờ",
                key: "time",
                render: (text, record) => {
                    return (
                        <span>
                            {language === LANGUAGE.EN
                                ? record.timeEn
                                : record.timeVi}
                        </span>
                    );
                },
                defaultSortOrder: "descend",
                sorter: (a, b) => a.id - b.id,
            },
            {
                title:
                    language === LANGUAGE.EN ? "Max number" : "Số lượng tối đa",
                key: "maxNumber",
                dataIndex: "maxNumber",
            },
            {
                title: language === LANGUAGE.EN ? "Created At" : "Ngày tạo",
                key: "createdAt",
                dataIndex: "createdAt",
            },
            {
                title: language === LANGUAGE.EN ? "Action" : "Chức năng",
                key: "action",
                render: (_, record) => (
                    <Space size="middle">
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                this.props.handleDelete(record);
                            }}
                        >
                            <FormattedMessage id={"actions.delete"} />
                        </button>
                    </Space>
                ),
            },
        ];

        return (
            <>
                <div className="mt-5">
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        bordered
                        title={() => (
                            <h3>
                                {/* <FormattedMessage id={"manage-user.listUser"} /> */}
                                Danh sách kế hoạch
                            </h3>
                        )}
                    />
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.appReducer.language,
    };
};

export default connect(mapStateToProps)(TableManageSchedules);
