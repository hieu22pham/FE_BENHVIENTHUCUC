import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

class HeaderBack extends Component {
    handleGoBack = () => {
        this.props.history.goBack();
    };
    render() {
        return (
            <header style={{ backgroundColor: "#2d6a4f" }}>
                <nav className="navbar navbar-primary">
                    <button
                        className="btn btn-light"
                        onClick={this.handleGoBack}
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="text-light"
                            fontSize={24}
                        />
                    </button>
                </nav>
            </header>
        );
    }
}

export default withRouter(HeaderBack);
