import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Helmet } from "react-helmet";

import HomeHeader from "../HomeHeader";
import "./ListClinic.scss";
import {
    getAllClinicService,
    searchClinicByNameService,
} from "../../../services";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { LANGUAGE } from "../../../utils";
import HomeFooter from "../HomeFooter";
import * as actions from "../../../redux/actions";

class ListClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: "",
            listClinic: [],
        };
    }

    async componentDidMount() {
        this.props.isShowLoading(true);
        let res = await getAllClinicService();
        if (res && res.errCode === 0) {
            this.renderList(res.data);
        }
    }

    renderList = async (data) => {
        this.props.isShowLoading(false);
        this.setState({
            listClinic: data ? data : [],
        });
    };

    handleOnChangeInput = async (event) => {
        let key = event.target.name;
        let value = event.target.value;
        let copyState = { ...this.state };

        copyState[key] = value;

        this.setState({
            ...copyState,
        });

        if (!value) {
            let res = await getAllClinicService();
            if (res && res.errCode === 0) {
                this.renderList(res.data);
            }
        }
    };

    handleEnterKeyPress = async (event) => {
        if (event.key === "Enter") {
            let search = this.state.searchInput;
            let { language } = this.props;
            this.props.isShowLoading(true);
            let res = await searchClinicByNameService({
                search: search,
                lang: language,
            });

            if (res && res.errCode === 0) {
                this.props.isShowLoading(false);
                this.renderList(res.data);
            }
        }
    };

    render() {
        const { language } = this.props;
        const { searchInput, listClinic } = this.state;
        return (
            <>
                <Helmet>
                    <title>Cơ sở y tế dành cho bạn</title>
                    <meta
                        name="description"
                        content="Danh sách cơ sở y tế dành cho bạn"
                    />
                </Helmet>
                <HomeHeader bgColor={true} />
                <div className="list-clinic_container">
                    <div className="list-clinic-header">
                        <Link to="/home">
                            <i className="fas fa-home"></i>
                            <span>/</span>
                        </Link>
                        <div>
                            <FormattedMessage
                                id={"patient.list-clinic.text-title"}
                            />
                        </div>
                    </div>
                    <div className="list-clinic_search">
                        <h3 className="text-title">
                            <FormattedMessage
                                id={"patient.list-clinic.text-examination"}
                            />
                        </h3>
                        <div className="filter_search">
                            <input
                                className="form-control"
                                name="searchInput"
                                value={searchInput}
                                placeholder="Search"
                                onChange={(e) => {
                                    this.handleOnChangeInput(e);
                                }}
                                onKeyPress={(e) => {
                                    this.handleEnterKeyPress(e);
                                }}
                            />
                            {/* <i className="fas fa-search"></i> */}
                            <button>
                                <FormattedMessage
                                    id={"patient.list-clinic.text-search"}
                                />
                            </button>
                        </div>
                    </div>

                    <ul>
                        {ListClinic &&
                            listClinic.length > 0 &&
                            listClinic.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <Link to={`/detail-clinic/${item.id}`}>
                                            <img
                                                src={item.image}
                                                width={100}
                                                height={67}
                                                alt={
                                                    language === LANGUAGE.VI
                                                        ? item.nameVi
                                                        : item.nameEn
                                                }
                                            />
                                            <h3>
                                                {language === LANGUAGE.VI
                                                    ? item.nameVi
                                                    : item.nameEn}
                                            </h3>
                                        </Link>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
                <HomeFooter />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.appReducer.language,
        userInfor: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        isShowLoading: (isLoading) => {
            return dispatch(actions.isLoadingAction(isLoading));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListClinic);
