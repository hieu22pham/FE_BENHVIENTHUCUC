import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom/cjs/react-router-dom.min";


export default class AboutClinic extends Component {
    render() {
        window.scrollTo(0, 0);
        return (
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-5 container-about">
                        <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                            <div className="d-flex flex-column">
                                <img className="img-fluid rounded about-img-2 align-self-end"
                                    src={require("../../../assets/images/detail_specialty/gioi-thieu-co-so-32-dai-tu-1.jpg")}
                                    alt="" />
                                <img className="img-fluid rounded  bg-white pt-3 pe-3 about-img"
                                    src={require("../../../assets/images/detail_specialty/gioi-thieu-co-so-32-dai-tu-2.jpg")}

                                    alt="" />

                            </div>
                        </div>
                        <div className="col-lg-6 wow fadeIn about-content" data-wow-delay="0.5s">
                            <h1 className="mb-4">
                                <FormattedMessage
                                    id={"homepage.reasons"}
                                />
                            </h1>

                            <p>
                                <FormattedMessage
                                    id={"homepage.text-about-1"}
                                />
                            </p>
                            <p className="mb-4">
                                <FormattedMessage
                                    id={"homepage.text-about-2"}
                                />
                            </p>
                            <p><i className="far fa-check-circle text-primary me-3"></i>
                                <FormattedMessage
                                    id={"homepage.text-check-1"}
                                />
                            </p>
                            <p><i className="far fa-check-circle text-primary me-3"></i>
                                <FormattedMessage
                                    id={"homepage.text-check-2"}
                                />
                            </p>
                            <p><i className="far fa-check-circle text-primary me-3"></i>
                                <FormattedMessage
                                    id={"homepage.text-check-3"}
                                />
                            </p>
                            <Link
                                to={`/gioi-thieu/6`}
                                className="btn-section btn btn-primary rounded-pill py-3 px-5 mt-3"
                            >
                                <FormattedMessage id="homepage.more-infor" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
