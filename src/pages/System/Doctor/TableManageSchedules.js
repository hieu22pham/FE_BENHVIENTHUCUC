import React, { useState, useEffect } from "react";
import { Table, Space, DatePicker, message, Button } from "antd";
import { LANGUAGE } from "../../../utils";
import moment from "moment";
import { connect } from "react-redux";
import axios from "axios";

const TableManageSchedules = ({ language }) => {
    const [dataSchedules, setDataSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]); // Trạng thái theo dõi các ô được chọn
    const [localDate, setLocalDate] = useState(""); // Theo dõi localStorage
    const [dataSource, setdataSource] = useState("");
    const [clickCount, setClickCount] = useState("")

    // Fetch schedules based on selected date
    useEffect(() => {
        setLocalDate(localStorage.getItem("dataTime"));
    }, [localStorage.getItem("dataTime")]);

    useEffect(() => {
        setClickCount(localStorage.getItem("clickCount"));
    }, [localStorage.getItem("clickCount")]);

    // Fetch schedules based on selected date or localStorage change
    const fetchSchedules = async () => {
        setLoading(true);
        const timestamp = moment(selectedDate || new Date()).startOf("day").valueOf();
        var userId = localStorage.getItem("IdSelectedDoctor");

        if (!userId) {
            userId = localStorage.getItem("idUser");
        }

        console.log("localDate: ", localDate)
        console.log("localDate: ", timestamp)
        console.log("localDate: ", clickCount)

        try {
            const response = await axios.get(
                `http://localhost:8080/api/get-schedule-doctor-by-date?doctorId=${userId}&date=${localDate}`
            );

            console.log("response: ", response)

            if (response.data.errCode === 0) {
                setDataSchedules(response.data.data);

                setSelectedKeys([]);
            }
        } catch (error) {
            console.error("Error fetching schedules:", error);
            message.error(language === LANGUAGE.EN ? "Error fetching schedules." : "Lỗi khi lấy dữ liệu lịch trình.");
        } finally {
            setLoading(false);
        }
    };

    // Gọi lại API khi `selectedDate` hoặc `localDate` thay đổi
    useEffect(() => {
        fetchSchedules();
    }, [localDate, clickCount]);

    // Prepare data for table display
    useEffect(() => {
        const dataSources = dataSchedules.map((item) => ({
            key: item.id,
            maxNumber: item.maxNumber || 10,
            timeEn: item.timeData?.valueEn || "N/A",
            timeVi: item.timeData?.valueVi || "N/A",
            createdAt: item.createdAt
                ? moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
                : "N/A",
        }));
        console.log("Processed dataSource: ", dataSources);
        setdataSource(dataSources);
    }, [dataSchedules]);

    const handleDelete = async (id) => {


        const confirmDelete = window.confirm(
            language === LANGUAGE.EN ? "Are you sure you want to delete this schedule?" : "Bạn có chắc chắn muốn xóa lịch trình này?"
        );
        if (!confirmDelete) return;

        try {
            console.log(id)
            const response = await axios.delete(`http://localhost:8080/api/delete-schedule/${id}`);
            console.log(response)
            if (response.status === 200) {
                message.success(language === LANGUAGE.EN ? "Schedule deleted!" : "Lịch trình đã được xóa!");
                fetchSchedules(); // Refresh schedules
            } else {
                message.error(language === LANGUAGE.EN ? "Failed to delete schedule." : "Xóa lịch trình thất bại.");
            }
        } catch (error) {
            console.error("Error deleting schedule:", error);
            message.error(language === LANGUAGE.EN ? "An error occurred while deleting the schedule." : "Đã xảy ra lỗi khi xóa lịch trình.");
        }
    };

    // Define table columns
    const columns = [
        {
            title: language === LANGUAGE.EN ? "Time" : "Khung giờ",
            key: "time",
            render: (_, record) => (
                <span>{language === LANGUAGE.EN ? record.timeEn : record.timeVi}</span>
            ),
        },
        {
            title: language === LANGUAGE.EN ? "Max number" : "Số lượng tối đa",
            key: "maxNumber",
            dataIndex: "maxNumber",
        },
        {
            title: language === LANGUAGE.EN ? "Created At" : "Ngày tạo",
            key: "createdAt",
            dataIndex: "createdAt",
        },
        {
            title: language === LANGUAGE.EN ? "Action" : "Hành động",
            key: "action",
            render: (_, record) => (
                <Button
                    className="btn btn-danger"
                    type="danger"
                    onClick={() => handleDelete(record.key)}
                >
                    {language === LANGUAGE.EN ? "Delete" : "Xóa"}
                </Button>
            ),
        },

    ];

    // Handle date selection
    const handleDateChange = (date) => {
        setSelectedDate(moment(date).startOf("day").valueOf()); // Update selected date
        console.log("D: ", selectedDate)

        this.setState({
            selectedDate, // Cập nhật ngày đã chọn
            dataTime: null, // Reset dataTime khi chọn ngày mới
        });
    };

    // Toggle select/deselect action
    const handleToggleSelect = (key) => {
        setSelectedKeys((prevKeys) =>
            prevKeys.includes(key)
                ? prevKeys.filter((item) => item !== key) // Deselect
                : [...prevKeys, key] // Select
        );
    };

    // Submit action
    const handleSubmit = () => {
        // You can handle the selected items here
        console.log("Selected keys:", selectedKeys);

        // Reset selection after submit
        setSelectedKeys([]);
        message.success(language === LANGUAGE.EN ? "Submitted successfully!" : "Gửi thành công!");
    };

    return (
        <div className="mt-5">
            {/* Date Picker for selecting schedules */}
            {/* Table to display schedules */}
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered
                loading={loading} // Show loading spinner while fetching data
                title={() => (
                    <h3>
                        {language === LANGUAGE.EN ? "Schedule List" : "Danh sách kế hoạch"}
                    </h3>
                )}
                pagination={false} // Disable pagination if unnecessary
                style={{ marginTop: 20 }}
            />

            {/* Submit Button */}
            <Button
                type="primary"
                onClick={handleSubmit}
                style={{ marginTop: 20, display: "none" }}
                disabled={selectedKeys.length === 0} // Disable if no items selected
            >
                {language === LANGUAGE.EN ? "Submit" : "Gửi"}
            </Button>
        </div>
    );
};

// Map Redux state to props
const mapStateToProps = (state) => ({
    language: state.appReducer.language,
});

// Connect component to Redux store
export default connect(mapStateToProps)(TableManageSchedules);
