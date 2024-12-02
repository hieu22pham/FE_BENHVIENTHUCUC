import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, Select, message } from "antd";
import axios from "axios";

const MedicineForm = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    passWord: "",
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    gender: "",
  });

  const [medicineData, setMedicineData] = useState({
    parentId: null, // ID của thuốc (từ bảng medicine)
    keyTable: "medicine", // Loại hóa đơn (luôn là 'medicine' trong trường hợp này)
    medicine_quantity: null, // Số lượng thuốc
  });

  const [medicines, setMedicines] = useState([]); // Danh sách thuốc

  // Lấy thông tin người dùng khi component được mount
  useEffect(() => {
    const id = localStorage.getItem("patientId")
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/get-infor-user?id=${id}`);
        if (response.data) {
          setUserInfo(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        message.error("Lỗi khi lấy thông tin người dùng.");
      }
    };

    fetchUserInfo();

    // Lấy danh sách thuốc
    const fetchMedicines = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/get-all-medicine");
        if (response.data) {
          setMedicines(response.data.data); // API trả về danh sách thuốc
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
        message.error("Lỗi khi lấy thông tin thuốc.");
      }
    };

    fetchMedicines();
  }, []);

  // Cập nhật giá trị của từng trường thuốc
  const handleInputChange = (field, value) => {
    setMedicineData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Xử lý khi chọn thuốc từ dropdown
  const handleMedicineSelect = (medicineId) => {
    setMedicineData((prevData) => ({
      ...prevData,
      parentId: medicineId, // Lưu ID thuốc vào parentId
    }));
  };

  // Xử lý lưu thông tin thuốc
  const handleSubmit = async () => {
    try {
      console.log("Dữ liệu gửi lên API:", medicineData);

      // Kiểm tra dữ liệu trước khi gửi
      if (!medicineData.parentId || !medicineData.medicine_quantity) {
        message.warning("Vui lòng chọn thuốc và nhập số lượng.");
        return;
      }
      
      const id = localStorage.getItem("patientId")
      console.log("Id: ", id)
      console.log("medicineData22: ", medicineData)
      console.log("medicineData: ", medicineData)
      const response = await axios.post(`http://localhost:8080/api/create-invoice/${id}`, medicineData);

      console.log("Ress: ", response)
      if (response.status === 200) {
        message.success("Lưu thông tin thuốc thành công!");
        // Reset form sau khi lưu
        setMedicineData({
          parentId: null,
          keyTable: "medicine",
          medicine_quantity: null,
        });
      }
    } catch (error) {
      console.error("Error saving medicine data:", error);
      message.error("Lỗi khi lưu thông tin thuốc.");
    }
  };

  return (
    <div className="container mt-5">
      {/* Thông tin người dùng */}
      <h2>Thông tin người dùng</h2>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Email">
              <Input value={userInfo?.email} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Họ và tên">
              <Input value={`${userInfo?.lastName} ${userInfo?.firstName}`} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số điện thoại">
              <Input value={userInfo?.phoneNumber} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Địa chỉ">
              <Input value={userInfo?.address} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Giới tính">
              <Input value={(userInfo?.gender=="M") ? "Nam" : "Nữ"  } disabled />
            </Form.Item>
          </Col>
        </Row>

        {/* Thông tin thuốc */}
        <h2 className="mt-4">Thông tin thuốc</h2>
        <Row gutter={16}>
          {/* Dropdown chọn thuốc */}
          <Col span={12}>
            <Form.Item label="Tên thuốc">
              <Select
                value={medicineData.parentId}
                onChange={handleMedicineSelect}
                placeholder="Chọn tên thuốc"
              >
                {medicines.map((medicine) => (
                  <Select.Option key={medicine.id} value={medicine.id}>
                    {medicine.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Số lượng */}
          <Col span={12}>
            <Form.Item label="Số lượng">
              <Input
                type="number"
                value={medicineData.medicine_quantity}
                onChange={(e) => handleInputChange("medicine_quantity", e.target.value)}
                placeholder="Nhập số lượng thuốc"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Nút lưu */}
        <Button type="primary" onClick={handleSubmit}>
          Lưu thông tin thuốc
        </Button>
      </Form>
    </div>
  );
};

export default MedicineForm;
