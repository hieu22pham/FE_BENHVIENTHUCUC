import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import "../../pages/HomePage/HomeHeader.scss";
import { Link } from "react-router-dom/cjs/react-router-dom";

export default class Option extends Component {
    render() {
        return (
            <div className="options">
                <div className="options-container">
                    <Link to={"/kham-chuyen-khoa"} className="option-child">
                        <div
                            className="icon-child"
                            style={{
                                backgroundImage: `url(${require("../../assets/images/icon-menu/161905-iconkham-chuyen-khoa.png")})`,
                            }}
                        ></div>
                        <p className="text-child">
                            <FormattedMessage id="banner.examination" />
                            <br />
                            <FormattedMessage id="banner.speciality" />
                        </p>
                    </Link>
                    <div className="option-child">
                        <div
                            className="icon-child"
                            style={{
                                backgroundImage: `url(${require("../../assets/images/icon-menu/161817-iconkham-tu-xa.png")})`,
                            }}
                        ></div>
                        <p className="text-child">
                            <FormattedMessage id="banner.examination" />
                            <br />
                            <FormattedMessage id="banner.remote" />
                        </p>
                    </div>
                    <div className="option-child">
                        <div
                            className="icon-child"
                            style={{
                                backgroundImage: `url(${require("../../assets/images/icon-menu/161350-iconkham-tong-quan.png")})`,
                            }}
                        ></div>
                        <p className="text-child">
                            <FormattedMessage id="banner.examination" />
                            <br />
                            <FormattedMessage id="banner.generality" />
                        </p>
                    </div>
                    <div className="option-child">
                        <div
                            className="icon-child"
                            style={{
                                backgroundImage: `url(${require("../../assets/images/icon-menu/161340-iconxet-nghiem-y-hoc.png")})`,
                            }}
                        ></div>
                        <p className="text-child">
                            <FormattedMessage id="banner.test" />
                            <br />
                            <FormattedMessage id="banner.medical" />
                        </p>
                    </div>
                    <div className="option-child">
                        <div
                            className="icon-child"
                            style={{
                                backgroundImage: `url(${require("../../assets/images/icon-menu/161403-iconsuc-khoe-tinh-than.png")})`,
                            }}
                        ></div>
                        <p className="text-child">
                            <FormattedMessage id="banner.health" />
                            <br />
                            <FormattedMessage id="banner.spirit" />
                        </p>
                    </div>
                    <div className="option-child">
                        <div
                            className="icon-child"
                            style={{
                                backgroundImage: `url(${require("../../assets/images/icon-menu/161410-iconkham-nha-khoa.png")})`,
                            }}
                        ></div>
                        <p className="text-child">
                            <FormattedMessage id="banner.examination" />
                            <br />
                            <FormattedMessage id="banner.dentistry" />
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
