const LoadGames = () => {
    const GameSkeleton = () => (
        <div className="casino-game">
            <div className="game-box">
                <div className="content">
                    <div className="content-overlay"></div>
                    <div className="thumbnail thumb-bg">
                        <div className="play-now">
                            <div className="game-description">
                                <div className="game-text-container">
                                    <div className="content game-name"></div>
                                    <div className="meta">
                                        <div className=""></div>
                                    </div>
                                </div>
                                <div className="favourite-container">
                                    <a className="favourite"><i className="material-icons favourite-icon">favorite_border</i></a>
                                </div>
                            </div>
                            <div className="game-play-button">
                                <span className="click-to-play">
                                <i className="material-icons">play_circle_filled</i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="casino-games-container">
            <div className="row games-list limited-games-list popular">
                {Array.from({ length: 5 }, (_, index) => (
                    <GameSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};

export default LoadGames;