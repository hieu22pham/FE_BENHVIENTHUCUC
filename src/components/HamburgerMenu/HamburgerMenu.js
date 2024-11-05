import React, { Component } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";

import configs from "../../configs";
import "./HamburgerMenu.scss";
import { connect } from "react-redux";
import * as actions from "../../redux/actions";
import { FormattedMessage } from "react-intl";

class HamburgerMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isOpen !== this.props.isOpen) {
            this.setState({
                isOpen: this.props.isOpen,
            });
        }
    }

    handleMenuOpen = () => {
        this.props.handleOpenMenuFromHeader();
    };
    render() {
        const { isLoggedIn } = this.props;

        const menus = [
            {
                link: configs.routes.HOMEPAGE,
                nameVi: (
                    <FormattedMessage id={"homeHeader.hambergerMenu.home"} />
                ),
            },
            {
                link: configs.routes.HISTORY_BOOKING,
                nameVi: isLoggedIn ? (
                    <FormattedMessage
                        id={"homeHeader.hambergerMenu.examination-history"}
                    />
                ) : (
                    <FormattedMessage id={"homeHeader.hambergerMenu.look-up"} />
                ),
            },
            {
                link: "/contact",
                nameVi: (
                    <FormattedMessage id={"homeHeader.hambergerMenu.contact"} />
                ),
            },
            {
                link: "/article",
                nameVi: (
                    <FormattedMessage id={"homeHeader.hambergerMenu.terms"} />
                ),
            },
        ];

        return (
            <>
                <div
                    className={`nen-mo ${this.state.isOpen ? "display" : ""}`}
                    onClick={this.handleMenuOpen}
                ></div>
                <nav
                    className={`navbar-container ${
                        this.state.isOpen ? "open" : ""
                    }`}
                >
                    <ul className="navbar-content">
                        {menus.map((item, index) => {
                            return (
                                <li
                                    key={index}
                                    onClick={() => {
                                        this.handleMenuOpen();
                                    }}
                                >
                                    <Link to={item.link}>{item.nameVi}</Link>
                                </li>
                            );
                        })}
                        {isLoggedIn === false ? (
                            <>
                                <li>
                                    <Link to={configs.routes.LOGIN}>
                                        <FormattedMessage
                                            id={
                                                "homeHeader.hambergerMenu.login"
                                            }
                                        />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={configs.routes.REGISTER}>
                                        <FormattedMessage
                                            id={
                                                "homeHeader.hambergerMenu.register"
                                            }
                                        />
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link
                                    to={configs.routes.LOG_OUT}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        this.props.processLogout();
                                    }}
                                >
                                    <FormattedMessage
                                        id={"homeHeader.hambergerMenu.logout"}
                                    />
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
        language: state.appReducer.language,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HamburgerMenu);
