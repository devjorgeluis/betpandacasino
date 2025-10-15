import IconPromotions from "/src/assets/svg/promotions.svg";
import ImgWeeklyCashback from "/src/assets/img/750x430_Promotion_Card_Main_Promotion_Page_Weekly_Cashback.jpg";
import ImgCashbackIncrease from "/src/assets/img/750x430_Promotion_Card_Main_Promotion_Page_Games_of_the_Week_ES.jpg";
import ImgClub from "/src/assets/img/750x430_Promotion_Card_Main_Promotion_Page_Monday_Free_Bet_ES.jpg";

const Promotions = () => {
    const promotions = [
        {
            id: 1,
            image: ImgWeeklyCashback,
            title: "Cashback semanal",
            description: "Obtén un 10% de devolución semanal los miércoles.",
            link: "#"
        },
        {
            id: 2,
            image: ImgCashbackIncrease,
            title: "Aumento del Cashback",
            description: "Juega esta semana y recibe un 5% de devolución.",
            link: "#"
        },
        {
            id: 3,
            image: ImgClub,
            title: "Desbloquear apuesta gratuita.",
            description: "¿Mala racha? Te damos una apuesta gratuita cada lunes.",
            link: "#"
        }
    ];

    return (
        <>
            <div className="styled-text-list title-with-icon promotions">
                <div className="container">
                    <div className="row">
                        <div className="tagline icon">
                            <span><img alt="Promotions.svg" src={IconPromotions} /></span>
                        </div>
                        <div className="tagline title"><span>Promociones</span></div>
                    </div>
                </div>
            </div>
            <div className="hero-banner-two-columns promotions scroll-horizontal">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 taglines"></div>
                        <div className="col-md-6"></div>
                        <div className="col-md-12 taglines-group">
                            {promotions.map((promotion) => (
                                <div key={promotion.id} className="group promotion-cards promotion-cards-link">
                                    <div className="tagline">
                                        <a href={promotion.link}><img title="" alt="info" src={promotion.image} /></a>
                                    </div>
                                    <div className="tagline title"><span>{promotion.title}</span></div>
                                    <div className="tagline text"><span>{promotion.description}</span></div>
                                    <div className="tagline read-more-promotions"><a href={promotion.link}>Leer más</a></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Promotions
