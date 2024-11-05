import actionTypes from "../types/actionTypes";

const initialState = {
    genders: [],
    roles: [],
    positions: [],
    isLoadingGender: false,
    users: [],
    topDoctors: [],
    listDoctor: [],
    allScheduleTime: [],
    prices: [],
    provinces: [],
    payments: [],
    specialties: [],
    clinics: [],
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START: {
            state.isLoadingGender = true;

            return { ...state };
        }
        case actionTypes.FETCH_GENDER_SUCCESS: {
            let copyState = { ...state };
            copyState.genders = action.data;
            copyState.isLoadingGender = false;

            return copyState;
        }
        case actionTypes.FETCH_GENDER_FAILED: {
            let copyState = { ...state };
            copyState.genders = [];
            copyState.isLoadingGender = false;

            return { ...state };
        }

        case actionTypes.FETCH_POSITION_SUCCESS: {
            state.positions = action.data;
            return { ...state };
        }
        case actionTypes.FETCH_POSITION_FAILED: {
            state.positions = [];
            return { ...state };
        }
        case actionTypes.FETCH_ROLE_SUCCESS: {
            state.roles = action.data;
            return { ...state };
        }
        case actionTypes.FETCH_ROLE_FAILED: {
            state.roles = [];
            return { ...state };
        }

        case actionTypes.CREATE_USER_SUCCESS: {
            return { ...state };
        }
        case actionTypes.CREATE_USER_FAILED: {
            return { ...state };
        }

        case actionTypes.GET_ALL_USER_SUCCESS: {
            state.users = action.users;
            return { ...state };
        }

        case actionTypes.GET_ALL_USER_FAILED: {
            state.users = [];
            return { ...state };
        }

        case actionTypes.GET_TOP_DOCTORS_SUCCESS: {
            state.topDoctors = action.data;
            return { ...state };
        }

        case actionTypes.GET_TOP_DOCTORS_FAILED: {
            state.topDoctors = [];
            return { ...state };
        }
        case actionTypes.GET_ALL_DOCTORS_SUCCESS: {
            state.listDoctor = action.data;
            return { ...state };
        }
        case actionTypes.GET_ALL_DOCTORS_FAILED: {
            state.listDoctor = [];
            return { ...state };
        }
        case actionTypes.GET_ALLCODE_SCHEDULE_TIME_SUCCESS: {
            state.allScheduleTime = action.data;
            return { ...state };
        }
        case actionTypes.GET_ALLCODE_SCHEDULE_TIME_FAILED: {
            state.allScheduleTime = [];
            return { ...state };
        }
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START: {
            state.isLoadingGender = true;

            return { ...state };
        }
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS: {
            let copyState = { ...state };
            copyState.prices = action.data.resPrice;
            copyState.provinces = action.data.resProvince;
            copyState.payments = action.data.resPayment;
            copyState.specialties = action.data.resSpecialty;
            copyState.clinics = action.data.resClinic;
            copyState.isLoadingGender = false;

            return copyState;
        }
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED: {
            let copyState = { ...state };
            copyState.prices = [];
            copyState.payments = [];
            copyState.provinces = [];
            copyState.isLoadingGender = false;

            return { ...state };
        }
        case actionTypes.GET_ALL_CLINIC_SUCCESS: {
            let copyState = { ...state };
            copyState.clinics = action.data;
            return copyState;
        }
        case actionTypes.GET_ALL_CLINIC_FAILED: {
            let copyState = { ...state };
            copyState.clinics = [];
            return copyState;
        }
        default:
            return state;
    }
};
export default adminReducer;
