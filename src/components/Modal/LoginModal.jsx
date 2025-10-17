import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import LoadApi from "../Loading/LoadApi";
import IconClose from "/src/assets/svg/close.svg";

const LoginModal = ({ isMobile, isOpen, onClose, onConfirm, onLoginSuccess }) => {
    const { contextData, updateSession } = useContext(AppContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
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
                onConfirm();
            }, 1000);
        } else {
            setErrorMsg("Correo electrónico o contraseña no válidos");
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
            <div className="fade modal show" style={{ display: "block" }}>
                <div className={`modal-dialog user-modal login-modal modal-lg modal-dialog-centered ${isMobile ? 'mobile' : 'desktop'}`}>
                    <div className="modal-content">
                        <div className="modal-wrapper login active">
                            <button className="modal-close-btn" onClick={onClose}>
                                <img src={IconClose} />
                            </button>
                        </div>
                        <div className="modal-container">
                            <div className="modal-header">
                                <div className="header title-content">
                                    <div className="titleContainer"><span className="title">Te damos la bienvenida de nuevo</span></div>
                                </div>
                            </div>
                            <div className="modal-body">
                                <form className="form login" method="POST" onSubmit={handleSubmit}>
                                    {
                                        errorMsg !== "" && <div className="alert alert-danger">
                                            {errorMsg}
                                        </div>
                                    }
                                    <div>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="username"
                                                placeholder="Nombre de usuario"
                                                autoComplete="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group password">
                                            <div className="input-password-wrapper">
                                                <input
                                                    id="password"
                                                    className="form-control"
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    placeholder="Contraseña"
                                                    autoComplete="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {
                                                showPassword === false ? (
                                                <span className="eye-password" id="eyePassword" onClick={() => setShowPassword(true)}>
                                                    <span className="material-icons">visibility_off</span>
                                                </span>
                                                ) : (
                                                <span className="eye-password" id="eyePassword" onClick={() => setShowPassword(false)}>
                                                    <span className="material-icons">visibility</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-cta full-width">
                                        {
                                            isLoading ? <>
                                                <span style={{visibility: "hidden"}}>Acceso</span>
                                                <LoadApi />
                                            </> : "Acceso"
                                        }
                                    </button>
                                </form>
                            </div>
                            <div className="modal-footer">
                                {/* <div className="generic-text-button-container register-link">
                                    <span className="before-generic-text">¿No tienes una cuenta?</span>
                                    <span className="text px-2">regístrate</span>
                                </div>
                                <div className="generic-text-button-container false">
                                    <span className="before-generic-text">¿Te olvidaste la contraseña?</span>
                                    <span className="text px-2">restablécela aquí.</span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginModal;