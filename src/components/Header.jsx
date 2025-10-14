import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import DivLoading from "./DivLoading";
import ImgLogo from "/src/assets/svg/logo.svg";

const Header = ({
    isLogin,
    userBalance,
    handleLoginClick,
    handleLogoutClick
}) => {
    const { isSidebarExpanded } = useContext(LayoutContext);
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showMenuContainer, setShowMenuContainer] = useState(false);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);

    const closeUserMenu = () => {
        setShowUserMenu(false);
    };

    const toggleMenuContainer = () => {
        setShowMenuContainer(!showMenuContainer);
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

    const menuItems = [
        {
            className: "menu-button profile-button",
            link: "/account/profile",
            icon: "account_circle",
            title: "Perfil"
        },
        {
            className: "menu-button balances-button",
            link: "/account/balances",
            icon: "account_balance_wallet",
            title: "Saldos de la cuenta"
        },
        {
            className: "menu-button transactions-button",
            link: "/account/transactions/wallet",
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

    return (
        <div className={`menu-layout-navbar ${isSidebarExpanded ? 'expanded' : ''}`}>
            <nav id="mainNav" className="main-menu-container header landing-page">
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
                                                                if (item.link === "") {
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
                                                                {item.link === "" && isLogoutLoading ? "" : <i className="material-icons">{item.icon}</i> }
                                                            </span>
                                                            <span className="title">
                                                                {item.link === "" && isLogoutLoading ? <DivLoading /> : item.title}
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
                                <button className="btn btn-secondary desktop-login small fixed-menu-btn topmenu" onClick={() => handleLoginClick()}>
                                    Acceso
                                </button>
                                {/* <button className="btn btn-cta register-link small fixed-menu-btn topmenu">
                                Regístrate
                            </button> */}
                            </div>
                        }
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;
