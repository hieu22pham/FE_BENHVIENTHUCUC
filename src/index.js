import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

import "./styles/styles.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import reduxStore, { persistor } from "./redux/configStore";
import IntlProviderWrapper from "./hoc/IntlProviderWrapper";

const renderApp = () => {
    ReactDOM.render(
        <Provider store={reduxStore}>
            <IntlProviderWrapper>
                <App persistor={persistor} />
            </IntlProviderWrapper>
        </Provider>,
        document.getElementById("root")
    );
};
renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
