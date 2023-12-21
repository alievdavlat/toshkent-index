'use client';
import React, { useState, useEffect } from 'react'
import {get} from 'lodash';
import Image from 'next/image';
import i18n from '@/services/i18n';
import { useDispatch } from "react-redux";
import NoDataUI from '@/components/NoDataUI';
import { useTranslation } from "next-i18next";
import PageLoader from '@/components/PageLoader';
import { ContainerAll } from '@/modules/container';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from 'swiper/modules';
import CheckLinkType from '@/components/CheckLinkType';
import { feedbackModalVisibleHandler } from '@/store/features/system';
import useWindowSize from '@/hooks/useWindowDimensions';
import { useSelector } from 'react-redux';

const Banner = ({ innerHeight }) => {
    const dispatch = useDispatch();
    const [sliderSteps, setSliderSteps] = useState([]);
    const {t} = useTranslation('translation');
    const size = useWindowSize();

    return (
        <section className='section main' style={{height: `${innerHeight}vh`}}>
            <ContainerAll
                url={'/slider/list/'}
                name='/slider/list/'
                onSuccess={data => setSliderSteps(data?.data)}
            >
                {({items, isLoading}) => {
                    return (
                        <>
                            {items?.length <= 0 && !isLoading ? <NoDataUI /> : ""}
                            {isLoading && <PageLoader />}
                            {items?.length > 0 && (
                                <>
                                    <Swiper className='main-slider owl-carousel'
                                        spaceBetween={0}
                                        loop={false}
                                        speed={2000}
                                        modules={[Pagination]}
                                        pagination={{
                                            el: ".main-nav__list",
                                            clickable: true,
                                            renderBullet: function(index, className) {
                                              return `<li class="swiper-pagination-bullet main-nav__item"><div class="main-nav__line"><span></span></div></li>`;
                                            },
                                          }}
                                        autoplay={{
                                            delay: 2500,
                                            disableOnInteraction: false
                                        }}
                                        style={{height: '100%'}}
                                    >
                                        {items.map((item, idx) => {
                                            return (
                                                <SwiperSlide key={idx}>
                                                    <div className='main-slider__item'>
                                                        <div className='container'>
                                                            <div className="main-slider__content">
                                                                <h1 className="main-slider__title">
                                                                    {get(item, `title.title_${i18n.language}`)}
                                                                </h1>
                                                                <div className="main-slider__text">
                                                                    {get(item, `description.description_${i18n.language}`)}
                                                                </div>
                                                                <div className="main-slider__btns">
                                                                    <a href={null} className="feedback-open btn btn-trans" style={{cursor: 'pointer'}} onClick={() => dispatch(feedbackModalVisibleHandler(true))}>
                                                                        {t("advice")}
                                                                    </a>
                                                                    <CheckLinkType
                                                                        url={get(item, 'url')} 
                                                                        title={get(item, `button_name.button_${i18n.language}`)}
                                                                    />
                                                                </div>
                                                                <div className="main-slider__img">
                                                                    {size.width < 800 ? 
                                                                        <Image src={get(item, 'mobile_image[0]') || get(item, 'image[0]')} width={1000} height={960} alt="main"/>
                                                                        : <Image src={get(item, 'image[0]') || ''} width={1000} height={960} alt="main"/>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SwiperSlide> 
                                            )
                                        })}
                                    </Swiper>
                                    <div className="main-nav">
                                        <div className="container">
                                            <ul className="main-nav__list"></ul>
                                            <ul className="main-nav__lists">
                                                {sliderSteps.map((item, idx) => (
                                                    <li className="main-nav__item" key={idx}>
                                                        <div className="main-nav__name">
                                                            {get(item, `title.title_${i18n.language}`)}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )
                }}
            </ContainerAll>
        </section>
    )
}

export default Banner