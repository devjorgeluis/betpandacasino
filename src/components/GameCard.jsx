const GameCard = (props) => {
  return (
    <div className={`casino-game ${props.mobileShowMore ? 'mobile' : ''}`} onClick={props.onClick} data-game-id={props.id || props.gameId}>
      <div className="game-box">
        <div className="content">
          <div className="content-overlay"></div>
          <div className="thumbnail thumb-bg" style={{ backgroundImage: `url(${props.imageSrc})` }}>
            <div className="play-now">
              <div className="game-description">
                <div className="game-text-container">
                  <div className="content game-name">{props.title}</div>
                  <div className="meta">
                    <div className="provider">{props.provider}</div>
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
};

export default GameCard;
