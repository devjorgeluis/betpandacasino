import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/LayoutContext";
import { NavigationContext } from "../components/NavigationContext";
import { callApi } from "../utils/Utils";
import GameCard from "/src/components/GameCard";
import Slideshow from "../components/Casino/Slideshow";
import CategoryContainer from "../components/CategoryContainer";
import GameModal from "../components/GameModal";
import About from "../components/Home/About";
import Footer from "../components/Footer";
import LoadGames from "../components/LoadGames";
import SearchInput from "../components/SearchInput";
import SearchSelect from "../components/SearchSelect";
import LoginModal from "../components/LoginModal";
import "animate.css";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;


const Casino = () => {
  const pageTitle = "Casino";
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [txtSearch, setTxtSearch] = useState("");
  const [searchDelayTimer, setSearchDelayTimer] = useState();
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [mobileShowMore, setMobileShowMore] = useState(false);
  const refGameModal = useRef();
  const location = useLocation();
  const searchRef = useRef(null);
  const { isSlotsOnly, isMobile } = useOutletContext();

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
    setActiveCategory({});

    const hash = location.hash;
    if (hash && hash.startsWith('#')) {
      const pageName = hash.substring(1);
      getPage(pageName);
    } else {
      getPage("casino");
    }

    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);


  useEffect(() => {
    updateNavLinks();
  }, [isSlotsOnly]);

  const updateNavLinks = () => {
    if (isSlotsOnly === "false") {
    } else {
    }
  };

  const getPage = (page) => {
    setIsLoadingGames(true);
    setCategories([]);
    setGames([]);
    callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
  };

  const callbackGetPage = (result) => {
    if (result.status === 500 || result.status === 422) {
    
    } else {
      setCategories(result.data.categories);
      setSelectedProvider(null);
      setPageData(result.data);

      if (result.data.page_group_type === "categories" && result.data.categories.length > 0) {
        const firstCategory = result.data.categories[0];
        setSelectedCategoryIndex(0);
        setActiveCategory(firstCategory);
        fetchContent(firstCategory, firstCategory.id, firstCategory.table_name, 0, true, result.data.page_group_code);
      } else if (result.data.page_group_type === "games") {
        loadMoreContent();
      }

      pageCurrent = 0;
    }
    setIsLoadingGames(false);
  };

  const loadMoreContent = () => {
    let item = categories[selectedCategoryIndex];
    if (item) {
      fetchContent(item, item.id, item.table_name, selectedCategoryIndex, false);
      if (isMobile) {
        setMobileShowMore(true);
      }
    }
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode) => {
    let pageSize = 30;
    setIsLoadingGames(true);

    if (resetCurrentPage == true) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);
    setTxtSearch("");

    const groupCode = pageGroupCode || pageData.page_group_code;

    let apiUrl = "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=" +
      pageCurrent +
      "&length=" +
      pageSize;

    if (selectedProvider && selectedProvider.id) {
      apiUrl += "&provider=" + selectedProvider.id;
    }

    callApi(
      contextData,
      "GET",
      apiUrl,
      callbackFetchContent,
      null
    );
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      
    } else {
      if (pageCurrent == 0) {
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
      if (element.image_local != null) {
        imageDataSrc = contextData.cdnUrl + element.image_local;
      }
      element.imageDataSrc = imageDataSrc;
    });
  };

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    setShowFullDivLoading(true);
    selectedGameId = game.id != null ? game.id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : null;
    callApi(contextData, "GET", "/get-game-url?game_id=" + selectedGameId, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    setShowFullDivLoading(false);
    if (result.status == "0") {
      switch (selectedGameLauncher) {
        case "modal":
        case "tab":
          setGameUrl(result.url);
          break;
      }
    }
  };

  const closeGameModal = () => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedProvider(null);
    setTxtSearch("");
  }

  const handleProviderSelect = (provider, index = 0) => {
    setSelectedProvider(provider);
    setIsProviderDropdownOpen(false);
    setTxtSearch("");
    if (categories.length > 0 && provider) {
      setActiveCategory(provider);
      fetchContent(provider, provider.id, provider.table_name, index, true);
      if (isMobile) {
        setMobileShowMore(true);
      }
    } else if (!provider && categories.length > 0) {
      const firstCategory = categories[0];
      setActiveCategory(firstCategory);
      fetchContent(firstCategory, firstCategory.id, firstCategory.table_name, 0, true);
    }
  };

  const search = (e) => {
    let keyword = e.target.value;
    setTxtSearch(keyword);

    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
      let keyword = e.target.value;
      do_search(keyword);
    } else {
      if (
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        e.keyCode == 8 ||
        e.keyCode == 46
      ) {
        do_search(keyword);
      }
    }

    if (e.key === "Enter" || e.keyCode === 13 || e.key === "Escape" || e.keyCode === 27) {
      searchRef.current?.blur();
    }
  };

  const do_search = (keyword) => {
    clearTimeout(searchDelayTimer);

    if (keyword == "") {
      return;
    }

    setGames([]);
    setIsLoadingGames(true);

    let pageSize = 20;

    let searchDelayTimerTmp = setTimeout(function () {
      callApi(
        contextData,
        "GET",
        "/search-content?keyword=" + txtSearch + "&page_group_code=" + pageData.page_group_code + "&length=" + pageSize,
        callbackSearch,
        null
      );
    }, 1000);

    setSearchDelayTimer(searchDelayTimerTmp);
  };

  const callbackSearch = (result) => {
    if (result.status === 500 || result.status === 422) {
      
    } else {
      configureImageSrc(result, true);
      setGames(result.content);
      pageCurrent = 0;
    }
    setIsLoadingGames(false);
  };

  const clearSearch = () => {
    setTxtSearch("");
    setSelectedProvider(null);
    if (categories.length > 0) {
      const firstCategory = categories[0];
      setActiveCategory(firstCategory);
      setSelectedCategoryIndex(0);
      fetchContent(firstCategory, firstCategory.id, firstCategory.table_name, 0, true);
      if (isMobile) {
        setMobileShowMore(false);
      }
    }
  }

  return (
    <>
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
          gameImg={selectedGameImg}
          reload={launchGame}
          launchInNewTab={() => launchGame(null, null, "tab")}
          ref={refGameModal}
          onClose={closeGameModal}
          isMobile={isMobile}
        />
      ) : (
        <>
          <div className={`root-container ${isMobile ? 'mobile' : ''}`} id="pageContainer">
            <div className="root-wrapper">
              <div className="page">
                <div className="casino-container">
                  <Slideshow />
                  <div className="container-fluid search-and-filter-wrapper" id="casinoFilterWrapper">
                    <div className="container search-and-filter-container">
                      <div className="row">
                        <div className="col-md-9 filter-column">
                          <div className="container">
                            <div className="casino-filters-container" id="casinoFiltersContainer">
                              <div
                                className="casino-filter"
                                onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
                              >
                                Proveedores <i className="material-icons">arrow_drop_down</i>
                              </div>
                              <div className="casino-filter">Funciones <i className="material-icons">arrow_drop_down</i></div>
                            </div>
                          </div>
                          {isProviderDropdownOpen && (
                            <SearchSelect
                              categories={categories}
                              selectedProvider={selectedProvider}
                              setSelectedProvider={setSelectedProvider}
                              isProviderDropdownOpen={isProviderDropdownOpen}
                              setIsProviderDropdownOpen={setIsProviderDropdownOpen}
                              onProviderSelect={handleProviderSelect}
                            />
                          )}
                        </div>
                        <div className="col-md-3 search-column">
                          <SearchInput
                            txtSearch={txtSearch}
                            setTxtSearch={setTxtSearch}
                            searchRef={searchRef}
                            search={search}
                            clearSearch={clearSearch}
                            isMobile={isMobile}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {
                    categories.length > 0 && txtSearch === "" && selectedProvider === null && <CategoryContainer
                      categories={categories}
                      selectedCategoryIndex={selectedCategoryIndex}
                      onCategoryClick={fetchContent}
                      onCategorySelect={handleCategorySelect}
                      isMobile={isMobile}
                      pageType="casino"
                    />
                  }
                  {
                    (txtSearch !== "" || selectedProvider) && <>
                      <div className="container">
                        <div className={`container categories-container ${isMobile ? 'mobile' : ''}`}>
                          <ul className={`navbar-nav flex-row casino-lobby-categories row ${isMobile ? 'mobile' : ''}`}>
                            <li className="nav-item" onClick={clearSearch}>
                              <a className="nav-link">
                                <i className="material-icons">chevron_left</i>
                                <span className="title">Volver a todos los juegos</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <div className="filter-description">
                              Mostrando juegos
                              {selectedProvider && (
                                <span>
                                  de
                                  <h1>{selectedProvider.name}</h1>
                                </span>
                              )}
                              {txtSearch !== "" && (
                                <span>
                                  búsqueda que coincide con “
                                  <h1>{txtSearch}</h1>
                                  ”
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                  <div className="casino-tab-view">
                    <div className="main-container">
                      <div className="container container-fluid">
                        <div className="casino-games-container">
                          {
                            txtSearch === "" && selectedProvider === null ? <div className="row games-list popular" onClick={loadMoreContent}>
                              <h2>{activeCategory?.name || ''}
                                <a className="show-all">Mostrar todo</a>
                              </h2>
                            </div> : <div className="row games-list popular"><h2></h2></div>
                          }
                          <div className={`row games-list popular ${mobileShowMore ? '' : 'limited-games-list'}`}>
                            {games &&
                              games.map((item, index) => {
                                let imageDataSrc = item.image_url;
                                if (item.image_local != null) {
                                  imageDataSrc = contextData.cdnUrl + item.image_local;
                                }
                                return (
                                  <GameCard
                                    key={index}
                                    id={item.id}
                                    provider={activeCategory?.name || 'Casino'}
                                    title={item.name}
                                    imageSrc={imageDataSrc}
                                    mobileShowMore={mobileShowMore}
                                    onClick={() =>
                                      isLogin
                                        ? launchGame(item, "slot", "tab")
                                        : handleLoginClick()
                                    }
                                  />
                                );
                              })
                            }
                          </div>
                        </div>
                        {isLoadingGames && <LoadGames />}
                      </div>
                    </div>
                  </div>
                </div>

                <About />
              </div>
            </div>

            <Footer isSlotsOnly={isSlotsOnly} />
          </div>
        </>
      )}
    </>
  );
};

export default Casino;
