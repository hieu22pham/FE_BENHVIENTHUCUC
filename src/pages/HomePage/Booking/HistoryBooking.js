import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Rate, Modal, Input, Button, Card, Tabs, Row, Col } from "antd";
import axios from "axios";
import HomeFooter from "../HomeFooter";
import HomeHeader from "../HomeHeader";
import { toast } from "react-toastify";

const { Title } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const HistoryBooking = () => {
  const [dataSource1, setDataSource1] = useState([]);
  const [dataSource2, setDataSource2] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const userId = localStorage.getItem("idUser");
  const [adress, setAddress] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const responseBookings = await axios.get(`http://localhost:8080/api/get-booking-by-user-id/${userId}`);
      const bookingsData = responseBookings.data.data;

      const userRes = await axios.get(`http://localhost:8080/api/get-infor-user?id=${userId}`);
      console.log("userRes: ", userRes)

      setAddress(userRes.data.data.address)
      console.log("adress: ", adress)

      const updatedBookings = await Promise.all(
        bookingsData.map(async (booking) => {
          console.log("booking.doctorId: ", booking.doctorId)
          const doctorResponse = await axios.get(`http://localhost:8080/api/get-doctor-by-id/${booking.doctorId}`);
          const doctorData = doctorResponse.data.data;

          const timeType = booking.timeType
          let timeTypeLabel;
          switch (timeType) {
            case "T1":
              timeTypeLabel = "8:00 - 9:00";
              break;
            case "T2":
              timeTypeLabel = "9:00 - 10:00";
              break;
            case "T3":
              timeTypeLabel = "10:00 - 11:00";
              break;
            case "T4":
              timeTypeLabel = "11:00 - 12:00";
              break;
            case "T5":
              timeTypeLabel = "13:00 - 14:00";
              break;
            case "T6":
              timeTypeLabel = "14:00 - 15:00";
              break;
            case "T7":
              timeTypeLabel = "15:00 - 16:00";
              break;
            case "T8":
              timeTypeLabel = "16:00 - 17:00";
              break;
            default:
              timeTypeLabel = "Thời gian không xác định";
          }
          const dateTime = `${new Date(Number(booking.date)).toLocaleDateString('en-GB')}, từ ${timeTypeLabel}`

          return {
            ...booking,
            doctorInfo: doctorData,
            dateTime: dateTime
          };
        })
      );
      try {
        // var responseExam = []
        // if (responseBookings.status == 200) {
        const responseExam = await axios.get(`http://localhost:8080/api/get-examination/${userId}`);
        console.log("responseExam: ", responseExam)
        const ExamData = responseExam.data.data || [];

        console.log("ExamData: ", ExamData)

        var doctorData
        const updatedExam = await Promise.all(
          updatedBookings.map(async (exam) => {
            if (bookingsData.doctorData) {
              const doctorResponse = await axios.get(`http://localhost:8080/api/get-infor-user/${bookingsData.doctorData}`);
              doctorData = doctorResponse.data.data || {};
            }
            var detailed_examination = ""
            ExamData.map((item) => {
              if (item.doctorId === exam.doctorId) {
                detailed_examination = item.detailed_examination
              }
            })

            return {
              ...exam,
              doctorData,
              detailed_examination: detailed_examination
            };
          })
        );

        const arr2 = updatedExam.filter((data) => data.detailed_examination !== "");
        console.log("Data2: ", arr2)
        if (arr2.length > 0) {
          setDataSource2(arr2);

        } else {
          setDataSource2([]);

        }
        // }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }

      const arr1 = updatedBookings.filter((data) => data.statusId === "S2");

      setDataSource1(arr1);

      console.log("Data1: ", arr1)

    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenModal = (record) => {
    const patientId = localStorage.getItem("idUser"); // Lấy patientId từ localStorage
    console.log("Hh: ", patientId)

    const updatedRecord = { ...record, patientId };
    setCurrentRecord(updatedRecord);
    console.log("updatedRecord: ", updatedRecord)

    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setRating(0);
    setComment("");
  };

  const handleSubmitRating = async () => {
    try {
      if (currentRecord) {

        await axios.post("http://localhost:8080/api/new-review", {
          doctorId: currentRecord?.doctorId || "",
          bookingId: currentRecord.id,
          rating,
          patientId: userId,
          comment,
        });

        toast.success("Đánh giá đã được gửi");
        handleCancelModal();
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleCancel = async (id) => {
    console.log("Id: ", id)
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?");
    if (!isConfirmed) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/api/cancle-booking/${id}`
      );

      if (response.status === 200) {
        alert("Hủy lịch hẹn thành công!");
        fetchBookings(); // Làm mới danh sách sau khi hủy
      } else {
        alert("Hủy lịch hẹn thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi hủy lịch hẹn:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  }

  const columns1 = [

    {
      title: "Tên bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
      render: (_, record) => `${localStorage.getItem("fullNameUser")}`,
    },
    {
      title: "Bác sĩ khám",
      dataIndex: "doctorName",
      key: "doctorName",
      render: (_, record) => ` ${record.doctorInfo?.lastName || ""} ${record.doctorInfo?.firstName || ""}`,
    },
    {
      title: "Thời gian",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (dateTime) => `${dateTime}`
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: () => adress|| "",
    },
    {
      title: "Lý do khám",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Chức năng",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleCancel(record.id)}>
          Hủy
        </Button>
      ),
    },
  ];

  const columns2 = [
    {
      title: "Tên bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
      render: (_, record) => `${localStorage.getItem("fullNameUser")}`,
    },
    {
      title: "Bác sĩ khám",
      dataIndex: "doctorName",
      key: "doctorName",
      render: (_, record) => {
        const doctorInfo = record.doctorInfo || {};
        return `${doctorInfo.lastName || ""} ${doctorInfo.firstName || ""}`;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (dateTime) => (`${dateTime}`),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: () => adress|| "",
    },
    {
      title: "Kết quả khám",
      dataIndex: "detailed_examination",
      key: "detailed_examination",
      render: (_, record) =>
        `${record?.detailed_examination}`
    },
    {
      title: "Chức năng",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleOpenModal(record)}>
          Đánh giá
        </Button>
      ),
    },
  ];

  return (
    <>
      <HomeHeader />
      <div style={{ padding: "24px" }}>
        <Spin spinning={loading}>
          <Card style={{ marginBottom: "24px" }}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Lịch Hẹn" key="1">
                <Table
                  columns={columns1}
                  dataSource={dataSource1}
                  rowKey={(record) => record.id}
                  bordered
                  locale={{ emptyText: "Không có dữ liệu" }}
                />
              </TabPane>
              <TabPane tab="Lịch Sử Khám" key="2">
                <Table
                  columns={columns2}
                  dataSource={dataSource2}
                  rowKey={(record) => record.id}
                  bordered
                  locale={{ emptyText: "Không có dữ liệu" }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Spin>

        <Modal
          title="Đánh giá bác sĩ"
          open={isModalOpen}
          onCancel={handleCancelModal}
          footer={[
            <Button key="cancel" onClick={handleCancelModal}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" onClick={handleSubmitRating}>
              Gửi đánh giá
            </Button>,
          ]}
        >
          <div>
            <label>Đánh giá:</label>
            <Rate value={rating} onChange={setRating} />
          </div>
          <div style={{ marginTop: 16 }}>
            <label>Bình luận:</label>
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Nhập bình luận của bạn"
            />
          </div>
        </Modal>
      </div>
      <HomeFooter />
    </>
  );
};

export default HistoryBooking;
