import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/LayoutContext";
import { NavigationContext } from "../components/NavigationContext";
import { callApi } from "../utils/Utils";
import GameCard from "/src/components/GameCard";
import NavLinkIcon from "../components/NavLinkIcon";
import Slideshow from "../components/Slideshow";
import CategorySlideshow from "../components/CategorySlideshow";
import GameModal from "../components/GameModal";
import DivLoading from "../components/DivLoading";
import GamesLoading from "../components/GamesLoading";
import SearchInput from "../components/SearchInput";
import SearchSelect from "../components/SearchSelect";
import LoginModal from "../components/LoginModal";
import CustomAlert from "../components/CustomAlert";
import "animate.css";
import ImgBanner1 from "/src/assets/img/slots.avif";
import ImgMobileBanner1 from "/src/assets/img/mobile-slots.avif";
import ImgLobby from "/src/assets/img/lobby.avif";
import ImgJoker from "/src/assets/img/jokers.avif";
import ImgHot from "/src/assets/img/hot.avif";
import ImgCrash from "/src/assets/img/crash.avif";
import ImgMegaways from "/src/assets/img/megaways.avif";
import ImgRoulette from "/src/assets/img/roulette.webp";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let pageCurrent = 0;


const Casino = () => {
  const pageTitle = "Casino";
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const [selectedPage, setSelectedPage] = useState("lobby");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [fragmentNavLinksBody, setFragmentNavLinksBody] = useState(<></>);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [txtSearch, setTxtSearch] = useState("");
  const [searchDelayTimer, setSearchDelayTimer] = useState();
  const [messageCustomAlert, setMessageCustomAlert] = useState(["", ""]);
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const refGameModal = useRef();
  const location = useLocation();
  const searchRef = useRef(null);
  const { isSlotsOnly } = useOutletContext();

  let imageSlideshow = isMobile ? [ImgMobileBanner1] : [ImgBanner1];

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

    setSelectedPage("casino");
    getPage("casino");

    window.scrollTo(0, 0);
  }, [location.pathname]);


  useEffect(() => {
    updateNavLinks();
  }, [isSlotsOnly]);

  const updateNavLinks = () => {
    if (isSlotsOnly === "false") {
      setFragmentNavLinksBody(
        <>
          <NavLinkIcon
            title="Lobby"
            pageCode="home"
            icon={ImgLobby}
            active={selectedPage === "home" || selectedPage === "lobby"}
            onClick={() => getPage("home")}
          />
          <NavLinkIcon
            title="Jokers"
            pageCode="joker"
            icon={ImgJoker}
            active={selectedPage === "joker"}
            onClick={() => getSubPage("joker")}
          />
          <NavLinkIcon
            title="Hot"
            pageCode="hot"
            icon={ImgHot}
            active={selectedPage === "hot"}
            onClick={() => getSubPage("hot")}
          />
          <NavLinkIcon
            title="Juegos de crash"
            pageCode="arcade"
            icon={ImgCrash}
            active={selectedPage === "arcade"}
            onClick={() => getSubPage("arcade")}
          />
          <NavLinkIcon
            title="Megaways"
            pageCode="megaways"
            icon={ImgMegaways}
            active={selectedPage === "megaways"}
            onClick={() => getSubPage("megaways")}
          />
          <NavLinkIcon
            title="Ruletas"
            pageCode="roulette"
            icon={ImgRoulette}
            active={selectedPage === "roulette"}
            onClick={() => getSubPage("roulette")}
          />
        </>
      );
    } else {
      setFragmentNavLinksBody(
        <>
          <NavLinkIcon
            title="Lobby"
            pageCode="home"
            icon={ImgLobby}
            active={selectedPage === "home" || selectedPage === "lobby"}
            onClick={() => getPage("home")}
          />
          <NavLinkIcon
            title="Jokers"
            pageCode="joker"
            icon={ImgJoker}
            active={selectedPage === "joker"}
            onClick={() => getSubPage("joker")}
          />
          <NavLinkIcon
            title="Hot"
            pageCode="hot"
            icon={ImgHot}
            active={selectedPage === "hot"}
            onClick={() => getSubPage("hot")}
          />
          <NavLinkIcon
            title="Megaways"
            pageCode="megaways"
            icon={ImgMegaways}
            active={selectedPage === "megaways"}
            onClick={() => getSubPage("megaways")}
          />
        </>
      );
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
      setSelectedProvider(null);
      setPageData(result.data);

      if (result.data.menu === "home") {
        setMainCategories(result.data.categories);
      }

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

  const getSubPage = (page) => {
    setIsLoadingGames(true);
    setGames([]);
    setSelectedPage(page);
    callApi(contextData, "GET", "/get-page?page=" + page, callbackGetSubPage, null);
  };

  const callbackGetSubPage = (result) => {
    if (result.status === 500 || result.status === 422) {
      setMessageCustomAlert(["error", result.message]);
    } else {
      setPageData(result.data);
      setSelectedProvider(null);
      setActiveCategory({});

      if (result.data.page_group_type === "categories") {
        setCategories(result.data.categories)
      }

      if (result.data.page_group_type === "games") {
        if (mainCategories && mainCategories.length > 0) {
          setCategories(mainCategories);
        } else {
          callApi(contextData, "GET", "/get-page?page=home", (homeResult) => {
            if (homeResult.data && homeResult.data.categories) {
              setMainCategories(homeResult.data.categories);
              setCategories(homeResult.data.categories);
            }
          }, null);
        }
      }

      if (result.data.categories && result.data.categories.length > 0) {
        let item = result.data.categories[0];
        fetchContent(item, item.id, item.table_name, 0, true, result.data.page_group_code);
      }
    }
  };

  const loadMoreContent = () => {
    let item = categories[selectedCategoryIndex];
    if (item) {
      fetchContent(item, item.id, item.table_name, selectedCategoryIndex, false);
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
      setMessageCustomAlert(["error", result.message]);
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
    } else if (result.status == "500" || result.status == "422") {
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

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedProvider(category);
    setTxtSearch("");
  }

  const handleProviderSelect = (provider, index = 0) => {
    setSelectedProvider(provider);
    setIsProviderDropdownOpen(false);
    setTxtSearch("");
    if (categories.length > 0 && provider) {
      setActiveCategory(provider);
      fetchContent(provider, provider.id, provider.table_name, index, true);
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
      setMessageCustomAlert(["error", result.message]);
    } else {
      configureImageSrc(result, true);
      setGames(result.content);
      pageCurrent = 0;
    }
    setIsLoadingGames(false);
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
          <Slideshow images={imageSlideshow} />

          <div className="games-tags_gamesTags">
            <div className="games-tags_gamesTagsInner">
              {fragmentNavLinksBody}
            </div>
          </div>

          {
            categories.length > 0 ? <CategorySlideshow
              categories={categories}
              selectedCategoryIndex={selectedCategoryIndex}
              onCategoryClick={fetchContent}
              onCategorySelect={handleCategorySelect}
              pageType="casino"
            /> : <DivLoading />
          }

          <div className="slots-filters_gamesFilters">
            <div className="slots-filters_searchSection">
              <SearchInput
                txtSearch={txtSearch}
                setTxtSearch={setTxtSearch}
                searchRef={searchRef}
                search={search}
                contextData={contextData}
                pageData={pageData}
                setGames={setGames}
                setIsLoadingGames={setIsLoadingGames}
                callbackSearch={callbackSearch}
                searchDelayTimer={searchDelayTimer}
                setSearchDelayTimer={setSearchDelayTimer}
              />
              <SearchSelect
                categories={categories}
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                isProviderDropdownOpen={isProviderDropdownOpen}
                setIsProviderDropdownOpen={setIsProviderDropdownOpen}
                onProviderSelect={handleProviderSelect}
              />
            </div>
          </div>

          <div className="active-games">
            {
              txtSearch === "" && <div className="games-block-title_gamesBlockTitle">
                <div className="games-block-title_gamesBlockTitleSeparator games-block-title_gamesBlockTitleLeft"></div>
                <p className="games-block-title_gamesBlockTitleText">Tragamonedas Destacadas</p>
                <div className="games-block-title_gamesBlockTitleSeparator games-block-title_gamesBlockTitleRight"></div>
              </div>
            }

            <div className="games-cards-suspensed_gameCardWrapper">
              <div className="grid_grid grid_sm grid_rowMax3 games-cards-suspensed_gameCardListClassName">
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
                        title={item.name}
                        imageSrc={imageDataSrc}
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
          </div>


          {isLoadingGames && <GamesLoading />}
          {!isLoadingGames && games.length >= 20 && (
            <div className="games-cards-suspensed_seeMoreWrapper">
              <a onClick={loadMoreContent}>
                <button className="button_button button_zeusPrimary button_md">Ver más</button>
              </a>
            </div>
          )}
          {!isLoadingGames && games.length === 0 && (
            <div className="not-found-view_notFoundView">
              <div className="not-found-view_notFoundViewContent">
                Buscamos por todas partes, <br /> pero no encontramos nada.
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Casino;