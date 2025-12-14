import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import LoadApi from "../Loading/LoadApi";
import ImgLogo from "/src/assets/svg/logo.svg";
import IconClose from "/src/assets/svg/close.svg";
import ImgSupport from "/src/assets/svg/support-black.svg";

const Header = ({
    isLogin,
    isMobile,
    userBalance,
    supportParent,
    handleLoginClick,
    handleLogoutClick,
    openSupportModal
}) => {
    const { isSidebarExpanded } = useContext(LayoutContext);
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showMenuContainer, setShowMenuContainer] = useState(false);
    const [showMobileMenuContainer, setShowMobileMenuContainer] = useState(false);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);

    const closeUserMenu = () => {
        setShowUserMenu(false);
    };

    const toggleMenuContainer = () => {
        setShowMenuContainer(!showMenuContainer);
    };

    const toggleMobileMenuContainer = () => {
        setShowMobileMenuContainer(!showMobileMenuContainer);
    };

    const closeMenuContainer = () => {
        setShowMenuContainer(false);
    };

    const toggleLanguageMenu = () => {
        setShowLanguageMenu(!showLanguageMenu);
    };

    const closeLanguageMenu = () => {
        setShowLanguageMenu(false);
    };

    const handleLanguageSelect = () => {
        closeLanguageMenu();
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest('.dropdown') && !event.target.closest('.user-menu-container') && !event.target.closest('.account-button') && !event.target.closest('.menuContainer')) {
            closeLanguageMenu();
            closeUserMenu();
            closeMenuContainer();
        }
    };

    useState(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const languages = [
        { code: "EN", name: "English" },
        { code: "DE", name: "Deutsch" },
        { code: "JA", name: "日本語" },
        { code: "FR", name: "Français" },
        { code: "NL", name: "Nederlands" },
        { code: "PT", name: "Português" },
        { code: "TR", name: "Türkçe" },
        { code: "ES", name: "Español" },
        { code: "KO", name: "한국어" },
        { code: "IT", name: "Italiano" },
        { code: "EL", name: "Ελληνικά" },
        { code: "AR", name: "العربية" },
        { code: "ZH", name: "中文" },
        { code: "CS", name: "Čeština" }
    ];

    const baseMenuItems = [
        {
            className: "menu-button profile-button",
            link: "/profile",
            icon: "account_circle",
            title: "Perfil"
        },
        {
            className: "menu-button balances-button",
            link: "/profile/balance",
            icon: "account_balance_wallet",
            title: "Saldos de la cuenta"
        },
        {
            className: "menu-button transactions-button",
            link: "/profile/history",
            icon: "format_list_bulleted",
            title: "Transacciones"
        },
        {
            className: "menu-button logout-button",
            link: "",
            icon: "logout",
            title: "Cerrar sesión"
        }
    ];

    let menuItems = [...baseMenuItems];
    if (supportParent) {
        const supportItem = {
            className: "menu-button support-button",
            link: null,
            icon: "phone",
            title: "Contactá a Tu Cajero",
            isSupport: true
        };
        const idx = menuItems.findIndex(item => item.className && item.className.includes('transactions-button'));
        if (idx >= 0) menuItems.splice(idx + 1, 0, supportItem);
        else menuItems.push(supportItem);
    }

    return (
        <div className={`menu-layout-navbar ${isSidebarExpanded ? 'expanded' : ''}`}>
            <nav id="mainNav" className={`main-menu-container header landing-page ${isMobile ? 'mobile ' : ' '} ${isLogin ? 'logged-in' : ''}`}>
                <div className="navbar-nav">
                    <div className="desktop-top-menu-nav"></div>
                    <div className="desktop-logo-container">
                        <a
                            onClick={() => navigate("/")}
                            className="linkCss active"
                            aria-current="page"
                        >
                            <img
                                alt="Company logo"
                                className="logo light-logo"
                                src={ImgLogo}
                            />
                        </a>
                    </div>
                    <div className="desktop-user-panel">
                        {
                            isLogin ? <div className="loggedin">
                                <div className="loggedinContainer">
                                    <div className="currency-selector-container">
                                        <div className="currency-selector true" id="currency-selector-button">
                                            <span className="balance">
                                                <span>{userBalance ? "$ " + parseFloat(userBalance).toFixed(2) : "$0.00"}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="account-button"
                                        onClick={toggleMenuContainer}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i className="material-icons">account_circle</i>
                                    </div>
                                    {
                                        showMenuContainer && <div className="menuContainer">
                                            <div className="menu">
                                                <div className="menu-title"></div>
                                                <nav className="menuButtonWrapper">
                                                    {menuItems.map((item, index) => (
                                                        <a
                                                            key={index}
                                                            className={item.className}
                                                            onClick={() => {
                                                                if (item.isSupport) {
                                                                    openSupportModal(true);
                                                                    closeMenuContainer();
                                                                } else if (item.link === "") {
                                                                    setIsLogoutLoading(true);
                                                                    handleLogoutClick();
                                                                } else {
                                                                    navigate(item.link);
                                                                    closeMenuContainer();
                                                                }
                                                            }}
                                                            style={{ position: 'relative' }}
                                                        >
                                                            <span className="icon">
                                                                {item.link === "" && isLogoutLoading ? "" : <i className="material-icons">{item.icon}</i>}
                                                            </span>
                                                            <span className="title">
                                                                {item.link === "" && isLogoutLoading ? <LoadApi /> : item.title}
                                                            </span>
                                                        </a>
                                                    ))}
                                                    
                                                </nav>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div> : <div className="lngAndButtonWrap">
                                <div className="hide-in-context language-menu-container d-none">
                                    <div className="dropdown">
                                        <div
                                            className="dropbtn"
                                            onClick={toggleLanguageMenu}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="dropdownItem active">
                                                <div className="item active">
                                                    <div className="flag-button-container">
                                                        <span className="flagIcon">
                                                            <i className="material-icons">language</i>
                                                        </span>
                                                        <span className="arrow-icon">
                                                            <span className="material-icons">
                                                                {showLanguageMenu ? 'arrow_drop_up' : 'arrow_drop_down'}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {showLanguageMenu && (
                                            <div className="dropdown-content">
                                                {languages.map((language) => (
                                                    <div
                                                        key={language.code}
                                                        className="dropdownItem"
                                                        onClick={() => handleLanguageSelect(language.code)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <div className="item">
                                                            <span style={{ paddingLeft: "10px" }}>
                                                                <span style={{ width: "29px", display: "inline-block" }}>
                                                                    {language.code}
                                                                </span>{" "}
                                                                {language.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button className="button-support" onClick={() => { openSupportModal(false); }}>
                                    <img src={ImgSupport} />
                                </button>
                                <button className="btn btn-secondary desktop-login register-link small fixed-menu-btn topmenu" onClick={() => handleLoginClick()}>
                                    Acceso
                                </button>
                                {/* <button className="btn btn-cta register-link small fixed-menu-btn topmenu">
                                Regístrate
                            </button> */}
                            </div>
                        }
                    </div>
                </div>
                <div className="headerWrapper">
                    <div className="header-container">
                        <div className={`headerLeft ${isLogin ? " head" : ""}`}>
                            {
                                isLogin ? <a aria-current="page" className="linkCss active" onClick={() => navigate("/")}>
                                    <img alt="logo" className="logo light-logo" src={ImgLogo} />
                                </a> :
                                    <button className="hamburger-bars" aria-label="Open menu"><span className="material-icons">menu</span></button>
                            }
                        </div>
                        <div className="headerMiddle">
                            {
                                !isLogin && <a aria-current="page" className="linkCss active" onClick={() => navigate("/")}>
                                    <img alt="logo" className="logo light-logo" src={ImgLogo} />
                                </a>
                            }
                        </div>
                        <div className="headerRight">
                            {
                                isLogin ? <div className="loggedin">
                                    <div className="loggedinContainer">
                                        <button className="button-support" onClick={() => { openSupportModal(false); }}>
                                            <img src={ImgSupport} />
                                        </button>

                                        <div className="currency-selector-container">
                                            <div className="currency-selector true " id="currency-selector-button">
                                                <span className="balance">
                                                    <span>{userBalance ? "$ " + parseFloat(userBalance).toFixed(2) : "$0.00"}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className="mobile-account-button"
                                            onClick={toggleMobileMenuContainer}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <i className="material-icons">account_circle</i>
                                        </div>
                                        {
                                            showMobileMenuContainer && <div className="menuContainer">
                                                <div className="menu">
                                                    <div className="menu-title"></div>
                                                    <div className="menu-close" onClick={toggleMobileMenuContainer}>
                                                        <img src={IconClose} style={{ filter: 'invert(1)', width: '20px' }} />
                                                    </div>
                                                    <nav className="menuButtonWrapper">
                                                        {menuItems.map((item, index) => (
                                                            <a
                                                                key={index}
                                                                className={item.className}
                                                                onClick={() => {
                                                                    if (item.isSupport) {
                                                                        openSupportModal(true);
                                                                        toggleMobileMenuContainer();
                                                                    } else if (item.link === "") {
                                                                        setIsLogoutLoading(true);
                                                                        handleLogoutClick();
                                                                    } else {
                                                                        navigate(item.link);
                                                                        toggleMobileMenuContainer();
                                                                    }
                                                                }}
                                                                style={{ position: 'relative' }}
                                                            >
                                                                <span className="icon">
                                                                    {item.link === "" && isLogoutLoading ? "" : <i className="material-icons">{item.icon}</i>}
                                                                </span>
                                                                <span className="title">
                                                                    {item.link === "" && isLogoutLoading ? <LoadApi /> : item.title}
                                                                </span>
                                                            </a>
                                                        ))}
                                                       
                                                    </nav>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div> : <div className="lngAndButtonWrap">
                                    <button className="button-support" onClick={() => { openSupportModal(false); }}>
                                        <img src={ImgSupport} />
                                    </button>
                                    <button className="btn btn-secondary small login-button fixed-menu-btn" onClick={() => handleLoginClick()}>Acceso</button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;
