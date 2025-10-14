const NavLinkIcon = (props) => {
  let customClass = "games-tags_gamesTag";
  if (props.active) {
    customClass += " games-tags_active";
  }

  return (
    <button role="button" className={customClass} onClick={props.onClick}>
      <span className="games-tags_tagIconWrapper">
        <img src={props.icon} alt={props.title} width="46" height="40" />
      </span>
      <span className="games-tags_gameTagLabel">{props.title}</span>
    </button>
  );
};

export default NavLinkIcon;