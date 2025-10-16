import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import IconDots from "/src/assets/svg/dots.svg";
import IconDownload from "/src/assets/svg/download.svg";
import ImgLogo from "/src/assets/svg/logo.svg";

const Sidebar = ({ isSlotsOnly, isMobile }) => {
    const { isSidebarExpanded, toggleSidebar } = useContext(LayoutContext);
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isSportsPage = location.pathname === "/sports" || location.pathname === "/live-sports";
    const [expandedMenus, setExpandedMenus] = useState([""]);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState({ code: "es", name: "Spanish" });
    const [liveCasinoMenus, setLiveCasinoMenus] = useState([]);
    const [hasFetchedLiveCasino, setHasFetchedLiveCasino] = useState(false);
    const [activeSubmenuItem, setActiveSubmenuItem] = useState("");
    const [countdown, setCountdown] = useState({
        days: 1,
        hours: 5,
        minutes: 8,
        seconds: 25
    });

    const languages = [
        { code: "en", name: "English" },
        { code: "de", name: "German" },
        { code: "ja", name: "Japanese" },
        { code: "fr", name: "French" },
        { code: "nl", name: "Dutch" },
        { code: "pt", name: "Portuguese" },
        { code: "tr", name: "Turkish" },
        { code: "es", name: "Spanish" },
        { code: "ko", name: "Korean" },
        { code: "it", name: "Italian" },
        { code: "el", name: "Greek" },
        { code: "ar", name: "Arabic" },
        { code: "zh", name: "Chinese" },
        { code: "cs", name: "Czech" }
    ];

    const toggleMenu = (menuName) => {
        setExpandedMenus(prev =>
            prev.includes(menuName)
                ? prev.filter(item => item !== menuName)
                : [...prev, menuName]
        );
    };

    const isMenuExpanded = (menuName) => {
        return expandedMenus.includes(menuName);
    };

    const toggleLanguageDropdown = () => {
        setShowLanguageDropdown(!showLanguageDropdown);
    };

    const closeLanguageDropdown = () => {
        setShowLanguageDropdown(false);
    };

    const handleLanguageSelect = (languageCode) => {
        var language = languages.find(lang => lang.code === languageCode) || currentLanguage;
        setCurrentLanguage(language);
        closeLanguageDropdown();
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prevCountdown => {
                let { days, hours, minutes, seconds } = prevCountdown;

                if (seconds > 0) {
                    seconds--;
                } else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes--;
                    } else {
                        minutes = 59;
                        if (hours > 0) {
                            hours--;
                        } else {
                            hours = 23;
                            if (days > 0) {
                                days--;
                            } else {
                                days = 1;
                                hours = 5;
                                minutes = 8;
                                seconds = 25;
                            }
                        }
                    }
                }

                return { days, hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!hasFetchedLiveCasino) {
            getPage("livecasino");
        }

        const hash = location.hash;
        if (hash && hash.startsWith('#')) {
            const categoryCode = hash.substring(1);
            setActiveSubmenuItem(categoryCode);
            
            if (location.pathname === '/live-casino' && !expandedMenus.includes('live-casino')) {
                setExpandedMenus(prev => [...prev, 'live-casino']);
            }
        } else {
            setActiveSubmenuItem("");
        }

        window.scrollTo(0, 0);
    }, [location.pathname, location.hash, hasFetchedLiveCasino]);

    const getPage = (page) => {
        callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
    };

    const callbackGetPage = (result) => {
        if (result.status === 500 || result.status === 422) {

        } else {
            let menus = [];
            result.data.categories.forEach(element => {
                menus.push({
                    name: element.name,
                    icon: element.image_local != null && element.image_local !== ""  && contextData.cdnUrl + element.image_local,
                    href: "/live-casino#" + element.code
                })
            });
            setLiveCasinoMenus(menus);
            setHasFetchedLiveCasino(true);
        }
    };

    const isSlotsOnlyMode = isSlotsOnly === "true" || isSlotsOnly === true;

    const menuItems = !isSlotsOnlyMode ? [
        {
            id: 'casino',
            name: 'Casino',
            icon: 'custom-icon-bp-casino',
            href: '/casino',
            subItems: [
                { name: 'Lobby', icon: 'custom-icon-bp-home', href: '/casino#home' },
                { name: 'Hot', icon: 'custom-icon-bp-fire', href: '/casino#hot' },
                { name: 'Jokers', icon: 'custom-icon-spades', href: '/casino#joker' },
                { name: 'Juegos de crash', icon: 'custom-icon-scale', href: '/casino#arcade' },
                { name: 'Megaways', icon: 'custom-icon-bp-megaways', href: '/casino#megaways' },
                { name: 'Ruletas', icon: 'custom-icon-bingo', href: '/casino#roulette' },
            ]
        },
        {
            id: 'live-casino',
            name: 'Casino en Vivo',
            icon: 'custom-icon-bp-live-casino',
            href: '/live-casino',
            subItems: liveCasinoMenus
        },
        {
            id: 'sports',
            name: 'Deportes',
            icon: 'custom-icon-bp-sports',
            href: '/sports',
            subItems: [
                { name: 'Home', icon: 'custom-icon-bp-home', href: '/sports' },
                { name: 'Live', icon: 'custom-icon-bp-live', href: '/live-sports' }
            ]
        }
    ] : [
        {
            id: 'casino',
            name: 'Casino',
            icon: 'custom-icon-bp-casino',
            href: '/casino',
            subItems: [
                { name: 'Lobby', icon: 'custom-icon-bp-home', href: '/casino#home' },
                { name: 'Hot', icon: 'custom-icon-bp-fire', href: '/casino#hot' },
                { name: 'Jokers', icon: 'custom-icon-spades', href: '/casino#joker' },
                { name: 'Juegos de crash', icon: 'custom-icon-scale', href: '/casino#arcade' },
                { name: 'Megaways', icon: 'custom-icon-bp-megaways', href: '/casino#megaways' },
                { name: 'Ruletas', icon: 'custom-icon-bingo', href: '/casino#roulette' },
            ]
        }
    ];

    const collapsedMenuItems = !isSlotsOnlyMode ? [
        { name: 'casino', icon: 'custom-icon-bp-casino', href: '/casino' },
        { name: 'live-casino', icon: 'custom-icon-bp-live-casino', href: '/live-casino' },
        { name: 'sports', icon: 'custom-icon-bp-sports', href: '/sports' }
    ] : [
        { name: 'casino', icon: 'custom-icon-bp-casino', href: '/casino' }
    ];

    return (
        <>
            <div className={`menu-layout-sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
                <div className={`sidemenu-container sidemenu-container-collapsed ${!isSidebarExpanded ? 'active' : ''}`}>
                    <div className="sidemenu-header collapsed">
                        <div className="close-button collapsed fixed">
                            <span
                                className="hamburger-bars sidemenu-toggle"
                                onClick={toggleSidebar}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className="material-icons">menu</span>
                            </span>
                        </div>
                    </div>
                    <div className="content collapsed"></div>
                    <div className="menu-items menu-items-collapsed">
                        {collapsedMenuItems.map((item, index) => (
                            <button
                                key={index}
                                className={`nav-link fixed-nav-link ${item.name} ${item.name === 'sports' ? 'active-collapsed' : ''}`}
                                onClick={() => navigate(item.href)}
                                aria-current={item.name === 'sports' ? 'page' : undefined}
                            >
                                <i className={item.icon}></i>
                            </button>
                        ))}
                    </div>
                    <div className="menu-divider"></div>
                    <div className="footer-items footer-items-collapsed"></div>
                </div>

                <div className={`sidemenu-container sidemenu-container-expanded ${isSidebarExpanded ? 'active' : ''}`}>
                    <div className="sidemenu-header expanded">
                        <div className="close-button expanded logo fixed">
                            <span
                                className="hamburger-bars sidemenu-toggle"
                                onClick={toggleSidebar}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className="material-icons">{isMobile ? "close" : "menu"}</span>
                            </span>
                        </div>
                        <div className="brand-logo">
                            <a className="linkCss" onClick={() => navigate("/")}>
                                <img alt="logo" className="logo light-logo" src={ImgLogo} />
                            </a>
                        </div>
                    </div>
                    <div className="content d-none">
                        <div className="cashback-component">
                            <div className="cashback-header-container">
                                <h4>Cashback semanal en</h4>
                            </div>
                            <div className="cashback-timer-container">
                                <div className="cashback-timer-item">
                                    <div className="cachback-timer-item-count nav-link">
                                        <h3>{countdown.days}</h3>
                                    </div>
                                    <div className="cachback-timer-item-text">
                                        <span>DÍAS</span>
                                    </div>
                                </div>
                                <span className="timer-dots">
                                    <img src={IconDots} alt="dots" />
                                </span>
                                <div className="cashback-timer-item">
                                    <div className="cachback-timer-item-count nav-link">
                                        <h3>{countdown.hours.toString().padStart(2, '0')}</h3>
                                    </div>
                                    <div className="cachback-timer-item-text">
                                        <span>H</span>
                                    </div>
                                </div>
                                <span className="timer-dots">
                                    <img src={IconDots} alt="dots" />
                                </span>
                                <div className="cashback-timer-item">
                                    <div className="cachback-timer-item-count nav-link">
                                        <h3>{countdown.minutes.toString().padStart(2, '0')}</h3>
                                    </div>
                                    <div className="cachback-timer-item-text">
                                        <span>MIN</span>
                                    </div>
                                </div>
                                <span className="timer-dots">
                                    <img src={IconDots} alt="dots" />
                                </span>
                                <div className="cashback-timer-item">
                                    <div className="cachback-timer-item-count nav-link">
                                        <h3>{countdown.seconds.toString().padStart(2, '0')}</h3>
                                    </div>
                                    <div className="cachback-timer-item-text">
                                        <span>SEG</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="menu-items-container">
                        <div className="menu-items menu-items-fixed">
                            {menuItems.map((menu) => (
                                <div key={menu.id} className="side-submenu-container">
                                    <div className={`submenu-container ${isMenuExpanded(menu.id) ? 'expanded-submenu-container' : ''}`}>
                                        <button
                                            className={`nav-link submenu-link expandable CUSTOM ${menu.id}`}
                                            onClick={() => {
                                                toggleMenu(menu.id);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="nav-link-logo">
                                                <i className={menu.icon}></i>
                                                {menu.name}
                                            </div>
                                            <div>
                                                <div className="submenu-chevron">
                                                    <i className="material-icons">
                                                        {isMenuExpanded(menu.id) ? 'expand_more' : 'chevron_right'}
                                                    </i>
                                                </div>
                                            </div>
                                        </button>
                                        <div className={`expandeble-sub-menu collapse ${isMenuExpanded(menu.id) ? 'expanded-sub-menu show' : ''}`}>
                                            {menu.subItems.map((subItem, subIndex) => {
                                                let categoryCode = "";
                                                if (menu.id === "live-casino" && subItem.href.includes("#")) {
                                                    categoryCode = subItem.href.split("#")[1];
                                                }
                                                
                                                const isActive = menu.id === "live-casino" 
                                                    ? categoryCode === activeSubmenuItem
                                                    : subItem.href === location.pathname + location.hash;
                                                
                                                return (
                                                    <button
                                                        key={subIndex}
                                                        className={`nav-link submenu-tab-link CUSTOM ${subItem.name.toLowerCase().replace(/\s+/g, '-')} ${isActive ? 'active' : ''}`}
                                                        onClick={() => navigate(subItem.href)}
                                                    >
                                                        <i className={subItem.icon}></i>
                                                        {/* {
                                                            menu.id !== "live-casino" ? <i className={subItem.icon}></i> : <img src={subItem.icon} width={25} />
                                                        } */}
                                                        {subItem.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="menu-divider"></div>
                    <div className="footer-items footer-items-fixed"></div>
                    <div className="language-wrapper-container d-none">
                        <div className="dropdown-btn small dropdown">
                            <button
                                aria-haspopup="true"
                                aria-expanded={showLanguageDropdown}
                                id="dropdown-btn"
                                type="button"
                                className="dropdown-toggle btn btn-secondary"
                                onClick={toggleLanguageDropdown}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="material-icons">language</i>
                                {currentLanguage.name} ({currentLanguage.code})
                            </button>
                            {showLanguageDropdown && (
                                <div
                                    aria-labelledby="dropdown-btn"
                                    className="dropdown-menu show"
                                >
                                    {languages.map((language) => (
                                        <a
                                            key={language.code}
                                            href="#"
                                            className={`dropdown-item ${language.code === currentLanguage.code ? 'active' : ''}`}
                                            role="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleLanguageSelect(language.code);
                                            }}
                                        >
                                            {language.name} ({language.code})
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="footer-content footer-content-fixed d-none">
                        <div className="app-install-container">
                            <div className="app-buttons-container">
                                <div className="download-text-area">Download App</div>
                                <button name="windows app download button" aria-label="windows app download button" className="app-button windows">
                                    <i className="device-icon">
                                        <img src={IconDownload} alt="Windows app" />
                                    </i>
                                    <div className="hoverBubble bubblePosition windows">
                                        <p></p>
                                        <p></p>
                                        <p>Haz clic para instalar la aplicación</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                !isSportsPage && <nav className="bottom-menu">
                    <button className="mobile-menu-item" onClick={() => navigate("/casino")}>
                        <div className="icon"><i className="custom-icon-bp-casino"></i></div>
                        <div className="menu-text">Casino</div>
                    </button>
                    {
                        !isSlotsOnlyMode && <>
                            <button className="mobile-menu-item" onClick={() => navigate("/live-casino")}>
                                <div className="icon"><i className="custom-icon-bp-live-casino"></i></div>
                                <div className="menu-text">Casino en Vivo</div>
                            </button>
                            <button className="mobile-menu-item" onClick={() => navigate("/sports")}>
                                <div className="icon"><i className="custom-icon-bp-sports"></i></div>
                                <div className="menu-text">Deportes</div>
                            </button>
                        </>
                    }
                    <button className="mobile-menu-item" onClick={toggleSidebar}>
                        <div className="icon"><span className="material-icons">menu</span></div>
                        <div className="menu-text">Menú</div>
                    </button>
                </nav>
            }
        </>
    );
};

export default Sidebar;
