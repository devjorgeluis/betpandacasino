import IconWelcome from "/src/assets/svg/welcome.svg";
import ImgBonus from "/src/assets/img/750x430_Promotion_Card_Main_Promotion_Page_Welcome_Bonus_ES.jpg";
import ImgCashback from "/src/assets/img/750x430_Promotion_Card_Main_Promotion_Page_Cashback_10_ES.jpg";
import ImgClub from "/src/assets/img/750x430_Promotion_Card_Main_Promotion_Page_XP_Club_ES.jpg";

const Welcome = () => {
    const offers = [
        {
            id: 1,
            name: "bonus",
            img: ImgBonus
        },
        {
            id: 2,
            name: "cashback",
            img: ImgCashback
        },
        {
            id: 3,
            name: "club",
            img: ImgClub
        }
    ];

    return (
        <>
            <div className="styled-text-list title-with-icon promotions hide-logged-in">
                <div className="container">
                    <div className="row">
                        <div className="tagline icon">
                            <span><img alt="Welcome.svg" src={IconWelcome} /></span>
                        </div>
                        <div className="tagline title"><span>Ofertas de bienvenida</span></div>
                    </div>
                </div>
            </div>
            <div className="hero-banner-two-columns promotions noscroll-horizontal hide-logged-in">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 taglines"></div>
                        <div className="col-md-6"></div>
                        <div className="col-md-12 taglines-group">
                            {
                                offers.map((offer) => (
                                    <div key={offer.id} className="group promotion-cards">
                                        <div className="tagline">
                                            <a href="#">
                                                <img title={offer.name} alt="info" src={offer.img} />
                                            </a>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Welcome