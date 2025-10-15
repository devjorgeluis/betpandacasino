import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import CategoryButton from "../components/CategoryButton";

const CategorySlideshow = (props) => {
  const { contextData } = useContext(AppContext);
  const navigate = useNavigate();

  if (!props.categories || props.categories.length === 0) {
    return null;
  }


  const handleCategoryClick = (category, index) => {
    if (props.pageType === 'home') {
      // Navigate to casino with provider parameter
      navigate(`/casino?provider=${encodeURIComponent(category.name)}&providerId=${category.id}`);
    } else {
      // Default casino behavior
      if (props.onCategoryClick) {
        props.onCategoryClick(category, category.id, category.table_name, index, true);
      }
      if (props.onCategorySelect) {
        props.onCategorySelect(category);
      }
    }
  };

  return (
    <div className="container">
      <div className="container categories-container">
        <ul className="navbar-nav flex-row casino-lobby-categories row">
          {props.categories.map((category, index) => (
            <CategoryButton
              key={index}
              name={category.name}
              icon={category.image_local != null && category.image_local !== "" ? contextData.cdnUrl + category.image_local : category.image_url}
              active={props.selectedCategoryIndex === index}
              onClick={() => handleCategoryClick(category, index)}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CategorySlideshow