import { Card, Space, Statistic, Typography } from "antd";

import React, { Component } from "react";

import "./DashboardCard.scss";

export default class DashboardCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <Card
                style={{ width: "calc(33% - 10px)", minWidth: "150px" }}
                className="card-container"
            >
                <Space
                    direction="horizontal"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Space direction="vertical">
                        <Typography.Text>{this.props.title}</Typography.Text>
                        <Statistic
                            value={this.props.value}
                            style={{ fontWeight: "600" }}
                        />
                    </Space>
                    {this.props.icon}
                </Space>
            </Card>
        );
    }
}
