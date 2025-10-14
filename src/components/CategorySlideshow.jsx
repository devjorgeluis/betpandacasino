import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import CategoryButton from "../components/CategoryButton";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import IconPrev from "/src/assets/svg/swiper-prev.svg";
import IconNext from "/src/assets/svg/swiper-next.svg";

const CategorySlideshow = (props) => {
  const { contextData } = useContext(AppContext);
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!props.categories || props.categories.length === 0) {
    return null;
  }

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const onSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

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
    <div className="providers-carousel_providersCarouselContainer" style={{ position: 'relative' }}>
      <button
        onClick={handlePrev}
        className="providers-carousel_providerSlideIcon"
        disabled={isBeginning ? true : false}
      >
        <img src={IconPrev} />
      </button>

      <Swiper
        ref={swiperRef}
        onSlideChange={onSlideChange}
        className="providers-carousel_swiper"
        spaceBetween={10}
        slidesPerView={20}
        watchOverflow={true}
        observer={true}
        observeParents={true}
        breakpoints={{
          320: {
            slidesPerView: 4
          },
          576: {
            slidesPerView: 6
          },
          640: {
            slidesPerView: 8
          },
          768: {
            slidesPerView: 12
          },
          1024: {
            slidesPerView: 15
          },
          1600: {
            slidesPerView: 18
          },
          1601: {
            slidesPerView: 20
          },
        }}
      >
        {props.categories.map((category, index) => (
          <SwiperSlide key={`category-${category.id || index}`}>
            <CategoryButton
              key={index}
              name={category.name}
              icon={category.image_local != null && category.image_local !== "" ? contextData.cdnUrl + category.image_local : category.image_url}
              active={props.selectedCategoryIndex === index}
              onClick={() => handleCategoryClick(category, index)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={handleNext}
        className="providers-carousel_providerSlideIcon slider-next-button"
        disabled={isEnd ? true : false}
      >
        <img src={IconNext} />
      </button>
    </div>
  )
}

export default CategorySlideshow