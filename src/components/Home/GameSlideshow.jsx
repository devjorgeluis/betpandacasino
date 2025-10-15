import { useContext, useRef } from 'react';
import { AppContext } from '../../AppContext';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const GameSlideshow = ({ games, name, title, icon, link }) => {
    const { contextData } = useContext(AppContext);
    const swiperRef = useRef(null);

    return (
        <div className="gameSlider ocultar-logged-in">
            <div className="container">
                <div className="section-outer">
                    <div className="title-wrapper">
                        <div className="title-text">
                            <h4 className="title">
                                <img src={icon} className="icon" alt="Juegos en vivo principales" />
                                {title}
                            </h4>
                        </div>
                        <div className="panel-navigate">
                            <div className="show-all-wrapper">
                                <div className="see-all"><a href={link}>Show all</a></div>
                            </div>
                            <div className="d-none d-md-block">
                                <div className="navigate-wrapper navigate-bottom d-flex">
                                    <button type="button" className={`${name}-navigate-prev navigate-prev`}>
                                        <svg className="icon icon-arrowLeft" viewBox="0 0 24 24" width="24px" height="24px">
                                            <title>Arrow Left</title>
                                            <path d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path>
                                        </svg>
                                    </button>
                                    <button type="button" className={`${name}-navigate-next navigate-prev`}>
                                        <svg className="icon icon-arrowRight" viewBox="0 0 24 24" width="24px" height="24px">
                                            <title>Arrow Right</title>
                                            <path d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inner-section desktop">
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={10}
                            slidesPerView={5}
                            navigation={{
                                nextEl: "." + name + "-navigate-next",
                                prevEl: "." + name + "-navigate-prev",
                            }}
                            loop={true}
                            breakpoints={{
                                320: {
                                    slidesPerView: 3,
                                },
                                992: {
                                    slidesPerView: 6,
                                },
                            }}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                        >
                            {games.map((game) => (
                                <SwiperSlide key={game.id}>
                                    <a className="card-wrapper play-button" href={game.link}>
                                        <div className="card-game-list">
                                            <img
                                                src={game.image_local != null && game.image_local !== "" ? contextData.cdnUrl + game.image_local : game.image_url}
                                                className="bg game-img"
                                                alt={game.name}
                                            />
                                        </div>
                                        <div className="card-game-name">
                                            <p className="name">{game.name}</p>
                                        </div>
                                    </a>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameSlideshow
