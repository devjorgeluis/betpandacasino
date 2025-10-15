import IconDiscover from "/src/assets/svg/discover.svg";
import ImgCasino from "/src/assets/img/casino.jpg";
import ImgSports from "/src/assets/img/sports.jpg";
import ImgLiveCasino from "/src/assets/img/live-casino.jpg";
import ImgOriginal from "/src/assets/img/original.jpg";

const Discover = () => {
    const discovers = [
        {
            id: 1,
            name: "casino",
            img: ImgCasino,
            link: "/casino"
        },
        {
            id: 2,
            name: "sports",
            img: ImgSports,
            link: "/sports"
        },
        {
            id: 3,
            name: "live casino",
            img: ImgLiveCasino,
            link: "/live-casino"
        },
        {
            id: 4,
            name: "original",
            img: ImgOriginal,
            link: "#"
        }
    ];
    
    return (
        <>
            <div className="styled-text-list title-with-icon promotions explore-betpanda">
                <div className="container">
                    <div className="row">
                        <div className="tagline icon">
                            <span><img alt="Group.svg" src={IconDiscover} /></span>
                        </div>
                        <div className="tagline title"><span>Descubre Betpanda</span></div>
                    </div>
                </div>
            </div>
            <div className="hero-banner-two-columns explore-betpanda">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 taglines"></div>
                        <div className="col-md-6"></div>
                        <div className="col-md-12 taglines-group">
                            {
                                discovers.map((discover) => (
                                    <div key={discover.id} className="group explore-card">
                                        <div className="tagline">
                                            <a href={discover.link}>
                                                <img title={discover.name} alt="info" src={discover.img} />
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

export default Discover