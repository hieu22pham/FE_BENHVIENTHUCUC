import axios from "../utils/axios";

//Api đăng nhập và xác thực người dùng
const handleLoginApi = (email, passWord) => {
    return axios.post("/api/login", { email, passWord });
};
const handleLoginApi2 = (username, password) => {
    return axios.post("/api/login2", { username, password });
};

//Xác thực đăng nhập
const getUserInforPatient = (id) => {
    return axios.get(`/api/get-infor-user?id=${id}`);
};

const getUserInforSystem = (token) => {
    return axios.get("/api/system-user-infor", {
        headers: {
            Authorization: `Bearer ${token}`, // Thay thế 'Bearer' bằng phần tiêu đề thích hợp nếu yêu cầu của bạn yêu cầu
        },
    });
};

//Ủy quyền người dùng
const getAdminSystem = (token) => {
    return axios.get("/api/admin-dashboard", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
const fetchDashboardData = (token) => {
    return axios
        .get("/api/home-dashboard", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            // Xử lý dữ liệu thành công
            return response;
        })
        .catch((error) => {
            if (error.response && error.response.status === 403) {
                // Xử lý lỗi 403 ở đây
                // console.error("Error:", error);
                return Promise.reject(error);
            } else {
                // Xử lý các lỗi khác
                console.error("Error:", error);
                // Trả về một promise bị reject với lỗi gốc
                return Promise.reject(error);
            }
        });
};

//Api quản lý User
const getAllUsersService = (inputId) => {
    //axios trả về promise
    return axios.get(`/api/get-all-users`, {
        params: {
            id: inputId,
        },
    }); //phải cùng method vs server
};

const createNewUserService = (data) => {
    return axios.post(`/api/create-new-user`, {
        ...data,
    });
};

const deleteUserService = (userId) => {
    return axios.delete(`/api/delete-user/${userId}`);
};

const editUserService = (inputData) => {
    return axios.put(`/api/edit-user/${inputData.id}`, inputData);
};

//Api bảng Allcode
const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`);
};

//Api bác sĩ nổi bật
const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
};
const getTopDoctorHome2Service = (limit) => {
    return axios.get(`/api/get-top-doctor?limit=${limit}`);
};

//Api danh sách Doctor
const getAllDoctorService = () => {
    return axios.get(`/api/get-all-doctor`);
};
const searchDoctorByNameService = (search) => {
    return axios.get(`/api/search-doctor-by-name?search=${search}`);
};

//Api tạo thông tin Docotor
const saveDetailDoctorService = (data) => {
    return axios.post(`/api/save-infor-doctor`, data);
};

//Api quản lý kế hoạch
const saveBulkScheduleDoctorService = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data);
};
const deleteScheduleService = (id) => {
    return axios.delete(`/api/delete-schedule/${id}`);
};
const getDoctorByClinic = (specialtyId) => {
    return axios.get(`/api/get-doctor-by-clinic?clinicId=${specialtyId}`);
};

//Api detail Doctor
const getDetailDoctor = (id) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${id}`);
};
const getScheduleDoctorByDateServicde = (doctorId, date) => {
    return axios.get(
        `/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`
    );
};

const getExtraInforDoctorByIdServicde = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
};

const getProfileDoctorByIdService = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};

const postPatientBookAppointmentService = (data) => {
    return axios.post(`/api/patient-book-appointment`, data);
};

const postVerifyBookAppointmentService = (data) => {
    return axios.post(`/api/verify-book-appointment`, data);
};

//Api chuyên khoa
const createNewSpecialty = (data) => {
    return axios.post(`/api/create-new-specialty`, data);
};
const editSpecialtyService = (inputData) => {
    return axios.put(`/api/edit-specialty/${inputData.id}`, inputData);
};
const deleteSpecialtyService = (id) => {
    return axios.delete(`/api/delete-specialty/${id}`);
};

const getAllSpecialtyService = () => {
    return axios.get(`/api/get-all-specialty`);
};

const getDetailSpecialtyByIdService = (data) => {
    return axios.get(
        `/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`
    );
};

const searchSpecialtyByNameService = (data) => {
    return axios.get(
        `/api/search-specialty-by-name?search=${data.search}&lang=${data.lang}`
    );
};

//Api phòng khám
const createNewClinic = (data) => {
    return axios.post(`/api/create-new-clinic`, data);
};
const editClinicService = (inputData) => {
    return axios.put(`/api/edit-clinic/${inputData.id}`, inputData);
};
const deleteClinicService = (id) => {
    return axios.delete(`/api/delete-clinic/${id}`);
};

