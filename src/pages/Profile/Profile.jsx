import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="container account-page-container">
            <div className="row">
                <div className="account-page-menu-col">
                    <nav aria-label="account page navigation" className="account-page-menu-container">
                        <ul className="nav-menu">
                            <li className="nav-item">
                                <a className="nav-link active" href="/profile"><i className="material-icons">account_circle</i>Perfil</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/profile/balance"><i className="material-icons">account_balance_wallet</i>Saldos de la cuenta</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/profile/history"><i className="material-icons">format_list_bulleted</i>Transacciones</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="account-page-content-col">
                    <div className="account-content-container">
                        <div className="content-padding">
                            <div className="avatar-container">
                                <div className="default-avatar"><i className="material-icons">account_circle</i></div>
                            </div>
                            <h3 className="section"><i className="material-icons">account_circle</i> Cuenta</h3>
                            <div className="row account-page-row">
                                <div className="col-md-6"><label className="itemTitle">Correo electrónico:</label></div>
                                <div className="col-md-6 right">
                                    <span className="form-value">{contextData?.session?.user?.email || '-'}</span>
                                </div>
                            </div>
                            <div className="row account-page-row">
                                <div className="col-md-6"><label>ID de usuario:</label></div>
                                <div className="col-md-6 right">
                                    <span className="form-value">{contextData?.session?.user?.id || '******'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;