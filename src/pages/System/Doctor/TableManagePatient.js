import React, { useState, useEffect } from "react";
import { Table, Space, Input, Select } from "antd";
import { LANGUAGE } from "../../../utils";
import moment from "moment";
import axios from "axios";
import { useHistory, withRouter  } from "react-router-dom";

const TableManagePatient = () => {
    const [nameFilter, setNameFilter] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [dataPatients, setDataPatients] = useState([]);
    const [editingKey, setEditingKey] = useState(""); // Key đang được chỉnh sửa
    const [selectedStatus, setSelectedStatus] = useState(""); // Trạng thái được chọn
    const history = useHistory()
    const [idUser, setIdUser] = useState("");
    const [dateTime, setdateTime] = useState("");
    const [localDate, setLocalDate] = useState(); // Theo dõi localStorage
    
    useEffect(() => {
        setLocalDate(localStorage.getItem("dataTime"));
    }, [localStorage.getItem("dataTime")]);
    
    // Lấy danh sách bệnh nhân khi component được render
    useEffect(() => {
        const userId = localStorage.getItem("idUser");
        

        if (userId) {
            setIdUser(userId);

            console.log("uuu: ", userId)
        }
        fetchPatients();
    }, [localDate]);

    // Gọi API lấy danh sách bệnh nhân
    const fetchPatients = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/get-list-patient-for-doctor-admin-s5?doctorId=${idUser}&date=${localDate}`
            );
            console.log("ddd: ", localDate)

            console.log("RR: ", response)
            
            if(response.data.data)
                setDataPatients(response.data.data);

            console.log("R: ", response)
        } catch (error) {
            console.error("Error fetching doctor schedules:", error);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [localDate]);

    // Lọc danh sách theo tên
    const handleFilter = () => {
        const filtered = dataPatients.filter((patient) =>
            `${patient.patientData.lastName} ${patient.patientData.firstName} `.toLowerCase().includes(nameFilter.toLowerCase())
        );
        setFilteredData(filtered);
    };

    // Cập nhật trạng thái trong bộ nhớ
    const handleStatusChange = (value, patientId) => {
        setSelectedStatus(value);
        setDataPatients((prevData) =>
            prevData.map((patient) =>
                patient.patientId === patientId ? { ...patient, status: value } : patient
            )
        );
    };

    // Cập nhật trạng thái bằng API
    const handleSave = async (id) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn cập nhật trạng thái này?");
        if (isConfirmed) {
            try {
                const response = await fetch(`http://localhost:8080/api/update-booking-status/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ statusId: selectedStatus }), // Gửi trạng thái mới
                });

                if (response.ok) {
                    alert("Cập nhật trạng thái thành công!");
                    fetchPatients(); // Làm mới danh sách bệnh nhân sau khi cập nhật
                    setEditingKey(""); // Thoát chế độ sửa
                } else {
                    const errorData = await response.json();
                    alert(`Cập nhật trạng thái thất bại: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái:", error);
                alert("Đã xảy ra lỗi, vui lòng thử lại sau!");
            }
        }
    };

    // Kích hoạt chế độ chỉnh sửa
    const editStatus = (patientId) => {
        setEditingKey(patientId);
        setSelectedStatus(""); // Reset trạng thái khi bắt đầu chỉnh sửa
    };
    
    const handleMedicine = (record) => {
        console.log("record: ", record)
        localStorage.setItem("patientId", record.patientId)
        history.push("/doctor/medicine-form"); // Chuyển hướng sang trang "/"
    };

    const handleConfim = (record) => {
        localStorage.setItem("patientId", record.patientId)
        history.push("/doctor/examination-form");
      };

    // Chuẩn bị dữ liệu cho bảng
    const dataSource = (filteredData.length > 0 ? filteredData : dataPatients).map((item) => ({
        key: item.id,
        bookingId: item.id,
        statusId: item.statusId,
        doctorId: item.doctorId,
        patientId: item.patientId,
        email: item.patientData.email,
        fullName: `${item.patientData.lastName}`,
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
        status: item.status, // Trạng thái bệnh nhân
    }));

    // Cấu hình cột bảng
    const columns = [
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            key: "fullName",
            filterDropdown: () => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search name"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        onPressEnter={handleFilter}
                    />
                </div>
            ),
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
            title:"Giới tính",
            dataIndex:  "genderValueVi",
            key: "gender",
        },
        {
            title:  "Thời gian khám",
            dataIndex: LANGUAGE.EN ? "timeTypeValueEn" : "timeTypeValueVi",
            key: "timeType",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text, record) => {
                const isEditing = editingKey === record.patientId;

                return isEditing ? (
                    <Select
                        value={selectedStatus || record.statusId} // Hiển thị trạng thái đã chọn hoặc trạng thái hiện tại
                        onChange={(value) => handleStatusChange(value, record.patientId)} // Xử lý khi thay đổi
                        style={{ width: 150 }}
                    >
                        <Select.Option value="S1">Lịch hẹn mới</Select.Option>
                        <Select.Option value="S2">Đang chờ khám</Select.Option>
                        <Select.Option value="S3">Đã khám xong</Select.Option>
                        <Select.Option value="S4">Đã hủy</Select.Option>
                    </Select>
                ) : (
                    // Hiển thị trạng thái dạng text nếu không phải đang sửa
                    <span>
                        {(record.statusId === "S1" && "Lịch hẹn mới") ||
                            (record.statusId === "S2" && "Đang chờ khám") ||
                            (record.statusId === "S3" && "Đã khám xong") ||
                            (record.statusId === "S4" && "Đã hủy") ||
                            (record.statusId === "S5" && "Đang chờ khám") ||
                            "Chưa xác định"}
                    </span>
                );
            },
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <Space size="middle">
                <button
                  className="btn btn-primary"
                  onClick={() => handleConfim(record)}
                >
                  Khám bệnh
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleMedicine(record)}
                >
                  Kê thuốc
                </button>
          
                {editingKey === record.patientId ? (
                  <button
                    className="btn btn-success"
                    onClick={() => handleSave(record.bookingId)}
                  >
                    Cập nhật
                  </button>
                ) : (
                  <button
                    className="btn btn-warning"
                    onClick={() => editStatus(record.patientId)}
                  >
                    Sửa
                  </button>
                )}
              </Space>
            ),
          }
    ]          

    const handleCancle = async (id) => {    
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?");
        if (!isConfirmed) return;
    
        try {
            const response = await axios.put(
                `http://localhost:8080/api/cancle-booking/${id}`
            );
    
            if (response.status === 200) {
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

    return (
        <div className="mt-5">
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered
                title={() => <h3>Danh sách bệnh nhân</h3>}
            />
        </div>
    );
};

export default withRouter(TableManagePatient);
