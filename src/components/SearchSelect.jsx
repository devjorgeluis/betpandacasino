import { useContext } from "react";
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

    const toggleProviderDropdown = () => {
        setIsProviderDropdownOpen(!isProviderDropdownOpen);
    };

    const handleProviderSelect = (provider, index = 0) => {
        setSelectedProvider(provider);
        setIsProviderDropdownOpen(false);
        onProviderSelect(provider, index);
    };

    return (
        <div className="input-wrapper_inputWrapper select_select provider-select_providerSelect input-wrapper_default">
            <div>
                <label className="input-wrapper_inputWrapperLabel">
                    <span className="input-wrapper_inputWrapperInput">
                        <button
                            className={`select_selector select_active ${isProviderDropdownOpen ? 'select_opened' : ''}`}
                            onClick={toggleProviderDropdown}
                        >
                            {selectedProvider && (
                                <span className="select_selectorIcon">
                                    <img
                                        alt=""
                                        loading="lazy"
                                        width="20"
                                        height="20"
                                        decoding="async"
                                        data-nimg="1"
                                        src={selectedProvider.image_local != null && selectedProvider.image_local !== "" ? contextData.cdnUrl + selectedProvider.image_local : selectedProvider.image_url}
                                    />
                                </span>
                            )}
                            <span className="select_selectorLabel">
                                <span className="select_selectorLabelCurrentLabel">
                                    {selectedProvider ? selectedProvider.name : "Todos los proveedores"}
                                </span>
                            </span>
                            {selectedProvider && selectedProvider.id ?
                                <span
                                    className="select-suffix_selectorSuffixClear"
                                    role="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        handleProviderSelect(null, 0);
                                    }}
                                >
                                    <img src={IconClose} />
                                </span> : 
                                <span className="select-suffix_selectorSuffixIcon">
                                    <img src={IconArrowDown} />
                                </span>
                            }
                        </button>
                        <div className={`select-options_selectOptions ${isProviderDropdownOpen ? 'select-options_shown' : ''}`}>
                            {categories && categories.map((provider, index) => (
                                <button
                                    key={index}
                                    className="select-options_selectOption"
                                    onClick={() => handleProviderSelect(provider, index)}
                                >
                                    <span className="select-options_selectOptionIcon">
                                        <img
                                            alt=""
                                            loading="lazy"
                                            width="20"
                                            height="20"
                                            decoding="async"
                                            data-nimg="1"
                                            src={provider.image_local != null && provider.image_local !== "" ? contextData.cdnUrl + provider.image_local : provider.image_url}
                                        />
                                    </span>
                                    <span><span>{provider.name}</span></span>
                                </button>
                            ))}
                        </div>
                        <span className="input-wrapper-label_inputWrapperLabel input-wrapper_inputWrapperLabelText">
                            <span>Proveedor</span>
                        </span>
                    </span>
                </label>
            </div>
            <fieldset className="input-wrapper_inputWrapperFieldset input-wrapper_hasLabel">
                <legend className="input-wrapper_inputWrapperLegend"><span>Proveedor</span></legend>
            </fieldset>
        </div>
    );
};

export default SearchSelect;