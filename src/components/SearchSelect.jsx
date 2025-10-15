import { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import IconArrowDown from "/src/assets/svg/arrow-down.svg";
import IconClose from "/src/assets/svg/close.svg";

const SearchSelect = ({
    categories,
    selectedProvider,
    setSelectedProvider,
    isProviderDropdownOpen,
    setIsProviderDropdownOpen,
    onProviderSelect
}) => {
    const { contextData } = useContext(AppContext);
    const [searchStudio, setSearchStudio] = useState("");

    const toggleProviderDropdown = () => {
        setIsProviderDropdownOpen(!isProviderDropdownOpen);
    };

    const handleProviderSelect = (provider, index = 0) => {
        setSelectedProvider(provider);
        setIsProviderDropdownOpen(false);
        onProviderSelect(provider, index);
    };

    const filteredCategories = categories.filter(provider => 
        provider.name.toLowerCase().includes(searchStudio.toLowerCase())
    );

    return (
        <div className="filter-container studio-filter">
            <div className="filter-title-row">
                <div className="close-container" onClick={() => setIsProviderDropdownOpen(false)}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="-36.5 91.5 648.5 684.99">
                        <polygon
                            className="icon-fill"
                            points="356.28,433.98 599.55,167.05 611.11,154.38 599,142.22 562.78,105.85 549.45,92.47 536.72,106.43
                                    287.76,379.61 38.77,106.43 26.04,92.46 12.71,105.86 -23.51,142.26 -35.61,154.41 -24.06,167.08 219.22,434.01 -24.05,700.94
                                    -35.61,713.61 -23.5,725.76 12.72,762.13 26.05,775.52 38.78,761.56 287.74,488.38 536.73,761.56 549.46,775.53 562.79,762.13
                                    599.01,725.73 611.11,713.58 599.56,700.91 "
                        ></polygon>
                    </svg>
                </div>
                <div className="filter-title">Proveedores</div>
            </div>
            <div className="search-studio">
                <input 
                    className="form-control" 
                    placeholder="Buscar" 
                    value={searchStudio}
                    onChange={(e) => setSearchStudio(e.target.value)}
                />
            </div>
            <div className="filter-scroll-container">
                <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
                    <div style={{ position: 'absolute', inset: '0px', overflow: 'scroll', marginRight: '-15px', marginBottom: '-15px' }}>
                        <div className="filter-scroll-inner">
                            <div className="studio-container">
                                <div className="section-title">Populares</div>
                                {filteredCategories.map((provider, index) => (
                                    <div key={index} className="studio-item" onClick={() => handleProviderSelect(provider, index)}>
                                        <div className="studio-image">
                                            {provider.image_local || provider.image_url ? (
                                                <img
                                                    alt={provider.name}
                                                    loading="lazy"
                                                    width="20"
                                                    height="20"
                                                    decoding="async"
                                                    src={provider.image_local ? contextData.cdnUrl + provider.image_local : provider.image_url}
                                                />
                                            ) : (
                                                <i className="studio-logo"></i>
                                            )}
                                        </div>
                                        <div className="studio-name">{provider.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div style={{ position: 'absolute', height: '6px', right: '2px', bottom: '2px', left: '2px', borderRadius: '3px' }}>
                        <div style={{ position: 'relative', display: 'block', height: '100%', cursor: 'pointer', borderRadius: 'inherit', backgroundColor: 'rgba(0, 0, 0, 0.2)', width: '0px' }}></div>
                    </div>
                    <div style={{ position: 'absolute', width: '6px', right: '2px', bottom: '2px', top: '2px', borderRadius: '3px' }}>
                        <div style={{ position: 'relative', display: 'block', width: '100%', cursor: 'pointer', borderRadius: 'inherit', backgroundColor: 'rgba(0, 0, 0, 0.2)', height: '30px', transform: 'translateY(0px)' }}></div>
                    </div>
                </div>
            </div>
            <div className="action-container">
                <a className="btn btn-primary full-width" onClick={() => setIsProviderDropdownOpen(false)}>Aplicar</a>
            </div>
        </div>
    );
};

export default SearchSelect;
