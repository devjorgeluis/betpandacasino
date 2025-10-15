import { useContext } from "react";
import { LayoutContext } from "./LayoutContext";

const SearchInput = ({
    txtSearch,
    setTxtSearch,
    searchRef,
    search,
    clearSearch,
    isMobile
}) => {
    const { setShowMobileSearch } = useContext(LayoutContext);

    const handleClearClick = () => {
        if (txtSearch !== "") {
            if (clearSearch) {
                clearSearch();
            } else {
                setTxtSearch("");
            }
        }
    };

    const handleFocus = () => {
        if (isMobile) {
            setShowMobileSearch(true);
        }
    };

    return (
        <div className="search-container">
            <div className="input-group">
                <input
                    ref={searchRef}
                    className={`form-control ${isMobile ? 'mobile-form-control' : 'desktop-form-control'}`}
                    placeholder="Buscar"
                    value={txtSearch}
                    onChange={(event) => {
                        setTxtSearch(event.target.value);
                    }}
                    onKeyUp={(event) => {
                        search(event);
                    }}
                    onFocus={handleFocus}
                />
                <span className="input-group-append">
                    <button
                        type="button"
                        onClick={handleClearClick}
                    >
                        <i className="material-icons">{txtSearch === "" ? "search" : "delete"}</i>
                    </button>
                </span>
            </div>
        </div>
    );
};

export default SearchInput;
