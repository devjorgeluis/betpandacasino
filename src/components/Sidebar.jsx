import { useState, useEffect } from "react";
import IconDots from "/src/assets/svg/dots.svg";
import IconDownload from "/src/assets/svg/download.svg";

const Sidebar = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState([""]);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
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

    const currentLanguage = languages.find(lang => lang.code === "es") || languages[0];

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

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

    const menuItems = [
        {
            id: 'casino',
            name: 'Casino',
            icon: 'custom-icon-bp-casino',
            href: '/es/sportsbook',
            subItems: [
                { name: 'Hogar', icon: 'custom-icon-bp-home', href: '/es/casino' },
                { name: 'Jugado recientemente', icon: 'custom-icon-bp-recently-played', href: '/es/casino#recently_played' },
                { name: 'Tus favoritos', icon: 'custom-icon-bp-your-favourites', href: '/es/casino#your_favorites' },
                { name: 'Betpanda Originals', icon: 'custom-icon-bp-betpanda', href: '/es/originals' },
                { name: 'Mantener y ganar', icon: 'custom-icon-bp-hold-win', href: '/es/casino/25/hold-&-win' },
                { name: 'Nuevos juegos', icon: 'custom-icon-boy', href: '/es/casino/13/new' },
                { name: 'Ranuras de rejilla', icon: 'custom-icon-bp-grid-slots', href: '/es/casino/27/grid' },
                { name: 'Comprar función', icon: 'custom-icon-bp-buy-feature', href: '/es/casino/5/buy-feature' },
                { name: 'Juegos de mesa', icon: 'custom-icon-bp-table-games', href: '/es/casino/23/table-games' },
                { name: 'Demostrablemente', icon: 'custom-icon-scale', href: '/es/casino/16/provably-fair' },
                { name: 'Megaways', icon: 'custom-icon-bp-megaways', href: '/es/casino/12/megaways' }
            ]
        },
        {
            id: 'live-casino',
            name: 'Casino en Vivo',
            icon: 'custom-icon-bp-live-casino',
            href: '/es/sportsbook',
            subItems: [
                { name: 'Vestíbulo', icon: 'custom-icon-trof2', href: '/es/casino/page/2/live-casino' },
                { name: 'Jugado recientemente', icon: 'custom-icon-bp-recently-played', href: '/es/casino/page/2/live-casino/2/live-casino-lobby' },
                { name: 'Tus favoritos', icon: 'custom-icon-bp-your-favourites', href: '/es/casino/page/2/live-casino/2/live-casino-lobby#yourfavorites' },
                { name: 'Ruleta en vivo', icon: 'custom-icon-bingo', href: '/es/casino/page/2/live-casino/7/live-roulette' },
                { name: 'Blackjack en vivo', icon: 'custom-icon-spades', href: '/es/casino/page/2/live-casino/8/live-blackjack' },
                { name: 'Bacará en vivo', icon: 'custom-icon-sixdices', href: '/es/casino/page/2/live-casino/9/live-baccarat' },
                { name: 'Programas de juegos', icon: 'custom-icon-dealer2', href: '/es/casino/page/2/live-casino/11/game-shows' },
                { name: 'Dados Sic Bo', icon: 'custom-icon-diamon', href: '/es/casino/page/2/live-casino/14/sic-bo' },
                { name: 'Veintiuno VIP', icon: 'custom-icon-kings', href: '/es/casino/page/2/live-casino/26/vip-blackjack' }
            ]
        },
        {
            id: 'sports',
            name: 'Deportes',
            icon: 'custom-icon-bp-sports',
            href: '/es/sportsbook',
            subItems: [
                { name: 'Home', icon: 'custom-icon-bp-home', href: '/es/sportsbook' },
                { name: 'My bets', icon: 'custom-icon-dollarsign', href: '/es/sportsbook?bt-path=%2Fbets' },
                { name: 'Live', icon: 'custom-icon-bp-live', href: '/es/sportsbook?bt-path=%2Flive' },
                { name: 'Upcoming Events', icon: 'custom-icon-bp-events', href: '/es/sportsbook?bt-path=%2Fevent-builder' },
                { name: 'Favourites', icon: 'custom-icon-bp-favourites', href: '/es/sportsbook?bt-path=%2Ffavorites' },
                { name: 'Soccer', icon: 'custom-icon-bp-sport-soccer', href: '/es/sportsbook?bt-path=%2Fsoccer-1' },
                { name: 'Basketball', icon: 'custom-icon-bp-sport-basketball', href: '/es/sportsbook?bt-path=%2Fbasketball-2' },
                { name: 'Ice Hockey', icon: 'custom-icon-bp-sport-icehockey', href: '/es/sportsbook?bt-path=%2Fice-hockey-4' },
                { name: 'Tennis', icon: 'custom-icon-bp-sport-tennis', href: '/es/sportsbook?bt-path=%2Ftennis-5' },
                { name: 'Fifa', icon: 'custom-icon-bp-fifa', href: '/es/sportsbook?bt-path=%2Ffifa-300' }
            ]
        },
        {
            id: 'esports',
            name: 'Deportes electrónicos',
            icon: 'custom-icon-mush',
            href: '/es/sportsbook',
            subItems: [
                { name: 'Home', icon: 'custom-icon-bp-home', href: '/es/sportsbook?bt-path=%2Fe_sport%2F300' },
                { name: 'My Bets', icon: 'custom-icon-dollarsign', href: '/es/sportsbook?bt-path=%2Fbets' },
                { name: 'Live', icon: 'custom-icon-bp-live', href: '/es/sportsbook?bt-path=%2Flive' },
                { name: 'Upcoming Events', icon: 'custom-icon-bp-events', href: '/es/sportsbook?bt-path=%2Fe_sport%2F300' },
                { name: 'Favourites', icon: 'custom-icon-bp-favourites', href: '/es/sportsbook?bt-path=%2Ffavorites' },
                { name: 'Counter-Strike', icon: 'custom-icon-banan', href: '/es/sportsbook?bt-path=%2Fcounter-strike-109' },
                { name: 'League of Legends', icon: 'custom-icon-bp-league', href: '/es/sportsbook?bt-path=%2Fleague-of-legends-110' },
                { name: 'Dota 2', icon: 'custom-icon-bp-dota', href: '/es/sportsbook?bt-path=%2Fdota-2-111' },
                { name: 'Fifa', icon: 'custom-icon-melon', href: '/es/sportsbook?bt-path=%2Ffifa-300' },
                { name: 'NBA2K', icon: 'custom-icon-bp-nba-2k', href: '/es/sportsbook?bt-path=%2Fnba-2k-302' }
            ]
        },
        {
            id: 'promotions',
            name: 'Promociones',
            icon: 'custom-icon-bp-promotions',
            href: '/es/sportsbook',
            subItems: [
                { name: 'Campaigns', icon: 'custom-icon-powers', href: '/es/promo/promotions' },
                { name: 'Welcome Offers', icon: 'custom-icon-bp-welcome-offers', href: '/es/promo/promotions' }
            ]
        }
    ];

    // Collapsed sidebar menu items
    const collapsedMenuItems = [
        { name: 'CASINO', icon: 'custom-icon-bp-casino', href: '/es/casino/page/0/' },
        { name: 'live-casino', icon: 'custom-icon-bp-live-casino', href: '/es/casino/page/2/live-casino' },
        { name: 'sports', icon: 'custom-icon-bp-sports', href: '/es/sportsbook' },
        { name: 'esports', icon: 'custom-icon-mush', href: '/es/sportsbook?bt-path=%2Fe_sport%2F300' },
        { name: 'promotions', icon: 'custom-icon-bp-promotions', href: '/es/promo/promotions' }
    ];

    // Timer items
    const timerItems = [
        { value: '1', label: 'DÍAS' },
        { value: '5', label: 'H' },
        { value: '8', label: 'MIN' },
        { value: '25', label: 'SEG' }
    ];

    return (
        <div className={`menu-layout-sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
            {/* Collapsed Sidebar */}
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
                        <a 
                            key={index}
                            className={`nav-link fixed-nav-link ${item.name} ${item.name === 'sports' ? 'active-collapsed' : ''}`}
                            href={item.href}
                            aria-current={item.name === 'sports' ? 'page' : undefined}
                        >
                            <i className={item.icon}></i>
                        </a>
                    ))}
                </div>
                <div className="menu-divider"></div>
                <div className="footer-items footer-items-collapsed"></div>
            </div>

            {/* Expanded Sidebar */}
            <div className={`sidemenu-container sidemenu-container-expanded ${isSidebarExpanded ? 'active' : ''}`}>
                <div className="sidemenu-header expanded">
                    <div className="close-button expanded logo fixed">
                        <span 
                            className="hamburger-bars sidemenu-toggle"
                            onClick={toggleSidebar}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="material-icons">menu</span>
                        </span>
                    </div>
                    <div className="brand-logo">
                        <a className="linkCss" href="/es/">
                            <img alt="logo" className="logo light-logo" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Main_a728350f56.svg" /> 
                        </a>
                    </div>
                </div>
                <div className="content">
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
                                    <a 
                                        className={`nav-link submenu-link expandable CUSTOM ${menu.id}`}
                                        href={menu.href}
                                        onClick={(e) => {
                                            e.preventDefault();
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
                                    </a>
                                    <div className={`expandeble-sub-menu collapse ${isMenuExpanded(menu.id) ? 'show' : ''}`}>
                                        {menu.subItems.map((subItem, subIndex) => (
                                            <a 
                                                key={subIndex}
                                                className={`nav-link submenu-tab-link CUSTOM ${subItem.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                href={subItem.href}
                                            >
                                                <i className={subItem.icon}></i>
                                                {subItem.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="menu-divider"></div>
                <div className="footer-items footer-items-fixed"></div>
                <div className="language-wrapper-container">
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
                <div className="footer-content footer-content-fixed">
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
    );
};

export default Sidebar;
