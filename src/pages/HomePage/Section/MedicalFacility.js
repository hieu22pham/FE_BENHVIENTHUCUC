import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { withRouter } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { getAllClinicService } from "../../../services";
import { LANGUAGE } from "../../../utils";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import * as actions from "../../../redux/actions";

class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listClinic: [],
        };
    }
    async componentDidMount() {
        this.props.isShowLoading(true);
        let res = await getAllClinicService();
        if (res && res.errCode === 0) {
            this.props.isShowLoading(false);
            this.setState({
                listClinic: res.data ? res.data : [],
            });
        }
    }

    handleViewDetailClinic = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${item.id}`);
        }
    };

    render() {
        const { listClinic } = this.state;
        const { language } = this.props;
        return (
            <div className="section-share section-medical-facility">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="homepage.about-us" />
                        </span>
                        <Link
                            to={`/detail-clinic/6`}
                            className="btn-section"
                        >
                            <FormattedMessage id="homepage.text-search" />
                        </Link>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {listClinic &&
                                listClinic.map((item) => {
                                    return (
                                        <div
                                            className="section-customize"
                                            key={item.id}
                                            onClick={() => {
                                                this.handleViewDetailClinic(
                                                    item
                                                );
                                            }}
                                        >
                                            <div className="container-content">
                                                <div
                                                    className="bg-img medical-facility-img"
                                                    style={{
                                                        backgroundImage: `url(${item.image})`,
                                                    }}
                                                ></div>
                                                <div className="description text-center">
                                                    {language === LANGUAGE.VI
                                                        ? item.nameVi
                                                        : item.nameEn}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.appReducer.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        isShowLoading: (isLoading) => {
            return dispatch(actions.isLoadingAction(isLoading));
        },
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(MedicalFacility)
);
