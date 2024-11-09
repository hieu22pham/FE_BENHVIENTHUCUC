import React from "react";
import style from "./LoadingComponent.module.scss";
import { useSelector } from "react-redux";

export default function LoadingComponent() {
    const { isLoading } = useSelector((state) => state.appReducer);

    //Nếu true cho hiển thị
    if (isLoading) {
        return (
            <div className={style.bgLoading}>
                <img
                    src={require("../../assets/imgloading/loadinganimation.gif")}
                    alt=""
                />
            </div>
        );
    } else {
        return "";
    }
}
