import { useContext, useRef } from 'react';
import { AppContext } from '../../AppContext';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import IconProvider from "/src/assets/svg/provider.svg";

const GameProviders = ({ categories }) => {
    const { contextData } = useContext(AppContext);
    const swiperRef = useRef(null);

    return (
        <>
            <div className="styled-text-list title-with-icon promotions title-with-icon-top-games hide-logged-in">
                <div className="container">
                    <div className="row">
                        <div className="tagline icon">
                            <span><img alt="Vector.svg" src={IconProvider} /></span>
                        </div>
                        <div className="tagline title"><span>Proveedores de juegos</span></div>
                    </div>
                </div>
            </div>
            <div className="panel-section fixed-width provider-slider top-games-navigation-hide hide-logged-in">
                <div className="panel-navigate fixed-width">
                    <div className="navigate-wrapper">
                        <button type="button" className={`${name}-navigate-prev navigate-prev`}>
                            <svg className="icon icon-arrowLeft" viewBox="0 0 24 24" width="24px" height="24px">
                                <title>Arrow Left</title>
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path>
                            </svg>
                        </button>
                        <button type="button" className={`${name}-navigate-next navigate-next`}>
                            <svg className="icon icon-arrowRight" viewBox="0 0 24 24" width="24px" height="24px">
                                <title>Arrow Right</title>
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="container-fixed-width desktop">
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={10}
                        slidesPerView={6}
                        navigation={{
                            nextEl: `.${name}-navigate-next`,
                            prevEl: `.${name}-navigate-prev`,
                        }}
                        loop={true}
                        breakpoints={{
                            320: {
                                slidesPerView: 3,
                            },
                            768: {
                                slidesPerView: 4,
                            },
                            992: {
                                slidesPerView: 6,
                            },
                        }}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        className="panel-wrapper desktop"
                    >
                        {categories.map((category) => (
                            <SwiperSlide key={category.id}>
                                <a className="panel-card provider-slider-slide no-link desktop" href="">
                                    <div className="panel-inner">
                                        <div className="icon-wrapper">
                                            <img
                                                className="panel-icon"
                                                src={contextData.cdnUrl + category.image_local}
                                                alt={category.name}
                                                title={category.name}
                                                style={{"height": "70px"}}
                                            />
                                        </div>
                                        <div className="text-wrapper"></div>
                                    </div>
                                </a>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>
    )
}

export default GameProviders
