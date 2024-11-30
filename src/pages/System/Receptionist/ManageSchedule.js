import React, { useEffect, useState } from 'react';
import { Table, Button, Select, Modal, Typography, Spin, notification } from 'antd';
import axios from 'axios';
import { toast } from "react-toastify";

const { Title } = Typography;
const { Option } = Select;

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctorNames, setDoctorNames] = useState({});
  const [status, setStatus] = useState({});

  // Hàm fetchAppointments dùng để tải lại dữ liệu
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/get-all-bookings');
      const data = await response.json();
      setAppointments(data.data);

      // Fetch tên bác sĩ
      const doctorData = {};
      for (const appointment of data.data) {
        if (!doctorData[appointment.doctorId]) {
          const doctorResponse = await axios.get(`http://localhost:8080/api/get-infor-user?id=${appointment.doctorId}`);
          doctorData[appointment.doctorId] = `${doctorResponse.data?.data?.lastName} ${doctorResponse.data?.data?.firstName}`;
        }
      }
      setDoctorNames(doctorData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      toast.error("Không thể tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchAppointments lần đầu khi component được mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Cập nhật trạng thái lịch hẹn
  const updateBookingStatus = async (id) => {
    if (!newStatus) {
      notification.error({ message: "Vui lòng chọn trạng thái mới trước khi cập nhật!" });
      return;
    }

    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn cập nhật trạng thái này?",
      onOk: async () => {
        try {
          const response = await axios.put(`http://localhost:8080/api/update-booking-status/${id}`, {
            statusId: newStatus,
            status: newStatus,
          });
          if (response.status === 200) {
            notification.success({ message: "Cập nhật trạng thái thành công!" });
            await fetchAppointments();
            setEditingId(null);
          } else {
            notification.error({ message: "Cập nhật trạng thái thất bại!" });
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái:", error);
          notification.error({ message: "Đã xảy ra lỗi, vui lòng thử lại sau!" });
        }
      },
    });
  };

  // Xóa lịch hẹn
  const deleteBooking = async (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa lịch hẹn này? Hành động này không thể hoàn tác!",
      onOk: async () => {
        try {
          const response = await axios.delete(`http://localhost:8080/api/delete-booking/${id}`);
          if (response.status === 200) {
            notification.success({ message: "Xóa lịch hẹn thành công!" });
            await fetchAppointments();
          } else {
            notification.error({ message: "Xóa lịch hẹn thất bại!" });
          }
        } catch (error) {
          console.error("Lỗi khi xóa lịch hẹn:", error);
          notification.error({ message: "Đã xảy ra lỗi, vui lòng thử lại sau!" });
        }
      },
    });
  };

  // Cột cho bảng
  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      render: (value, _, index) => index + 1,
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientData',
      key: 'patientData',
      render: (patientData) => `${patientData?.firstName || ''} ${patientData?.lastName || ''}` || 'N/A',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'patientData',
      key: 'phone',
      render: (patient) => patient?.phoneNumber || 'N/A',
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctorId',
      key: 'doctorId',
      render: (doctorId) => doctorNames[doctorId],
    },
    {
      title: 'Ngày hẹn',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(parseInt(date)).toLocaleDateString(),
    },
    {
      title: 'Khung giờ',
      dataIndex: 'timeTypeDataPatient',
      key: 'timeTypeDataPatient',
      render: (time) => time?.valueVi || 'N/A',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusData',
      key: 'status',
      render: (_, record) =>
        editingId === record.id ? (
          <Select
            value={newStatus}
            onChange={(value) => setNewStatus(value)}
            style={{ width: '100%' }}
          >
            <Option value="S5">Đang chờ khám</Option>
            <Option value="S3">Đã khám xong</Option>
          </Select>
        ) : (
          <span
            className={`badge ${
              record.statusId === 'S2'
                ? 'bg-success'
                : record.statusId === 'S5'
                ? 'bg-primary text-dark'
                : record.statusId === 'S1'
                ? 'bg-warning text-dark'
                : record.statusId === 'S4'
                ? 'bg-danger'
                : 'bg-secondary'
            }`}
          >
            {record?.statusId === "S2"
              ? "Đã xác nhận"
              : record?.statusId === "S5"
              ? "Đang chờ khám"
              : record?.statusId === "S4"
              ? "Đã hủy"
              : record?.statusId === "S3"
              ? "Đã khám xong"
              : record?.statusId === "S1"
              ? "Lịch hẹn mới"
              : ""}
          </span>
        ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) =>
        editingId === record.id ? (
          <>
            <Button
              type="primary"
              size="small"
              onClick={() => updateBookingStatus(record.id)}
              style={{ marginRight: 8 }}
            >
              Lưu
            </Button>
            <Button size="small" onClick={() => setEditingId(null)}>
              Hủy
            </Button>
          </>
        ) : (
          <>
            <Button
              type="link"
              onClick={() => {
                setEditingId(record.id);
                setNewStatus(record.statusId);
              }}
            >
              Sửa
            </Button>
            <Button type="link" danger onClick={() => deleteBooking(record.id)}>
              Xóa
            </Button>
          </>
        ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div style={{ padding: 24 }}>
        <Title level={3}>Quản lý lịch hẹn</Title>
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey={(record) => record.id}
          bordered
          pagination={{ pageSize: 5 }}
        />
      </div>
    </Spin>
  );
};

export default AppointmentManagement;
