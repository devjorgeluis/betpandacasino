import { useEffect } from "react";
import { responsible } from "/src/assets/js/responsible.js";
import IconClose from "/src/assets/svg/close.svg";

const ResponsibleGamingModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-wrapper_modalWrapper modal-wrapper_shown">
            <div className="modal-wrapper_modalContentWrapper modal-wrapper_hasTitle general-modal">
                <div className="modal-wrapper-title_modalWrapperTitle">
                    <span>Juego responsable</span>
                    <button onClick={onClose}>
                        <img src={IconClose} />
                    </button>
                </div>
                <div className="login-modal_loginModalInner">
                    <div className="login-modal_modalDescription">
                        {responsible.text}
                    </div>
                </div>
                <div className="modal-footer_modalFooter">
                    <button className="button_button button_zeusPrimary button_md modal-close-button_modalCloseButton" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default ResponsibleGamingModal;