import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import {
    getAllUsersService,
    createNewUserService,
    deleteUserService,
    editUserService,
} from "../../services/userService";
import ModalUser from "../../components/System/ModalUser";
import ModalEditUser from "../../components/System/ModalEditUser";
import { emitter } from "../../utils";
import "./UserManage.scss";

class UserManage extends Component {
    constructor(props) {
        super(props);
        //state để dùng lưu biến trong component
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {},
        };
    }

    async componentDidMount() {
        await this.getAllUserFromReact();
    }

    //Get all user
    getAllUserFromReact = async () => {
        let response = await getAllUsersService("ALL");
        console.log(response);

        if (response && response.errCode === 0) {
            this.setState(
                {
                    arrUsers: response.users,
                },
                () => {
                    //kiểm tra state sau khi setState lại bởi this.setState chạy bất đồng bộ
                    // console.log(this.state.arrUsers);
                }
            );
        }
    };

    //Create
    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        });
    };

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        });
    };

    //Add a User
    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);

            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUserFromReact();
                this.setState({
                    isOpenModalUser: false,
                });
            }

            //Phát đi một emit để gửi sang Modal, khi dữ liệu đã được thêm mới
            emitter.emit("EVENT_CLEARN_MODAL_INPUT", { id: "your id" });
            console.log("response create user: ", response);
        } catch (error) {
            console.log(error);
        }
    };

    //Delete
    handleDeleteUser = async (id) => {
        // console.log("delete");
        try {
            let response = await deleteUserService(id);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                //Load lại dữ liệu
                await this.getAllUserFromReact();
                alert(response.message);
            }

            console.log("response delete user: ", response);
        } catch (error) {
            console.log(error);
        }
    };

    //Edit
    handleEditUser = (user) => {
        // console.log(user);
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user,
        });
    };

    //tắt modal
    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        });
    };

    editUser = async (user) => {
        // console.log("click save user: ", user);
        try {
            let res = await editUserService(user);
            if (res && res.errCode !== 0) {
                alert(res.errCode);
            } else {
                //Load lại data
                await this.getAllUserFromReact();
                this.setState({
                    isOpenModalEditUser: false,
                });
            }

            console.log("response edit user: ", res);
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        // console.log("render: ", this.state.arrUsers); //chạy 2 lần do một lần mount và một lần setState
        let { arrUsers } = this.state;

        let renderListUser = () => {
            //Lặp qua từng phần tử để render ra giao diện
            return arrUsers.map((user, index) => {
                return (
                    <tr key={index}>
                        <td>{user.email}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.address}</td>
                        <td>
                            <button
                                className="btn-Edit"
                                onClick={() => {
                                    this.handleEditUser(user);
                                }}
                            >
                                <i className="fas fa-pencil-alt" />
                            </button>
                            <button
                                className="text-danger btn-Delete"
                                onClick={() => {
                                    this.handleDeleteUser(user.id);
                                }}
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                );
            });
        };

        return (
            <div className="users-container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggle={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {this.state.isOpenModalEditUser && (
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggle={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser={this.editUser}
                    />
                )}
                <div className="title text-center">Manage user</div>
                <div>
                    <button
                        className="btn btn-primary px-3 mx-3"
                        onClick={() => this.handleAddNewUser()}
                    >
                        <i className="fas fa-plus"></i> Add New User
                    </button>
                </div>
                <div className="user-table mt-4 mx-3 table-responsive">
                    <table id="customers" className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {arrUsers && <tbody>{renderListUser()}</tbody>}
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
