import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getUserInforSystem } from "../../services";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            linkToRedirect: "",
        };
    }

    async componentDidMount() {
        const { token, isLoggedIn } = this.props;

        if (token) {
            const resUser = await getUserInforSystem(token);

            if (resUser && resUser.errCode === 0 && isLoggedIn) {
                let userInfor = resUser.userInfor;

                if (
                    userInfor.userType === "admin" ||
                    userInfor.userType === "doctor"
                ) {
                    this.props.history.push("/system/home");
                } else {
                    this.props.history.push("/home");
                }
            }
        } else {
            this.props.history.push("/home");
        }
    }

    render() {
        return <Redirect to={this.state.linkToRedirect} />;
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        token: state.user.token,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
