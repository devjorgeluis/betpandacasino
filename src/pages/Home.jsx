import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/LayoutContext";
import { NavigationContext } from "../components/NavigationContext";
import { callApi } from "../utils/Utils";
import GameCard from "/src/components/GameCard";
import NavLinkIcon from "../components/NavLinkIcon";
import Slideshow from "../components/Home/Slideshow";
import GameLogos from "../components/Home/GameLogos";
import GameSlideshow from "../components/Home/GameSlideshow";
import Welcome from "../components/Home/Welcome";
import GameProviders from "../components/Home/GameProviders";
import Discover from "../components/Home/Discover";
import Promotions from "../components/Home/Promotions";
import About from "../components/Home/About";
import GameModal from "../components/GameModal";
import DivLoading from "../components/DivLoading";
import GamesLoading from "../components/GamesLoading";
import SearchInput from "../components/SearchInput";
import SearchSelect from "../components/SearchSelect";
import LoginModal from "../components/LoginModal";
import CustomAlert from "../components/CustomAlert";
import "animate.css";

import IconLive from "/src/assets/svg/live.svg";
import IconHot from "/src/assets/svg/hot.svg";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let pageCurrent = 0;

const Home = () => {
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const [selectedPage, setSelectedPage] = useState("lobby");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [topLiveCasino, setTopLiveCasino] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [fragmentNavLinksBody, setFragmentNavLinksBody] = useState(<></>);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [txtSearch, setTxtSearch] = useState("");
  const [searchDelayTimer, setSearchDelayTimer] = useState();
  const [messageCustomAlert, setMessageCustomAlert] = useState(["", ""]);
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const refGameModal = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const { isSlotsOnly } = useOutletContext();

  useEffect(() => {
    const checkIsMobile = () => {
      return window.innerWidth <= 767;
    };

    setIsMobile(checkIsMobile());

    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    setGameUrl("");
    setShouldShowGameModal(false);

    setSelectedPage("home");
    getPage("home");
    getStatus();

    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getStatus = () => {
    callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
  };

  const callbackGetStatus = (result) => {
    if (result.status === 500 || result.status === 422) {
      setMessageCustomAlert(["error", result.message]);
    } else {
      setIsLoadingGames(false);
      setTopGames(result.top_hot);
      setTopLiveCasino(result.top_livecasino);
      contextData.slots_only = result && result.slots_only;
    }
  };

  const getPage = (page) => {
    setIsLoadingGames(true);
    setCategories([]);
    setGames([]);
    setSelectedPage(page);
    callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
  };

  const callbackGetPage = (result) => {
    if (result.status === 500 || result.status === 422) {
      setMessageCustomAlert(["error", result.message]);
    } else {
      setCategories(result.data.categories);
      setPageData(result.data);

      if (result.data.menu === "home") {
        setMainCategories(result.data.categories);
      }

      if (pageData.url && pageData.url !== null) {
        if (contextData.isMobile) {
          // Mobile sports workaround
        }
      } else {
        if (result.data.page_group_type === "categories") {
          setSelectedCategoryIndex(-1);
        }
        if (result.data.page_group_type === "games") {
          loadMoreContent();
        }
      }
      pageCurrent = 0;
    }
    setIsLoadingGames(false);
  };

  const loadMoreContent = () => {
    let item = categories[selectedCategoryIndex];
    if (item) {
      fetchContent(item, item.id, item.table_name, selectedCategoryIndex, false);
    }
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode = null) => {
    let pageSize = 30;

    if (resetCurrentPage === true) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    const groupCode = pageGroupCode || pageData.page_group_code;

    callApi(
      contextData,
      "GET",
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=" +
      pageCurrent +
      "&length=" +
      pageSize,
      callbackFetchContent,
      null
    );
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      setMessageCustomAlert(["error", result.message]);
    } else {
      if (pageCurrent === 0) {
        configureImageSrc(result);
        setGames(result.content);
      } else {
        configureImageSrc(result);
        setGames([...games, ...result.content]);
      }
      pageCurrent += 1;
    }
    setIsLoadingGames(false);
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      let imageDataSrc = element.image_url;
      if (element.image_local !== null) {
        imageDataSrc = contextData.cdnUrl + element.image_local;
      }
      element.imageDataSrc = imageDataSrc;
    });
  };

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    setShowFullDivLoading(true);
    selectedGameId = game.id !== null ? game.id : selectedGameId;
    selectedGameType = type !== null ? type : selectedGameType;
    selectedGameLauncher = launcher !== null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    callApi(contextData, "GET", "/get-game-url?game_id=" + selectedGameId, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    setShowFullDivLoading(false);
    if (result.status === "0") {
      switch (selectedGameLauncher) {
        case "modal":
        case "tab":
          setGameUrl(result.url);
          break;
      }
    } else if (result.status === "500" || result.status === "422") {
      setMessageCustomAlert(["error", result.message]);
    }
  };

  const closeGameModal = () => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    setGameUrl("");
    setShouldShowGameModal(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
  };

  const handleAlertClose = () => {
    setMessageCustomAlert(["", ""]);
  };

  return (
    <>
      <CustomAlert message={messageCustomAlert} onClose={handleAlertClose} />
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onConfirm={handleLoginConfirm}
        />
      )}

      {shouldShowGameModal && selectedGameId !== null ? (
        <GameModal
          gameUrl={gameUrl}
          gameName={selectedGameName}
          reload={launchGame}
          launchInNewTab={() => launchGame(null, null, "tab")}
          ref={refGameModal}
          onClose={closeGameModal}
        />
      ) : (
        <>
          <div className="landingPage">
            <div className="root-container" id="pageContainer">
              <div className="root-wrapper">
                <div className="page">
                  <Slideshow />
                  <GameLogos />
                  { topLiveCasino.length > 0 && <GameSlideshow games={topLiveCasino} name="liveCasino" title="Juegos en vivo principales" icon={IconLive} link="/live-casino" /> }
                  { topGames.length > 0 && <GameSlideshow games={topGames} name="casino" title="Juegos más populares" icon={IconHot} link="/casino" /> }
                  <Welcome />
                  { mainCategories.length > 0 && <GameProviders categories={mainCategories} /> }
                  <Discover />
                  <Promotions />
                  <About />
                </div>
              </div>
              <footer className="footer-container">
                <div className="linkContainer">
                  <div className="appIconWrap">
                    <div className="footer-row">
                      <div className="app-buttons-container">
                        <div className="download-text-area">Download App</div>
                        <button name="windows app download button" aria-label="windows app download button" className="app-button windows">
                          <i className="device-icon">
                            <img
                              src="data:image/svg+xml,%3csvg%20width='2490'%20height='2500'%20viewBox='0%200%20256%20257'%20xmlns='http://www.w3.org/2000/svg'%20preserveAspectRatio='xMidYMid'%3e%3cpath%20d='M0%2036.357L104.62%2022.11l.045%20100.914-104.57.595L0%2036.358zm104.57%2098.293l.08%20101.002L.081%20221.275l-.006-87.302%20104.494.677zm12.682-114.405L255.968%200v121.74l-138.716%201.1V20.246zM256%20135.6l-.033%20121.191-138.716-19.578-.194-101.84L256%20135.6z'%20fill='%23fff'/%3e%3c/svg%3e"
                            />
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
                  <div className="linkWrap">
                    <div className="footer-row"></div>
                    <div className="footer-row"></div>
                  </div>
                </div>
                <div className="footer-dynamic-content">
                  <div className="footer-dynamic footer-main">
                    <div className="container">
                      <div className="row">
                        <div className="col-md-6 taglines"></div>
                        <div className="col-md-6"></div>
                        <div className="col-md-12 taglines-group">
                          <div className="group footer-operated foot-column">
                            <div className="tagline">
                              <div className="tagline text company-info-footer">
                                <a href="/" className="logo-footer">
                                  <img src="https://d39l5twljzzea1.cloudfront.net/betpanda3/Group_121417651_87c3fa6120.svg" />
                                </a>
                                <div className="tagline text">
                                  <span className="text-heading">Star Bright Media S.R.L</span>
                                  <span>San Pedro, Barrio Dent, Del Centro Cultural Costarricense Norteamericano, Doscientos Metros al Norte y Concuenta al este, Edificio Ofident, Officins Numero Tres Costa Rica</span>
                                  <span className="text-heading">Número de Identificación Corporativa:</span>
                                  <span>3-102-880000</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="group footer-games foot-column top-line">
                            <div className="tagline title"><span>Juegos</span></div>
                            <a className="tagline link" href="/es/casino"><span>Casino</span></a><a className="tagline link" href="/es/casino/page/2/live-dealer"><span>Casino en vivo</span></a>
                            <a href="https://betpanda.io/en/sportsbook" className="tagline link"><span>Deportes</span></a><a className="tagline link" href="/es/casino/play/4188/aviator/"><span>Aviador</span></a>
                            <a className="tagline link" href="/es/originals"><span>Originales Betpanda</span></a><a className="tagline link" href="/es/casino/page/2/live-casino/11/game-shows"><span>Concursos</span></a>
                            <a className="tagline link" href="/es/casino/23/table-games"><span>Juegos de mesa</span></a>
                          </div>
                          <div className="group footer-info foot-column top-line">
                            <div className="tagline title"><span>Plataforma</span></div>
                            <a className="tagline link" href="/es/promo/promotions"><span>Promociones</span></a><a className="tagline link" href="/es/promo/priority-vip"><span>Club VIP</span></a>
                            <a href="mailto:affiliates@betpanda.io" className="tagline link"><span>Afiliados</span></a><a href="https://betpanda.kb.help/" className="tagline link"><span>Preguntas frecuentes</span></a>
                            <a className="tagline link" href="/es/info/terms"><span>Términos de servicio</span></a><a className="tagline link" href="/es/info/AML-Statement"><span>Declaración PBC/FT</span></a>
                            <a className="tagline link" href="/es/info/sportsbook-terms"><span>Reglas de apuestas deportivas</span></a><a className="tagline link" href="/es/info/terms"><span>Política de privacidad</span></a>
                            <a href="https://betpandacasino.io/lp/" className="tagline link"><span>Blog</span></a><a className="tagline link" href="/es/info/vpn"><span>Instrucciones de&nbsp;VPN</span></a>
                          </div>
                          <div className="group footer-info foot-column top-line footer-info-socials">
                            <div className="tagline title"><span>Comunidad</span></div>
                            <a href="https://x.com/betpanda_casino" className="tagline link link-social-footer">
                              <span><img alt="X.svg" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/X_8fbebe4f44.svg" /> X (Twitter)</span>
                            </a>
                            <a href="https://discord.gg/25ncaUDuft" className="tagline link link-social-footer">
                              <span><img alt="Discord new.png" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Discord_new_14fc1a7afc.png" /> Discord</span>
                            </a>
                            <a href="https://www.instagram.com/betpandaofficial/" className="tagline link link-social-footer">
                              <span><img alt="Instagram.svg" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Instagram_8114f44513.svg" /> Instagram</span>
                            </a>
                            <a href="https://t.me/betpandaofficial" className="tagline link link-social-footer">
                              <span><img alt="Telegram.svg" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Telegram_9c8c349dab.svg" /> Telegrama</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="footer-dynamic">
                    <div className="container">
                      <div className="row">
                        <div className="col-md-6 taglines"></div>
                        <div className="col-md-6"></div>
                        <div className="col-md-12 taglines-group">
                          <div className="group footer-supported-section">
                            <div className="tagline footer-supported-text">
                              <div className="tagline text">
                                <span className="text-parent-head">Monedas compatibles</span><span>¿No encuentras tu moneda favorita? <a href="mailto:support@betpanda.io">Solicítala aquí</a></span>
                              </div>
                            </div>
                            <div className="tagline coins-images">
                              <span>
                                <img alt="Group 121417667.svg" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Group_121417667_7e9394aed9.svg" />
                                <img alt="Group 121417662.svg" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Group_121417662_b8f17e79bf.svg" />
                                <img alt="Group 121417665.svg" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Group_121417665_d1be404b15.svg" />
                                <img alt="Group 121417664.svg" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Group_121417664_6746d82893.svg" />
                                <img alt="Group 121417663.svg" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Group_121417663_5173497c93.svg" />
                                <img alt="Group 121417666.svg" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Group_121417666_080ee79452.svg" />
                                <img alt="Group 121417669.svg" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Group_121417669_2adbd7a729.svg" />
                                <img alt="Group 121417660.svg" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Group_121417660_86f17b8ac8.svg" />
                                <img alt="Group 121417659.svg" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Group_121417659_c5fe0a8db8.svg" />
                                <img alt="Group 121417658.svg" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Group_121417658_ff619134d0.svg" />
                              </span>
                            </div>
                            <div className="tagline"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="styled-text-list partner-row">
                    <div className="container">
                      <div className="row">
                        <div className="tagline partner-logo-wrapper">
                          <div className="tagline partner-logo"><img title="" alt="info" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Trustpilot_Logo_2022_1_020c6ddfc7.svg" /><span></span></div>
                          <div className="tagline partner-logo"><img title="" alt="info" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/CT_logo_Black_Yellow_tag_1ac22bfeda.svg" /><span></span></div>
                          <div className="tagline partner-logo"><img title="" alt="info" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Group_470_b6bf1ffb7e.svg" /><span></span></div>
                          <div className="tagline partner-logo"><img title="" alt="info" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Group_469_cee9805075.svg" /><span></span></div>
                          <div className="tagline partner-logo"><img title="" alt="info" src="https://d3ec3n7kizfkuy.cloudfront.net/betpanda2/Layer_2_411995b0e2.svg" /><span></span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="styled-text-list copyright-wrapper">
                    <div className="container">
                      <div className="row">
                        <div className="tagline copyright"><span>©&nbsp;Todos los derechos reservados. 2025&nbsp;Betpanda.io</span></div>
                        <div className="tagline copyright-navigation">
                          <div className="copyright-nav-item">
                            <span>Support </span>
                            <a className="copyright-nav-link" href="mailto:support@betpanda.io">support@betpanda.io</a>
                          </div>
                          <div className="copyright-nav-item">
                            <span>Partners </span>
                            <a className="copyright-nav-link" href="mailto:partners@betpanda.io">partners@betpanda.io</a>
                          </div>
                          <div className="copyright-nav-item">
                            <span>Press </span>
                            <a className="copyright-nav-link" href="mailto:press@betpanda.io">press@betpanda.io</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;