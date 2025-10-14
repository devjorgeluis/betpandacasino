import { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import CustomAlert from "./CustomAlert";
import IconClose from "/src/assets/svg/close.svg";
import IconEye from "/src/assets/svg/eye.svg";
import IconEyeSlash from "/src/assets/svg/eye-slash.svg";
import IconLoading from "/src/assets/svg/loading.svg";

const ChangePasswordModal = ({ onClose }) => {
    const { contextData } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [messageCustomAlert, setMessageCustomAlert] = useState("");

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (newPassword !== confirmPassword) {
            setMessageCustomAlert(["error", "Las nuevas contraseñas no coinciden"]);
            return;
        }

        if (newPassword === "" || confirmPassword === "" || oldPassword === "") {
            setMessageCustomAlert(["error", "La contraseña no puede quedar en blanco."]);
            return;
        }

        if (form.checkValidity()) {
            setIsLoading(true);
            let body = {
                "old_password": oldPassword,
                "new_password": newPassword,
            };
            callApi(
                contextData,
                "POST",
                "/change-password/",
                callbackSubmitChangePassword,
                JSON.stringify(body)
            );
        }
    };

    const callbackSubmitChangePassword = (result) => {
        setIsLoading(false);
        if (result.status === "0") {
            setMessageCustomAlert(["success", "Tu contraseña se ha cambiado y ha sido copiada."]);
            setTimeout(() => {
                onClose();
            }, 2000);
        } else {
            setMessageCustomAlert(["error", result.message || "Error ..."]);
        }
    };

    return (
        <>
            <div className="modal-wrapper_modalWrapper modal-wrapper_shown">
                <div className="modal-wrapper_modalContentWrapper modal-wrapper_hasTitle change-password-modal">
                    <div className="modal-wrapper-title_modalWrapperTitle">
                        <span>Cambiar Contrasena</span>
                        <button onClick={onClose}>
                            <img src={IconClose} />
                        </button>
                    </div>

                    <form className="update-password-form_updatePasswordFormInputs" method="POST" onSubmit={handleSubmit}>
                        <div className="input-wrapper_inputWrapper input-wrapper_default">
                            <div>
                                <label htmlFor="oldPassword" className="input-wrapper_inputWrapperLabel">
                                    <span className="input-wrapper_inputWrapperInput">
                                        <input
                                            id="oldPassword"
                                            className="input_input"
                                            type={showOldPassword ? "text" : "password"}
                                            name="oldPassword"
                                            placeholder="Contraseña actual"
                                            autoComplete="old-password"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            required
                                        />
                                    </span>
                                    {showOldPassword === false ? (
                                        <span
                                            className="input-wrapper-suffix_inputWrapperSuffix"
                                            onClick={() => setShowOldPassword(true)}
                                        >
                                            <button type="button" className="input-button_inputButton">
                                                <img src={IconEyeSlash} />
                                            </button>
                                        </span>
                                    ) : (
                                        <span
                                            className="input-wrapper-suffix_inputWrapperSuffix"
                                            onClick={() => setShowOldPassword(false)}
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

                        <div className="input-wrapper_inputWrapper input-wrapper_default">
                            <div>
                                <label htmlFor="newPassword" className="input-wrapper_inputWrapperLabel">
                                    <span className="input-wrapper_inputWrapperInput">
                                        <input
                                            id="newPassword"
                                            className="input_input"
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            placeholder="Nueva contraseña"
                                            autoComplete="new-password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </span>
                                    {showNewPassword === false ? (
                                        <span
                                            className="input-wrapper-suffix_inputWrapperSuffix"
                                            onClick={() => setShowNewPassword(true)}
                                        >
                                            <button type="button" className="input-button_inputButton">
                                                <img src={IconEyeSlash} />
                                            </button>
                                        </span>
                                    ) : (
                                        <span
                                            className="input-wrapper-suffix_inputWrapperSuffix"
                                            onClick={() => setShowNewPassword(false)}
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

                        <div className="input-wrapper_inputWrapper input-wrapper_default">
                            <div>
                                <label htmlFor="confirmPassword" className="input-wrapper_inputWrapperLabel">
                                    <span className="input-wrapper_inputWrapperInput">
                                        <input
                                            id="confirmPassword"
                                            className="input_input"
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Repita nueva contraseña"
                                            autoComplete="new-password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </span>
                                    {showConfirmPassword === false ? (
                                        <span
                                            className="input-wrapper-suffix_inputWrapperSuffix"
                                            onClick={() => setShowConfirmPassword(true)}
                                        >
                                            <button type="button" className="input-button_inputButton">
                                                <img src={IconEyeSlash} />
                                            </button>
                                        </span>
                                    ) : (
                                        <span
                                            className="input-wrapper-suffix_inputWrapperSuffix"
                                            onClick={() => setShowConfirmPassword(false)}
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

                        <div className="modal-footer_modalFooter mt-0">
                            <button type="button" className="button_button button_zeusPrimary button_md update-password-form_updatePasswordButton" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="button_button button_zeusPrimary button_sm">
                                Cambiar datos y guardar
                                {isLoading && <img src={IconLoading} width={35} />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <CustomAlert message={messageCustomAlert} />
        </>
    );
};

export default ChangePasswordModal;