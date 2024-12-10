import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";

import "./DoctorExtraInfor.scss";
import { getExtraInforDoctorByIdServicde } from "../../../services";
import { LANGUAGE } from "../../../utils/constants";

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {},
        };
        window.scrollTo(0, 0);

    }

    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInforDoctorByIdServicde(
                this.props.doctorIdFromParent
            );
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data,
                });
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }

        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInforDoctorByIdServicde(
                this.props.doctorIdFromParent
            );
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data,
                });
            }
            // console.log("get ExtraInfor data: ", res);
        }
    }

    showHideDetailInfor = () => {
        this.setState({
            isShowDetailInfor: !this.state.isShowDetailInfor,
        });
    };

    render() {
        let { isShowDetailInfor, extraInfor } = this.state;
        let { language } = this.props;
        return (
            <div className="doctor-extraInfor_container">
                <div className="doctor-extraInfor_header">
                    <div className="text-address">
                        <FormattedMessage
                            id={"patient.extra-infor-doctor.text-address"}
                        />
                    </div>
                    <div className="name-clinic">
                        {extraInfor && extraInfor.nameClinic
                            ? extraInfor.nameClinic
                            : ""}
                    </div>
                    <div className="address-clinic">
                        {extraInfor && extraInfor.addressClinic
                            ? extraInfor.addressClinic
                            : ""}
                    </div>
                </div>
                
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        doctorDetailRedux: state.user.doctorDetail,
        language: state.appReducer.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
