import { useContext, useState, useEffect } from "react";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import CustomAlert from "../components/CustomAlert";
import ImgLogo from "/src/assets/img/logo.png";
import IconClose from "/src/assets/svg/close.svg";
import IconEye from "/src/assets/svg/eye.svg";
import IconEyeSlash from "/src/assets/svg/eye-slash.svg";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const { contextData, updateSession } = useContext(AppContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [messageCustomAlert, setMessageCustomAlert] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity()) {
            setIsLoading(true);

            let body = {
                username: username,
                password: password,
            };
            callApi(
                contextData,
                "POST",
                "/login/",
                callbackSubmitLogin,
                JSON.stringify(body)
            );
        }
    };

    const callbackSubmitLogin = (result) => {
        setIsLoading(false);
        if (result.status === "success") {
            localStorage.setItem("session", JSON.stringify(result));
            updateSession(result);

            if (onLoginSuccess) {
                onLoginSuccess(result.user.balance);
            }
            setTimeout(() => {
                onClose();
            }, 1000);
        } else {
            setMessageCustomAlert(["error", "Nombre de usuario o contraseña no válidos"]);
        }
    };

    useEffect(() => {
        const passwordInput = document.getElementById("password");
        if (passwordInput) {
            passwordInput.setAttribute("type", showPassword ? "text" : "password");
        }
    }, [showPassword]);

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-wrapper_modalWrapper modal-wrapper_shown">
                <div className="modal-wrapper_modalContentWrapper modal-wrapper_hasTitle login-modal">
                    <div className="modal-wrapper-title_modalWrapperTitle">
                        <span>Acceder</span>
                        <button onClick={onClose}>
                            <img src={IconClose} />
                        </button>
                    </div>

                    <div className="login-modal_loginModalInner">
                        <div className="login-modal_logoCentered">
                            <img alt="" loading="lazy" width="118" height="48" className="logo_logo" src={ImgLogo} />
                        </div>
                        <div className="login-modal_modalDescription">
                            <p className="login-modal_modalDescriptionInner">Introduce tu nombre de usuario y contraseña para empezar a jugar</p>
                        </div>
                        <div>
                            <form className="login-form_loginFormForm" method="POST" onSubmit={handleSubmit}>
                                <div className="input-wrapper_inputWrapper input-wrapper_default">
                                    <div>
                                        <label htmlFor="username" className="input-wrapper_inputWrapperLabel">
                                            <span className="input-wrapper_inputWrapperInput">
                                                <input
                                                    className="input_input login-form_loginFormInput"
                                                    type="text"
                                                    name="username"
                                                    placeholder="Nombre de usuario"
                                                    autoComplete="false"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    required
                                                />
                                            </span>
                                        </label>
                                    </div>
                                    <fieldset className="input-wrapper_inputWrapperFieldset"></fieldset>
                                </div>
                                
                                <div className="input-wrapper_inputWrapper input-wrapper_default">
                                    <div>
                                        <label htmlFor="password" className="input-wrapper_inputWrapperLabel">
                                            <span className="input-wrapper_inputWrapperInput">
                                                <input
                                                    id="password"
                                                    className="input_input login-form_loginFormInput"
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    placeholder="Contraseña"
                                                    autoComplete="false"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </span>
                                            {showPassword === false ? (
                                                <span
                                                    className="input-wrapper-suffix_inputWrapperSuffix"
                                                    onClick={() => setShowPassword(true)}
                                                >
                                                    <button type="button" className="input-button_inputButton">
                                                        <img src={IconEyeSlash} />
                                                    </button>
                                                </span>
                                            ) : (
                                                <span
                                                    className="input-wrapper-suffix_inputWrapperSuffix"
                                                    onClick={() => setShowPassword(false)}
                                                >
                                                    <button type="button" className="input-button_inputButton">
                                                        <img src={IconEye} />
                                                    </button>
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                    <fieldset className="input-wrapper_inputWrapperFieldset"></fieldset>
                                </div>
                                <button className="button_button button_zeusPrimary button_sm login-form_loginFormButton" type="submit">Acceder
                                    {
                                        isLoading && 
                                        <span className="button_buttonLoader">
                                            <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" data-icon="loading" viewBox="0 0 1024 1024"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.5 440.5 0 0 0-94.3-139.9 437.7 437.7 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150s83.9 101.8 109.7 162.7c26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36"></path></svg>
                                        </span>
                                    }
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <CustomAlert message={messageCustomAlert} />
        </>
    );
};

export default LoginModal;