import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Button } from "antd"; // Thêm Modal và Button từ Ant Design

const ManageMedicine = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    // Fetch data from API
    axios
      .get("http://localhost:8080/api/get-all-medicine")
      .then((response) => {
        if (response.data.errCode === 0) {
          setMedicines(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching medicines:", error);
      });
  }, []);

  const deleteMedicine = (id) => {
    // Hiển thị Modal xác nhận xóa
    Modal.confirm({
      title: "Xác nhận xóa thuốc",
      content: "Bạn có chắc chắn muốn xóa thuốc này không?",
      okText: "Xóa",
      okType: "danger", // Nút "Xóa" sẽ có màu đỏ
      cancelText: "Hủy",
      onOk() {
        axios
          .delete(`http://localhost:8080/api/delete-medicine/${id}`)
          .then(() => {
            setMedicines((prevMedicines) =>
              prevMedicines.filter((medicine) => medicine.id !== id)
            );
            toast.success("Xóa thành công!");
          })
          .catch((error) => {
            console.error("Error deleting medicine:", error);
            toast.error("Xóa thất bại!");
          });
      },
      onCancel() {
        console.log("Hủy xóa thuốc");
      },
    });
  };

  return (
    <div className="container mt-4">
      <h2>Quản lý thuốc</h2>
      <a className="btn btn-primary mb-3" href="/system/create-medicine">
        Thêm mới
      </a>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên thuốc</th>
            <th>Đơn vị</th>
            <th>Giá thuốc</th>
            <th>Cách sử dụng</th>
            <th>Hoạt chất</th>
            <th>Hàm lượng</th>
            <th>Đường dùng</th>
            <th>Quy cách đóng gói</th>
            <th>Đơn vị sản xuất</th>
            <th>Đơn vị kê khai</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine, index) => (
            <tr key={medicine.id}>
              <td>{index + 1}</td>
              <td>{medicine.name}</td>
              <td>{medicine.unit}</td>
              <td>{medicine.price.toLocaleString()}đ</td>
              <td>{medicine.usg}</td>
              <td>{medicine.activeIngredient}</td>
              <td>{medicine.dosage}</td>
              <td>{medicine.route}</td>
              <td>{medicine.packaging}</td>
              <td>{medicine.manufacturer}</td>
              <td>{medicine.declarationUnit}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteMedicine(medicine.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {medicines.length === 0 && (
            <tr>
              <td colSpan="12" className="text-center">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageMedicine;
