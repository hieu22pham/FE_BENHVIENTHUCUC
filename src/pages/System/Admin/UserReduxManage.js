import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import { toast } from "react-toastify";
import { Buffer } from "buffer";

import {
    LANGUAGE,
    CRUD_ACTIONS,
    CommonUtils,
    validateEmail,
    validatePhone,
} from "../../../utils";
import * as actions from "../../../redux/actions";
import "./UserReduxManage.scss";
import TableManageUser from "./TableManageUser";
import { toUpper } from "lodash";

class UserReduxManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genders: [],
            previewImgUrl: "",
            isOpen: false,

            id: "",
            email: "",
            passWord: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            address: "",
            gender: "",
            position: "",
            role: "",
            avatar: "",

            action: CRUD_ACTIONS.CREATE,
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
        this.getAllUser();
    }

    //Khi redux cập nhập lại props
    componentDidUpdate(prevProps, prevState, snapshot) {
        //Ta set lại state mặc định
        let arrGenders = this.props.genders;
        let arrPositions = this.props.positions;
        let arrRoles = this.props.roles;

        if (prevProps.genders !== this.props.genders) {
            this.setState({
                gender:
                    arrGenders && arrGenders.length > 0
                        ? arrGenders[0].keyMap
                        : "",
            });
        }

        if (prevProps.positions !== this.props.positions) {
            this.setState({
                position:
                    arrPositions && arrPositions.length > 0
                        ? arrPositions[0].keyMap
                        : "",
            });
        }

        if (prevProps.roles !== this.props.roles) {
            this.setState({
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
            });
        }

        //reset lại form mặc định cho các thẻ select
        if (prevProps.users !== this.props.users) {
            this.setState({
                email: "",
                passWord: "",
                firstName: "",
                lastName: "",
                phoneNumber: "",
                address: "",
                avatar: "",
                gender:
                    arrGenders && arrGenders.length > 0
                        ? arrGenders[0].keyMap
                        : "",
                position:
                    arrPositions && arrPositions.length > 0
                        ? arrPositions[0].keyMap
                        : "",
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
                previewImgUrl: "",
                action: CRUD_ACTIONS.CREATE,
            });
        }
    }

    getAllUser = () => {
        this.props.getAllUser("ALL");
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

    openPreviewImg = () => {
        if (!this.state.previewImgUrl) return;
        //Chưa có ảnh click sẽ ko cho setState để mở preview full màn hình

        this.setState({
            isOpen: true,
        });
    };

    handleOnchangeInput = (e) => {
        let { name, value } = e.target;

        let copyState = { ...this.state };

        copyState[name] = value;

        this.setState({
            ...copyState,
        });
    };

    handleSaveUser = async () => {
        let {
            id,
            email,
            passWord,
            firstName,
            lastName,
            phoneNumber,
            address,
            gender,
            position,
            role,
            avatar,
            action,
        } = this.state;

        let data = {
            id: id,
            email: email,
            passWord: passWord,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            address: address,
            gender: gender,
            roleId: role,
            positionId: position,
            avatar: avatar,
        };

        let isValid = this.checkValidateInput();

        //Check trạng thái của nút là create hay là edit
        if (action === CRUD_ACTIONS.CREATE) {
            if (isValid === false) {
                return;
            } else {
                if (!validateEmail(email)) {
                    toast.warning("Email không đúng định dạng!");
                    return;
                }
                if (!validatePhone(phoneNumber)) {
                    toast.warn("Số điện thoại không hợp lệ!");
                    return;
                }
                if (passWord.length < 6) {
                    toast.warn("Mật khẩu phải chứa ít nhất 6 kí tự!");
                    return;
                }

                //Thỏa mãn dispatch action create user lên reducer
                let res = await this.props.createNewUser(data); //gửi data để gọi api
                if (res && res.errCode === 0) {
                    toast.success("Thêm mới thành công người dùng!");
                    this.getAllUser();
                } else {
                    toast.error(res.errMessage);
                }
            }
        }

        if (action === CRUD_ACTIONS.EDIT) {
            if (isValid === false) {
                return;
            }
            if (!validatePhone(phoneNumber)) {
                toast.warn("Số điện thoại không hợp lệ!");
                return;
            }
            if (passWord.length <= 6) {
                toast.warn("Mật khẩu phải chứa it nhất 6 kí tự!");
                return;
            }
            //dispatch action edit user lên reducer
            await this.props.editUser(data);
        }
    };

    checkValidateInput = () => {
        let arrCheck = [
            "email",
            "passWord",
            "firstName",
            "lastName",
            "phoneNumber",
            "address",
        ];
        let isValid = true;

        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                toast.warning(`${toUpper(arrCheck[i])} không được để trống `);
                break;
            }
        }

        return isValid;
    };

    handleDeleteUser = async (id) => {
        let res = await this.props.deleteUser(id);
        if (res && res.errCode === 0) {
            toast.success("Xóa thành công!");
            this.getAllUser();
        } else {
            toast.warning("Xóa thất bại!");
        }
    };

    handleEditUser = (user) => {
        // console.log("check edit user from parent: ", user);
        let imageBase64 = "";

        if (user.image) {
            //decode từ base64 sang binary
            imageBase64 = new Buffer(user.image, "base64").toString("binary");
        }

        this.setState({
            id: user.id,
            email: user.email,
            passWord: "HARDCODE",
            firstName: user.firstName ? user.firstName : "",
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            avatar: "",
            gender: user.gender,
            position: user.positionId ? user.positionId : "",
            role: user.roleId,
            previewImgUrl: imageBase64,
            action: CRUD_ACTIONS.EDIT, //chỉnh lại action là edit
        });
    };

    render() {
        let { language, genders, roles, positions, users } = this.props;

        let {
            email,
            passWord,
            firstName,
            lastName,
            phoneNumber,
            address,
            gender,
            position,
            role,
            avatar,
            action,
        } = this.state;

        return (
            <div className="user-redux-container">
                <div className="manage-user-title">
                    <FormattedMessage id={"manage-user.title"} />
                </div>
                <div className="user-reudx-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 my-3">
                                <FormattedMessage id={"manage-user.add"} />
                            </div>

                            <div className="col-lg-3 col-sm-12">
                                <label>
                                    <FormattedMessage
                                        id={"manage-user.email"}
                                    />
                                </label>
                                <input
                                    className="form-control"
                                    type="email"
                                    name="email"
                                    value={email}
                                    disabled={
                                        action === CRUD_ACTIONS.EDIT
                                            ? true
                                            : false
                                    }
                                    onChange={(e) =>
                                        this.handleOnchangeInput(e)
                                    }
                                />
                            </div>
                            <div className="col-lg-3 col-sm-12">
                                <label>
                                    <FormattedMessage
                                        id={"manage-user.passWord"}
                                    />
                                </label>
                                <input
                                    className="form-control"
                                    type="password"
                                    autoComplete="off"
                                    name="passWord"
                                    value={passWord}
                                    disabled={
                                        action === CRUD_ACTIONS.EDIT
                                            ? true
                                            : false
                                    }
                                    onChange={(e) =>
                                        this.handleOnchangeInput(e)
                                    }
                                />
                            </div>
                            <div className="col-lg-3 col-sm-12">
                                <label>
                                    <FormattedMessage
                                        id={"manage-user.firstName"}
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
                            <div className="col-lg-3 col-sm-12">
                                <label>
                                    <FormattedMessage
                                        id={"manage-user.lastName"}
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
                            <div className="col-lg-3 col-sm-12">
                                <label>
                                    <FormattedMessage
                                        id={"manage-user.phoneNumber"}
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
                            <div className="col-lg-9 col-sm-12">
                                <label>
                                    <FormattedMessage
                                        id={"manage-user.address"}
                                    />
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="address"
                                    value={address}
                                    onChange={(e) =>
                                        this.handleOnchangeInput(e)
                                    }
                                />
                            </div>
                            <div className="col-lg-3 col-sm-12">
                                <label htmlFor="inputGender">
                                    <FormattedMessage
                                        id={"manage-user.gender"}
                                    />
                                </label>
                                <select
                                    className="form-control"
                                    id="inputGender"
                                    name="gender"
                                    value={gender}
                                    onChange={(e) =>
                                        this.handleOnchangeInput(e)
                                    }
                                >
                                    {genders &&
                                        genders.length > 0 &&
                                        genders.map((item, index) => {
                                            return (
                                                <option
                                                    key={item.id}
                                                    value={item.keyMap}
                                                >
                                                    {language === LANGUAGE.VI
                                                        ? item.valueVi
                                                        : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="col-lg-3 col-sm-12">
                                <label htmlFor="inputPosition">
                                    <FormattedMessage
                                        id={"manage-user.position"}
                                    />
                                </label>
                                <select
                                    className="form-control"
                                    id="inputPosition"
                                    name="position"
                                    onChange={(e) =>
                                        this.handleOnchangeInput(e)
                                    }
                                    value={position}
                                >
                                    {positions &&
                                        positions.length > 0 &&
                                        positions.map((item, index) => {
                                            return (
                                                <option
                                                    key={item.id}
                                                    value={item.keyMap}
                                                >
                                                    {language === LANGUAGE.VI
                                                        ? item.valueVi
                                                        : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="col-lg-3 col-sm-12">
                                <label htmlFor="inputRole">
                                    <FormattedMessage id={"manage-user.role"} />
                                </label>
                                <select
                                    className="form-control"
                                    id="inputRole"
                                    name="role"
                                    value={role}
                                    onChange={(e) =>
                                        this.handleOnchangeInput(e)
                                    }
                                >
                                    {roles &&
                                        roles.length > 0 &&
                                        roles.map((item) => {
                                            return (
                                                <option
                                                    key={item.id}
                                                    value={item.keyMap}
                                                >
                                                    {language === LANGUAGE.VI
                                                        ? item.valueVi
                                                        : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="col-lg-3 col-sm-12">
                                <label htmlFor="inputImg">
                                    <FormattedMessage id={"manage-user.img"} />
                                </label>
                                <div className="preview-img-container">
                                    <input
                                        id="preview-img"
                                        type="file"
                                        hidden
                                        onChange={(event) => {
                                            this.handleOnchangeImage(event);
                                        }}
                                    />
                                    <label
                                        htmlFor="preview-img"
                                        className="lable-upload"
                                    >
                                        Tải ảnh
                                        <i className="fas fa-upload"></i>
                                    </label>
                                    <div
                                        className="preview-image"
                                        style={{
                                            backgroundImage: `url(${this.state.previewImgUrl})`,
                                        }}
                                        onClick={() => {
                                            this.openPreviewImg();
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <button
                                    className={
                                        action === CRUD_ACTIONS.EDIT
                                            ? "btn btn-warning text-light"
                                            : "btn btn-primary"
                                    }
                                    onClick={() => this.handleSaveUser()}
                                >
                                    {action === CRUD_ACTIONS.EDIT ? (
                                        <FormattedMessage
                                            id={"manage-user.edit"}
                                        />
                                    ) : (
                                        <FormattedMessage
                                            id={"manage-user.save"}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <TableManageUser
                        data={users}
                        language={language}
                        deleteUser={this.handleDeleteUser}
                        handleEditUserFromParent={this.handleEditUser}
                        action={action}
                    />
                </div>

                {/**Xử lý mở to người dùng click preview Image sẽ được phóng to */}
                {this.state.isOpen && (
                    <Lightbox
                        mainSrc={this.state.previewImgUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.appReducer.language,
        genders: state.adminReducer.genders,
        isLoadingGender: state.adminReducer.isLoadingGender,
        positions: state.adminReducer.positions,
        roles: state.adminReducer.roles,
        users: state.adminReducer.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => {
            return dispatch(actions.fecthGenderStart());
        },
        getPositionStart: () => {
            return dispatch(actions.fecthPositionStart());
        },
        getRoleStart: () => {
            return dispatch(actions.fecthRoleStart());
        },
        createNewUser: (data) => {
            return dispatch(actions.createNewUserAction(data));
        },
        getAllUser: (data) => {
            return dispatch(actions.getAllUserAction(data));
        },
        deleteUser: (id) => {
            return dispatch(actions.deleteUserAction(id));
        },
        editUser: (data) => {
            return dispatch(actions.editUserAction(data));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserReduxManage);
