import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import GameCard from "/src/components/GameCard";
import Slideshow from "../components/LiveCasino/Slideshow";
import CategoryContainer from "../components/CategoryContainer";
import GameModal from "../components/Modal/GameModal";
import About from "../components/Home/About";
import Footer from "../components/Layout/Footer";
import LoadGames from "../components/Loading/LoadGames";
import SearchInput from "../components/SearchInput";
import SearchSelect from "../components/SearchSelect";
import LoginModal from "../components/Modal/LoginModal";
import "animate.css";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const LiveCasino = () => {
  const pageTitle = "Casino en Vivo";
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [firstFiveCategoriesGames, setFirstFiveCategoriesGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const originalCategoriesRef = useRef([]);
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
  const [isGameLoadingError, setIsGameLoadingError] = useState(false);
  const [mobileShowMore, setMobileShowMore] = useState(false);
  const [isSingleCategoryView, setIsSingleCategoryView] = useState(false);
  const refGameModal = useRef();
  const location = useLocation();
  const searchRef = useRef(null);
  const { isSlotsOnly, isMobile } = useOutletContext();
  const hasFetchedContentRef = useRef(false);
  const prevHashRef = useRef("");
  const pendingCategoryFetchesRef = useRef(0);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
    setActiveCategory({});
    setIsSingleCategoryView(false);
    hasFetchedContentRef.current = false;
    getPage("livecasino");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getPage = (page) => {
    setIsLoadingGames(true);
    setCategories([]);
    setGames([]);
    setFirstFiveCategoriesGames([]);
    callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
  };

  const callbackGetPage = (result) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
    } else {
      setCategories(result.data.categories || []);
      if (!originalCategoriesRef.current || originalCategoriesRef.current.length === 0) {
        originalCategoriesRef.current = result.data.categories || [];
      }
      setSelectedProvider(null);
      setPageData(result.data);
      const firstFiveCategories = (result.data.categories || []).slice(0, 5);
      if (firstFiveCategories.length > 0) {
        setFirstFiveCategoriesGames([]);
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        setIsLoadingGames(true);
        firstFiveCategories.forEach((item, index) => {
          fetchContentForCategory(item, item.id, item.table_name, index, true, result.data.page_group_code);
        });
      } else {
        setIsLoadingGames(false);
      }
    }
  };

  const fetchContentForCategory = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode = null) => {
    const pageSize = 8;
    const groupCode = pageGroupCode || pageData.page_group_code;
    const apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=0&length=" +
      pageSize +
      (selectedProvider && selectedProvider.id ? "&provider=" + selectedProvider.id : "");

    callApi(contextData, "GET", apiUrl, (result) => callbackFetchContentForCategory(result, category, categoryIndex), null);
  };

  const callbackFetchContentForCategory = (result, category, categoryIndex) => {
    if (result.status === 500 || result.status === 422) {
      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
    } else {
      const content = result.content || [];
      configureImageSrc(result);

      const gamesWithImages = content.map((game) => ({
        ...game,
        imageDataSrc: game.image_local != null ? contextData.cdnUrl + game.image_local : game.image_url,
      }));

      const categoryGames = {
        category: category,
        games: gamesWithImages,
      };

      setFirstFiveCategoriesGames((prev) => {
        const updated = [...prev];
        updated[categoryIndex] = categoryGames;
        return updated;
      });

      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
    }
  };

  useEffect(() => {
    if (categories.length === 0) return;
    const hash = location.hash;
    if (hash && hash.startsWith('#')) {
      if (prevHashRef.current !== hash) {
        const categoryCode = hash.substring(1);
        const category = categories.find(cat => cat.code === categoryCode);
        if (category) {
          const categoryIndex = categories.indexOf(category);
          setSelectedProvider(null);
          setActiveCategory(category);
          setSelectedCategoryIndex(categoryIndex);
          setIsSingleCategoryView(true);
          fetchContent(category, category.id, category.table_name, categoryIndex, true);
          prevHashRef.current = hash;
          hasFetchedContentRef.current = true;
          return;
        }
      }
    }

    if (!hasFetchedContentRef.current) {
      const urlParams = new URLSearchParams(location.search);
      const providerName = urlParams.get('provider');
      const providerId = urlParams.get('providerId');

      if (providerName && providerId) {
        const provider = categories.find(cat => cat.id.toString() === providerId.toString());
        if (provider) {
          const providerIndex = categories.indexOf(provider);
          setSelectedProvider(provider);
          setActiveCategory(provider);
          setSelectedCategoryIndex(providerIndex);
          setIsSingleCategoryView(true);
          fetchContent(provider, provider.id, provider.table_name, providerIndex, true);
          prevHashRef.current = hash;
          hasFetchedContentRef.current = true;
          return;
        }
      }

      // Default to multi-category view
      setActiveCategory(categories[0] || {});
      setSelectedCategoryIndex(0);
      setIsSingleCategoryView(false);
      hasFetchedContentRef.current = true;
    }
  }, [categories, location.search, location.hash]);

  const loadMoreContent = (category, categoryIndex) => {
    if (!category) return;
    if (isMobile) {
      setMobileShowMore(true);
    }
    setIsSingleCategoryView(true);
    setSelectedCategoryIndex(categoryIndex);
    setActiveCategory(category);
    fetchContent(category, category.id, category.table_name, categoryIndex, true);
    window.scrollTo(0, 0);
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage) => {
    let pageSize = 30;
    setIsLoadingGames(true);

    if (resetCurrentPage) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    let apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      pageData.page_group_code +
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

    callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
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
    } else {
      setIsGameLoadingError(true);
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

  const handleCategorySelect = (category, index) => {
    setActiveCategory(category);
    setSelectedProvider(null);
    setTxtSearch("");
    setIsSingleCategoryView(true);
    setSelectedCategoryIndex(index);
    fetchContent(category, category.id, category.table_name, index, true);
  };

  const handleProviderSelect = (provider, index = 0) => {
    setSelectedProvider(provider);
    setIsProviderDropdownOpen(false);
    setTxtSearch("");
    setIsSingleCategoryView(true);
    if (categories.length > 0 && provider) {
      setActiveCategory(provider);
      fetchContent(provider, provider.id, provider.table_name, index, true);
      if (isMobile) {
        setMobileShowMore(true);
      }
    } else if (!provider && categories.length > 0) {
      const firstCategory = categories[0];
      setActiveCategory(firstCategory);
      setIsSingleCategoryView(false);
      setSelectedCategoryIndex(0);
    }
  };

  const search = (e) => {
    let keyword = e.target.value;
    setTxtSearch(keyword);
    setIsSingleCategoryView(true);

    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
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

    if (keyword === "") {
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
      setIsLoadingGames(false);
    } else {
      configureImageSrc(result);
      setGames(result.content);
      pageCurrent = 0;
    }
    setIsLoadingGames(false);
  };

  const clearSearch = () => {
    setTxtSearch("");
    setSelectedProvider(null);
    setIsSingleCategoryView(false);
    navigate("/live-casino");
    if (categories.length > 0) {
      const firstCategory = categories[0];
      setActiveCategory(firstCategory);
      setSelectedCategoryIndex(0);
      setIsLoadingGames(true);
      const firstFiveCategories = categories.slice(0, 5);
      if (firstFiveCategories.length > 0) {
        setFirstFiveCategoriesGames([]);
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        firstFiveCategories.forEach((item, index) => {
          fetchContentForCategory(item, item.id, item.table_name, index, true, pageData.page_group_code);
        });
      } else {
        setIsLoadingGames(false);
      }
      if (isMobile) {
        setMobileShowMore(false);
      }
    } else {
      getPage("livecasino");
    }
  };

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
                  {categories.length > 0 && txtSearch === "" && selectedProvider === null && !isSingleCategoryView && (
                    <CategoryContainer
                      categories={originalCategoriesRef.current.length > 0 ? originalCategoriesRef.current : categories}
                      selectedCategoryIndex={selectedCategoryIndex}
                      onCategoryClick={(category, id, table, index) => handleCategorySelect(category, index)}
                      onCategorySelect={handleCategorySelect}
                      isMobile={isMobile}
                      pageType="livecasino"
                    />
                  )}
                  <div className="casino-tab-view">
                    <div className="main-container">
                      <div className="container container-fluid">
                        {(txtSearch !== "" || selectedProvider || isSingleCategoryView) ? (
                          <>
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
                            <div className="row">
                              <div className="col-12 mb-5">
                                <div className="filter-description" aria-live="polite">
                                  Mostrando juegos
                                  {selectedProvider && (
                                    <span>
                                      de <h1>{selectedProvider.name}</h1>
                                    </span>
                                  )}
                                  {txtSearch !== "" && (
                                    <span>
                                      búsqueda que coincide con “<h1>{txtSearch}</h1>”
                                    </span>
                                  )}
                                  {isSingleCategoryView && !selectedProvider && txtSearch === "" && (
                                    <span>
                                      de <h1>{activeCategory?.name || 'Categoría'}</h1>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="casino-games-container">
                              <div className="row games-list popular">
                                {games.map((game) => (
                                  <GameCard
                                    key={game.id}
                                    id={game.id}
                                    provider={activeCategory?.name || 'Casino en Vivo'}
                                    title={game.name}
                                    imageSrc={game.imageDataSrc || game.image_url}
                                    mobileShowMore={mobileShowMore}
                                    onClick={() => (isLogin ? launchGame(game, "slot", "tab") : handleLoginClick())}
                                  />
                                ))}
                              </div>
                            </div>
                            {isLoadingGames && <LoadGames />}
                            {(isSingleCategoryView || txtSearch !== "" || selectedProvider) && (
                              <div className="text-center">
                                <a className="btn btn-success load-more" onClick={() => loadMoreContent(activeCategory, selectedCategoryIndex)}>
                                  Mostrar todo
                                </a>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="casino-games-container">
                              {firstFiveCategoriesGames && firstFiveCategoriesGames.map((entry, catIndex) => {
                                if (!entry || !entry.games) return null;
                                const categoryKey = entry.category?.id || `cat-${catIndex}`;

                                return (
                                  <div className="category-block" key={categoryKey}>
                                    <div className="row games-list popular">
                                      <h2>
                                        {entry?.category?.name || ''}
                                        <a className="show-all" onClick={() => loadMoreContent(entry.category, catIndex)}>Mostrar todo</a>
                                      </h2>
                                    </div>
                                    <div className={`row games-list popular ${mobileShowMore ? '' : 'limited-games-list'}`}>
                                      {entry.games.slice(0, 5).map((game) => (
                                        <GameCard
                                          key={game.id}
                                          id={game.id}
                                          provider={entry.category?.name || 'Casino en Vivo'}
                                          title={game.name}
                                          imageSrc={game.imageDataSrc || game.image_url}
                                          mobileShowMore={mobileShowMore}
                                          onClick={() => (isLogin ? launchGame(game, "slot", "tab") : handleLoginClick())}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            {isLoadingGames && <LoadGames />}
                          </>
                        )}
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
      {isGameLoadingError && (
        <div className="container">
          <div className="row">
            <div className="col-md-6 error-loading-game">
              <div className="alert alert-warning">Error al cargar el juego. Inténtalo de nuevo o ponte en contacto con el equipo de soporte.</div>
              <a className="btn btn-primary" onClick={() => window.location.reload()}>
                Volver a la página principal
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveCasino;