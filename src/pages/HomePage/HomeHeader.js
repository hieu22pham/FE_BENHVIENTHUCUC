import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Link, withRouter } from "react-router-dom/cjs/react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGear,
    faSignOut,
    faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

import { LANGUAGE } from "../../utils";
import { changeLanguageAppAction } from "../../redux/actions";
import routes from "../../configs/routes";
import * as actions from "../../redux/actions";

import "./HomeHeader.scss";
import HamburgerMenu from "../../components/HamburgerMenu/HamburgerMenu";
import {
    getSearchByNameService,
    getSearchService,
    getUserInforSystem,
    getUserInforPatient,
} from "../../services";
import Option from "../../components/HomePage/Option";

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isFocused: false,
            searchQuery: "",
            listSearchClinic: [],
            listSearchDoctor: [],
            listSearchSpecialty: [],
            userInfor: {},
        };
    }

    async componentDidMount() {
        let copyState = { ...this.state };
        let { token } = this.props;
        let res = await getSearchService(5);
        if (res && res.errCode === 0) {
            copyState.listSearchClinic = res.data.resClinic;
            copyState.listSearchSpecialty = res.data.resSpecialty;
            copyState.listSearchDoctor = res.data.resDoctor;
        }
        this.setState({
            ...copyState,
        });

        if (token) {
            let userInfor = {};
            const res = await getUserInforSystem(token);
            if (res && res.errCode === 0) {
                userInfor = res.userInfor;
                let resUser = await getUserInforPatient(userInfor.id);
                if (resUser && resUser.errCode === 0) {
                    this.setState({
                        userInfor: resUser.data,
                    });
                }
            }
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.token !== this.props.token) {
            // console.log("check token componentDidUpdate: ", this.props.token);
            if (this.props.isLoggedIn) {
                let { token } = this.props;
                let userInfor = {};

                const res = await getUserInforSystem(token);

                if (res && res.errCode === 0) {
                    userInfor = res.userInfor;
                    let resUser = await getUserInforPatient(userInfor.id);
                    if (resUser && resUser.errCode === 0) {
                        this.setState({
                            userInfor: resUser.data,
                        });
                    }
                }
            }
        }
    }

    handleOpenMenu = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    };

    handleFocusSearch = async () => {
        this.setState({
            isFocused: true,
        });
    };

    handleBlurSearch = () => {
        this.setState({
            isFocused: false,
        });
    };

    handleOnChangeSearch = async (e, key) => {
        let copyState = { ...this.state };
        copyState[key] = e.target.value;
        this.setState({
            ...copyState,
        });
        if (copyState.searchQuery === "") {
            let res = await getSearchService(5);
            if (res && res.errCode === 0) {
                copyState.listSearchClinic = res.data.resClinic;
                copyState.listSearchSpecialty = res.data.resSpecialty;
                copyState.listSearchDoctor = res.data.resDoctor;
                this.setState({
                    ...copyState,
                });
            }
        }
    };

    handleEnterSearch = async (e) => {
        const { searchQuery } = this.state;
        let copyState = { ...this.state };
        if (searchQuery) {
            if (e.key === "Enter") {
                let res = await getSearchByNameService(searchQuery);
                if (res && res.errCode === 0) {
                    copyState.listSearchClinic = res.data.resClinic;
                    copyState.listSearchSpecialty = res.data.resSpecialty;
                    copyState.listSearchDoctor = res.data.resDoctor;
                }

                this.setState({
                    ...copyState,
                });
            }
        }
    };

    handleLogout = (event) => {
        event.preventDefault();
        this.props.history.push("/");

        // Cuộn trang về đầu
        window.scrollTo(0, 0);
        this.props.processLogout();
    };

    render() {
        let language = this.props.lang;
        let { isShowBanner, bgColor } = this.props;
        let {
            isFocused,
            searchQuery,
            listSearchClinic,
            listSearchDoctor,
            listSearchSpecialty,
            userInfor,
        } = this.state;

        return (
            <Fragment>
                <div
                    className={`home-header-container ${bgColor ? "bgColor" : ""
                        }`}
                >
                    <div className="home-header-content">
                        <div className="left-content">
                            <i
                                className="fas fa-bars"
                                onClick={() => {
                                    this.handleOpenMenu();
                                }}
                            ></i>
                            <Link to={routes.HOMEPAGE} className="header-logo">


                            </Link>
                        </div>
                        <div className="center-content d-none d-lg-flex">
                            <Link
                                to={routes.LIST_SPECIALTY}
                                className="child-content"
                            >
                                <div to={"/kham-chuyen-khoa"}>
                                    <b>
                                        <FormattedMessage id="homeHeader.speciality" />
                                    </b>
                                </div>
                                <div className="sub-title">
                                    <FormattedMessage id="homeHeader.search-doctor" />
                                </div>
                            </Link>
                            <Link
                                to={routes.LIST_CLINIC}
                                className="child-content"
                            >
                                <div>
                                    <b>
                                        <FormattedMessage id="homeHeader.health-facility" />
                                    </b>
                                </div>
                                <div className="sub-title">
                                    <FormattedMessage id="homeHeader.select-room" />
                                </div>
                            </Link>
                            <Link
                                to={routes.LIST_DOCTOR}
                                className="child-content"
                            >
                                <div>
                                    <b>
                                        <FormattedMessage id="homeHeader.doctor" />
                                    </b>
                                </div>
                                <div className="sub-title">
                                    <FormattedMessage id="homeHeader.select-doctor" />
                                </div>
                            </Link>
                            {/* <div className="child-content">
                                <div>
                                    <b>
                                        <FormattedMessage id="homeHeader.fee" />
                                    </b>
                                </div>
                                <div className="sub-title">
                                    <FormattedMessage id="homeHeader.check-health" />
                                </div>
                            </div> */}
                        </div>
                        <div className="right-content">
                            <div className="right_content-container">
                                <Link
                                    className="booking"
                                    to={routes.HISTORY_BOOKING}
                                >
                                    <FontAwesomeIcon
                                        icon={faClockRotateLeft}
                                        style={{
                                            fontSize: "20px",
                                        }}
                                        className="setting-icon"
                                    />
                                    <span>
                                        {/* <FormattedMessage id="homeHeader.support" /> */}
                                        Lịch hẹn
                                    </span>
                                </Link>
                                <div className="support">
                                    <div>
                                        <i className="fas fa-question-circle"></i>
                                        <span>
                                            <FormattedMessage id="homeHeader.support" />
                                        </span>
                                    </div>
                                    <span>0123-438-375</span>
                                </div>
                                <div
                                    className={
                                        language === LANGUAGE.VI
                                            ? "language-vi active"
                                            : "language-vi"
                                    }
                                >
                                    <span
                                        onClick={() => {
                                            this.props.changeLanguage(
                                                LANGUAGE.VI
                                            );
                                        }}
                                    >
                                        VN
                                    </span>
                                </div>
                                <div
                                    className={
                                        language === LANGUAGE.EN
                                            ? "language-en active"
                                            : "language-en"
                                    }
                                >
                                    <span
                                        onClick={() => {
                                            this.props.changeLanguage(
                                                LANGUAGE.EN
                                            );
                                        }}
                                    >
                                        EN
                                    </span>
                                </div>
                                {this.props.isLoggedIn && (
                                    <div
                                        className="header-username"
                                        style={{
                                            backgroundImage: `url(${userInfor && userInfor.image
                                                ? userInfor.image
                                                : require(`../../assets/images/avatar/no-avatar.png`)
                                                })`,
                                            position: "relative",
                                        }}
                                    >
                                        <div className="header-setting-poup-list">
                                            <ul>
                                                <li className="setting-item">
                                                    <Link to={routes.PROFILE}>
                                                        <span className="setting-icon">
                                                            <i
                                                                className="far fa-user"
                                                                style={{
                                                                    fontSize:
                                                                        "20px",
                                                                }}
                                                            ></i>
                                                        </span>
                                                        <span>Xem hồ sơ</span>
                                                    </Link>
                                                </li>
                                                <li className="setting-item">
                                                    <a>
                                                        <FontAwesomeIcon
                                                            icon={faGear}
                                                            style={{
                                                                fontSize:
                                                                    "20px",
                                                            }}
                                                            className="setting-icon"
                                                        />
                                                        <span>Cài đặt</span>
                                                    </a>
                                                </li>
                                                <li className="setting-item">
                                                    <a
                                                        href="/"
                                                        onClick={(event) => {
                                                            this.handleLogout(
                                                                event
                                                            );
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faSignOut}
                                                            style={{
                                                                fontSize:
                                                                    "20px",
                                                            }}
                                                            className="setting-icon"
                                                        />
                                                        <span>Đăng xuất</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {isShowBanner && (
                    <div className="home-header-banner">
                        <div className="search">
                            <div className="title">
                                <h1>
                                    <FormattedMessage id="banner.title1" />
                                    <br></br>
                                    <b>
                                        <FormattedMessage id="banner.title2" />
                                    </b>
                                </h1>
                            </div>
                            <div
                                className={`search-form ${isFocused ? "hien" : ""
                                    }`}
                            >
                                <div className="search-input">
                                    <i className="fas fa-search"></i>
                                    <input
                                        value={searchQuery}
                                        type="text"
                                        placeholder={
                                            language === LANGUAGE.VI
                                                ? "Tìm kiếm"
                                                : "Search"
                                        }
                                        onFocus={() => {
                                            this.handleFocusSearch();
                                        }}
                                        onBlur={() => {
                                            // Sử dụng setTimeout để trì hoãn việc ẩn danh sách kết quả
                                            setTimeout(() => {
                                                this.handleBlurSearch();
                                            }, 200); // Thời gian trễ 200ms (có thể điều chỉnh)
                                        }}
                                        onChange={(e) => {
                                            this.handleOnChangeSearch(
                                                e,
                                                "searchQuery"
                                            );
                                        }}
                                        onKeyPress={(e) => {
                                            this.handleEnterSearch(e);
                                        }}
                                    />
                                </div>
                                <div className="search-result">
                                    <div className="search-result_specialties">
                                        <h3>
                                            <FormattedMessage id="banner.speciality" />
                                        </h3>
                                        {listSearchSpecialty &&
                                            listSearchSpecialty.length > 0 &&
                                            listSearchSpecialty.map(
                                                (item, index) => {
                                                    return (
                                                        <Link
                                                            to={`/detail-specialty/${item.id}`}
                                                            key={index}
                                                        >
                                                            <div
                                                                className="image"
                                                                style={{
                                                                    backgroundImage: `url(${item.image})`,
                                                                }}
                                                            ></div>
                                                            <h4>
                                                                {language ===
                                                                    LANGUAGE.VI
                                                                    ? item.nameVi
                                                                    : item.nameEn}
                                                            </h4>
                                                            <div className="xoa"></div>
                                                        </Link>
                                                    );
                                                }
                                            )}
                                    </div>
                                    <div className="search-result_clinics">
                                        <h3>
                                            <FormattedMessage id="banner.clinic" />
                                        </h3>
                                        {listSearchClinic &&
                                            listSearchClinic.length > 0 &&
                                            listSearchClinic.map(
                                                (item, index) => {
                                                    return (
                                                        <Link
                                                            to={`/detail-clinic/${item.id}`}
                                                            key={index}
                                                        >
                                                            <div
                                                                className="image"
                                                                style={{
                                                                    backgroundImage: `url(${item.image})`,
                                                                }}
                                                            ></div>
                                                            <h4>
                                                                {language ===
                                                                    LANGUAGE.VI
                                                                    ? item.nameVi
                                                                    : item.nameEn}
                                                            </h4>
                                                            <div className="xoa"></div>
                                                        </Link>
                                                    );
                                                }
                                            )}
                                    </div>
                                    <div className="search-result_doctors">
                                        <h3>
                                            <FormattedMessage id="banner.doctor" />
                                        </h3>
                                        {listSearchDoctor &&
                                            listSearchDoctor.length > 0 &&
                                            listSearchDoctor.map(
                                                (item, index) => {
                                                    return (
                                                        <Link
                                                            to={`/detail-doctor/${item.id}`}
                                                            key={index}
                                                        >
                                                            <div
                                                                className="image"
                                                                style={{
                                                                    backgroundImage: `url(${item.image})`,
                                                                }}
                                                            ></div>
                                                            {/* <h4>
                                                                {language ===
                                                                    LANGUAGE.VI
                                                                    ? `${item.positionData.valueVi} ${item.firstName} ${item.lastName}`
                                                                    : `${item.positionData.valueEn} ${item.firstName} ${item.lastName}`}
                                                            </h4> */}
                                                            <div className="xoa"></div>
                                                        </Link>
                                                    );
                                                }
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Option />
                    </div>
                )}

                <HamburgerMenu
                    isOpen={this.state.isOpen}
                    handleOpenMenuFromHeader={this.handleOpenMenu}
                />
            </Fragment>
        );
    }
}

//lấy state của redux vào props của react
const mapStateFromToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        lang: state.appReducer.language,
        userInfo: state.user.userInfo,
        token: state.user.token,
    };
};

//gửi action lên redux(fire redux event)
const mapDispatchToProps = (dispatch) => {
    return {
        changeLanguage: (language) => {
            dispatch(changeLanguageAppAction(language));
        },
        processLogout: () => dispatch(actions.processLogout()),
        userLoginSuccess: (userInfo) =>
            dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default withRouter(
    connect(mapStateFromToProps, mapDispatchToProps)(HomeHeader)
); //kết nối react-redux
