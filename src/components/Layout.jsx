import { useContext, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "./LayoutContext";
import { callApi } from "../utils/Utils";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import NavLinkHeader from "../components/NavLinkHeader";
import LoginModal from "./LoginModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { NavigationContext } from "./NavigationContext";
import FullDivLoading from "./FullDivLoading";

const Layout = () => {
    const { contextData } = useContext(AppContext);
    const [selectedPage, setSelectedPage] = useState("lobby");
    const [isLogin, setIsLogin] = useState(contextData.session !== null);
    const [isMobile, setIsMobile] = useState(false);
    const [userBalance, setUserBalance] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [fragmentNavLinksTop, setFragmentNavLinksTop] = useState(<></>);
    const [isSlotsOnly, setIsSlotsOnly] = useState("");
    const [showFullDivLoading, setShowFullDivLoading] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const navigate = useNavigate();


    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    useEffect(() => {
        if (contextData.session != null) {
            setIsLogin(true);
            if (contextData.session.user && contextData.session.user.balance) {
                setUserBalance(contextData.session.user.balance);
            }
        }
        getStatus();
    }, [contextData.session]);

    useEffect(() => {
        const checkIsMobile = () => {
            return window.innerWidth <= 767;
        };

        const checkShouldCollapseSidebar = () => {
            return window.innerWidth < 1024;
        };

        const checkIsSmallScreen = () => {
            return window.innerWidth < 1024;
        };

        setIsMobile(checkIsMobile());
        setIsSmallScreen(checkIsSmallScreen());
        
        if (checkShouldCollapseSidebar()) {
            setIsSidebarExpanded(false);
        }

        const handleResize = () => {
            setIsMobile(checkIsMobile());
            setIsSmallScreen(checkIsSmallScreen());
            
            if (checkShouldCollapseSidebar()) {
                setIsSidebarExpanded(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const refreshBalance = () => {
        setUserBalance("");
        callApi(contextData, "GET", "/get-user-balance", callbackRefreshBalance, null);
    };

    const callbackRefreshBalance = (result) => {
        setUserBalance(result && result.balance);
    };

    const getStatus = () => {
        callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
    };

    const getPage = (page) => {
        setSelectedPage(page);
        setShowFullDivLoading(true);
        callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
        navigate("/" + (page === "home" ? "" : page));
    };

    const callbackGetPage = () => {
        setShowFullDivLoading(false);
    };

    const callbackGetStatus = (result) => {
        if ((result && result.slots_only == null) || (result && result.slots_only == false)) {
            setIsSlotsOnly("false");
            setFragmentNavLinksTop(
                <>
                    <NavLinkHeader
                        title="Inicio"
                        pageCode="home"
                        icon=""
                    />
                    <NavLinkHeader
                        title="Casino"
                        pageCode="casino"
                        icon=""
                    />
                    <NavLinkHeader
                        title="Casino en Vivo"
                        pageCode="live-casino"
                        icon=""
                    />
                    <NavLinkHeader
                        title="Deportes"
                        pageCode="sports"
                        icon=""
                    />
                </>
            );
        } else {
            setIsSlotsOnly("true");
            setFragmentNavLinksTop(
                <>
                    <NavLinkHeader
                        title="Inicio"
                        pageCode="home"
                        icon=""
                    />
                    <NavLinkHeader
                        title="Casino"
                        pageCode="casino"
                        icon=""
                    />
                </>
            );
        }
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLoginSuccess = (balance) => {
        setUserBalance(balance);
    };

    const handleLogoutClick = () => {
        callApi(contextData, "POST", "/logout", (result) => {
            if (result.status === "success") {
                setTimeout(() => {
                    localStorage.removeItem("session");
                    window.location.href = "/";
                }, 200);
            }
        }, null);
    };

    const handleChangePasswordClick = () => {
        setShowChangePasswordModal(true);
    };

    const layoutContextValue = {
        isLogin,
        userBalance,
        handleLoginClick,
        handleLogoutClick,
        handleChangePasswordClick,
        refreshBalance,
        isSidebarExpanded,
        toggleSidebar
    };

    return (
        <LayoutContext.Provider value={layoutContextValue}>
            <NavigationContext.Provider
                value={{ fragmentNavLinksTop, selectedPage, setSelectedPage, getPage, showFullDivLoading, setShowFullDivLoading }}
            >
                <>
                    <FullDivLoading show={showFullDivLoading} />
                    {showLoginModal && (
                        <LoginModal
                            isOpen={showLoginModal}
                            onClose={() => setShowLoginModal(false)}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    )}
                    {showChangePasswordModal && (
                        <ChangePasswordModal 
                            onClose={() => setShowChangePasswordModal(false)}
                        />
                    )}
                    <div className={`menu-layout ${isSmallScreen ? 'absolute' : 'fixed'}`}>
                        <Header
                            isLogin={isLogin}
                            userBalance={userBalance}
                            handleLoginClick={handleLoginClick}
                            handleLogoutClick={handleLogoutClick}
                        />
                        <Sidebar />
                        <main className={`menu-layout-content ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
                            <Outlet context={{ isSlotsOnly }} />
                        </main>
                    </div>
                </>
            </NavigationContext.Provider>
        </LayoutContext.Provider>
    );
};

export default Layout;
