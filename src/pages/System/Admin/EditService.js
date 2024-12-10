import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, InputNumber, Select, message } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const EditService = () => {
    const [form] = Form.useForm(); // Sử dụng Ant Design Form instance
    const [loading, setLoading] = useState(false);
    const [serviceId, setServiceId] = useState("");

    useEffect(() => {
        setServiceId(localStorage.getItem("idService"));
    }, [localStorage.getItem("idService")]);

    // Fetch service data by ID
    const fetchServiceData = async () => {
        console.log("serviceId: ", serviceId)
        const id = serviceId
        try {
            const response = await axios.get(`http://localhost:8080/api/get-all-service/${id}`);

            console.log(response)
            if (response.data.errCode === 0) {
                // Set form fields with fetched data
                form.setFieldsValue(response.data.data);
            } else {
                message.error("Failed to fetch service data!");
            }
        } catch (error) {
            console.error("Error fetching service data:", error);
            message.error("Something went wrong!");
        }
    };

    // Update service by submitting form
    const handleUpdateService = async (values) => {
        console.log("values: ", values)
        try {
            setLoading(true);
            const response = await axios.put(`http://localhost:8080/api/update-service/${serviceId}`, values);
            if (response.data.errCode === 0) {
                message.success("Sửa thông tin dịch vụ thành công!");
                if (fetchServiceData) fetchServiceData(); // Refresh service list if provided
            } else {
                message.error(response.data.errMessage || "Failed to update service!");
            }
        } catch (error) {
            message.error("Xảy ra lỗi khi sửa!");
        } finally {
            setLoading(false);
        }
    };

    // Fetch service data when component is mounted
    useEffect(() => {
        if (serviceId) {
            fetchServiceData();
        }
    }, [serviceId]);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Sửa dịch vụ</h2>
            <Form
                form={form} // Bind form instance
                layout="vertical"
                onFinish={handleUpdateService} // Submit form
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

                <Form.Item label="Mô tả" name="notes">
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

export default EditService;
