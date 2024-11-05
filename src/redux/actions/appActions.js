import actionTypes from "../types/actionTypes";
const changeLanguageAppAction = (language) => {
    return {
        type: actionTypes.CHANGE_LANGUAGE,
        language: language,
    };
};

const isLoadingAction = (isLoading) => {
    return {
        type: actionTypes.IS_SHOW_LOADING,
        isLoading: isLoading,
    };
};

export { changeLanguageAppAction, isLoadingAction };
