import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, InputNumber, Select, message } from "antd";
import axios from "axios";

const ExaminationForm = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    passWord: "",
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    gender: "",
  });

  const [examinationData, setExaminationData] = useState({
    weight: null,
    height: null,
    temperature: null,
    heart_rate: null,
    blood_pressure: null,
    bmi: null,
    detailed_examination: "",
  });

  const [additionalData, setAdditionalData] = useState({
    patientId: null,
    service_name: "",
    unit_price: null,
    quantity: null,
    price: null,
    notes: "",
    department: "",
  });

  const [services, setServices] = useState([]); // Dữ liệu các dịch vụ
  const [loadingServices, setLoadingServices] = useState(false); // Trạng thái loading khi fetch dịch vụ

  // Fetch user info when component mounts
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
    fetchAllServices(); // Fetch services when component mounts
  }, []);

  // Hàm lấy tất cả dịch vụ
  const fetchAllServices = async () => {
    setLoadingServices(true); // Bật trạng thái loading
    try {
      const response = await axios.get("http://localhost:8080/api/get-all-service");
      if (response.data.errCode === 0) {
        setServices(response.data.data); // Lưu dữ liệu vào state
      } else {
        message.error("Không thể lấy danh sách dịch vụ!");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      message.error("Lỗi khi lấy danh sách dịch vụ.");
    } finally {
      setLoadingServices(false); // Tắt trạng thái loading
    }
  };

  // Hàm khi chọn dịch vụ
  const handleServiceSelect = async (value) => {
    const selectedService = services.find(service => service.id === value);
    if (selectedService) {
      setAdditionalData(prevData => ({
        ...prevData,
        service_name: selectedService.service_name,
        unit_price: selectedService.unit_price,
        department: selectedService.department, // Cập nhật thông tin khoa khi chọn dịch vụ
      }));
    }
  };

  const [medicineData, setMedicineData] = useState({
    parentId: null, // ID của thuốc (từ bảng medicine)
    keyTable: "service", // Loại hóa đơn (luôn là 'medicine' trong trường hợp này)
    doctorId: null,
    medicine_quantity: null, // Số lượng thuốc
  });

  const handleSubmit = async () => {
    try {
      const id = localStorage.getItem("patientId")
      const doctorId = localStorage.getItem("idUser")

      // Calculate BMI
      const heightInMeters = examinationData.height / 100;
      examinationData.bmi = examinationData.weight / (heightInMeters ** 2);
      examinationData.patientId = userInfo.id;
      examinationData.keyTable = "service"
      examinationData.doctorId = doctorId

      // Save examination data
      const examinationResponse = await axios.post(`http://localhost:8080/api/post-examination/${id}`, examinationData);

      console.log("examinationResponse: ", examinationResponse)
      console.log("examinationData: ", examinationData)

      if (examinationResponse.status === 200) {
        message.success("Lưu thông tin khám bệnh thành công!");

        // medicineData.parentId = 


      }

      console.log("create-service id: ", id)
      // Prepare and save additional data
      additionalData.patientId = userInfo.id;
      additionalData.price = additionalData.unit_price * additionalData.quantity; // Calculate price
      const additionalResponse = await axios.post(`http://localhost:8080/api/create-service/${id}`, additionalData);

      console.log("additionalResponse: ", additionalResponse)

      if (additionalResponse.data.errCode == 0) {
        medicineData.parentId = additionalResponse.data.data.id
        medicineData.keyTable = "service"
        medicineData.medicine_quantity = additionalResponse.data.data.quantity
        const doctorId = localStorage.getItem("idUser")
        medicineData.doctorId = doctorId

        console.log("medicineData: ", medicineData)

        const response = await axios.post(`http://localhost:8080/api/create-invoice/${id}`, medicineData);
        console.log("Invoide res:", response)
        if (response.data.errCode === 200) {
          message.success("Lưu thông tin thuốc thành công!");
          // Reset form sau khi lưu
          setMedicineData({
            parentId: null,
            keyTable: "medicine",
            doctorId: null,
            medicine_quantity: null,
          });
        }
      }
      console.log(userInfo.id)
      console.log("additionalData: ", additionalData)

      if (additionalResponse.status === 200) {
        message.success("Lưu thông tin dịch vụ thành công!");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      message.error("Lỗi khi lưu thông tin.");
    }
  };

  const handleInputChange = (field, value, type = "examination") => {
    if (type === "examination") {
      setExaminationData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    } else if (type === "additional") {
      setAdditionalData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    }
  };

  return (
    <div className="container mt-5">
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
              <Input value={`${userInfo?.lastName || ""} ${userInfo?.firstName || ""}`} disabled />
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
              <Input value={userInfo?.gender == "M" ? "Nam" : "Nữ"} disabled />
            </Form.Item>
          </Col>
        </Row>

        <h2 className="mt-4">Thông tin khám bệnh</h2>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Cân nặng (kg)">
              <InputNumber
                min={0}
                value={examinationData.weight}
                onChange={(value) => handleInputChange("weight", value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Chiều cao (cm)">
              <InputNumber
                min={0}
                value={examinationData.height}
                onChange={(value) => handleInputChange("height", value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Nhiệt độ (°C)">
              <InputNumber
                min={0}
                step={0.1}
                value={examinationData.temperature}
                onChange={(value) => handleInputChange("temperature", value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Nhịp tim (lần/phút)">
              <InputNumber
                min={0}
                value={examinationData.heart_rate}
                onChange={(value) => handleInputChange("heart_rate", value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Huyết áp (mmHg)">
              <InputNumber
                min={0}
                value={examinationData.blood_pressure}
                onChange={(value) => handleInputChange("blood_pressure", value)}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Mô tả chi tiết khám bệnh">
              <Input.TextArea
                rows={4}
                value={examinationData.detailed_examination}
                onChange={(e) => handleInputChange("detailed_examination", e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <h2 className="mt-4">Thông tin dịch vụ</h2>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tên dịch vụ">
              <Select
                value={additionalData.service_name}
                onChange={handleServiceSelect}
                loading={loadingServices}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {services.map((service) => (
                  <Select.Option key={service.id} value={service.id}>
                    {service.service_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Đơn giá">
              <InputNumber
                min={0}
                step={1000}
                value={additionalData.unit_price}
                onChange={(value) => handleInputChange("unit_price", value, "additional")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số lượng">
              <InputNumber
                min={0}
                value={additionalData.quantity}
                onChange={(value) => handleInputChange("quantity", value, "additional")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ghi chú">
              <Input
                value={additionalData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value, "additional")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Khoa">
              <Input
                value={additionalData.department}
                onChange={(e) => handleInputChange("department", e.target.value, "additional")}
              />
            </Form.Item>
          </Col>
        </Row>

        <Button type="primary" className="mb-5" onClick={handleSubmit}>
          Lưu thông tin
        </Button>
      </Form>
    </div>
  );
};

export default ExaminationForm;
