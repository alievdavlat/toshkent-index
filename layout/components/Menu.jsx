'use client'

import React from 'react';
import {get} from 'lodash';
import Link from 'next/link';
import Image from 'next/image';
import Language from '../language';
import i18n from '@/services/i18n';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Link as ScrollLink } from "react-scroll";
import { ContainerAll } from '@/modules/container';
import { currentSlideHandler, fullpageScreenCountHandler, setCategoryActive } from '@/store/features/system'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "next-i18next";

const Menu = ({ active, menuActiveHandler, extraClass }) => {
    const pathname = usePathname();
    const router = useRouter();
    const {t} = useTranslation('translation');
    const dispatch = useDispatch();
    const { fullPageTotalSlides} = useSelector(state => state.system);

    const goToPageAndScroll = (selector) => {
        router.push("/");
        menuActiveHandler();
        dispatch(currentSlideHandler(selector));
    };

    const redirectHandler = (item) => {
        router.push(`/shop/?id=${item?.id}&${Date.now()}`);
        dispatch(setCategoryActive(item?.id));
        menuActiveHandler();
    }

    return (
        <div className={active ? "menu menu-active "  + extraClass : "menu " + extraClass}>
            <div className="menu-content">
                <div className="menu-wrap">

                    <div className="menu-col">
                        <ul className="menu-list"> 
                            <ContainerAll
                                url={'/eav/category/list/'}
                                name={'/eav/category/list/'}
                            >
                                {({items}) => {
                                    return (
                                        <>
                                            {items?.items?.length > 0 && (
                                                <>
                                                    {(items?.items || []).map(item => (
                                                        <li key={item?.id} style={{cursor: 'pointer'}}>
                                                            <Image src={item?.icon} width={50} height={50} alt='ico' />
                                                            <a href={null} onClick={() => redirectHandler(item)}>
                                                                <span>{get(item, `title.title_${i18n.language}`)}</span>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </>
                                            )}
                                        </>
                                    )
                                }}
                            </ContainerAll>
                        </ul>
                    </div>

                    <div className="menu-col">
                        <ul className="menu-list">
                            <li style={{cursor: 'pointer'}}>
                                {/*{pathname === '/' ?*/}
                                {/*    ( <ScrollLink to="news" spy={true} smooth={true} offset={0} duration={1000} onClick={() => {dispatch(fullpageScreenCountHandler(7)); menuActiveHandler()}} suppressHydrationWarning={true}>{t("news")}</ScrollLink> ) */}
                                {/*  : ( <a onClick={() => goToPageAndScroll(7)} suppressHydrationWarning={true}>{t("news")}</a>)*/}
                                {/*}*/}

                                <a onClick={() => router.push(`/news/`)}>{t("news")}</a>
                            </li>
                            <li style={{cursor: 'pointer'}}>
                                <ScrollLink to="contact" spy={true} smooth={true} offset={0} duration={1000} onClick={() => goToPageAndScroll(fullPageTotalSlides.length - 1)} suppressHydrationWarning={true}>{t("contactUs")}</ScrollLink>
                            </li>
                        </ul>
                    </div>

                    <div className="menu-col">

                        <ul className="menu-list">
                            <li>
                                <Link href="/map" suppressHydrationWarning={true}>{t("map")}</Link>
                            </li>
                            <li style={{cursor: 'pointer'}}>
                            {pathname === '/' ?
                                ( <ScrollLink to="faq" spy={true} smooth={true} offset={0} duration={1000} onClick={menuActiveHandler} suppressHydrationWarning={true}>{t("faq")}</ScrollLink> )
                              : (<a onClick={() => goToPageAndScroll(9)} suppressHydrationWarning={true}>{t("faq")}</a>)
                            }
                            </li>
                        </ul>
                    </div>
                    
                </div>

                <div className="menu-mobile">
                    <div className="menu-mobile__links">
                        <a href={`tel: ${t("+998(55)-515-33-33")}`} className="header__tel">
                            <span>{t("+998(55)-515-33-33")}</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M18.9645 16.61L17.7915 15.437C17.2055 14.851 16.2555 14.851 15.6705 15.437L14.7485 16.359C14.5425 16.565 14.2305 16.634 13.9645 16.517C12.6285 15.932 11.3085 15.045 10.1315 13.868C8.95954 12.696 8.07554 11.382 7.48954 10.051C7.36754 9.77597 7.43854 9.45297 7.65154 9.23997L8.47754 8.41397C9.14854 7.74297 9.14854 6.79397 8.56254 6.20797L7.38954 5.03497C6.60854 4.25397 5.34254 4.25397 4.56154 5.03497L3.90954 5.68597C3.16854 6.42697 2.85954 7.49597 3.05954 8.55597C3.55354 11.169 5.07154 14.03 7.52054 16.479C9.96954 18.928 12.8305 20.446 15.4435 20.94C16.5035 21.14 17.5725 20.831 18.3135 20.09L18.9645 19.439C19.7455 18.658 19.7455 17.392 18.9645 16.61V16.61Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M13 6.99256C14.031 6.97856 15.067 7.36056 15.854 8.14756" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.682 5.31884C17.113 3.74984 15.056 2.96484 13 2.96484" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M17.0066 11.0024C17.0206 9.97144 16.6386 8.93544 15.8516 8.14844" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.6797 5.32031C20.2487 6.88931 21.0337 8.94631 21.0337 11.0023" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </a>
                        <Language />
                    </div>	
                    <div className="menu-mobile__btns">
                        <div className="header-btns">
                            <Link href="/catalog" className="btn btn-trans">
                                <Image src="/auto.svg" width={20} height={20} alt="ico" />
                                <span suppressHydrationWarning={true}>{t("autoshop")}</span>
                            </Link>
                            <Link href="/auction" className="btn btn-trans">
                                <Image src="/auk.svg" width={20} height={20} alt="ico" />
                                <span suppressHydrationWarning={true}>{t("auksion")}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Menu;