const getAllClinicService = () => {
    return axios.get(`/api/get-clinic`);
};

const getDetailClinicByIdService = (data) => {
    return axios.get(
        `/api/get-detail-clinic-by-id?id=${data.id}&location=${data.location}&search=${data.search}`
    );
};

const searchClinicByNameService = (data) => {
    return axios.get(
        `/api/search-clinic-by-name?search=${data.search}&lang=${data.lang}`
    );
};

//Api search
const getSearchByNameService = (query) => {
    return axios.get(`/api/search-by-name?q=${query}`);
};

const getSearchService = (limit) => {
    return axios.get(`/api/search?limit=${limit}`);
};

const getListPatientForDoctorService = (doctorId, date) => {
    return axios.get(
        `/api/get-list-patient-for-doctor?doctorId=${doctorId}&date=${date}`
    );
};
const sendRemedyService = (data) => {
    return axios.post(`/api/send-remedy`, data);
};

//Api thống kê
const getBookingCountsByMonthService = () => {
    return axios.get(`/api/get-booking-count-by-month`);
};
const getClinicMonthlyBookingStatsService = () => {
    return axios.get(`/api/clinics/monthly-booking-stats`);
};
const countStatsForAdminService = () => {
    return axios.get(`/api/count-stats-for-admin`);
};

//Api lịch hẹn
const getBookingHistoryForPatient = (token) => {
    return axios.get("/api/get-booking-history-for-patient", {
        headers: {
            Authorization: `Bearer ${token}`, // Thay thế 'Bearer' bằng phần tiêu đề thích hợp nếu yêu cầu của bạn yêu cầu
        },
    });
};
const lookUpBookingHistoryForPatient = (email) => {
    return axios.get(`/api/look-up-booking-history-for-patient?email=${email}`);
};
const cancleBookingService = (id) => {
    return axios.put(`/api/cancle-booking/${id}`);
};

//Api update profile
const updateProfileService = (data) => {
    return axios.put(`/api/update-profile/${data.userId}`, data);
};
const changePasswordService = (data) => {
    return axios.post(`/api/change-password`, data);
};

//Api lấy ra genders
const getAllGenderService = () => {
    return axios.get(`/api/get-all-gender`);
};

//Api đăng ký tài khoản
const registerUserService = (data) => {
    return axios.post(`/api/register`, data);
};

//Api đánh giá
const newReviewService = (data) => {
    return axios.post(`/api/new-review`, data);
};
const getDoctorRatingService = (id) => {
    return axios.get(`/api/get-doctor-rating?id=${id}`);
};
const getDoctorReviewService = (id) => {
    return axios.get(`/api/get-reviews?id=${id}`);
};

export {
    handleLoginApi,
    getAllUsersService,
    createNewUserService,
    deleteUserService,
    editUserService,
    getAllCodeService,
    getTopDoctorHomeService,
    getAllDoctorService,
    saveDetailDoctorService,
    getDetailDoctor,
    saveBulkScheduleDoctorService,
    getScheduleDoctorByDateServicde,
    getExtraInforDoctorByIdServicde,
    getProfileDoctorByIdService,
    postPatientBookAppointmentService,
    postVerifyBookAppointmentService,
    createNewSpecialty,
    editSpecialtyService,
    deleteSpecialtyService,
    getAllSpecialtyService,
    getDetailSpecialtyByIdService,
    createNewClinic,
    editClinicService,
    deleteClinicService,
    getAllClinicService,
    getDetailClinicByIdService,
    getSearchByNameService,
    getSearchService,
    getTopDoctorHome2Service,
    handleLoginApi2,
    getUserInforSystem,
    getAdminSystem,
    getListPatientForDoctorService,
    sendRemedyService,
    getBookingCountsByMonthService,
    getClinicMonthlyBookingStatsService,
    countStatsForAdminService,
    getUserInforPatient,
    getBookingHistoryForPatient,
    fetchDashboardData,
    lookUpBookingHistoryForPatient,
    searchDoctorByNameService,
    searchSpecialtyByNameService,
    searchClinicByNameService,
    cancleBookingService,
    updateProfileService,
    changePasswordService,
    getAllGenderService,
    registerUserService,
    newReviewService,
    getDoctorRatingService,
    getDoctorReviewService,
    deleteScheduleService,
    getDoctorByClinic,
};
