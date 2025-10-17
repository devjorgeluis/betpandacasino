import { useContext, useState, useRef } from "react";
import { LayoutContext } from "./Layout/LayoutContext";
import { AppContext } from "../AppContext";
import { NavigationContext } from "./Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import LoadApi from "./Loading/LoadApi";
import LoginModal from "./Modal/LoginModal";
import GameModal from "./Modal/GameModal";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;

const MobileSearch = ({
    isLogin, isMobile, onClose
}) => {
    const { contextData } = useContext(AppContext);
    const { setShowMobileSearch } = useContext(LayoutContext);
    const { setShowFullDivLoading } = useContext(NavigationContext);
    const [games, setGames] = useState([]);
    const [gameUrl, setGameUrl] = useState("");
    const refGameModal = useRef();
    const [txtSearch, setTxtSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const searchRef = useRef(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [searchDelayTimer, setSearchDelayTimer] = useState();
    const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
    const [isGameLoadingError, setIsGameLoadingError] = useState(false);

    const handleClearClick = () => {
        if (onClose) {
            onClose();
        }
        if (setShowMobileSearch) {
            setShowMobileSearch(false);
        }
        setTxtSearch("");
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLoginConfirm = () => {
        setShowLoginModal(false);
    };

    const launchGame = (game, type, launcher) => {
        setShouldShowGameModal(true);
        selectedGameId = game.id != null ? game.id : selectedGameId;
        selectedGameType = type != null ? type : selectedGameType;
        selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
        selectedGameName = game?.name;
        selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : null;
        callApi(contextData, "GET", "/get-game-url?game_id=" + game.id, callbackLaunchGame, null);
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
            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    onConfirm={handleLoginConfirm}
                />
            )}
            <div className="mobile-search focused">
                <div className="search-container float-right">
                    <div className="input-group">
                        <input
                            ref={searchRef}
                            className="form-control mobile-form-control"
                            placeholder="Buscar"
                            value={txtSearch}
                            onChange={(event) => {
                                setTxtSearch(event.target.value);
                            }}
                            onKeyUp={(event) => {
                                search(event);
                            }}
                            autoFocus
                        />
                        <span className="input-group-append" onClick={handleClearClick}>
                            <button type="button">
                                <i className="material-icons">close</i>
                            </button>
                        </span>
                    </div>
                </div>
                <div className="search-results-container">
                    <div className="search-results-inner-container">
                        {
                            isSearch ? <>
                                <div className="pt-1">
                                    <LoadApi />
                                </div>
                            </> :
                            games.length > 0 && games.map((item, index) => {
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
                            })
                        }
                    </div>
                </div>
            </div>

            {shouldShowGameModal && selectedGameId !== null && (
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
            )}

            {
                isGameLoadingError && <div className="container">
                    <div className="row">
                        <div className="col-md-6 error-loading-game">
                            <div className="alert alert-warning">Error al cargar el juego. Inténtalo de nuevo o ponte en contacto con el equipo de soporte.</div>
                            <a className="btn btn-primary" onClick={() => window.location.reload()}>Volver a la página principal</a>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default MobileSearch;
