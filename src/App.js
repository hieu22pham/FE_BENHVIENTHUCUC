import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { connect } from "react-redux";
import * as actions from "./redux/actions";
import { ToastContainer } from "react-toastify";

import configs from "./configs";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import System from "./templates/AdminTemplates/System";
import { history } from "./redux/configStore";

import {
    userIsAuthenticated,
    userIsNotAuthenticated,
} from "./hoc/authentication";
import HomePage from "./pages/HomePage/HomePage";
import LoadingComponent from "./components/GlobalSetting/LoadingComponent";
import DetailDoctor from "./pages/HomePage/Doctor/DetailDoctor";
import Doctor from "./templates/AdminTemplates/Doctor";
import VerifyEmail from "./pages/HomePage/VerifyEmail";
import DetailSpecialty from "./pages/HomePage/Specialty/DetailSpecialty";
import DetailClinic from "./pages/HomePage/Clinic/DetailClinic";
import ListSpecialty from "./pages/HomePage/Specialty/ListSpecialty";
import ListDoctor from "./pages/HomePage/Doctor/ListDoctor";
import ListClinic from "./pages/HomePage/Clinic/ListClinic";
import HistoryBooking from "./pages/HomePage/Booking/HistoryBooking";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import Register from "./pages/Register/Register";
import Profile from "./pages/HomePage/Profile/Profile";

class App extends Component {
    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <LoadingComponent />
                <Router history={history}>
                    {/* {this.props.isLoggedIn && <Header />} */}
                    <div className="main-container">
                        <div className="content-container">
                            <Switch>
                                <Route
                                    path={configs.routes.HOME}
                                    exact
                                    component={Home}
                                />
                                <Route
                                    path={configs.routes.LOGIN}
                                    component={userIsNotAuthenticated(Login)}
                                    //Được phép truy cập trang Login khi isLogged=false (hoc),
                                    //nếu true thì chạy đến thẳng trang home để xủ lý chuyển trang
                                />
                                <Route
                                    path={configs.routes.REGISTER}
                                    component={userIsNotAuthenticated(Register)}
                                />

                                <Route
                                    path={configs.routes.SYSTEM}
                                    component={userIsAuthenticated(System)}
                                    //Được phép truy cập trang System khi isLogged=true(hoc)
                                    //nếu false chuyển sang trang login
                                />
                                <Route
                                    path={"/doctor"}
                                    component={userIsAuthenticated(Doctor)}
                                />

                                <Route
                                    path={configs.routes.HOMEPAGE}
                                    component={HomePage}
                                />
                                <Route
                                    path={configs.routes.DETAIL_DOCTOR}
                                    component={DetailDoctor}
                                />
                                <Route
                                    path={configs.routes.DETAIL_SPECIALTY}
                                    component={DetailSpecialty}
                                />
                                <Route
                                    path={configs.routes.DETAIL_CLINIC}
                                    component={DetailClinic}
                                />

                                <Route
                                    path={configs.routes.LIST_SPECIALTY}
                                    component={ListSpecialty}
                                />
                                <Route
                                    path={configs.routes.LIST_DOCTOR}
                                    component={ListDoctor}
                                />
                                <Route
                                    path={configs.routes.LIST_CLINIC}
                                    component={ListClinic}
                                />

                                <Route
                                    path={configs.routes.VERIFY_EMAIL_BOOKING}
                                    component={VerifyEmail}
                                />

                                <Route
                                    path={configs.routes.HISTORY_BOOKING}
                                    component={HistoryBooking}
                                />
                                <Route
                                    path={configs.routes.PROFILE}
                                    component={Profile}
                                />
                                <Route
                                    component={() => {
                                        return <Redirect to={"/home"} />;
                                    }}
                                />
                            </Switch>
                        </div>

                        <ToastContainer
                            position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="colored"
                        />
                    </div>
                </Router>
            </Fragment>
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
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
