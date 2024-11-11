import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import Specialty from "./Section/Specialty";
import MedicalFacility from "./Section/MedicalFacility";
import "./HomePage.scss";
import NextArrow from "./Section/NextArrow";
import PrevArrow from "./Section/PrevArrow";
import OutStandingDoctor from "./Section/OutStandingDoctor";
import HandBook from "./Section/HandBook";
import HomeFooter from "./HomeFooter";
import About from "./Section/About";

class HomePage extends Component {
    render() {
        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 2,
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />,
            // slickGoTo: this.handleAfterChang
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2.5,
                        slidesToScroll: 2,
                    },
                },
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                    },
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1.7,
                        slidesToScroll: 1,
                        arrows: false,
                    },
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1.4,
                        slidesToScroll: 1,
                        arrows: false,
                    },
                },
            ],
        };

        return (
            <div>
                <HomeHeader isShowBanner={true} />
                <Specialty settings={settings} />
                {/* <MedicalFacility settings={settings} /> */}
                <OutStandingDoctor settings={settings} />
                <HandBook settings={settings} />
                <About />
                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
