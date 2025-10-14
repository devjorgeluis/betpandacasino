import { NavLink } from "react-router-dom";

const NavLinkHeader = (props) => {
  return (
    <NavLink
      to={props.pageCode === "home" ? "/" : `/${props.pageCode}`}
      className={({ isActive }) => 
        `header-link_headerLink ${isActive ? "header-link_active" : ""}`
      }
      onClick={props.onClick}
    >
      {props.icon && <img className="main-nav-img" src={props.icon} alt={props.title} />}
      {props.title}
    </NavLink>
  );
};

export default NavLinkHeader;