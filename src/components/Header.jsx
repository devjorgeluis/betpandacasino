import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserMenu from "../components/UserMenu";
import ImgLogo from "/src/assets/img/logo.png";
import IconProfile from "/src/assets/svg/profile.svg";
import IconHamburger from "/src/assets/svg/hamburger.svg";

const Header = ({ isLogin, userBalance, handleLoginClick, handleLogoutClick, handleChangePasswordClick, fragmentNavLinksTop, isSlotsOnly }) => {
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const openMenu = () => {
        setShowUserMenu(!showUserMenu);
    };
    const onClose = () => {
        setShowUserMenu(false);
    }

    return (
        <>
            <header className="header_header">
                <div className="header_headerInner">
                    <div className="header_headerLeftContent">
                        <a onClick={() => navigate("/")}>
                            <img
                                title="Casino"
                                alt="Casino"
                                src={ImgLogo}
                                className="logo-domain"
                            />
                        </a>
                    </div>
                    <div className="header_headerLinks">
                        {
                            fragmentNavLinksTop
                        }
                    </div>
                    <div className="header-right_headerRight">
                        {isLogin ? (
                            <>
                                <div className="header-right_headerBalance">{userBalance ? parseFloat(userBalance).toFixed(2) + " $" : ""}</div>
                                <div className="header-right_headerRightUser" onClick={() => openMenu()}>
                                    <img src={IconProfile} width={20} height={20} />
                                    {/* <span className="header-right_unreadNotificationCounter">
                                        <div className="notifications-counter_notificationsCounter header-right_unreadCounter notifications-counter_sm">
                                            <span className="notifications-counter_notificationCounter">1</span>
                                        </div>
                                    </span> */}
                                </div>
                            </>
                        ) : (
                            <div className="header-right_headerRight">
                                <div className="header-right_headerBalance"></div>
                                <div className="header-right_guestRightMenu">
                                    <button className="button_button button_zeusPrimary button_xs" onClick={() => handleLoginClick()}>Acceso</button>
                                    <button className="button_button button_ghost button_md header-right_burgerButton hidden md:flex" onClick={() => openMenu()}>
                                        <img src={IconHamburger} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            {showUserMenu && <UserMenu 
                handleChangePasswordClick={() => {handleChangePasswordClick(); onClose();}} 
                handleLogoutClick={() => {handleLogoutClick(); onClose();}} 
                onClose={onClose}
                isSlotsOnly={isSlotsOnly}
            />}
        </>
    );
};

export default Header;