import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
//Đây là công việc nhập một trình trợ giúp từ "redux-auth-wrapper" để xây dựng một đối tượng hỗ trợ về vị trí
//và điều hướng trong ứng dụng.
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";
// Đây là công việc nhập một HOC (Thành phần bậc cao hơn) từ "redux-auth-wrapper" được sử dụng để tạo các hướng
//điều khiển dựa trên trạng thái xác thực.

const locationHelper = locationHelperBuilder({}); //tạo đói tượng xử lí và điều hướng

export const userIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: (state) => state.user.isLoggedIn, //nếu true thì mới được phép truy cập, false -> redirectPath
    wrapperDisplayName: "UserIsAuthenticated",
    redirectPath: "/login",
});
// - authenticatedSelectorlà một chức năng được sử dụng để xác định trạng thái xác thực của người dùng dựa trên trạng thái Redux.
//Trong trường hợp này, nó kiểm tra xem state.admin.isLoggedIn có đúng true hay không.
// - wrapperDisplayName là tên hiển thị của HOC khi xem trong DevTools.
// - redirectPath đường dẫn sẽ được chuyển hướng nếu người dùng không xác thực.

export const userIsNotAuthenticated = connectedRouterRedirect({
    // Want to redirect the user when they are authenticated
    authenticatedSelector: (state) => !state.user.isLoggedIn, //nếu false thì mới được phép truy cập, true thì chạy redirectPath
    wrapperDisplayName: "UserIsNotAuthenticated",
    redirectPath: (state, ownProps) =>
        locationHelper.getRedirectQueryParam(ownProps) || "/",
    allowRedirectBack: false,
});
// - Đây cũng là một HOC tương tự, nhưng ngược lại. Nó sẽ kiểm tra xem người dùng đã xác thực chưa, sau đó sẽ
//chuyển hướng điều hướng đến đường dẫn đã xác định.
// - authenticatedSelectortrong trường hợp này kiểm tra xem state.admin.isLoggedIn có đúng false hay không.
//Nếu isLoggedIn là false thì authenticated sẽ là true(không được phép truy cập) thì sẽ chạy đến redirectPath
// - redirectPath(nếu người dùng không được phép truy cập) ở đây có thể trả về đường dẫn từ tham số truyền vào hoặc
//sử dụng trình trợ giúp để lấy đường dẫn từ tham số truy vấn trong URL.
