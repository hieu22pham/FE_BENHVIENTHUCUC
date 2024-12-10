import React, { Component } from "react";
import DatePicker from "react-datepicker";
import { CommonUtils, LANGUAGE } from "../utils";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import {
    getUserInforPatient,
    updateProfileService,
    getUserInforSystem,
} from "../services";
import moment from "moment";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";

class ProfileUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            address: "",
            birthDay: "",
            selectedGender: "",
            avatar: "",

            previewImgUrl: "",

            genders: "",

            userInfo: {},
        };
    }
    async componentDidMount() {
        const { token } = this.props;
        this.props.getGenders();

        if (token) {
            const res = await getUserInforSystem(token);
            if (res && res.errCode === 0) {
                let userInfo = res.userInfor;
                this.setState({
                    userInfo: userInfo,
                });
                if (userInfo) {
                    let res = await getUserInforPatient(userInfo.id);
                    if (res && res.errCode === 0) {
                        let info = res.data;

                        let formattedDate = moment
                            .unix(+info.birthday / 1000)
                            .toDate(); // Convert timestamp to Date object

                        this.setState({
                            id: userInfo.id,
                            firstName: info.firstName,
                            lastName: info.lastName,
                            phoneNumber: info.phoneNumber
                                ? info.phoneNumber
                                : "",
                            email: info.email,
                            address: info.address,
                            birthDay: formattedDate,
                            selectedGender: info.gender,
                            previewImgUrl: info.image,
                        });
                    }
                }
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { token } = this.props;

        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.gendersRedux),
            });
        }
        if (prevProps.gendersRedux !== this.props.gendersRedux) {
            this.setState({
                genders: this.buildDataGender(this.props.gendersRedux),
                selectedGender:
                    this.props.gendersRedux &&
                        this.props.gendersRedux.length > 0
                        ? this.props.gendersRedux[0].keyMap
                        : "",
            });
        }
        if (prevProps.userInfo !== this.props.userInfo) {
            const { userInfo } = this.props;
            if (userInfo) {
                let res = await getUserInforPatient(userInfo.id);
                if (res && res.errCode === 0) {
                    let info = res.data;

                    let formattedDate = moment
                        .unix(+info.birthday / 1000)
                        .toDate(); // Convert timestamp to Date object

                    if (this.state.birthDay !== formattedDate) {
                        this.setState({
                            firstName: info.firstName,
                            lastName: info.lastName,
                            phoneNumber: info.phoneNumber
                                ? info.phoneNumber
                                : "",
                            email: info.email,
                            address: info.address,
                            birthDay: formattedDate,
                            selectedGender: info.gender,
                            previewImgUrl: info.image,
                        });
                    }
                }
            }
        }

        if (prevProps.token !== this.props.token)
            if (token) {
                const res = await getUserInforSystem(token);
                if (res && res.errCode === 0) {
                    let userInfo = res.userInfor;
                    this.setState({
                        userInfo: userInfo,
                    });
                    if (userInfo) {
                        let res = await getUserInforPatient(userInfo.id);
                        if (res && res.errCode === 0) {
                            let info = res.data;

                            let formattedDate = moment
                                .unix(+info.birthday / 1000)
                                .toDate(); // Convert timestamp to Date object

                            this.setState({
                                id: userInfo.id,
                                firstName: info.firstName,
                                lastName: info.lastName,
                                phoneNumber: info.phoneNumber
                                    ? info.phoneNumber
                                    : "",
                                email: info.email,
                                address: info.address,
                                birthDay: formattedDate,
                                selectedGender: info.gender,
                                previewImgUrl: info.image,
                            });
                        }
                    }
                }
            }
    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;

        if (data && data.length > 0) {
            result = data.map((item) => {
                return {
                    lable:
                        language === LANGUAGE.VI ? item.valueVi : item.valueEn,
                    value: item.keyMap,
                };
            });
        }

        return result;
    };

    handleOnchangeInput = (event) => {
        let valueInput = event.target.value;
        let key = event.target.name;
        let copyState = { ...this.state };
        copyState[key] = valueInput;
        this.setState({
            ...copyState,
        });
    };

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            //encode sang dạng base64
            let base64 = await CommonUtils.getBase64(file);
            // console.log("image base64: ", base64);

            //Tạo đường link ảo của HTML để xem được biến obj
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgUrl: objectUrl,
                avatar: base64,
            });

            // console.log("check file: ", objectUrl); //copy đường link này lên url để xem
        }
    };

    handleSelectDate = (date) => {
        if (date) {
            this.setState({ birthDay: date });
        }
    };

    handleSave = async (e) => {
        e.preventDefault();
        let birthDay = new Date(this.state.birthDay).getTime(); //timestamp

        let data = {
            userId: this.state.userInfo.id,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            gender: this.state.selectedGender,
            birthDay: birthDay,
            avatar: this.state.avatar,
        };
        this.props.isShowLoading(true);
        let res = await updateProfileService(data);
        if (res && res.errCode === 0) {
            this.props.isShowLoading(false);
            toast.success(res.message);
        } else {
            toast.error(res.errMessage);
        }
    };

    render() {
        const {
            email,
            firstName,
            lastName,
            address,
            phoneNumber,
            birthDay,
            selectedGender,
            genders,
        } = this.state;
        return (
            <form>
                <div className="row">
                    <div className="col-4">
                        <div className="profile-avatar-container ">
                            <span>Active</span>
                            <div className="avatar">
                                <div className="upload-container">
                                    <input
                                        id="upload-img"
                                        type="file"
                                        hidden
                                        onChange={(event) => {
                                            this.handleOnchangeImage(event);
                                        }}
                                    />

                                    <div className="upload-image">
                                        <label
                                            className="upload-placholder"
                                            htmlFor="upload-img"
                                            style={{
                                                backgroundImage: `url(${this.state.previewImgUrl})`,
                                            }}
                                        >
                                            {!this.state.previewImgUrl && (
                                                <>
                                                    <i className="fas fa-upload"></i>
                                                    <div>Upload Photo</div>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="desc-img text-center">
                                Allowed *.jpeg, *.jpg, *.png, *.gif max size of
                                3.1 MB
                            </div>
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="profile-container">
                            <div className="row">
                                <div className="col-lg-6 col-sm-12 mt-3">
                                    <label>
                                        <FormattedMessage
                                            id={"admin.manage-profile.email"}
                                        />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        name="email"
                                        value={email}
                                        disabled
                                    />
                                </div>
                                <div className="col-lg-6 col-sm-12 mt-3">
                                    <label>
                                        <FormattedMessage
                                            id={
                                                "admin.manage-profile.lastName"
                                            }
                                        />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="firstName"
                                        value={firstName}
                                        onChange={(e) =>
                                            this.handleOnchangeInput(e)
                                        }
                                    />
                                </div>
                                <div className="col-lg-6 col-sm-12 mt-3">
                                    <label>
                                        <FormattedMessage
                                            id={"admin.manage-profile.firstName"}
                                        />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="lastName"
                                        value={lastName}
                                        onChange={(e) =>
                                            this.handleOnchangeInput(e)
                                        }
                                    />
                                </div>
                                <div className="col-lg-6 col-sm-12 mt-3">
                                    <label>
                                        <FormattedMessage
                                            id={
                                                "admin.manage-profile.phoneNumber"
                                            }
                                        />
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            this.handleOnchangeInput(e)
                                        }
                                    />
                                </div>

                                <div className="col-6 form-group mt-3">
                                    <label>
                                        <FormattedMessage
                                            id={"admin.manage-profile.gender"}
                                        />
                                    </label>
                                    <select
                                        className="form-control"
                                        id="inputGender"
                                        name="selectedGender"
                                        value={selectedGender}
                                        onChange={(event) =>
                                            this.handleOnchangeInput(event)
                                        }
                                    >
                                        {genders &&
                                            genders.length > 0 &&
                                            genders.map((item, index) => {
                                                return (
                                                    <option
                                                        key={index}
                                                        value={item.value}
                                                    >
                                                        {item.lable}
                                                    </option>
                                                );
                                            })}
                                    </select>
                                </div>

                                <div className="col-6 form-group mt-3">
                                    <label>
                                        <FormattedMessage
                                            id={"admin.manage-profile.address"}
                                        />
                                    </label>
                                    <input
                                        className="form-control"
                                        value={address}
                                        name="address"
                                        onChange={(event) => {
                                            this.handleOnchangeInput(event);
                                        }}
                                    />
                                </div>

                                <div className="col-6 form-group mt-3">
                                    <label>
                                        <FormattedMessage
                                            id={"admin.manage-profile.birthday"}
                                        />
                                    </label>
                                    <br></br>

                                    <DatePicker
                                        className="form-control w-full z-100 "
                                        selected={birthDay}
                                        onChange={(date) => {
                                            this.handleSelectDate(date);
                                        }}
                                        dateFormat="dd/MM/yyyy" // Định dạng ngày tháng thành "dd/mm/yyyy"
                                        value={birthDay}
                                    />
                                </div>
                            </div>
                            <div className="btn-save">
                                <button
                                    className="btn btn-primary"
                                    onClick={(e) => {
                                        this.handleSave(e);
                                    }}
                                >
                                    <FormattedMessage
                                        id={"admin.manage-profile.save"}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.appReducer.language,
        gendersRedux: state.adminReducer.genders,
        userInfo: state.user.userInfo,
        token: state.user.token,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        isShowLoading: (isLoading) => {
            return dispatch(actions.isLoadingAction(isLoading));
        },
        getGenders: () => {
            return dispatch(actions.fecthGenderStart());
        },
        userLoginSuccess: (userInfo) =>
            dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUser);
