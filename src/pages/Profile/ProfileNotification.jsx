import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";

const ProfileNotification = () => {
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

    const notifications = [];
    // const notifications = [
    //     {
    //         title: "Balance updated!",
    //         date:  "22.09.2025 14:37",
    //         description: "A new deposit of $5.000,00 has been added to your balance."
    //     }
    // ];

    return (
        <div className="notifications-content_notifications">
            <div><h2 className="notifications-content_title">Notificaciones</h2></div>
            <div className="notifications-content_subtitleBlock"></div>
            <div className="notifications-content_notificationsList">
                {
                    notifications.map((notification, index) => (
                        <div className="notification-item_notificationItem" key={index}>
                            <div className="notification-item_notificationHeader">
                                <div className="notification-item_notificationTitle">
                                    <span className="notification-item_notificationTitleText">{notification.title}</span>
                                </div>
                                <div className="notification-item_datetime">{notification.date}</div>
                            </div>
                            <div className="notification-item_notificationBody notification-item_notificationBodyCollapsed">{notification.description}</div>
                        </div>
                    ))
                }
            </div>
        </div>

    );
};

export default ProfileNotification;