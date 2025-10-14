import React, { useState } from "react";
import ImgDog from "/src/assets/img/ganamosDogIcon.webp";
import ImgBackground from "/src/assets/img/background.webp";
import ImgActive from "/src/assets/img/active.webp";
import IconSport from "/src/assets/svg/sport.svg";
import IconLiveBetting from "/src/assets/svg/live-betting.svg";
import IconFooterCasino from "/src/assets/svg/footer-casino.svg";
import IconLiveCasino from "/src/assets/svg/live-casino.svg";

const MobileFooter = ({ isSlotsOnly }) => {
    return (
        <div className="main-mobile-menu">
            <a className="main-mobile-menu__ganamos-dog" href="/">
                <img className="main-mobile-menu__ganamos-dog-img" src={ImgDog} alt="" />
            </a>
            <img className="main-mobile-menu__background" src={ImgBackground} alt="background" />
            <nav className="main-mobile-menu__main">
                <a className="main-mobile-menu__menu-item" href={isSlotsOnly === "true" ? "#" : "/sports"}>
                    <img className="main-mobile-menu__menu-active" src={ImgActive} alt="" />
                    <span className="SVGInline main-mobile-menu__menu-icon">
                        <img className="SVGInline-svg main-mobile-menu__menu-icon-svg" src={IconSport} alt="sport" />
                    </span>
                    <span className="main-mobile-menu__menu-text">Deporte</span>
                </a>
                <div className="main-mobile-menu__menu-item">
                    <img className="main-mobile-menu__menu-active" src={ImgActive} alt="" />
                    <span className="SVGInline main-mobile-menu__menu-icon">
                        <img className="SVGInline-svg main-mobile-menu__menu-icon-svg" src={IconLiveBetting} alt="live betting" />
                    </span>
                    <span className="main-mobile-menu__menu-text">Apuestas en vivo</span>
                </div>
                <a className="main-mobile-menu__menu-item" href="/">
                    <img className="main-mobile-menu__menu-active" src={ImgActive} alt="" />
                    <div className="main-mobile-menu__menu-icon-container"></div>
                    <span className="main-mobile-menu__menu-text">Inicio</span>
                </a>
                <a className="main-mobile-menu__menu-item main-mobile-menu__menu-item_active" href="/casino">
                    <img className="main-mobile-menu__menu-active main-mobile-menu__menu-active_active" src={ImgActive} alt="" />
                    <div className="main-mobile-menu__menu-icon-container">
                        <span className="SVGInline main-mobile-menu__menu-icon main-mobile-menu__menu-icon_active">
                            <img className="SVGInline-svg main-mobile-menu__menu-icon-svg main-mobile-menu__menu-icon_active-svg" src={IconFooterCasino} alt="casino" />
                        </span>
                    </div>
                    <span className="main-mobile-menu__menu-text main-mobile-menu__menu-text_active">Casino</span>
                </a>
                <a className="main-mobile-menu__menu-item" href={isSlotsOnly === "true" ? "#" : "/casinolive"}>
                    <img className="main-mobile-menu__menu-active" src={ImgActive} alt="" />
                    <div className="main-mobile-menu__menu-icon-container">
                        <span className="SVGInline main-mobile-menu__menu-icon">
                            <img className="SVGInline-svg main-mobile-menu__menu-icon-svg" src={IconLiveCasino} alt="Casino en Vivo" />
                        </span>
                    </div>
                    <span className="main-mobile-menu__menu-text">Casino en vivo</span>
                </a>
            </nav>
        </div>
    )
};

export default MobileFooter;