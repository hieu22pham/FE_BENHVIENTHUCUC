import React, { Component } from "react";
import { FormattedMessage } from "react-intl";

class About extends Component {
    render() {
        return (
            <div className="section-share section-about">
                <div className="section-about-container">
                    <div>
                        <div className="section-about-header">
                            <h2>
                                <FormattedMessage
                                    id={"homepage.text-about-media"}
                                />
                            </h2>
                        </div>
                        <div className="section-about-content">
                            <div className="content-left">
                                <iframe
                                    width="100%"
                                    height="450"
                                    src="https://www.youtube.com/embed/Dts7MuVTl1o"
                                    title="Hệ thống Y tế Thu Cúc  - Chăm sóc sức khỏe trọn đời cho bạn"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="content-right">

                                <p>
                                    <FormattedMessage
                                        id={"homepage.text-about-media-talk"}
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default About;
