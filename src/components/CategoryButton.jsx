const CategoryButton = (props) => {
  let customClass = "providers-carousel_providerItem";
  if (props.active == true) {
    customClass += " providers-carousel_active";
  }

  return (
    <div className={customClass} onClick={props.onClick}>
      <div className="providers-carousel_providerItemIcon">
        {
          props.icon && props.icon !== "" &&
          <img
            alt={props.name}
            loading="lazy"
            width="40"
            height="40"
            decoding="async"
            src={props.icon}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        }
      </div>
      <span className="providers-carousel_providerItemLabel">{props.name}</span>
    </div>
  );
};

export default CategoryButton;
