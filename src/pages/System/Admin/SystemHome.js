import React, { Component } from "react";
import { UserOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospital, faUserDoctor } from "@fortawesome/free-solid-svg-icons";
import { Space } from "antd";
import { FormattedMessage } from "react-intl";
import { Helmet } from "react-helmet";

import "./SystemHome.scss";
import DashboardCard from "../../../components/System/DashboardCard";
import DashboardBanner from "../../../components/System/DashboardBanner";
import DashboardChart from "../../../components/System/DashboardChart";
import {
    countStatsForAdminService,
    getBookingCountsByMonthService,
    getClinicMonthlyBookingStatsService,
    fetchDashboardData,
} from "../../../services";
import { connect } from "react-redux";
import { LANGUAGE } from "../../../utils/constants";
import DoughnutChart from "../../../components/System/DoughnutChart";

class SystemHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartBooking: null,
            chartClinicBooking: null,
            userCountStats: 0,
            doctorCountStats: 0,
            specialtyCountStats: 0,
            authorized: false,
            totalBooking: 0,
            totalCancleBooking: 0,
        };
    }

    async componentDidMount() {
        const { language, token } = this.props;
        let authorizeUser = await this.authorizeUser(token);

        if (authorizeUser && authorizeUser.errCode === 0) {
            let res = await getBookingCountsByMonthService();
            let resClinicBooking = await getClinicMonthlyBookingStatsService();
            let resCountStats = await countStatsForAdminService();

            if (res && res.errCode === 0) {
                if (res && res.data && res.data.length > 0) {
                    // Xử lý dữ liệu để đưa vào biểu đồ
                    let labels = res.data.map((entry) => entry.month);
                    let counts = res.data.map((entry) => entry.counts);
                    let countsCancle = res.data.map(
                        (entry) => entry.countsCancle
                    );

                    this.setState({
                        totalBooking: counts,
                        totalCancleBooking: countsCancle,
                    });

                    const data = {
                        labels: labels,
                        datasets: [
                            {
                                label: `${language === LANGUAGE.VI
                                    ? "Lịch hủy"
                                    : "Cancellation schedule"
                                    }`,
                                data: countsCancle,
                                backgroundColor: "rgba(255, 99, 132, 0.5)",
                                hoverBackgroundColor: "rgba(255, 99, 132, 1)",
                            },
                            {
                                label: `${language === LANGUAGE.VI
                                    ? "Lịch đặt"
                                    : "Appointment number"
                                    }`,
                                data: counts,
                                backgroundColor: "rgba(53, 162, 235, 0.5)",
                                hoverBackgroundColor: "rgba(53, 162, 235, 1)",
                            },
                        ],
                    };

                    this.setState({
                        chartBooking: data,
                    });
                }
            }

            if (resClinicBooking && resClinicBooking.errCode === 0) {
                let labels = resClinicBooking.data.map((item) => {
                    return this.props.language === LANGUAGE.VI
                        ? item.nameVi
                        : item.nameEn;
                });
                let countsBooking = this.builData(resClinicBooking.data);
                const data = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Lịch đặt",
                            data: countsBooking,
                            backgroundColor: "rgba(53, 162, 235, 0.5)",
                        },
                    ],
                };
                this.setState({
                    chartClinicBooking: data,
                });
            }

            if (resCountStats && resCountStats.errCode === 0) {
                this.setState({
                    userCountStats: resCountStats.data.userCountStats,
                    doctorCountStats: resCountStats.data.doctorCountStats,
                    specialtyCountStats: resCountStats.data.specialtyCountStats,
                });
            }
        }
    }

    async componentDidUpdate(prevProps) {
        const { language } = this.props;
        if (prevProps.language !== this.props.language) {
            let res = await getBookingCountsByMonthService();
            let resClinicBooking = await getClinicMonthlyBookingStatsService();

            if (res && res.errCode === 0) {
                if (res && res.data && res.data.length > 0) {
                    // Xử lý dữ liệu để đưa vào biểu đồ
                    let labels = res.data.map((entry) => entry.month);
                    let counts = res.data.map((entry) => entry.counts);
                    let countsCancle = res.data.map(
                        (entry) => entry.countsCancle
                    );

                    this.setState({
                        totalBooking: counts,
                        totalCancleBooking: countsCancle,
                    });

                    const data = {
                        labels: labels,
                        datasets: [
                            {
                                label: `${language === LANGUAGE.VI
                                    ? "Lịch hủy"
                                    : "Cancellation schedule"
                                    }`,
                                data: countsCancle,
                                backgroundColor: "rgba(255, 99, 132, 0.5)",
                                hoverBackgroundColor: "rgba(255, 99, 132, 1)",
                            },
                            {
                                label: `${language === LANGUAGE.VI
                                    ? "Lịch đặt"
                                    : "Appointment"
                                    }`,
                                data: counts,
                                backgroundColor: "rgba(53, 162, 235, 0.5)",
                                hoverBackgroundColor: "rgba(53, 162, 235, 1)",
                            },
                        ],
                    };

                    this.setState({
                        chartBooking: data,
                    });
                }
            }

            if (resClinicBooking && resClinicBooking.errCode === 0) {
                let labels = resClinicBooking.data.map((item) => {
                    return this.props.language === LANGUAGE.VI
                        ? item.nameVi
                        : item.nameEn;
                });
                let countsBooking = this.builData(resClinicBooking.data);
                const data = {
                    labels: labels,
                    datasets: [
                        {
                            label: `${language === LANGUAGE.VI
                                ? "Lịch đặt"
                                : "Appointment"
                                }`,
                            data: countsBooking,
                            backgroundColor: "rgba(53, 162, 235, 0.5)",
                        },
                    ],
                };
                this.setState({
                    chartClinicBooking: data,
                });
            }
        }
    }

    authorizeUser = async (token) => {
        try {
            let res = await fetchDashboardData(token);
            // Xử lý dữ liệu nếu cần
            this.setState({
                authorized: true,
            });
            return res;
        } catch (error) {
            if (error.response && error.response.status === 403) {
                // Xử lý lỗi 403 ở đây
                console.log(
                    "Access forbidden. You are not authorized to view this page."
                );
                // Redirect hoặc thực hiện hành động khác tương ứng với lỗi 403
                this.props.history.push("/home");
            } else {
                // Xử lý các lỗi khác
                console.error("Error:", error);
            }
        }
    };

    builData = (inputData) => {
        let counts = inputData.map((entry) => entry.quantity);
        return counts;
    };

    render() {
        const { language } = this.props;
        const {
            userCountStats,
            doctorCountStats,
            specialtyCountStats,
            authorized,
            totalBooking,
            totalCancleBooking,
        } = this.state;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1 để lấy tháng thực tế

        return (
            <>
                <Helmet>
                    <title>{`Dasnhboard`}</title>
                    <meta name="description" content={`Dasnhboard`} />
                </Helmet>
                {authorized && (
                    <div className="admin-home">
                        <div className="admin-home_title">
                            {/* <h1>
                                <FormattedMessage
                                    id={"admin.dashboard.title"}
                                />
                            </h1> */}
                            <DashboardBanner />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                // justifyContent: "space-between",
                                marginTop: "40px",
                                gap: "20px",
                                flexWrap: "wrap",
                            }}
                        >
                            <DashboardCard
                                icon={
                                    <UserOutlined
                                        style={{
                                            fontSize: "20px",
                                            color: "green",
                                            backgroundColor:
                                                "rgba(0, 255, 0, 0.25)",
                                            borderRadius: "50%",
                                            padding: "8px",
                                        }}
                                    />
                                }
                                title={
                                    language === LANGUAGE.EN
                                        ? "User"
                                        : "Người dùng"
                                }
                                value={userCountStats}
                            />
                            <DashboardCard
                                icon={
                                    <FontAwesomeIcon
                                        icon={faHospital}
                                        style={{
                                            fontSize: "20px",
                                            color: "rgba(22, 119, 255, 0.75)",
                                            backgroundColor:
                                                "rgba(22, 119, 255, 0.25)",
                                            borderRadius: "50%",
                                            padding: "8px",
                                        }}
                                    />
                                }
                                title={
                                    language === LANGUAGE.EN
                                        ? "Specialties"
                                        : "Chuyên Khoa"
                                }
                                value={specialtyCountStats}
                            />
                            <DashboardCard
                                icon={
                                    <FontAwesomeIcon
                                        icon={faUserDoctor}
                                        style={{
                                            fontSize: "20px",
                                            color: "red",
                                            backgroundColor:
                                                "rgba(255, 0, 0, 0.25)",
                                            borderRadius: "50%",
                                            padding: "8px",
                                        }}
                                    />
                                }
                                title={
                                    language === LANGUAGE.EN
                                        ? "Doctor"
                                        : "Bác sĩ"
                                }
                                value={doctorCountStats}
                            />
                        </div>

                        <div className="admin-home_chart">
                            <div className="row">
                                <div className="col-8">
                                    <DashboardChart
                                        chartData={this.state.chartBooking}
                                        titleChart={
                                            language === LANGUAGE.VI
                                                ? "Số liệu thống kê đặt lịch"
                                                : "Scheduling statistics by month"
                                        }
                                    />
                                </div>
                                <div className="col-4 mt-7">
                                    <DoughnutChart
                                        totalBooking={totalBooking}
                                        totalCancleBooking={totalCancleBooking}
                                    />
                                </div>
                            </div>
                            {/* <DashboardChart
                                chartData={this.state.chartClinicBooking}
                                titleChart={
                                    language === LANGUAGE.VI
                                        ? `Số liệu thống kê phòng khám tháng ${currentMonth}`
                                        : `Monthly clinic scheduling statistics ${currentMonth}`
                                }
                            /> */}
                        </div>
                    </div>
                )}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.appReducer.language,
        token: state.user.token,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemHome);
