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
                                    height="400"
                                    src="https://www.youtube.com/embed/Dts7MuVTl1o"
                                    title="Hệ thống Y tế Thu Cúc - Chăm sóc sức khỏe trọn đời cho bạn"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="content-right">
                                <ul>
                                    <li>
                                        <a
                                            target="_blank"
                                            title="Báo sức khỏe đời sống"
                                            href="https://baotintuc.vn/y-te/viec-xep-so-lay-so-xep-hang-tu-to-mo-sang-kham-benh-rat-bat-cap-20221024150005519.htm"
                                            rel="noreferrer"
                                        >
                                            <div className="truyenthong-img suckhoedoisong-img"></div>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            target="_blank"
                                            title="VnExpress"
                                            href="https://baotintuc.vn/y-te/viec-xep-so-lay-so-xep-hang-tu-to-mo-sang-kham-benh-rat-bat-cap-20221024150005519.htm"
                                            rel="noreferrer"
                                        >
                                            <div className="truyenthong-img vnexpress-img"></div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default About;
