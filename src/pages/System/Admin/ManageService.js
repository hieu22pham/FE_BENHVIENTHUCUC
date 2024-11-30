import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, message, Modal } from "antd"; // Thêm Modal từ Ant Design
import { useHistory } from "react-router-dom";

const ManageService = () => {
    const [services, setServices] = useState([]); // Danh sách dịch vụ
    const [loading, setLoading] = useState(false); // Trạng thái loading khi fetch dữ liệu
    const history = useHistory();

    // Hàm fetch tất cả dịch vụ
    const fetchServices = async () => {
        try {
            setLoading(true); // Bật trạng thái loading
            const response = await axios.get("http://localhost:8080/api/get-all-service");

            if (response.data.errCode === 0) {
                setServices(response.data.data); // Lưu dữ liệu vào state
            } else {
                message.error("Không thể lấy danh sách dịch vụ!"); // Hiển thị lỗi nếu API trả về thất bại
            }
        } catch (error) {
            console.error("Lỗi khi fetch dịch vụ:", error);
            message.error("Đã xảy ra lỗi!");
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };

    // Hàm xóa dịch vụ theo ID
    const deleteService = (id) => {
        Modal.confirm({
            title: "Xác nhận xóa dịch vụ",
            content: "Bạn có chắc chắn muốn xóa dịch vụ này không?",
            okText: "Xóa",
            okType: "danger", // Nút "Xóa" sẽ có màu đỏ
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    const response = await axios.delete(`http://localhost:8080/api/delete-service/${id}`);
                    if (response.data.errCode === 0) {
                        message.success("Xóa dịch vụ thành công!"); // Hiển thị thông báo xóa thành công
                        fetchServices(); // Làm mới danh sách dịch vụ
                    } else {
                        message.error("Không thể xóa dịch vụ!"); // Hiển thị lỗi nếu không xóa được
                    }
                } catch (error) {
                    console.error("Lỗi khi xóa dịch vụ:", error);
                    message.error("Đã xảy ra lỗi khi xóa!");
                }
            },
        });
    };

    const editService = (record) => {
        localStorage.setItem("idService", record.id);
        history.push("/system/edit-service");
    };

    // Fetch dữ liệu dịch vụ khi component được mount
    useEffect(() => {
        fetchServices();
    }, []);

    // Định nghĩa cột cho bảng Ant Design
    const columns = [
        {
            title: "STT",
            dataIndex: "id",
            key: "id",
            render: (_, __, index) => index + 1, // Tự động tạo số thứ tự
        },
        {
            title: "Tên dịch vụ",
            dataIndex: "service_name",
            key: "service_name",
        },
        {
            title: "Giá dịch vụ",
            dataIndex: "unit_price",
            key: "unit_price",
            render: (price) => `${price.toLocaleString()} đ`, // Hiển thị dạng tiền tệ
        },
        {
            title: "Khoa thực hiện",
            dataIndex: "department",
            key: "department",
        },
        {
            title: "Mô tả",
            dataIndex: "notes",
            key: "notes",
            render: (notes) => notes || "Không có", // Hiển thị mặc định nếu không có mô tả
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <>
                    {/* Nút Sửa */}
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: '#FFCC00', // Golden Yellow
                            borderColor: '#FFCC00',
                            color: 'white', // Text color for better contrast
                        }}
                        onClick={() => editService(record)} // Hàm sửa (nếu có)
                    >
                        Sửa
                    </Button>
                    {/* Nút Xóa */}
                    <Button
                        type="primary"
                        danger
                        onClick={() => deleteService(record.id)} // Gọi hàm xóa
                        style={{ marginLeft: "10px" }}
                    >
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    const handleAdd = () => {
        history.push("/system/add-service");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Danh sách dịch vụ</h2>
            <Button
                type="primary"
                style={{ marginBottom: "10px" }}
                onClick={handleAdd} // Chuyển tới trang thêm dịch vụ
            >
                Thêm mới
            </Button>
            <Table
                columns={columns}
                dataSource={services}
                rowKey="id" // Khóa duy nhất cho mỗi hàng
                loading={loading} // Hiển thị loading khi dữ liệu đang fetch
                bordered // Thêm viền bảng
                pagination={{ pageSize: 8 }} // Phân trang, mỗi trang hiển thị 8 mục
            />
        </div>
    );
};

export default ManageService;
