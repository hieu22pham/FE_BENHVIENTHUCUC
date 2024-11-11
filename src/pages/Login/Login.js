import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Helmet } from "react-helmet";

import "./Login.scss";
import { handleLoginApi, handleLoginApi2 } from "../../services/userService";
import * as actions from "../../redux/actions";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import configs from "../../configs";
import HeaderBack from "../../components/HeaderBack";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            passWord: "",
            isShowPassWord: false,
            errMessage: "",
        };
    }

    handleChange = (e) => {
        const { value, name } = e.target;
        this.setState(
            {
                [name]: value,
            },
            () => {
                // console.log(this.state);
            }
        );
    };

    handleKeyDown = (e) => {
        // console.log("check key down: ", e);
        if (e.key === "Enter" || e.keyCode === 13) {
            this.handleLogin(e);
        }
    };

    handleLogin = async (e) => {
        //clearn hết đi
        this.setState({
            errMessage: ``,
        });
        //e.preventDefault(); SỬA NHẤt

        try {
            let res = await handleLoginApi(
                this.state.userName,
                this.state.passWord
            );
            if (res && res.errCode !== 0) {
                //Lấy kết quả trả về
                this.setState({
                    errMessage: res.message,
                });
            }
            if (res && res.errCode === 0) {
                //login thành công
                // console.log("Login success");

                this.props.userLoginSuccess(res.user); //vứt lên reducer để quản lý
                // this.props.history.replace("/"); //điều hướng sang trang home
            }
        } catch (error) {
            if (error) {
                // console.log(error.response); //la 1 thuoc tinh cua axios khi gap loi
                this.setState({
                    errMessage: error.response.data.message,
                });
            }
        }
    };

    handleLogin2 = async (e) => {
        this.setState({
            errMessage: ``,
        });
        //e.preventDefault(); ĐÂY NHẤT

        try {
            //this.props.isShowLoading(true); // ĐÂY NHẤT
            let res = await handleLoginApi2(
                this.state.userName,
                this.state.passWord
            );
            if (res && res.errCode !== 0) {
                this.props.isShowLoading(false);
                //Lấy kết quả trả về
                this.setState({
                    errMessage: res.errMessage,
                });
            }

            if (res && res.errCode === 0) {
                this.props.isShowLoading(false);
                this.props.userLoginSuccess2(res.token);
            }
        } catch (error) {
            if (error) {
                this.setState({
                    errMessage: error.response.data.message,
                });
            }
        }
    };

    handleShowHidePassword = () => {
        //true thì để là text và cho hiện icon con mắt bị gạch
        this.setState({
            isShowPassWord: !this.state.isShowPassWord,
        });
    };

    render() {
        // console.log(`login: ${this.props.isLoggedIn}`);
        //JSX
        return (
            <>
                <Helmet>
                    <title>{`Trang đăng nhập`}</title>
                    <meta name="description" content={`Trang đăng nhập`} />
                </Helmet>
                <HeaderBack />
                <div className="login-background d-flex">
                    <div className="login-container col-6">
                        <div className="login-content row">
                            <div className="Logo mb-5">
                                <img
                                    src={require("../../assets/background/logo_remove1.png")}
                                    alt="ThuCucTCI"
                                />
                            </div>
                            <div className="col-12 text-login"></div>
                            <div className="col-12 form-group">
                                <label>
                                    <FormattedMessage
                                        id={"patient.login.userName"}
                                    />
                                </label>
                                <input
                                    type="text"
                                    className="form-control login-input"
                                    placeholder="Enter your usename"
                                    name="userName"
                                    value={this.state.userName}
                                    onChange={(e) => {
                                        this.handleChange(e);
                                    }}
                                />
                            </div>
                            <div className="col-12 form-group login-input">
                                <label>
                                    <FormattedMessage
                                        id={"patient.login.passWord"}
                                    />
                                </label>
                                <div className="custom-input-password">
                                    <input
                                        type={
                                            this.state.isShowPassWord
                                                ? "text"
                                                : "password"
                                        }
                                        className="form-control"
                                        placeholder="Enter your password"
                                        name="passWord"
                                        value={this.state.passWord}
                                        onChange={(e) => {
                                            this.handleChange(e);
                                        }}
                                        onKeyDown={(e) => {
                                            this.handleKeyDown(e);
                                        }}
                                        autoComplete="off"
                                    />
                                    <span
                                        onClick={() => {
                                            this.handleShowHidePassword();
                                        }}
                                    >
                                        {this.state.isShowPassWord ? (
                                            <i className="far fa-eye-slash"></i>
                                        ) : (
                                            <i className="far fa-eye"></i>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="col-12" style={{ color: "red" }}>
                                {this.state.errMessage}
                            </div>
                            <div className="col-12">
                                <button
                                    className="btn-login"
                                    onClick={() => {
                                        this.handleLogin2();
                                    }}
                                >
                                    <FormattedMessage
                                        id={"patient.login.login"}
                                    />
                                </button>
                            </div>
                            <div className="col-12 forgot-password">
                                <Link to={configs.routes.REGISTER}>
                                    <FormattedMessage
                                        id={"patient.login.register"}
                                    />
                                </Link>
                            </div>
                            <div className="col-12">
                                <span className="forgot-password">
                                    <FormattedMessage
                                        id={"patient.login.forgot"}
                                    />
                                </span>
                            </div>
                            <div className="col-12 text-center mt-3">
                                <span className="text-other-login ">
                                    <FormattedMessage
                                        id={"patient.login.other-app"}
                                    />
                                </span>
                            </div>
                            <div className="col-12 social-login">
                                <i className="fab fa-google-plus-g google"></i>
                                <i className="fab fa-facebook-f facebook"></i>
                            </div>
                        </div>
                    </div>
                    <div className="login-bg_img col-6">
                        <div className="style_shape__1HA08"></div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        isShowLoading: (isLoading) => {
            return dispatch(actions.isLoadingAction(isLoading));
        },
        userLoginSuccess: (userInfo) =>
            dispatch(actions.userLoginSuccess(userInfo)),
        userLoginSuccess2: (token) => {
            return dispatch(actions.userLoginSuccess2(token));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
