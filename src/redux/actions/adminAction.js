import { toast } from "react-toastify";
import {
    getAllCodeService,
    createNewUserService,
    getAllUsersService,
    deleteUserService,
    editUserService,
    getTopDoctorHomeService,
    getAllDoctorService,
    saveDetailDoctorService,
    getAllSpecialtyService,
    getAllClinicService,
} from "../../services";
import actionTypes from "../types/actionTypes";

//redux-thunk
export const fecthGenderStart = () => {
    return async (dispatch) => {
        dispatch({
            type: actionTypes.FETCH_GENDER_START,
        });

        try {
            let res = await getAllCodeService("GENDER");

            if (res && res.errCode === 0) {
                dispatch(fecthGenderSuccess(res.data));
            } else {
                dispatch(fecthGenderFailed());
            }
        } catch (error) {
            dispatch(fecthGenderFailed());
            console.log("fetachGenderStart error: ", error);
        }
    };
};

export const fecthGenderSuccess = (genderData) => {
    return {
        type: actionTypes.FETCH_GENDER_SUCCESS,
        data: genderData,
    };
};
export const fecthGenderFailed = () => {
    return {
        type: actionTypes.FETCH_GENDER_FAILED,
    };
};

//Lấy ra chức vụ
export const fecthPositionStart = () => {
    return async (dispatch) => {
        try {
            let res = await getAllCodeService("POSITION");

            if (res && res.errCode === 0) {
                dispatch(fecthPositionSuccess(res.data));
            } else {
                dispatch(fecthPositionFailed());
            }
        } catch (error) {
            dispatch(fecthPositionFailed());
            console.log("fecthPositionStart error: ", error);
        }
    };
};

export const fecthPositionSuccess = (positionData) => {
    return {
        type: actionTypes.FETCH_POSITION_SUCCESS,
        data: positionData,
    };
};

export const fecthPositionFailed = () => {
    return {
        type: actionTypes.FETCH_POSITION_FAILED,
    };
};

//Lấy ra role
export const fecthRoleStart = () => {
    return async (dispatch) => {
        try {
            let res = await getAllCodeService("ROLE");

            if (res && res.errCode === 0) {
                dispatch(fecthRoleSuccess(res.data));
            } else {
                dispatch(fecthRoleFailed());
            }
        } catch (error) {
            dispatch(fecthRoleFailed());
            console.log("fecthRoleStart error: ", error);
        }
    };
};
export const fecthRoleSuccess = (roleData) => {
    return {
        type: actionTypes.FETCH_ROLE_SUCCESS,
        data: roleData,
    };
};

export const fecthRoleFailed = () => {
    return {
        type: actionTypes.FETCH_ROLE_FAILED,
    };
};

//Tạo user mới
export const createNewUserAction = (data) => {
    // console.log(data);
    return async (dispatch) => {
        try {
            let res = await createNewUserService(data);
            if (res && res.errCode === 0) {
                dispatch(saveUserSuccess());
            }
            return res;
        } catch (error) {
            dispatch(saveUserFailed());
            console.log(error);
        }
    };
};

export const saveUserSuccess = () => {
    return {
        type: actionTypes.CREATE_USER_SUCCESS,
    };
};

export const saveUserFailed = () => {
    return {
        type: actionTypes.CREATE_USER_FAILED,
    };
};

//Lấy danh sách user
export const getAllUserAction = (inputId) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: actionTypes.DiSPLAY_LOADING,
            });
            let res = await getAllUsersService(inputId);
            if (res && res.errCode === 0) {
                dispatch(getAllUserSuccess(res.users));
                dispatch({
                    type: actionTypes.HIDE_LOADING,
                });
            }
        } catch (error) {
            console.log(error);
            dispatch(getAllUserFailed());
        }
    };
};

export const getAllUserSuccess = (data) => {
    return {
        type: actionTypes.GET_ALL_USER_SUCCESS,
        users: data,
    };
};

export const getAllUserFailed = () => {
    return {
        type: actionTypes.GET_ALL_USER_FAILED,
    };
};

//Xóa người dùng
export const deleteUserAction = (id) => {
    return async (dispatch) => {
        try {
            let res = await deleteUserService(id);
            return res;
        } catch (error) {
            dispatch(deleteUserFailed());
            console.log(error);
        }
    };
};

export const deleteUserSuccess = () => {
    return {
        type: actionTypes.DELETE_USER_SUCCESS,
    };
};

export const deleteUserFailed = () => {
    return {
        type: actionTypes.DELETE_USER_FAILED,
    };
};

//Sửa người dùng
export const editUserAction = (data) => {
    return async (dispatch) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Cập nhập user thành công!");
                dispatch(editUserSuccess());
                dispatch(getAllUserAction("ALL"));
            } else {
                toast.success(res.errMessage);
            }
        } catch (error) {
            toast.error("Cập nhập user lỗi!");
            dispatch(editUserFailed());
            console.log("editUserAction lỗi", error);
        }
    };
};

export const editUserSuccess = () => {
    return {
        type: actionTypes.EDIT_USER_SUCCESS,
    };
};

export const editUserFailed = () => {
    return {
        type: actionTypes.EDIT_USER_FAILED,
    };
};

