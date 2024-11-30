import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Helmet } from "react-helmet";

import HomeHeader from "../HomeHeader";
import "./ListDoctor.scss";
import {
    getAllDoctorService,
    searchDoctorByNameService,
} from "../../../services";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { LANGUAGE } from "../../../utils";
import HomeFooter from "../HomeFooter";
import * as actions from "../../../redux/actions";

class ListDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: "",
            ListDoctor: [],
        };
        window.scrollTo(0, 0);

    }

    async componentDidMount() {
        this.props.isShowLoading(true);
        let res = await getAllDoctorService();
        if (res && res.errCode === 0) {
            this.renderListDoctor(res.data);
        }
    }

    renderListDoctor = async (data) => {
        this.props.isShowLoading(false);
        this.setState({
            ListDoctor: data ? data : [],
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
            let res = await getAllDoctorService();
            if (res && res.errCode === 0) {
                this.renderListDoctor(res.data);
            }
        }
    };

    handleEnterKeyPress = async (event) => {
        if (event.key === "Enter") {
            let searchName = this.state.searchInput;
            this.props.isShowLoading(true);
            let res = await searchDoctorByNameService(searchName);

            if (res && res.errCode === 0) {
                this.props.isShowLoading(false);
                this.renderListDoctor(res.data);
            }
        }
    };

    handleDoctorClick = (doctorId) => {
        localStorage.setItem("doctorIdSelected", doctorId); // Lưu vào localStorage
        console.log("Doctor ID selected:", doctorId); // Debug ID được chọn
    };

    render() {
        const { language } = this.props;
        const { searchInput, ListDoctor } = this.state;
        return (
            <>
                <Helmet>
                    <title>{`Danh sách bác sĩ dành cho bạn`}</title>
                    <meta name="description" content={`Danh sách bác sĩ`} />
                </Helmet>
                <HomeHeader bgColor={true} />
                <div className="list-doctor_container">
                    <div className="list-doctor-header">
                        <Link to="/home">
                            <i className="fas fa-home"></i>
                            <span>/</span>
                        </Link>
                        <div>
                            <FormattedMessage
                                id={"patient.list-doctor.text-title"}
                            />
                        </div>
                    </div>
                    <div className="list-doctor_search">
                        <h3 className="text-title">
                            <FormattedMessage
                                id={"patient.list-doctor.text-examination"}
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
                                    id={"patient.list-speciality.text-search"}
                                />
                            </button>
                        </div>
                    </div>

                    <ul>
                        {ListDoctor &&
                            ListDoctor.length > 0 &&
                            ListDoctor.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <Link to={`/detail-doctor/${item.id}`} 
                                            onClick={() => this.handleDoctorClick(item.id)}
                                        >
                                            <img
                                                src={item.image}
                                                width={100}
                                                height={67}
                                                alt={
                                                    language === LANGUAGE.VI
                                                        ? item.lastName
                                                        : item.lastName
                                                }
                                            />
                                            <div className="description">
                                                <h3>
                                                    {language === LANGUAGE.VI
                                                        ? `${item.positionData.valueVi} ${item.lastName} ${item.firstName} `
                                                        : `${item.positionData.valueEn} ${item.firstName} ${item.lastName} `}
                                                </h3>
                                                <div>
                                                    {language === LANGUAGE.VI
                                                        ? `${item.Doctor_Infor.specialtyData.nameVi}`
                                                        : `${item.Doctor_Infor.specialtyData.nameEn}`}
                                                </div>
                                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ListDoctor);
