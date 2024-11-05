import React, { Component } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard, faKey } from "@fortawesome/free-solid-svg-icons";
import { Tabs } from "antd";

import { CommonUtils, LANGUAGE } from "../../../utils";
import "./Profile.scss";
import ProfileUser from "../../../components/ProfileUser";
import { FormattedMessage } from "react-intl";
import ChangePassword from "../../../components/ChangePassword";
import HomeHeader from "../HomeHeader";

const { TabPane } = Tabs;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            address: "",
            birthDay: "",
            selectedGender: "",

            previewImgUrl: "",

            genders: "",
        };
    }

    handleTab = (e) => {
        // console.log(e);
    };

    render() {
        return (
            <>
                <HomeHeader bgColor={true} />
                <div className="manage-profile-container container">
                    <div className="manage-profile-header">
                        <h4 className="manage-profile-title">
                            <FormattedMessage
                                id={"admin.manage-profile.title"}
                            />
                        </h4>
                        <nav className="">
                            <ol className="breadcrums">
                                <li>
                                    <Link to={"/system/home"}>
                                        <FormattedMessage
                                            id={
                                                "admin.manage-profile.text-home"
                                            }
                                        />
                                    </Link>
                                </li>
                                <li className="breadcrums-separator">
                                    <span className="doot"></span>
                                </li>
                                <li>
                                    <Link to={"/system/manage-profile"}>
                                        <FormattedMessage
                                            id={
                                                "admin.manage-profile.text-profile"
                                            }
                                        />
                                    </Link>
                                </li>
                                <li className="breadcrums-separator">
                                    <span className="doot"></span>
                                </li>
                                <li>
                                    <div>
                                        <FormattedMessage
                                            id={
                                                "admin.manage-profile.text-account"
                                            }
                                        />
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div className="manage-profile-body">
                        <Tabs
                            defaultActiveKey="1"
                            onChange={this.handleTab}
                            className="custom-tabs"
                        >
                            <TabPane
                                key="1"
                                tab={
                                    <span>
                                        <FontAwesomeIcon
                                            icon={faIdCard}
                                            style={{
                                                fontSize: "1rem",
                                                marginRight: "5px",
                                            }}
                                        />
                                        <FormattedMessage
                                            id={
                                                "admin.manage-profile.text-general"
                                            }
                                        />
                                    </span>
                                }
                            >
                                <ProfileUser />
                            </TabPane>
                            <TabPane
                                key="2"
                                tab={
                                    <span>
                                        <FontAwesomeIcon
                                            icon={faKey}
                                            style={{
                                                fontSize: "1rem",
                                                marginRight: "5px",
                                            }}
                                        />
                                        <FormattedMessage
                                            id={
                                                "admin.manage-profile.text-security"
                                            }
                                        />
                                    </span>
                                }
                            >
                                <ChangePassword />
                            </TabPane>
                        </Tabs>
                    </div>
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

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
