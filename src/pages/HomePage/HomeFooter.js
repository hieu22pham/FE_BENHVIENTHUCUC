import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom/cjs/react-router-dom";

export default class HomeFooter extends Component {
    render() {
        return (
            <footer>
                <div className="home-footer px-5">
                    <div className="d-lg-flex d-sm-block content-footer">
                        <div className="col-lg-6 col-sm-12 footer-logo-company ">
                            <NavLink to="/home">
                                <img
                                    title="Logo"
                                    className="footer-logo"
                                    src={require("../../assets/background/logo_remove01.png")}
                                    alt="ThuCucTCI"
                                />
                            </NavLink>
                            <div className="footer-company">
                                <p>
                                    <span >
                                        <i className="fas fa-map-marker-alt icon-right"></i>
                                    </span>
                                    <FormattedMessage
                                        id={"homepage.footer.address"}
                                    />
                                </p>
                            </div>
                        </div>
                        {/* <div className="col-lg-3 col-sm-12"></div> */}
                        <div className="col-lg-6 col-sm-12 text-center">
                            <div className="footer-address">
                                <strong>
                                    <FormattedMessage
                                        id={"homepage.footer.headquarters"}
                                    />
                                </strong>
                                <br />
                                <p>
                                    <FormattedMessage
                                        id={"homepage.footer.address"}
                                    />
                                </p>
                            </div>
                            <div className="footer-address">
                                <strong>
                                    <FormattedMessage
                                        id={"homepage.footer.support"}
                                    />
                                </strong>
                                <br />
                                <p>
                                    ThuCucAdmin@gmail.com
                                </p>

                            </div>
                            <div className="footer-address">
                                <strong>Hotline</strong>
                                <br />
                                <span>0123-438-375 (7h30 - 18h) </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="home-footer2 text-center">
                    <small>&copy; Thu Cuc TCI 32 Dai Tu.</small>
                </div>
            </footer>
        );
    }
}
