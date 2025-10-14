import { useState, useEffect } from "react";
import IconNotification from "/src/assets/svg/notification.svg";
import IconClose from "/src/assets/svg/white-close.svg";

const CustomAlert = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(!!message && Array.isArray(message) && message[1] !== "");

  useEffect(() => {
    setIsVisible(!!message && Array.isArray(message) && message[1] !== "");
  }, [message]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="toast_toastWrapper">
      {message && Array.isArray(message) && message[1] !== "" && (
        <div className="toast-card_toastWrapper toast-card_shown">
          <div className="toast-card_toast toast-card_shown">
            <div className="toast-card-header_toastCardHeader">
              <span className="toast-card-header_toastCardHeaderIcon">
                <img src={IconNotification} />
              </span>
              <span className="toast-card-header_toastCardMessage">Notificaciones!</span>
              <button className="toast-card-header_toastCardHeaderCloseButton" onClick={handleClose}>
                <img src={IconClose} width={10} height={10} />
              </button>
            </div>
            <div className="toast-card_toastContent"><div className="toast-card_toastDescription">{message[1]}</div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomAlert;