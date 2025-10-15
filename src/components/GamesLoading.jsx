const GamesLoading = () => {
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

export default GamesLoading;