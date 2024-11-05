import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import _ from "lodash"; //xử lý mảng và obj hiệu quả tương tự jquery

class ModalEditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            email: "",
            passWord: "",
            firstName: "",
            lastName: "",
            address: "",
        };
    }

    toggle() {
        this.props.toggle(); //lấy bên cha
    }

    checkInputValidate = () => {
        let isValid = true;

        let arrInput = [
            "email",
            "passWord",
            "firstName",
            "lastName",
            "address",
        ];

        //Dung for de co the dung break va continue
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert("Không được để trống " + arrInput[i]);
                break;
            }
        }

        return isValid;
    };

    handleSaveUser() {
        //validate
        let isValid = this.checkInputValidate();

        //hợp lệ
        if (isValid) {
            //call api edit user
            this.props.editUser(this.state); //gửi dữ liệu sang cho UserManage
        }
    }

    //Lần đầu tiên khi được mount vào DOM sẽ chạy
    componentDidMount() {
        let { currentUser } = this.props; //obj
        console.log("didmount edit modal", this.props.currentUser);

        //check không rỗng
        if (currentUser && !_.isEmpty(currentUser)) {
            this.setState({
                id: currentUser.id,
                email: currentUser.email,
                passWord: "hardcode",
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                address: currentUser.address,
            });
        }
    }

    render() {
        //set lai state
        let handleOnChange = (e) => {
            const { name, value } = e.target;
            // console.log(name, value);

            this.setState(
                {
                    [name]: value,
                },
                () => {
                    // console.log(this.state);
                }
            );
        };

        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => {
                    this.toggle();
                }}
                className={"modal-user-container"}
                size="lg"
                centered
            >
                <ModalHeader
                    toggle={() => {
                        this.toggle();
                    }}
                >
                    Edit User
                </ModalHeader>
                <ModalBody>
                    <div className="modal-user-body">
                        <div className="input-container">
                            <label>Email</label>
                            <input
                                type="text"
                                name="email"
                                onChange={(e) => handleOnChange(e)}
                                value={this.state.email}
                                disabled
                            />
                        </div>
                        <div className="input-container">
                            <label>PassWord</label>
                            <input
                                type="password"
                                name="passWord"
                                onChange={(e) => handleOnChange(e)}
                                value={this.state.passWord}
                                disabled
                            />
                        </div>
                        <div className="input-container">
                            <label>First name</label>
                            <input
                                type="text"
                                name="firstName"
                                onChange={(e) => handleOnChange(e)}
                                value={this.state.firstName}
                            />
                        </div>
                        <div className="input-container">
                            <label>Last name</label>
                            <input
                                type="text"
                                name="lastName"
                                onChange={(e) => handleOnChange(e)}
                                value={this.state.lastName}
                            />
                        </div>
                        <div className="input-container max-width-input">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                onChange={(e) => handleOnChange(e)}
                                value={this.state.address}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        className="px-3"
                        onClick={() => {
                            this.handleSaveUser();
                        }}
                    >
                        Save Changes
                    </Button>
                    <Button
                        className="px-3"
                        color="secondary"
                        onClick={() => {
                            this.toggle();
                        }}
                    >
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}
const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
