const CategoryButton = (props) => {
  let customClass = "nav-link";
  if (props.active == true) {
    customClass += " active";
  }

  return (
    <li className="nav-item" onClick={props.onClick}>
      <a className={customClass} href={"#" + props.code}>
        <h1 className="title seo-title">{props.name}</h1>
      </a>
    </li>
  );
};

export default CategoryButton;
