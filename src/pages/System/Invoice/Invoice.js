import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Typography, Divider, Row, Col, Card, Spin, message } from 'antd';
import { PrinterOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Invoice = () => {
    const [services, setServices] = useState([]); // Dữ liệu dịch vụ
    const [medicines, setMedicines] = useState([]); // Dữ liệu thuốc
    const [isSendingEmail, setIsSendingEmail] = useState(false); // Trạng thái gửi email
    const [userInfo, setUserInfo] = useState(null);
    const [price, setPrice] = useState();
    const [doctorName, setDoctorName] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const id = localStorage.getItem("patientId");
            try {
                const serviceRes = await axios.get(`http://localhost:8080/api/get-all-service-invoice/${id}`);
                const medicineRes = await axios.get(`http://localhost:8080/api/get-all-medicine-invoice/${id}`);
                const userRes = await axios.get(`http://localhost:8080/api/get-infor-user?id=${id}`); // ID bệnh nhân
                const doctor_id = localStorage.getItem("selectedDoctor")
                const priceExaminationRes = await axios.get(`http://localhost:8080/api/get-extra-infor-doctor-by-id?doctorId=${doctor_id}`);
                
                console.log("priceExaminationRes: ", priceExaminationRes)
                const name = localStorage.getItem("nameSelectedDoctor")
                
                setPrice(priceExaminationRes.data.data.priceData?.valueVi)
                setDoctorName(name);
                console.log("priceExaminationRes.data.data.priceData?.valueVi: ", priceExaminationRes.data.data.priceData?.valueVi)
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

    const formatCurrency = (value) => {
        return value
            ? `${parseFloat(value).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
              })}`
            : "0 VNĐ";
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

        const priceExam = parseFloat(price || 0)
        return serviceTotal + medicineTotal + priceExam;
    };

    const calculateTableTotal = (items, key) => {
        return items.reduce((sum, item) => sum + parseFloat(item[key] || 0), 0);
    };

    const serviceColumns = [
        { title: 'STT', dataIndex: 'id', key: 'id', render: (text, _, index) => index + 1 },
        { title: 'Tên dịch vụ', dataIndex: ['serviceDetails', 'service_name'], key: 'service_name' },
        { title: 'Bảng giá', dataIndex: ['serviceDetails', 'unit_price'], key: 'unit_price', render: (text) => formatCurrency(text) },
        { title: 'Thành tiền', dataIndex: ['serviceDetails', 'price'], key: 'price', render: (text) => formatCurrency(text) },
        { title: 'Ghi chú', dataIndex: ['serviceDetails', 'notes'], key: 'notes', render: (text) => text || '' },
        { title: 'Khoa thực hiện', dataIndex: ['serviceDetails', 'department'], key: 'department', render: (text) => text || 'N/A' },
    ];

    const medicineColumns = [
        { title: 'STT', dataIndex: 'id', key: 'id', render: (text, _, index) => index + 1 },
        { title: 'Tên thuốc', dataIndex: ['medicineDetails', 'name'], key: 'name' },
        { title: 'Bảng giá', dataIndex: ['medicineDetails', 'price'], key: 'price', render: (text) => formatCurrency(text) },
        { title: 'Số lượng', dataIndex: 'medicine_quantity', key: 'medicine_quantity' },
        { title: 'Thành tiền', key: 'total', render: (_, record) => formatCurrency(record.medicineDetails.price * record.medicine_quantity) },
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
                            <span><b>Bác sĩ</b>: {doctorName}</span><br></br>
                            <span><b>Giá khám bệnh</b>: {formatCurrency(price)}</span>
                        </Card>
                    </Col>
                </Row>
                
                <Divider />
                <Title level={4}>Chỉ định CLS</Title>
                <Table dataSource={services} columns={serviceColumns} pagination={false} rowKey="id" />
                <p style={{ textAlign: "right", marginTop: "10px" }}>
                    <Text strong>Tổng tiền dịch vụ: </Text>
                    {formatCurrency(services.reduce((sum, s) => sum + parseFloat(s.serviceDetails.price || 0), 0))}
                </p>
                <Divider />
                <Title level={4}>Đơn thuốc</Title>
                <Table dataSource={medicines} columns={medicineColumns} pagination={false} rowKey="id" />
                <p style={{ textAlign: "right", marginTop: "10px" }}>
                    <Text strong>Tổng tiền thuốc: </Text>
                    {formatCurrency(medicines.reduce((sum, m) => sum + parseFloat(m.medicineDetails.price || 0) * parseFloat(m.medicine_quantity || 0), 0))}
                </p>
                <Divider />
                <Row>
                    <Col span={24} style={{ textAlign: "right" }}>
                        <Text strong style={{ fontSize: "16px" }}>Tổng tiền hóa đơn: {formatCurrency(calculateTotalAmount())}</Text>
                        <div style={{ marginTop: "20px" }}>
                            <Button type="primary" icon={<PrinterOutlined />} className="mb-2" onClick={() => window.print()}>
                                In hóa đơn
                            </Button>
                            <Button
                                type="primary"
                                icon={<MailOutlined />}
                                style={{ marginLeft: "10px" }}
                                loading={isSendingEmail}
                                onClick={handleSendEmail}
                            >
                                {isSendingEmail ? "Đang gửi..." : "Gửi Email"}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Invoice;
