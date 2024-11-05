import { toast } from "react-toastify";
import actionTypes from "../types/actionTypes";
import {
    getDetailDoctor,
    cancleBookingService,
    changePasswordService,
    getAllGenderService,
} from "../../services";

export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS,
});

export const userLoginSuccess = (userInfo) => ({
    type: actionTypes.USER_LOGIN_SUCCESS, //viết tắt return
    userInfo: userInfo,
});

export const userLoginSuccess2 = (token) => ({
    type: actionTypes.USER_LOGIN_SUCCESS2, //viết tắt return
    token: token,
});

export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL, //viết tắt return
});

export const processLogout = () => ({
    type: actionTypes.PROCESS_LOGOUT,
});

export const getDetailDoctorAction = (id) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: actionTypes.DiSPLAY_LOADING,
            });
            let res = await getDetailDoctor(id);
            if (res && res.errCode === 0) {
                dispatch(getDetailDoctorSuccess(res.data));
                dispatch({
                    type: actionTypes.HIDE_LOADING,
                });
            } else {
                dispatch(getDetailDoctorFailed());
            }
        } catch (error) {
            console.log("Lỗi getDetailDoctor!", error);
            toast.error("Lấy thông tin chi tiết bác sĩ thất bại!");
        }
    };
};

const getDetailDoctorSuccess = (data) => {
    return {
        type: actionTypes.GET_DETAIL_DOCTOR_SUCCESS,
        data,
    };
};

const getDetailDoctorFailed = () => {
    return {
        type: actionTypes.GET_DETAIL_DOCTOR_FAILED,
    };
};

export const cancleBookingAction = (id) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: actionTypes.DiSPLAY_LOADING,
            });
            let res = await cancleBookingService(id);
            if (res && res.errCode === 0) {
                toast.success(res.message);
                dispatch({
                    type: actionTypes.HIDE_LOADING,
                });
            } else {
                toast.error(res.errMessage);
            }
        } catch (error) {}
    };
};

export const changePasswordAction = (data) => {
    return async (dispatch) => {
        try {
            dispatch({
                type: actionTypes.DiSPLAY_LOADING,
            });
            let res = await changePasswordService(data);
            if (res && res.errCode === 0) {
                toast.success(res.message);
                dispatch({
                    type: actionTypes.HIDE_LOADING,
                });
            } else {
                toast.error(res.errMessage);
                dispatch({
                    type: actionTypes.HIDE_LOADING,
                });
            }
        } catch (error) {}
    };
};

export const getAllGenderAction = () => {
    return async (dispatch) => {
        try {
            dispatch({
                type: actionTypes.DiSPLAY_LOADING,
            });
            let res = await getAllGenderService();

            if (res && res.errCode === 0) {
                dispatch(getAllGenderSuccess(res.data));
                dispatch({
                    type: actionTypes.HIDE_LOADING,
                });
            } else {
                dispatch(getAllGenderFailed());
                dispatch({
                    type: actionTypes.HIDE_LOADING,
                });
            }
        } catch (error) {}
    };
};

const getAllGenderSuccess = (data) => {
    return {
        type: actionTypes.GET_ALL_GENDER_SUCCESS,
        data,
    };
};
const getAllGenderFailed = (data) => {
    return {
        type: actionTypes.GET_ALL_GENDER_FAILED,
        data,
    };
};
