import React from "react";

export default function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                display: "flex",
                background: "#fff",
                justifyContent: "center",
                alignItems: "center",
                transform: "translate(-25%, -70%)",
                width: "44px",
                height: "48px",
                border: "2px solid #d7d7d7",
                opacity: "0.5",
                textAlign: "center",
            }}
            onClick={onClick}
        >
            <i
                className="fas fa-angle-left"
                style={{ fontSize: "30px", color: "#959595", opacity: 0.5 }}
            ></i>
        </div>
    );
}
