import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import LoadApi from "../../components/Loading/LoadApi";
import IconChevronLeft from "/src/assets/svg/chevron-left.svg";
import IconChevronRight from "/src/assets/svg/chevron-right.svg";
import IconDoubleLeft from "/src/assets/svg/double-arrow-left.svg";
import IconDoubleRight from "/src/assets/svg/double-arrow-right.svg";

const ProfileHistory = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            return window.innerWidth <= 767;
        };

        setIsMobile(checkIsMobile());

        const handleResize = () => {
            setIsMobile(checkIsMobile());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getDefaultDates = () => {
        const now = new Date();
        const currentMonthFirst = new Date(now.getFullYear(), now.getMonth(), 1);
        const nextMonthFirst = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return { dateFrom: currentMonthFirst, dateTo: nextMonthFirst };
    };

    const [filters, setFilters] = useState(getDefaultDates());
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(true);
    const [activeTab, setActiveTab] = useState('wallet');
    const [pagination, setPagination] = useState({
        start: 0,
        length: 5,
        totalRecords: 0,
        currentPage: 1,
    });

    const [showFromCalendar, setShowFromCalendar] = useState(false);
    const [showToCalendar, setShowToCalendar] = useState(false);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '.');
    };

    const CustomFromInput = () => (
        <button className="date-picker-wrapper_datePickerButton" onClick={() => setShowFromCalendar(!showFromCalendar)}>
            <span className="date-picker-wrapper_datePickerButtonContent date-picker-wrapper_hasValue">
                <span className="date-picker-wrapper_datePickerButtonLabel">Desde</span><span className="date-picker-wrapper_datePickerButtonValue">{formatDate(filters.dateFrom)}</span>
            </span>
            <span className="date-picker-wrapper_datePickerButtonArrow">
                <img src={IconChevronLeft} />
            </span>
        </button>
    );

    const CustomToInput = () => (
        <button className="date-picker-wrapper_datePickerButton" onClick={() => setShowToCalendar(!showToCalendar)}>
            <span className="date-picker-wrapper_datePickerButtonContent date-picker-wrapper_hasValue">
                <span className="date-picker-wrapper_datePickerButtonLabel">Hasta</span><span className="date-picker-wrapper_datePickerButtonValue">{formatDate(filters.dateTo)}</span>
            </span>
            <span className="date-picker-wrapper_datePickerButtonArrow">
                <img src={IconChevronLeft} />
            </span>
        </button>
    );

    const handleFilterChange = (name, checked) => {
        setFilters((prev) => ({
            ...prev,
            status: { ...prev.status, [name]: checked },
        }));
    };

    const handleDateChange = (date, name) => {
        setFilters((prev) => ({ ...prev, [name]: date }));
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            start: (page - 1) * prev.length,
            currentPage: page,
        }));
    };

    const fetchHistory = (tab) => {
        setLoading(true);

        const formatDateForAPI = (date) => {
            if (!date) return '';
            const d = new Date(date);
            return d.toISOString().split('T')[0];
        };

        let queryParams;
        let apiEndpoint;

        if (tab === 'casino') {
            queryParams = new URLSearchParams({
                start: pagination.start,
                length: pagination.length,
                ...(filters.dateFrom && { date_from: formatDateForAPI(filters.dateFrom) }),
                ...(filters.dateTo && { date_to: formatDateForAPI(filters.dateTo) }),
                type: "slot"
            }).toString();
            apiEndpoint = `/get-history?${queryParams}`;
        } else {
            queryParams = new URLSearchParams({
                start: pagination.start,
                length: pagination.length,
                ...(filters.dateFrom && { date_from: formatDateForAPI(filters.dateFrom) }),
                ...(filters.dateTo && { date_to: formatDateForAPI(filters.dateTo) }),
            }).toString();
            apiEndpoint = `/get-transactions?${queryParams}`;
        }

        callApi(
            contextData,
            "GET",
            apiEndpoint,
            (response) => {
                if (response.status === "0") {
                    setTransactions(response.data);
                    setPagination((prev) => ({
                        ...prev,
                        totalRecords: response.recordsTotal || 0,
                    }));
                } else {
                    setTransactions([]);
                    console.error("API error:", response);
                }
                setLoading(false);
            },
            null
        );
    };

    const handleSubmit = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        setPagination((prev) => ({ ...prev, start: 0, currentPage: 1 }));
        fetchHistory(activeTab);
    };

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        fetchHistory(activeTab);
    }, [pagination.start, pagination.length, activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPagination((prev) => ({ ...prev, start: 0, currentPage: 1 }));
    };

    const formatDateDisplay = (dateString) => {
        const date = new Date(dateString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${hours}:${minutes} ${day} ${month} ${year}`;
    };

    const formatBalance = (value) => {
        const num = parseFloat(value);
        return num.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatOperation = (operation) => {
        return operation === "change_balance" ? "change balance" : operation;
    };

    const totalPages = Math.ceil(pagination.totalRecords / pagination.length);

    const getVisiblePages = () => {
        const delta = 1;
        const visiblePages = [];
        let startPage = Math.max(1, pagination.currentPage - delta);
        let endPage = Math.min(totalPages, pagination.currentPage + delta);

        if (endPage - startPage + 1 < 2 * delta + 1) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 2 * delta);
            } else {
                startPage = Math.max(1, endPage - 2 * delta);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(i);
        }

        return { visiblePages, startPage, endPage };
    };

    const { visiblePages } = getVisiblePages();

    const handleFirstPage = () => handlePageChange(1);
    const handlePrevPage = () => handlePageChange(pagination.currentPage - 1);
    const handleNextPage = () => handlePageChange(pagination.currentPage + 1);
    const handleLastPage = () => handlePageChange(totalPages);

    return (
        <div className="container account-page-container pn-account pn-transactions pn-wallet">
            <div className="row">
                <div className="account-page-menu-col">
                    <nav aria-label="account page navigation" className="account-page-menu-container">
                        <ul className="nav-menu">
                            <li className="nav-item">
                                <a className="nav-link" href="/profile"><i className="material-icons">account_circle</i>Perfil</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/profile/balance"><i className="material-icons">account_balance_wallet</i>Saldos de la cuenta</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" href="/profile/history"><i className="material-icons">format_list_bulleted</i>Transacciones</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="account-page-content-col">
                    <div className="account-content-container">
                        <div className="transaction-page__container">
                            <div className="transaction-content-wrapper">
                                <div className="tp-tableContainer transactions">
                                    <div className="tabbar-container">
                                        <ul className="nav nav-tabs cashier-popup">
                                            <li
                                                className={`nav-item ${activeTab === "wallet" ? "active" : ""}`}
                                                onClick={() => handleTabChange('wallet')}
                                            >
                                                <a className="nav-link">Billetera</a>
                                            </li>
                                            <li
                                                className={`nav-item ${activeTab === "casino" ? "active" : ""}`}
                                                onClick={() => handleTabChange('casino')}
                                            >
                                                <a className="nav-link">Casino</a>
                                            </li>
                                            <li className="nav-item fill-out"></li>
                                        </ul>
                                    </div>

                                    {loading ? (
                                        <div className="pt-3">
                                            <LoadApi />
                                        </div>
                                    ) : transactions.length > 0 ? (
                                        activeTab === "wallet" ? <div className="transaction-table transaction-table--wallet-transaction-table">
                                            <div className="transaction-table__header-container">
                                                <span className="transaction-table__header-label transaction-table__header-label--type">Fecha </span>
                                                <span className="transaction-table__header-label transaction-table__header-label--type">Tipo </span>
                                                <span className="transaction-table__header-label transaction-table__header-label--transactionId">ID de la transacción</span>
                                                <span className="transaction-table__header-label transaction-table__header-label--amount">Monto</span>
                                            </div>
                                            <div className="transaction-table__body-container">
                                                {transactions.map((txn, index) => (
                                                    <div className="transaction-table__row" key={index}>
                                                        <span className="transaction-table__cell">{formatDateDisplay(txn.created_at)}</span>
                                                        <span className="transaction-table__cell text-capitalize">{formatOperation(txn.type)}</span>
                                                        <span className="transaction-table__cell">{txn.id}</span>
                                                        <span className="transaction-table__cell justify-content-md-end">{formatBalance(txn.amount)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div> : <div className="transaction-table transaction-table--generic-table casino-transaction-table">
                                            <div className="transaction-table__header-container">
                                                <span className="transaction-table__header-label transaction-table__header-label--type">Fecha</span>
                                                <span className="transaction-table__header-label transaction-table__header-label--type">Tipo</span>
                                                <span className="transaction-table__header-label transaction-table__header-label--amount">Monto</span>
                                            </div>
                                            <div className="transaction-table__body-container">
                                                {transactions.map((txn, index) => (
                                                    <div className="transaction-table__row" key={index}>
                                                        <span className="transaction-table__cell">{formatDateDisplay(txn.created_at)}</span>
                                                        <span className="transaction-table__cell text-capitalize">{formatOperation(txn.operation)}</span>
                                                        <span className="transaction-table__cell justify-content-md-end">{formatBalance(txn.value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : <div className="transaction-table__body-container">
                                        <div className="transaction-table__status-pagination">
                                            <div className="transaction-table__status">
                                                <span className="transaction-table__no-data--span">No hay transacciones</span>
                                            </div>
                                        </div>
                                    </div>
                                    }

                                    {totalPages > 1 && (
                                        <div className="transaction-table">
                                            <div className="transaction-table__status-pagination">
                                                <div className="transaction-table__paginate">
                                                    {pagination.currentPage > 1 && (
                                                        <>
                                                            {
                                                                !isMobile && <button className="transaction-table-paginate--btn" onClick={handleFirstPage}>
                                                                    <img src={IconDoubleLeft} alt="first" width={16} />
                                                                </button>
                                                            }
                                                            <button className="transaction-table-paginate--btn" onClick={handlePrevPage}>
                                                                <img src={IconChevronLeft} alt="next" width={20} style={{filter: "invert(1)"}} />
                                                            </button>
                                                        </>
                                                    )}

                                                    {visiblePages.map((page) => (
                                                        <span
                                                            key={page}
                                                            className="transaction-table-paginate--btn"
                                                            onClick={() => handlePageChange(page)}
                                                        >
                                                            {page}
                                                        </span>
                                                    ))}

                                                    {pagination.currentPage < totalPages && (
                                                        <>
                                                            <button className="transaction-table-paginate--btn" onClick={handleNextPage}>
                                                                <img src={IconChevronRight} alt="first" width={20} style={{filter: "invert(1)"}} />
                                                            </button>
                                                            {
                                                                !isMobile && <button className="transaction-table-paginate--btn" onClick={handleLastPage}>
                                                                    <img src={IconDoubleRight} alt="next" width={16} />
                                                                </button>
                                                            }
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHistory;