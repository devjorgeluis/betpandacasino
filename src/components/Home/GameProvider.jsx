import IconCointelegraph from "/src/assets/svg/cointelegraph.svg";
import IconTrustpilot from "/src/assets/svg/trustpilot.svg";
import IconAskgamblers from "/src/assets/svg/askgamblers.svg";
import IconC2ryptonews from "/src/assets/svg/cryptonews.svg";
import IconBitcoin from "/src/assets/svg/bitcoin.svg";

const GameProvider = () => {
    const gameProviders = [
        {
            id: 1,
            name: "cointelegraph",
            icon: IconCointelegraph,
            alt: "cointelegraph",
            href: "#"
        },
        {
            id: 2,
            name: "trustpilot",
            icon: IconTrustpilot,
            alt: "trustpilot",
            href: "#"
        },
        {
            id: 3,
            name: "askgamblers",
            icon: IconAskgamblers,
            alt: "askgamblers",
            href: "#"
        },
        {
            id: 4,
            name: "cryptonews",
            icon: IconC2ryptonews,
            alt: "cryptonews",
            href: "#"
        },
        {
            id: 5,
            name: "bitcoin",
            icon: IconBitcoin,
            alt: "bitcoin",
            href: "#"
        }
    ];

    return (
        <div className="gameListSection logos-provider hide-logged-in">
            <div className="container">
                <div className="section-outer">
                    <div className="title-wrapper">
                        <div className="title-text"><h4 className="title"></h4></div>
                    </div>
                    <div className="inner-section desktop">
                        <div className="container-inner column-size-5">
                            {gameProviders.map((provider) => (
                                <a key={provider.id} className="card-wrapper" href={provider.href}>
                                    <div className="card-game-list">
                                        <img src={provider.icon} className="bg" alt={provider.alt} />
                                        <div className="card-inner"></div>
                                    </div>
                                    <div className="card-game-name">
                                        <p className="name">{provider.name}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameProvider
