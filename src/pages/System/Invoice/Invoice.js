import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Input, Typography, Divider, Row, Col, Card, Spin, message } from 'antd';
import { PrinterOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Invoice = () => {
    const [services, setServices] = useState([]); // Dữ liệu dịch vụ
    const [medicines, setMedicines] = useState([]); // Dữ liệu thuốc
    const [isSendingEmail, setIsSendingEmail] = useState(false); // Trạng thái gửi email
    const [emailBody, setEmailBody] = useState(""); // Email người dùng nhập vào
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const id = localStorage.getItem("patientId")
            try {
                const serviceRes = await axios.get(`http://localhost:8080/api/get-all-service-invoice/${id}`);
                const medicineRes = await axios.get(`http://localhost:8080/api/get-all-medicine-invoice/${id}`);
                const userRes = await axios.get(`http://localhost:8080/api/get-infor-user?id=${id}`); // ID bệnh nhân
                
                console.log("serviceRes: ", serviceRes)
                
                setServices(serviceRes.data.data || []);
                setMedicines(medicineRes.data.data.data || []);
                setUserInfo(userRes.data.data);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            }
        };

        fetchData();
    }, []);

    const handleSendEmail = async () => {
        setIsSendingEmail(true);
        try {
            const emailData = {
                email: userInfo.email,
                patientName: `${userInfo?.lastName} ${userInfo?.firstName}`,
                patientId: userInfo?.id,
                services,
                medicines,
                totalAmount: calculateTotalAmount(),
            };

            await axios.post('http://localhost:8080/api/send-invoice-email', emailData);
            message.success('Email gửi thành công!');
        } catch (error) {
            console.error('Lỗi khi gửi email:', error);
            message.error('Lỗi khi gửi email. Vui lòng thử lại.');
        } finally {
            setIsSendingEmail(false);
        }
    };

    const calculateTotalAmount = () => {
        const serviceTotal = services.reduce(
            (sum, s) => sum + parseFloat(s.serviceDetails.price || 0),
            0
        );
        const medicineTotal = medicines.reduce(
            (sum, m) =>
                sum +
                parseFloat(m.medicineDetails.price || 0) *
                    parseFloat(m.medicine_quantity || 0),
            0
        );
        return serviceTotal + medicineTotal;
    };

    const serviceColumns = [
        { title: 'STT', dataIndex: 'id', key: 'id', render: (text, _, index) => index + 1 },
        { title: 'Tên dịch vụ', dataIndex: ['serviceDetails', 'service_name'], key: 'service_name' },
        { title: 'Bảng giá', dataIndex: ['serviceDetails', 'unit_price'], key: 'unit_price' },
        { title: 'Thành tiền', dataIndex: ['serviceDetails', 'price'], key: 'price' },
        { title: 'Ghi chú', dataIndex: ['serviceDetails', 'notes'], key: 'notes', render: (text) => text || 'None' },
        { title: 'Khoa thực hiện', dataIndex: ['serviceDetails', 'department'], key: 'department', render: (text) => text || 'N/A' },
    ];

    const medicineColumns = [
        { title: 'STT', dataIndex: 'id', key: 'id', render: (text, _, index) => index + 1 },
        { title: 'Tên thuốc', dataIndex: ['medicineDetails', 'name'], key: 'name' },
        { title: 'Bảng giá', dataIndex: ['medicineDetails', 'price'], key: 'price' },
        { title: 'Số lượng', dataIndex: 'medicine_quantity', key: 'medicine_quantity' },
        { title: 'Thành tiền', key: 'total', render: (_, record) => record.medicineDetails.price * record.medicine_quantity },
        { title: 'Ghi chú', dataIndex: ['medicineDetails', 'usg'], key: 'usg' },
    ];

    return (
        <div className="container">
            <Card>
                <Title level={3}>Hóa đơn chi tiết</Title>
                <Divider />
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="Thông tin bệnh nhân" bordered={false}>
                            <p><Text strong>Tên:</Text> {userInfo?.lastName} {userInfo?.firstName}</p>
                            <p><Text strong>Địa chỉ:</Text> {userInfo?.address || 'N/A'}</p>
                            <p><Text strong>Số điện thoại:</Text> {userInfo?.phoneNumber || 'N/A'}</p>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Thu tiền" bordered={false}>
                            <p><Text strong>Tổng tiền hóa đơn:</Text> {calculateTotalAmount()} đ</p>
                            <Input
                                placeholder="Nhập email"
                                value={userInfo?.email}
                                hidden
                                onChange={(e) => setEmailBody(e.target.value)}
                                className="mb-3"
                            />
                            <Button type="primary" icon={<PrinterOutlined />} className="mb-2" onClick={() => window.print()}>
                                In hóa đơn
                            </Button>
                            <Button
                                type="primary"
                                icon={<MailOutlined />}
                                style={{marginLeft: "10px"}}
                                loading={isSendingEmail}
                                onClick={handleSendEmail}
                            >
                                {isSendingEmail ? "Đang gửi..." : "Gửi Email"}
                            </Button>
                        </Card>
                    </Col>
                </Row>
                <Divider />
                <Title level={4}>Chỉ định CLS</Title>
                <Table dataSource={services} columns={serviceColumns} pagination={false} rowKey="id" />

                <Divider />
                <Title level={4}>Đơn thuốc</Title>
                <Table dataSource={medicines} columns={medicineColumns} pagination={false} rowKey="id" />
            </Card>
        </div>
    );
};

export default Invoice;
