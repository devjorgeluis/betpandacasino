import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import IconDownload from "/src/assets/svg/download.svg";
import ImgLogo from "/src/assets/svg/logo.svg";
import IconTwitter from "/src/assets/svg/twitter.svg";
import IconDiscord from "/src/assets/img/discord.png";
import IconInstagram from "/src/assets/svg/instagram.svg";
import IconTelegram from "/src/assets/svg/telegram.svg";
import IconTrustpilot from "/src/assets/svg/trustpilot.svg";
import IconCointelegraph from "/src/assets/svg/cointelegraph.svg";
import IconAskgamblers from "/src/assets/svg/askgamblers.svg";
import IconC2ryptonews from "/src/assets/svg/cryptonews.svg";
import IconBitcoin from "/src/assets/svg/bitcoin.svg";

const Footer = ({ isSlotsOnly }) => {
    const navigate = useNavigate();

    return (
        <>
            <footer className="footer-container">
                <div className="linkContainer">
                    <div className="appIconWrap">
                        <div className="footer-row">
                            <div className="app-buttons-container">
                                <div className="download-text-area">Download App</div>
                                <button name="windows app download button" aria-label="windows app download button" className="app-button windows">
                                    <i className="device-icon">
                                        <img src={IconDownload} />
                                    </i>
                                    <div className="hoverBubble bubblePosition windows">
                                        <p></p>
                                        <p></p>
                                        <p>Haz clic para instalar la aplicación</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="linkWrap">
                        <div className="footer-row"></div>
                        <div className="footer-row"></div>
                    </div>
                </div>
                <div className="footer-dynamic-content">
                    <div className="footer-dynamic footer-main">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 taglines"></div>
                                <div className="col-md-6"></div>
                                <div className="col-md-12 taglines-group">
                                    <div className="group footer-operated foot-column">
                                        <div className="tagline">
                                            <div className="tagline text company-info-footer">
                                                <a onClick={() => navigate("/")} className="logo-footer">
                                                    <img src={ImgLogo} />
                                                </a>
                                                <div className="tagline text">
                                                    <span className="text-heading">Star Bright Media S.R.L</span>
                                                    <span>San Pedro, Barrio Dent, Del Centro Cultural Costarricense Norteamericano, Doscientos Metros al Norte y Concuenta al este, Edificio Ofident, Officins Numero Tres Costa Rica</span>
                                                    <span className="text-heading">Número de Identificación Corporativa:</span>
                                                    <span>3-102-880000</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group footer-games foot-column top-line">
                                        <div className="tagline title"><span>Juegos</span></div>
                                        <a className="tagline link" href="/casino"><span>Casino</span></a>
                                        {
                                            isSlotsOnly === "false" && <>
                                                <a className="tagline link" href="/live-casino"><span>Casino en vivo</span></a>
                                                <a className="tagline link" href="/sports"><span>Deportes</span></a>
                                                <a className="tagline link" href="/live-sports"><span>Deportes en vivo</span></a>
                                            </>
                                        }
                                    </div>
                                    <div className="group footer-info foot-column top-line footer-info-socials">
                                        <div className="tagline title"><span>Comunidad</span></div>
                                        <a href="https://x.com/betpanda_casino" className="tagline link link-social-footer">
                                            <span><img alt="X.svg" src={IconTwitter} /> X (Twitter)</span>
                                        </a>
                                        <a href="https://discord.gg/25ncaUDuft" className="tagline link link-social-footer">
                                            <span><img alt="Discord new.png" src={IconDiscord} /> Discord</span>
                                        </a>
                                        <a href="https://www.instagram.com/betpandaofficial/" className="tagline link link-social-footer">
                                            <span><img alt="Instagram.svg" src={IconInstagram} /> Instagram</span>
                                        </a>
                                        <a href="https://t.me/betpandaofficial" className="tagline link link-social-footer">
                                            <span><img alt="Telegram.svg" src={IconTelegram} /> Telegrama</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="styled-text-list partner-row">
                        <div className="container">
                            <div className="row">
                                <div className="tagline partner-logo-wrapper">
                                    <div className="tagline partner-logo"><img title="" alt="info" src={IconTrustpilot} /><span></span></div>
                                    <div className="tagline partner-logo"><img title="" alt="info" src={IconCointelegraph} /><span></span></div>
                                    <div className="tagline partner-logo"><img title="" alt="info" src={IconAskgamblers} /><span></span></div>
                                    <div className="tagline partner-logo"><img title="" alt="info" src={IconC2ryptonews} /><span></span></div>
                                    <div className="tagline partner-logo"><img title="" alt="info" src={IconBitcoin} /><span></span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="styled-text-list copyright-wrapper">
                        <div className="container">
                            <div className="row">
                                <div className="tagline copyright"><span>©&nbsp;Todos los derechos reservados. 2025&nbsp;Betpanda.io</span></div>
                                <div className="tagline copyright-navigation">
                                    <div className="copyright-nav-item">
                                        <span>Support </span>
                                        <a className="copyright-nav-link" href="mailto:support@betpanda.io">support@betpanda.io</a>
                                    </div>
                                    <div className="copyright-nav-item">
                                        <span>Partners </span>
                                        <a className="copyright-nav-link" href="mailto:partners@betpanda.io">partners@betpanda.io</a>
                                    </div>
                                    <div className="copyright-nav-item">
                                        <span>Press </span>
                                        <a className="copyright-nav-link" href="mailto:press@betpanda.io">press@betpanda.io</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;