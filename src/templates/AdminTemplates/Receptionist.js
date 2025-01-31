import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { Menu, Layout } from "antd";

import Header from "./Header/Header";
import AppointmentManagement from "../../pages/System/Receptionist/ManageSchedule";
// import ManagePatient from "../../pages/System/Receptionist/ManagePatient";
import { FormattedMessage } from "react-intl";
import { getUserInforSystem, getUserInforPatient } from "../../services";
import * as actions from "../../redux/actions";
import { receptionistMenu } from "./Header/menuApp";
import ExaminationManagement from "../../pages/System/Receptionist/MangeExamination";
import Invoice from "../../pages/System/Invoice/Invoice";

const { Content, Footer, Sider } = Layout;

class Receptionist extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            menuSystem: [],
            userInfo: {},
            collapsed: true,
        };
    }

    async componentDidMount() {
        try {
            this._isMounted = true;
            let { token } = this.props;
            let menu = [];
            let userInfor = {};

            const res = await getUserInforSystem(token);

            if (this._isMounted) {
                if (res && res.errCode === 0) {
                    userInfor = res.userInfor;
                    await this.props.userLoginSuccess(userInfor);
                    userInfor = res.userInfor;
                    let resUser = await getUserInforPatient(userInfor.id);

                    if (userInfor.userType === "receptionist") {
                        menu = receptionistMenu;
                    } else {
                        this.props.history.push("/home");
                        this._isMounted = false;
                    }

                    if (this._isMounted) {
                        this.setState({
                            menuSystem: this.renderMenuItems(menu),
                            userInfo: resUser.data,
                        });
                    }
                }
            }
        } catch (error) {
            // Xử lý lỗi nếu cần
        }
    }

    renderMenuItems = (items) => {
        if (items && items.length > 0) {
            return items.map((item) => {
                if (item.menus && item.menus.length > 0) {
                    return {
                        key: `${item.id}`,
                        label: <FormattedMessage id={item.name} />,
                        icon: item.icon,
                        children: this.renderMenuItems(item.menus)
                            ? this.renderMenuItems(item.menus)
                            : [],
                    };
                } else {
                    return {
                        key: `${item.link}`,
                        label: <FormattedMessage id={item.name} />,
                    };
                }
            });
        }
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { systemMenuPath, userInfo } = this.props;
        const { collapsed } = this.state;

        return (
            <Fragment>
                {this.props.isLoggedIn && <Header />}
                <Layout
                    className="system-container"
                    style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                    }}
                >
                    <Sider
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={(value) =>
                            this.setState({ collapsed: value })
                        }
                        className="system-menu"
                        width={260}
                    >
                        {!collapsed && (
                            <>
                                <div className="header-menu-container">
                                    <div className="header-menu-avatar">
                                        <div className="user-avatar">
                                            <img
                                                alt={this.state.userInfo.image}
                                                src={this.state.userInfo.image}
                                            ></img>
                                        </div>
                                        <span className="user-role">
                                            {userInfo.userType}
                                        </span>
                                    </div>

                                    <div className="header-menu-infor">
                                        <h6>{`${userInfo.lastName} ${userInfo.firstName} `}</h6>
                                        <p> {userInfo.userName}</p>
                                    </div>
                                </div>

                                <span
                                    className="pt-3"
                                    style={{
                                        backgroundColor: "#001529",
                                        color: "white",
                                        fontSize: 14,
                                        fontWeight: "600",
                                        paddingLeft: 20,
                                        display: "block",
                                    }}
                                >
                                    <FormattedMessage
                                        id={"admin.menu.text-manage"}
                                    />
                                </span>
                            </>
                        )}

                        <Menu
                            style={{
                                height: "calc(100vh - 40px)",
                                width: "100%",
                            }}
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={[
                                this.props.history.location.pathname,
                            ]}
                            items={this.state.menuSystem}
                            onClick={(item) => {
                                this.props.history.push(item.key);
                            }}
                        ></Menu>
                    </Sider>
                    <Layout
                        className="system-list"
                        style={{
                            width: "80%",
                            overflow: "auto",
                            height: "calc(100vh - 40px)",
                        }}
                    >
                        <Content>
                            <Switch>
                                <Route
                                    path="/receptionist/manage-schedule"
                                    component={AppointmentManagement}
                                />
                                <Route
                                    path="/receptionist/manage-time-stamp"
                                    component={ExaminationManagement}
                                />
                                <Route
                                    path="/receptionist/invoice"
                                    component={Invoice}
                                />
                                <Route
                                    component={() => {
                                        return <Redirect to={systemMenuPath} />;
                                    }}
                                />
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        token: state.user.token,
        language: state.appReducer.language,
        systemMenuPath: state.appReducer.systemMenuPath,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        userLoginSuccess: (userInfo) =>
            dispatch(actions.userLoginSuccess(userInfo)),
        changeLanguage: (language) =>
            dispatch(actions.changeLanguageAppAction(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Receptionist);
