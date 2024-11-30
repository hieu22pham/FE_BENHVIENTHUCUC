import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const ExaminationManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorNames, setDoctorNames] = useState({}); // Để lưu thông tin tên bác sĩ
  const history = useHistory();

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/get-all-bookings');
        const data = await response.json();
        setAppointments(data.data);

        // Fetch doctor names
        const doctorData = {};
        for (const appointment of data.data) {
          if (!doctorData[appointment.doctorId]) {
            const doctorResponse = await axios.get(`http://localhost:8080/api/get-infor-user?id=${appointment.doctorId}`);
            doctorData[appointment.doctorId] = `${doctorResponse.data?.data?.firstName} ${doctorResponse.data?.data?.lastName}` ;
          }
        }
        setDoctorNames(doctorData);
        console.log("doctorData: ",doctorData)
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Không thể tải dữ liệu!");
      }
    };

    fetchData();
  }, []);

  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa mục này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/delete-booking/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("Xóa lịch hẹn thành công!");
        setAppointments((prevAppointments) =>
          prevAppointments.filter((appointment) => appointment.id !== id)
        );
      } else {
        const errorData = await response.json();
        alert(`Xóa lịch hẹn thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi khi xóa lịch hẹn:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  const handlePayment = (appointmentId) => {
    localStorage.setItem("patientId", appointmentId.patientId);
    history.push("/receptionist/invoice");
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Quản lý ca khám</h1>
      <div className="mb-3"></div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>STT</th>
            <th>Bệnh nhân</th>
            <th>Số điện thoại</th>
            <th>Bác sĩ</th>
            <th>Ngày hẹn</th>
            <th>Khung giờ</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={appointment.id}>
              <td>{index + 1}</td>
              <td>{appointment.patientData ? `${appointment.patientData.lastName} ${appointment.patientData.firstName}` : ''}</td>
              <td>{appointment.patientData ? appointment.patientData.phoneNumber : ''}</td>
              <td>{doctorNames[appointment.doctorId] || "Đang tải..."}</td>
              <td>{new Date(parseInt(appointment.date)).toLocaleDateString()}</td>
              <td>{appointment.timeTypeDataPatient ? appointment.timeTypeDataPatient.valueVi : ''}</td>
              <td>
                <span
                  className={`badge ${
                    appointment.payment === true
                      ? "bg-success"
                      : appointment.payment === false
                      ? "bg-warning text-dark"
                      : "bg-danger"
                  }`}
                  onClick={() => handlePayment(appointment)}
                  style={{
                    cursor: appointment.payment === false ? "pointer" : "default",
                  }}
                >
                  {appointment.payment === true
                    ? "Đã thanh toán"
                    : appointment.payment === false
                    ? "Chưa thanh toán"
                    : "Không xác định"}
                </span>
              </td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => deleteBooking(appointment.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between">
        <span>Hiển thị 10 / trang</span>
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" href="#">1</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ExaminationManagement;
