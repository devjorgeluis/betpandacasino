import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import IconProfileCircle from "/src/assets/svg/profile-circle.svg";
import IconHistory from "/src/assets/svg/history.svg";
import IconNotification from "/src/assets/svg/notification.svg";
import IconPassword from "/src/assets/svg/password.svg";
import IconLogout from "/src/assets/svg/logout.svg";

const UserMenu = ({ handleChangePasswordClick, handleLogoutClick, onClose, isSlotsOnly }) => {
    const navigate = useNavigate();
    const { contextData } = useContext(AppContext);

    return (
        <div id="mobile-menu-wrapper" className="mobile-menu-wrapper_mobileMenuWrapper mobile-menu-wrapper_opened" onClick={onClose}>
            <div className="mobile-menu_mobileMenu" onClick={(e) => e.stopPropagation()}>
                {
                    contextData.session && <>
                        <div className="mobile-menu-user_wrapper">
                            <div className="mobile-menu-user_userIcon">{contextData.session.user.username?.charAt(0).toUpperCase()}</div>
                            <div>
                                <p className="mobile-menu-user_name">{contextData.session.user.username}</p>
                                <p className="mobile-menu-user_balance">creditos {parseFloat(contextData.session.user.balance).toFixed(2) || ''} $</p>
                            </div>
                        </div>
                        <div className="mobile-menu-links_linksList">
                            <a className="mobile-menu-links_link" onClick={() => {navigate("/profile"); onClose();}}>
                                <img className="mobile-menu-links_icon" src={IconProfileCircle} />
                                <span className="mobile-menu-links_linkText">Mis datos</span>
                            </a>
                            <a className="mobile-menu-links_link" onClick={() => {navigate("/profile/history"); onClose();}}>
                                <img className="mobile-menu-links_icon" src={IconHistory} />
                                <span className="mobile-menu-links_linkText">Historial</span>
                            </a>
                            <a className="mobile-menu-links_link" onClick={() => {navigate("/profile/notification"); onClose();}}>
                                <img className="mobile-menu-links_icon" src={IconNotification} />
                                <span className="mobile-menu-links_linkText">Notificaciones</span>
                                {/* <div className="notifications-counter_notificationsCounter notifications-counter_md">
                                    <span className="notifications-counter_notificationCounter">1</span>
                                </div> */}
                            </a>
                            <button className="button_button button_ghost button_md mobile-menu-links_link" onClick={handleChangePasswordClick}>
                                <img className="mobile-menu-links_icon" src={IconPassword} />
                                <span className="mobile-menu-links_linkText">Cambiar contraseña</span>
                            </button>
                            <button className="button_button button_ghost button_md mobile-menu-links_link" onClick={handleLogoutClick}>
                                <img className="mobile-menu-links_icon" src={IconLogout} />
                                <span className="mobile-menu-links_linkText">Cerrar sesión</span>
                            </button>
                        </div>
                    </>
                }
                
                <div className="mobile-menu-navigation_mobileMenuNav">
                    <a className="mobile-menu-navigation_mobileMenuLink" onClick={() => {navigate("/"); onClose();}}>Inicio</a>
                    <a className="mobile-menu-navigation_mobileMenuLink" onClick={() => {navigate("/casino"); onClose();}}>Casino</a>
                    {
                        isSlotsOnly === "false" && <>
                            <a className="mobile-menu-navigation_mobileMenuLink" onClick={() => {navigate("/live-casino"); onClose();}}>Casino en vivo</a>
                            <a className="mobile-menu-navigation_mobileMenuLink" onClick={() => {navigate("/sports"); onClose();}}>Deportes</a>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default UserMenu;