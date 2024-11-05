import { logger } from "redux-logger"; //để ghi các hoạt động của redux vào console trong quá trình phát triển
import thunkMiddleware from "redux-thunk"; //Middleware cho phép viết các action creators trả về các hàm thay vì chỉ là đối tượng action.
import { routerMiddleware } from "connected-react-router"; //Thư viện kết nối Redux với React Router.
import { createBrowserHistory } from "history"; //Thư viện để quản lý lịch sử địa chỉ trong React Router.

import { createStore, applyMiddleware, compose } from "redux"; //Các hàm từ Redux để tạo Redux store, áp dụng middleware và kết hợp chúng.
import { createStateSyncMiddleware } from "redux-state-sync"; // Middleware để đồng bộ hóa trạng thái Redux giữa các tab trình duyệt hoặc thiết bị khác nhau.
import { persistStore } from "redux-persist"; //Thư viện hỗ trợ Redux giúp bạn lưu trữ trạng thái Redux vào bộ nhớ cục bộ (local storage hoặc AsyncStorage cho ứng dụng React Native).

import createRootReducer from "./reducers/rootReducer";
import actionTypes from "./types/actionTypes";

const environment = process.env.NODE_ENV || "development"; //xác định môi trường
let isDevelopment = environment === "development"; //so ánh xem có đang chạy trong môi trường phát triển không

//hide redux logs
isDevelopment = false;

// Tạo đối tượng lịch sử history sử dụng createBrowserHistory từ thư viện history.
//Đối tượng này sẽ được sử dụng bởi connected-react-router để quản lý lịch sử địa chỉ trong ứng dụng.
export const history = createBrowserHistory({
    basename: process.env.REACT_APP_ROUTER_BASE_NAME,
});

// reduxStateSyncConfig: Cấu hình cho createStateSyncMiddleware.
// Trong trường hợp này, chỉ một hành động với loại actionTypes.APP_START_UP_COMPLETE sẽ được đồng bộ hóa giữa các tab/trình duyệt.
const reduxStateSyncConfig = {
    whitelist: [actionTypes.APP_START_UP_COMPLETE, actionTypes.CHANGE_LANGUAGE],
};

const rootReducer = createRootReducer(history);

//Xây dựng danh sách các middleware sẽ được áp dụng
const middleware = [
    routerMiddleware(history), //Middleware để đồng bộ hóa lịch sử địa chỉ trong Redux với trình duyệt.
    thunkMiddleware, // Middleware cho việc sử dụng action creators trả về hàm thay vì action đối tượng.
    createStateSyncMiddleware(reduxStateSyncConfig), //Middleware để đồng bộ hóa trạng thái Redux.
];

if (isDevelopment) middleware.push(logger); //trong môi trường phát triển thì thêm logger

const composeEnhancers =
    isDevelopment && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

const reduxStore = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middleware))
);

export const dispatch = reduxStore.dispatch; //Export dispatch từ Redux store để có thể gửi các action.

export const persistor = persistStore(reduxStore); //để quản lý việc lưu trữ dữ liệu trạng thái sử dụng Redux Persist.

export default reduxStore;
