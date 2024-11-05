import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Helmet } from "react-helmet";

import "./DetailClinic.scss";
import HomeHeader from "../HomeHeader";
import HomeFooter from "../HomeFooter";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
    getDetailClinicByIdService,
    getAllCodeService,
} from "../../../services/userService";
import { LANGUAGE } from "../../../utils";
import _ from "lodash";
import * as actions from "../../../redux/actions";

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
            readMoreDesc: false,
            listProvince: [],
            searchInput: "",
            location: "ALL",
            clinicId: "",
        };
    }

    async componentDidMount() {
        if (
            this.props.match &&
            this.props.match.params &&
            this.props.match.params.id
        ) {
            this.props.isShowLoading(true);
            let id = this.props.match.params.id;
            let res = await getDetailClinicByIdService({
                id: id,
                location: "ALL",
                search: "",
            });
            this.setState({
                clinicId: id,
            });

            let provinces = await getAllCodeService("PROVINCE");

            // console.log("check res from DetailClinic: ", provinces);

            if (
                res &&
                res.errCode === 0 &&
                provinces &&
                provinces.errCode === 0
            ) {
                let arrDoctorId = [];
                let arrProvince = [];
                if (res.data && !_.isEmpty(res.data)) {
                    let listDoctor = res.data.doctorClinic;
                    if (listDoctor && listDoctor.length > 0) {
                        arrDoctorId = listDoctor.map((item, index) => {
                            return item.doctorId;
                        });
                    }
                }
                if (provinces && provinces.data.length > 0) {
                    arrProvince = provinces.data;
                    arrProvince.unshift({
                        keyMap: "ALL",
                        createdAt: null,
                        type: "PROVINCE",
                        valueVi: "Toàn quốc",
                        valueEn: "ALL",
                    });
                }
                this.setState(
                    {
                        dataDetailClinic: res.data,
                        arrDoctorId: arrDoctorId,
                        listProvince: arrProvince ? arrProvince : [],
                    },
                    () => {
                        this.props.isShowLoading(false);
                    }
                );
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}

    handleOnChangeSelect = async (event) => {
        // console.log("check onChange: ", event.target.value);
        let location = event.target.value;
        this.setState({ location: location });

        if (
            this.props.match &&
            this.props.match.params &&
            this.props.match.params.id
        ) {
            let id = this.props.match.params.id;

            let res = await getDetailClinicByIdService({
                id: id,
                location: location,
                search: this.state.searchInput,
            });

            if (res && res.errCode === 0) {
                let arrDoctorId = [];

                if (res.data && !_.isEmpty(res.data)) {
                    let listDoctor = res.data.doctorClinic;
                    if (listDoctor && listDoctor.length > 0) {
                        arrDoctorId = listDoctor.map((item, index) => {
                            return item.doctorId;
                        });
                    }
                }

                this.setState({
                    arrDoctorId: arrDoctorId,
                });
            }
        }
    };

    handleOnChangeInput = (e) => {
        let key = e.target.name;
        let value = e.target.value;

        let copyState = { ...this.state };
        copyState[key] = value;

        this.setState({
            ...copyState,
        });
    };

    handleEnterKeyPress = async (event) => {
        if (event.key === "Enter") {
            let data = {
                id: this.state.clinicId,
                location: this.state.location,
                search: this.state.searchInput,
            };

            let res = await getDetailClinicByIdService(data);

            if (res && res.errCode === 0) {
                let arrDoctorId = [];

                if (res.data && !_.isEmpty(res.data)) {
                    let listDoctor = res.data.doctorClinic;
                    if (listDoctor && listDoctor.length > 0) {
                        arrDoctorId = listDoctor.map((item, index) => {
                            return item.doctorId;
                        });
                    }
                }

                this.setState({
                    arrDoctorId: arrDoctorId,
                });
            }
        }
    };

    render() {
        let { arrDoctorId, dataDetailClinic, listProvince, searchInput } =
            this.state;
        let { language } = this.props;

        return (
            <>
                <Helmet>
                    <title>
                        {`Đặt lịch khám tại - ${dataDetailClinic.nameVi}`}
                    </title>
                    <meta
                        name="description"
                        content={`Đặt lịch khám tại - ${dataDetailClinic.nameVi}`}
                    />
                </Helmet>
                <div className="detail-clinic_container">
                    <HomeHeader />
                    <div
                        className="detail-clinic_header"
                        style={{
                            backgroundImage: `url(${require("../../../assets/images/detail_specialty/114348-bv-viet-duc.jpg")})`,
                        }}
                    >
                        <div className="detail-clinic_content">
                            <div className="detail-clinic_description">
                                <div className="detail-clinic_image">
                                    <img
                                        src={dataDetailClinic.image}
                                        alt={dataDetailClinic.image}
                                    />
                                </div>
                                <div className="detail-clinic_address">
                                    <h1>
                                        {language === LANGUAGE.VI
                                            ? dataDetailClinic.nameVi
                                            : dataDetailClinic.nameEn}
                                    </h1>
                                    <div>{dataDetailClinic.address}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="detail-clinic_body">
                        <div className="filter-doctor">
                            <select
                                onChange={(event) => {
                                    this.handleOnChangeSelect(event);
                                }}
                            >
                                {listProvince &&
                                    listProvince.length > 0 &&
                                    listProvince.map((item, index) => {
                                        return (
                                            <option
                                                key={index}
                                                value={item.keyMap}
                                            >
                                                {language === LANGUAGE.VI
                                                    ? item.valueVi
                                                    : item.valueEn}
                                            </option>
                                        );
                                    })}
                            </select>
                            <div className="filter-doctor_search">
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
                                        id={"patient.detail-clinic.text-search"}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="list-doctor">
                            {arrDoctorId &&
                                arrDoctorId.length > 0 &&
                                arrDoctorId.map((item, index) => {
                                    return (
                                        <div
                                            className="doctor-item"
                                            key={index}
                                        >
                                            <div className="doctor-item_left">
                                                <div className="profile-doctor">
                                                    <ProfileDoctor
                                                        doctorId={item}
                                                        isShowDescription={true}
                                                        isShowLinkDetail={true}
                                                        isShowPrice={false}
                                                    />
                                                </div>
                                            </div>
                                            <div className="doctor-item_right">
                                                <DoctorSchedule
                                                    doctorIdFromParent={item}
                                                />
                                                <DoctorExtraInfor
                                                    doctorIdFromParent={item}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <div className="clinic-description">
                        <h2 className="text-desc">
                            <FormattedMessage
                                id={"patient.detail-clinic.text-desc"}
                            />
                        </h2>
                        {dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: dataDetailClinic.descriptionHTML,
                                }}
                            ></div>
                        )}
                    </div>
                </div>

                <div className="mt-3">
                    <HomeFooter />
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
    return {
        isShowLoading: (isLoading) => {
            return dispatch(actions.isLoadingAction(isLoading));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
