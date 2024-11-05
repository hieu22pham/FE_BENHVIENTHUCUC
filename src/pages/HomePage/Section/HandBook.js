import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FormattedMessage } from "react-intl";

export default class HandBook extends Component {
    render() {
        return (
            <div className="section-share section-handbook">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">
                            <FormattedMessage id="homepage.hand-book" />
                        </span>
                        <button className="btn-section">
                            <FormattedMessage id="homepage.more-infor" />
                        </button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            <div className="section-customize">
                                <div className="bg-img handbook-img img-number-1"></div>
                                <div className="description">
                                    {/* 5 khác biệt khi tầm soát bệnh, khám tổng
                                    quát tại Doctor Check */}
                                    Tại sao ngủ ngồi bị ợ hơi và cách chẩn đoán, điều trị
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-img handbook-img img-number-2"></div>
                                <div className="description">
                                    {/* HOT: Hoàn ngay 10% phí xét nghiệm NIPT tại
                                    Hệ thống Medlatec - Hà Nội */}
                                    Cách phân biệt nôn trớ và trào ngược chính xác
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-img handbook-img img-number-3"></div>
                                <div className="description">
                                    Những sai lầm thường gặp khi điều trị ợ nóng trào ngược dạ dày
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-img handbook-img img-number-4"></div>
                                <div className="description">
                                    Cách ngăn ngừa ợ nóng trào ngược dạ dày tái phát sau điều trị
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-img handbook-img img-number-5"></div>
                                <div className="description">
                                    Các phương pháp điều trị đau thắt lưng và
                                    lưu ý giảm đau tại nhà
                                </div>
                            </div>
                            <div className="section-customize">
                                <div className="bg-img handbook-img img-number-6"></div>
                                <div className="description">
                                    Tiêm chủng TCI – Nhận ưu đãi, bảo vệ sức khỏe bạn và gia đình
                                </div>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}
