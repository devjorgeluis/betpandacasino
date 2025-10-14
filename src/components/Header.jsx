import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({
    isLogin,
    userBalance,
    handleLoginClick,
    handleLogoutClick,
    handleChangePasswordClick,
    fragmentNavLinksTop,
    isSlotsOnly
}) => {
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    const closeUserMenu = () => {
        setShowUserMenu(false);
    };

    const toggleLanguageMenu = () => {
        setShowLanguageMenu(!showLanguageMenu);
    };

    const closeLanguageMenu = () => {
        setShowLanguageMenu(false);
    };

    const handleLanguageSelect = (languageCode) => {
        console.log("Selected language:", languageCode);
        // Add your language change logic here
        closeLanguageMenu();
    };

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
        if (!event.target.closest('.dropdown') && !event.target.closest('.user-menu-container')) {
            closeLanguageMenu();
            closeUserMenu();
        }
    };

    // Add event listener for outside clicks
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

    return (
        <div className="menu-layout-navbar expanded">
            <nav id="mainNav" className="main-menu-container header landing-page">
                <div className="navbar-nav">
                    <div className="desktop-top-menu-nav"></div>
                    <div className="desktop-logo-container">
                        <a
                            className="linkCss active"
                            href="/es/"
                            aria-current="page"
                        >
                            <img
                                alt="Company logo"
                                className="logo light-logo"
                                src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Main_a728350f56.svg"
                            />
                        </a>
                    </div>
                    <div className="desktop-user-panel">
                        <div className="lngAndButtonWrap">
                            <div className="hide-in-context language-menu-container">
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
                            <button className="btn btn-secondary desktop-login small fixed-menu-btn topmenu">
                                Acceso
                            </button>
                            <button className="btn btn-cta register-link small fixed-menu-btn topmenu">
                                Regístrate
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;