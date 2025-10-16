import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import LoadCasino from "./LoadCasino";
import LoadApi from "./LoadApi";
import IconEnlarge from "/src/assets/svg/enlarge.svg";
import IconClose from "/src/assets/svg/large-close.svg";

const GameModal = (props) => {
  const { contextData } = useContext(AppContext);
  const [url, setUrl] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [games, setGames] = useState([]);
  const [searchDelayTimer, setSearchDelayTimer] = useState();
  const [txtSearch, setTxtSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (props.gameUrl !== null && props.gameUrl !== "") {
      if (props.isMobile) {
        window.location.href = props.gameUrl;
      } else {
        document
          .getElementsByClassName("game-view-container")[0]
          .classList.remove("d-none");
        setUrl(props.gameUrl);
      }
    }
  }, [props.gameUrl, props.isMobile]);

  const closeModal = () => {
    resetModal();
    document.getElementsByClassName("game-view-container")[0].classList.add("d-none");
    if (props.onClose) {
      props.onClose();
    }
  };

  const resetModal = () => {
    setUrl(null);
    setIframeLoaded(false);
    document.getElementById("game-window-iframe").classList.add("d-none");
  };

  const toggleFullScreen = () => {
    const gameWindow = document.getElementsByClassName("game-window")[0];

    if (!isFullscreen) {
      // Enter fullscreen
      if (gameWindow.requestFullscreen) {
        gameWindow.requestFullscreen();
      } else if (gameWindow.mozRequestFullScreen) {
        gameWindow.mozRequestFullScreen();
      } else if (gameWindow.webkitRequestFullscreen) {
        gameWindow.webkitRequestFullscreen();
      } else if (gameWindow.msRequestFullscreen) {
        gameWindow.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const exitHandler = () => {
    if (
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      setIsFullscreen(false);
      document
        .getElementsByClassName("game-view-container")[0]
        .classList.remove("fullscreen");
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("mozfullscreenchange", exitHandler);
    document.addEventListener("MSFullscreenChange", exitHandler);

    return () => {
      document.removeEventListener("fullscreenchange", exitHandler);
      document.removeEventListener("webkitfullscreenchange", exitHandler);
      document.removeEventListener("mozfullscreenchange", exitHandler);
      document.removeEventListener("MSFullscreenChange", exitHandler);
    };
  }, []);

  const handleIframeLoad = () => {
    if (url != null) {
      document.getElementById("game-window-iframe").classList.remove("d-none");
      setIframeLoaded(true);
    }
  };

  const handleIframeError = () => {
    console.error("Error loading game iframe");
    setIframeLoaded(false);
  }

  if (props.isMobile) {
    return null;
  }

  const launchGame = (game, type, launcher) => {
    setUrl(null);
    setIframeLoaded(false);
    setTxtSearch("");
    document.getElementById("game-window-iframe").classList.add("d-none");
    
    setTimeout(() => {
      callApi(contextData, "GET", "/get-game-url?game_id=" + game.id, callbackLaunchGame, null);
    }, 50);
  };

  const callbackLaunchGame = (result) => {
    if (result.status == "0") {
      setUrl(result.url);
    }
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
    setIsSearch(true);
    clearTimeout(searchDelayTimer);

    if (keyword == "") {
      return;
    }

    setGames([]);

    let pageSize = 20;
    let searchDelayTimerTmp = setTimeout(function () {
      callApi(
        contextData,
        "GET",
        "/search-content?keyword=" + txtSearch + "&page_group_code=" + "default_pages_home" + "&length=" + pageSize,
        callbackSearch,
        null
      );
    }, 1000);

    setSearchDelayTimer(searchDelayTimerTmp);
  };

  const callbackSearch = (result) => {
    setIsSearch(false);
    if (result.status === 500 || result.status === 422) {

    } else {
      configureImageSrc(result, true);
      setGames(result.content);
    }
  };

  return (
    <>
      <div className="casino-game-background" style={{ backgroundImage: `url(${props.gameImg})` }}></div>
      <div className="d-none game-view-container gradient with-background">
        {
          txtSearch !== "" && <div className="game-search-result">
            <div className="search-results-container">
              <div className="search-results-inner-container">
                {
                  isSearch ? <>
                    <div className="mt-4" style={{ opacity: 0 }}>loading</div>
                    <LoadApi />
                  </> :
                    games.length > 0 ? games.map((item, index) => {
                      let imageDataSrc = item.image_url;
                      if (item.image_local != null) {
                        imageDataSrc = contextData.cdnUrl + item.image_local;
                      }

                      return (
                        <div
                          className="game-result-row"
                          key={index}
                          onClick={() => launchGame(item, "slot", "tab")}
                        >
                          <div className="game-image" style={{ backgroundImage: `url(${imageDataSrc})` }}></div>
                          <div className="game-title">
                            <span className="game-name">{item.name}</span>
                            <span className="game-studio"><span className="text-uppercase">{item.type}</span></span>
                          </div>
                        </div>
                      )
                    }) : <div className="no-results">
                      No se encontró ningún juego que coincida con la búsqueda : ' {txtSearch} '
                    </div>
                }
              </div>
            </div>
          </div>
        }

        <div className="game-head-wrapper" id="gameHeadWrapper">
          <div className="game-head-section">
            <div className="search-section">
              <div className="search-container in-game">
                <div className="search-group">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Buscar"
                    onKeyUp={search}
                    value={txtSearch}
                    onChange={(event) => {
                      setTxtSearch(event.target.value);
                    }}
                  />
                  <span className="input-group-append">
                    <button type="button"><i className="material-icons">search</i></button>
                  </span>
                </div>
              </div>
              <div className="play-for-fun-switch">
                <div className="inner">
                  <span className="fun">{props.gameName || "Joker's Jewels"}</span>
                </div>
              </div>
            </div>
            <div className="icon-section">
              <div className="game-fullscreen game-button">
                <img src={IconEnlarge} alt="Fullscreen" onClick={toggleFullScreen} />
              </div>
              <div className="game-close game-button">
                <img src={IconClose} alt="Close" onClick={closeModal} />
              </div>
            </div>
          </div>
        </div>
        <div className="game-container">
          <div className="game-container-inner">
            {iframeLoaded == false && (
              <div className="game-window-iframe-wrapper">
                <LoadCasino />
              </div>
            )}

            <div
              id="game-window-iframe"
              className="game-window-iframe-wrapper d-none"
            >
              <iframe
                allow="camera;microphone;fullscreen *"
                src={url}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                className="game"
                style={{ border: 'none' }}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameModal;