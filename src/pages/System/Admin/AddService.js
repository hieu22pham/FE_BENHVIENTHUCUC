import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, InputNumber, Select, message } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const AddService = ({ fetchServices }) => {
    const [form] = Form.useForm(); // Khởi tạo form từ Ant Design
    const [loading, setLoading] = useState(false);

    // Submit form to add new service
    const handleAddService = async (values) => {
        try {
            const id = localStorage.getItem("patientId")
            setLoading(true);
            const response = await axios.post(`http://localhost:8080/api/create-service/${id}`, values);
            if (response.data.errCode === 0) {
                message.success("Thêm dịch vụ thành công!")
                form.resetFields(); // Reset các trường của form về ban đầu
                if (fetchServices) fetchServices(); // Refresh the service list if provided
            } else {
                message.error(response.data.errMessage || "Failed to add service!");
            }
        } catch (error) {
            message.error("Lưu dịch vụ thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Thêm mới dịch vụ</h2>
            <Form
                layout="vertical"
                form={form} // Gán form cho Ant Design
                onFinish={handleAddService}
                initialValues={{
                    service_name: "",
                    unit_price: 0,
                    department: "",
                    notes: "",
                }}
            >
                <Form.Item
                    label="Tên dịch vụ"
                    name="service_name"
                    rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
                >
                    <Input placeholder="Nhập tên dịch vụ" />
                </Form.Item>

                <Form.Item
                    label="Giá dịch vụ"
                    name="unit_price"
                    rules={[{ required: true, message: "Vui lòng nhập giá dịch vụ!" }]}
                >
                    <InputNumber
                        placeholder="Nhập giá dịch vụ"
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value.replace(/,*/g, "")}
                    />
                </Form.Item>

                <Form.Item
                    label="Khoa thực hiện"
                    name="department"
                    rules={[{ required: true, message: "Vui lòng chọn khoa thực hiện!" }]}
                >
                    <Select placeholder="Chọn khoa thực hiện">
                        <Option value="Khoa Huyết học truyền máu">Khoa Huyết học truyền máu</Option>
                        <Option value="Khoa Sinh hóa">Khoa Sinh hóa</Option>
                        <Option value="Khoa Chuẩn đoán hình ảnh">Khoa Chuẩn đoán hình ảnh</Option>
                        {/* Thêm các khoa khác nếu cần */}
                    </Select>
                </Form.Item>

                <Form.Item label="Mô tả" name="notes" rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}>
                    <TextArea rows={4} placeholder="Nhập mô tả (nếu có)" />
                    
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Xác nhận
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddService;
