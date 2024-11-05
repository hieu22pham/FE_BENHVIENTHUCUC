import axios from "axios";
import _ from 'lodash';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    //withCredentials: true,
});

instance.interceptors.response.use((response) => {
    //luồng khi gọi api thành công
    const { data } = response;
    return response.data; //custom lại axios chỉ trả thẳng về data tránh các thuộc tính thừa
});

export default instance;
