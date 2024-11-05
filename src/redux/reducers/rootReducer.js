import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import userReducer from "./userReducer";
import appReducer from "./appReducer";
import adminReducer from "./adminReducer";

const persistCommonConfig = {
    storage: storage,
    stateReconciler: autoMergeLevel2,
};

const userPersistConfig = {
    ...persistCommonConfig,
    key: "user",
    whitelist: ["isLoggedIn", "userInfo", "token"],
};

//Lưu lại trạng thái language khi reload
const appPersistConfig = {
    ...persistCommonConfig,
    key: "app",
    whitelist: ["language"], //tên các biên trên redux muốn lưu lại
};
// eslint-disable-next-line import/no-anonymous-default-export
export default (history) =>
    combineReducers({
        router: connectRouter(history),
        user: persistReducer(userPersistConfig, userReducer),
        appReducer: persistReducer(appPersistConfig, appReducer),
        adminReducer: adminReducer,
    });

// autoMergeLevel2: Một hàm để tự động hợp nhất trạng thái trong redux-persist.
// storage: Thư viện để quản lý lưu trữ dữ liệu, thường là local storage hoặc session storage.
// persistReducer: Hàm trong redux-persist để tạo ra reducer có khả năng lưu trạng thái.
// combineReducers: Hàm trong Redux để kết hợp nhiều reducer thành một reducer duy nhất.
// connectRouter: Hàm từ thư viện connected-react-router để kết nối Redux với React Router.
// Khai báo cấu hình cho việc lưu trạng thái:

// - persistCommonConfig: Cấu hình chung cho việc lưu trạng thái. Sử dụng storage là local storage và autoMergeLevel2
//để hợp nhất trạng thái.
// - adminPersistConfig: Cấu hình lưu trạng thái cho phần "admin". Lưu trạng thái với key là "admin" và chỉ lưu các
//thuộc tính được chỉ định trong mảng whitelist.
// - userPersistConfig: Cấu hình lưu trạng thái cho phần "user". Lưu trạng thái với key là "user" và
//chỉ lưu các thuộc tính được chỉ định trong mảng whitelist.

// Tạo reducer chính:

// Hàm export là một function nhận vào tham số history, được sử dụng để tạo reducer chính.
// - Sử dụng combineReducers để kết hợp các reducer lại với nhau.
// - Reducer router được tạo bởi connectRouter(history) để quản lý trạng thái địa chỉ trong React Router.
// - Reducer admin và user được tạo bằng cách sử dụng persistReducer với cấu hình tương ứng và reducer tương ứng
//(adminReducer và userReducer).
// - Tổng cộng, đoạn mã này giúp bạn tạo ra một reducer chính có khả năng lưu trạng thái của các phần "admin" và "user"
//vào local storage, và cũng quản lý trạng thái địa chỉ của React Router thông qua reducer router.
