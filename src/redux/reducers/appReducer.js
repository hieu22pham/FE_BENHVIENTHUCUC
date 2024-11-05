import actionTypes from "../types/actionTypes";

const initContentOfConfirmModal = {
    isOpen: false,
    messageId: "",
    handleFunc: null,
    dataFunc: null,
};

const initialState = {
    started: true,
    language: "vi",
    isLoading: false,
    systemMenuPath: "/system/home",
    contentOfConfirmModal: {
        ...initContentOfConfirmModal,
    },
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.APP_START_UP_COMPLETE:
            return {
                ...state,
                started: true,
            };
        case actionTypes.SET_CONTENT_OF_CONFIRM_MODAL:
            return {
                ...state,
                contentOfConfirmModal: {
                    ...state.contentOfConfirmModal,
                    ...action.contentOfConfirmModal,
                },
            };

        case actionTypes.CHANGE_LANGUAGE: {
            // console.log(action);
            return {
                ...state,
                language: action.language,
            };
        }
        case actionTypes.DiSPLAY_LOADING: {
            state.isLoading = true;
            return { ...state };
        }
        case actionTypes.HIDE_LOADING: {
            state.isLoading = false;
            return { ...state };
        }
        case actionTypes.IS_SHOW_LOADING: {
            state.isLoading = action.isLoading;
            return { ...state };
        }
        default:
            return state;
    }
};

export default appReducer;
