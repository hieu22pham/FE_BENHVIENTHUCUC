import React, { useState, useEffect } from "react";
import { Table, Space, Input, Select, Modal } from "antd";
import { LANGUAGE } from "../../../utils";
import moment from "moment";
import axios from "axios";
import { useHistory, withRouter } from "react-router-dom";

const TableMangeConfirmSchedule = () => {
    const [nameFilter, setNameFilter] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [dataPatients, setDataPatients] = useState([]);
    const [editingKey, setEditingKey] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [idUser, setIdUser] = useState("");
    const [localDate, setLocalDate] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentPatient, setCurrentPatient] = useState(null); // Lưu thông tin bệnh nhân hiện tại
    const [modalActionType, setModalActionType] = useState("");
    const history = useHistory();
    const [fullNameUser, setFullNameUser] = useState(""); // Lưu tên bác sĩ/ người dùng

    useEffect(() => {
        const userId = localStorage.getItem("idUser");
        const userFullName = localStorage.getItem("fullNameUser"); // Lấy tên người dùng từ localStorage
        if (userId) setIdUser(userId);
        if (userFullName) setFullNameUser(userFullName); // Lưu vào state
        fetchPatients();
    }, [localDate]);


    useEffect(() => {
        setLocalDate(localStorage.getItem("dataTime"));
    }, [localStorage.getItem("dataTime")]);

    useEffect(() => {
        const userId = localStorage.getItem("idUser");
        if (userId) setIdUser(userId);
        
        fetchPatients();
    }, [localDate]);

    const fetchPatients = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/get-list-patient-for-doctor-admin?doctorId=${idUser}&date=${localDate}`
            );

            console.log("response: ", response)

            if (response.data.data) setDataPatients(response.data.data);
        } catch (error) {
            console.error("Error fetching doctor schedules:", error);
        }
    };

    const handleFilter = () => {
        const filtered = dataPatients.filter((patient) =>
            `${patient.patientData.lastName} ${patient.patientData.firstName}`.toLowerCase().includes(nameFilter.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const showModal = (patient, actionType) => {
        setCurrentPatient(patient); // Lưu thông tin bệnh nhân hiện tại
        setModalActionType(actionType);
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        setIsModalVisible(false);

        if (modalActionType === "confirm") {
            await confirmBooking(currentPatient);
        } else if (modalActionType === "cancel") {
            await cancelBooking(currentPatient);
        }

        fetchPatients();
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setCurrentPatient(null);
        setModalActionType("");
    };

    const confirmBooking = async (patient) => {
        try {
            const payload = {
                ...patient,
                fullNameUser, // Thêm tên bác sĩ/người dùng
            };
            const response = await axios.post(`http://localhost:8080/api/confirm-schedule`, payload );
            if (response.status === 200) {
                alert("Xác nhận lịch hẹn thành công!");
            } else {
                alert("Xác nhận lịch hẹn thất bại!");
            }
        } catch (error) {
            console.error("Error confirming booking:", error);
            alert("Đã xảy ra lỗi, vui lòng thử lại sau!");
        }
    };

    const cancelBooking = async (patient) => {
        console.log("patient: ", patient)
        // const isConfirmed = window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?");
    // if (!isConfirmed) return;

    try {
        const payload = {
            ...patient,
            fullNameUser, // Thêm tên bác sĩ/người dùng
        };
        const res = await axios.post(`http://localhost:8080/api/cancel-schedule`, payload);
        const response = await axios.put(
            `http://localhost:8080/api/cancle-booking/${patient.key}`
        );

        if (response.status === 200 && res.status === 200) {
            alert("Hủy lịch hẹn thành công!");
            fetchPatients(); // Làm mới danh sách sau khi hủy
        } else {
            alert("Hủy lịch hẹn thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi hủy lịch hẹn:", error);
        alert("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
    };

    const dataSource = (dataPatients).map((item) => ({
        key: item.id,
        bookingId: item.id,
        statusId: item.statusId,
        doctorId: item.doctorId,
        patientId: item.patientId,
        email: item.patientData.email,
        fullName:`${item.patientData?.lastName || ""} ${item.patientData?.firstName || ""}` ,
        address: item.patientData.address,
        phoneNumber: item.patientData.phoneNumber,
        birthday: moment.unix(+item.patientData.birthday / 1000).format("DD/MM/YYYY"),
        genderValueVi: item.patientData.genderData.valueVi,
        genderValueEn: item.patientData.genderData.valueEn,
        timeTypeValueVi: item.timeTypeDataPatient.valueVi,
        timeTypeValueEn: item.timeTypeDataPatient.valueEn,
        reason: item.reason,
        date: item.date,
        timeType: item.timeType,
        status: item.status,
    }));

    const columns = [
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "Ngày sinh",
            dataIndex: "birthday",
            key: "birthday",
        },
        {
            title: "Giới tính",
            dataIndex: "genderValueVi",
            key: "gender",
        },
        {
            title: "Thời gian khám",
            dataIndex: LANGUAGE.EN ? "timeTypeValueEn" : "timeTypeValueVi",
            key: "timeType",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <button
                        className="btn btn-primary"
                        onClick={() => showModal(record, "confirm")}
                    >
                        Xác nhận
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => showModal(record, "cancel")}
                    >
                        Hủy
                    </button>
                </Space>
            ),
        },
    ];

    return (
        <div className="mt-5">
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered
                title={() => <h3>Danh sách bệnh nhân</h3>}
            />
            <Modal
                title={modalActionType === "confirm" ? "Xác nhận lịch hẹn" : "Hủy lịch hẹn"}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                cancelText="Hủy bỏ"
                okText="Đồng ý"
            >
                <p>
                    {modalActionType === "confirm"
                        ? "Bạn có chắc chắn muốn xác nhận lịch hẹn này?"
                        : "Bạn có chắc chắn muốn hủy lịch hẹn này?"}
                </p>
            </Modal>
        </div>
    );
};

export default withRouter(TableMangeConfirmSchedule);
