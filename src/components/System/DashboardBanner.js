import React, { Component } from "react";

import "./DashboardBanner.scss";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

class DashboardBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
        };
    }

    componentDidMount() {
        if (this.props.userInfo) {
            this.setState({
                // fullName: `${this.props.userInfo.firstName} ${this.props.userInfo.lastName}`,
                fullName: `${this.props.userInfo?.firstName || ""} ${this.props.userInfo?.lastName || ""}`,
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userInfo !== this.props.userInfo) {
            this.setState({
                fullName: `${this.props.userInfo?.firstName || ""} ${this.props.userInfo?.lastName || ""}`,
            });
        }
    }

    render() {
        return (
            <div className="dashboard-banner text-sm d-sm-block d-lg-flex">
                <div className="banner-left">
                    <div className="banner-title">
                        <FormattedMessage id={"admin.dashboard.title"} />
                        <p>{this.state.fullName}</p>
                    </div>
                    <div className="banner-description">
                        <FormattedMessage id={"admin.dashboard.desc"} />
                    </div>
                </div>
                {/* <div className="banner-right">
                    <img
                        src={require(`../../assets/images/dashboard/banner.png`)}
                        alt="banner.png"
                        height={200}
                    />
                </div> */}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
        language: state.appReducer.language,
    };
};

export default connect(mapStateToProps)(DashboardBanner);
