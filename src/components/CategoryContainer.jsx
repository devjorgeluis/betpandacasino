import { useContext } from "react";
import { AppContext } from "../AppContext";
import CategoryButton from "./CategoryButton";

const CategoryContainer = (props) => {
  const { contextData } = useContext(AppContext);

  if (!props.categories || props.categories.length === 0) {
    return null;
  }

  const handleCategoryClick = (category, index) => {
    if (props.onCategoryClick) {
      props.onCategoryClick(category, category.id, category.table_name, index, true);
    }
    if (props.onCategorySelect) {
      props.onCategorySelect(category);
    }
  };

  return (
    <div className="container">
      <div className={`container categories-container ${props.isMobile ? 'mobile' : ''}`}>
        <ul className={`navbar-nav flex-row casino-lobby-categories row ${props.isMobile ? 'mobile' : ''}` }>
          {props.categories.map((category, index) => (
            <CategoryButton
              key={category.id ?? category.code ?? index}
              name={category.name}
              code={category.code}
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

export default CategoryContainer