import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux";

import { emitter } from "../../utils";

class ModalUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            passWord: "",
            firstName: "",
            lastName: "",
            address: "",
        };

        this.listenToEmitter();
    }

    listenToEmitter() {
        //Lắng nghe emitter phát từ parent
        emitter.on("EVENT_CLEARN_MODAL_INPUT", (data) => {
            // console.log("listen emitter from parent: ", data);
            //reset State
            this.setState({
                email: "",
                passWord: "",
                firstName: "",
                lastName: "",
                address: "",
            });
        });
    } //bus event

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

    handleAddNewUser() {
        //validate
        let isValid = this.checkInputValidate();

        //hợp lệ
        if (isValid) {
            //call api
            this.props.createNewUser(this.state); //gửi dữ liệu sang cho UserManage
            // this.setState({
            //     email: "",
            //     passWord: "",
            //     firstName: "",
            //     lastName: "",
            //     address: "",
            // });
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
                    Create a New User
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
                            />
                        </div>
                        <div className="input-container">
                            <label>PassWord</label>
                            <input
                                type="text"
                                name="passWord"
                                onChange={(e) => handleOnChange(e)}
                                value={this.state.passWord}
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
                            this.handleAddNewUser();
                        }}
                    >
                        Add New
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
