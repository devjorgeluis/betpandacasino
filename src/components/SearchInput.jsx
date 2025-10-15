const SearchInput = ({
    txtSearch,
    setTxtSearch,
    searchRef,
    search,
    clearSearch
}) => {
    const handleClearClick = () => {
        if (txtSearch !== "") {
            if (clearSearch) {
                clearSearch();
            } else {
                setTxtSearch("");
            }
        }
    };

    return (
        <div className="search-container">
            <div className="input-group">
                <input 
                    ref={searchRef}
                    className="form-control" 
                    placeholder="Buscar" 
                    value={txtSearch}
                    onChange={(event) => {
                        setTxtSearch(event.target.value);
                    }}
                    onKeyUp={(event) => {
                        search(event);
                    }}
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