//
export const getTopDoctorAction = () => {
    return async (dispatch) => {
        try {
            dispatch({
                type: actionTypes.DiSPLAY_LOADING,
            });
            let res = await getTopDoctorHomeService("");
            if (res && res.errCode === 0) {
                dispatch(getTopDoctorSuccess(res.data));
                // console.log("check res get top doctor: ", res);
                dispatch({
                    type: actionTypes.HIDE_LOADING,
                });
            } else {
                dispatch(getTopDoctorFailed());
            }
        } catch (error) {
            console.log("Lỗi getTopDoctorAction: ", error);
            dispatch(getTopDoctorFailed());
        }
    };
};

const getTopDoctorSuccess = (data) => {
    return {
        type: actionTypes.GET_TOP_DOCTORS_SUCCESS,
        data,
    };
};
const getTopDoctorFailed = () => {
    return {
        type: actionTypes.GET_TOP_DOCTORS_FAILED,
    };
};

//Lấy tất cả doctor
export const getAllDoctorAction = () => {
    return async (dispatch) => {
        try {
            dispatch({
                type: actionTypes.DiSPLAY_LOADING,
            });
            let res = await getAllDoctorService();
            if (res && res.errCode === 0) {
                dispatch(getAllDoctorSuccess(res.data));
                dispatch({
                    type: actionTypes.HIDE_LOADING,
                });
            }
        } catch (error) {
            console.log("Lỗi getAllDoctor: ", error);
            dispatch(getAllDoctorFailed());
        }
    };
};

export const getAllDoctorSuccess = (doctors) => {
    return {
        type: actionTypes.GET_ALL_DOCTORS_SUCCESS,
        data: doctors,
    };
};
export const getAllDoctorFailed = () => {
    return {
        type: actionTypes.GET_ALL_DOCTORS_FAILED,
    };
};

//Lưu thông tin chi tiết doctor
export const saveDetailDoctorAction = (data) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: actionTypes.DiSPLAY_LOADING,
            });
            let res = await saveDetailDoctorService(data);
            if (res && res.errCode === 0) {
                toast.success("Lưu thông tin chi tiết bác sĩ thành công!");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
                });
                dispatch({
                    type: actionTypes.HIDE_LOADING,
                });
            } else {
                toast.error("Lưu thông tin chi tiết bác sĩ thất bại!");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
                });
                dispatch({
                    type: actionTypes.HIDE_LOADING,
                });
            }
        } catch (error) {
            toast.error("Lưu thông tin chi tiết bác sĩ thất bại!");
            console.log("Lỗi saveDetailDoctor: ", error);
            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
            });
            dispatch({
                type: actionTypes.HIDE_LOADING,
            });
        }
    };
};

//Lấy tất cả thời gian
export const getAllScheduleTimeAction = (type) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: actionTypes.DiSPLAY_LOADING,
            });
            let res = await getAllCodeService("TIME");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.GET_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    data: res.data,
                });
                dispatch({
                    type: actionTypes.HIDE_LOADING,
                });
            }
        } catch (err) {
            console.log("Lỗi getAllScheduleHoursAction: ", err);
            dispatch({
                type: actionTypes.GET_ALLCODE_SCHEDULE_TIME_FAILED,
            });
        }
    };
};

//Lấy tất cả giá, tỉnh thành, phương thức thanh toán của bác sĩ
export const getRequiredDoctorInfor = () => {
    return async (dispatch) => {
        dispatch({
            type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START,
        });

        try {
            let resPrice = await getAllCodeService("PRICE");
            let resPayment = await getAllCodeService("PAYMENT");
            let resProvince = await getAllCodeService("PROVINCE");
            let resSpecialty = await getAllSpecialtyService();
            let resClinic = await getAllClinicService();

            if (
                resPrice &&
                resPayment &&
                resProvince &&
                resSpecialty &&
                resClinic &&
                resPrice.errCode === 0 &&
                resPayment.errCode === 0 &&
                resProvince.errCode === 0 &&
                resSpecialty.errCode === 0 &&
                resClinic.errCode === 0
            ) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data,
                };
                dispatch(fecthRequiredDoctorInforSuccess(data));
            } else {
                dispatch(fecthRequiredDoctorInforFailed());
            }
        } catch (error) {
            dispatch(fecthRequiredDoctorInforFailed());
            console.log("fetachGenderStart error: ", error);
        }
    };
};

export const fecthRequiredDoctorInforSuccess = (data) => {
    return {
        type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
        data: data,
    };
};
export const fecthRequiredDoctorInforFailed = () => {
    return {
        type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED,
    };
};

export const getAllClinicAction = () => {
    return async (dispatch) => {
        try {
            dispatch({
                type: actionTypes.DiSPLAY_LOADING,
            });
            let res = await getAllClinicService();
            if (res && res.errCode === 0) {
                dispatch(getAllClinicSuccess(res.data));
                dispatch({
                    type: actionTypes.HIDE_LOADING,
                });
            } else {
                dispatch(getAllClinicFailed());
                dispatch({
                    type: actionTypes.HIDE_LOADING,
                });
            }
        } catch (error) {}
    };
};

const getAllClinicSuccess = (data) => {
    return {
        type: actionTypes.GET_ALL_CLINIC_SUCCESS,
        data,
    };
};
const getAllClinicFailed = (data) => {
    return {
        type: actionTypes.GET_ALL_CLINIC_FAILED,
        data,
    };
};
