import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Input, Button, Row, Col, InputNumber, message } from "antd";
import axios from "axios";

const CreateMedicine = () => {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    price: '',
    usg: '',
    activeIngredient: '',
    dosage: '',
    route: '',
    packaging: '',
    manufacturer: '',
    declarationUnit: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (values) => {
    console.log("Dữ liệu thuốc: ", values);
    try {
      const response = await axios.post("http://localhost:8080/api/create-medicine", values);

      // Assuming response contains a 'data' object that has the result
      if (response.data.errCode === 0) {
        message.success("Lưu thông tin thuốc thành công!");
      } else {
        message.error("Lỗi khi lưu thông tin thuốc.");
      }
    } catch (error) {
      console.error("Error saving medicine data:", error);
      message.error("Lỗi khi lưu thông tin thuốc.");
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Nhập thông tin thuốc</h1>
      <Form
        onFinish={handleSubmit}
        initialValues={formData} // Set the initial values for the form
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tên thuốc" name="name" rules={[{ required: true, message: 'Nhập tên thuốc!' }]}>
              <Input name="name" onChange={handleChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Đơn vị" name="unit" rules={[{ required: true, message: 'Nhập đơn vị!' }]}>
              <Input name="unit" onChange={handleChange} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Giá thuốc" name="price" rules={[{ required: true, message: 'Nhập giá thuốc!' }]}>
              <Input name="price" onChange={handleChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Cách sử dụng" name="usg">
              <Input name="usg" onChange={handleChange} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Hoạt chất" name="activeIngredient">
              <Input name="activeIngredient" onChange={handleChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Hàm lượng" name="dosage">
              <Input name="dosage" onChange={handleChange} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Đường dùng" name="route">
              <Input name="route" onChange={handleChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Quy cách đóng gói" name="packaging">
              <Input name="packaging" onChange={handleChange} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Đơn vị sản xuất" name="manufacturer">
              <Input name="manufacturer" onChange={handleChange} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Đơn vị kê khai" name="declarationUnit">
              <Input name="declarationUnit" onChange={handleChange} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateMedicine;
