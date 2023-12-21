'use client'

import React, {useState} from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import NoDataUI from '@/components/NoDataUI'
import { Autoplay, Pagination } from 'swiper/modules';
import PageLoader from '@/components/PageLoader'
import { ContainerAll } from '@/modules/container'
import { Swiper, SwiperSlide } from "swiper/react"
import AuctionCard from '@/components/Cards/AuctionCard'
import ArrowLeft from '@/../../img/icons/arrow-left.svg'
import ArrowRight from '@/../../img/icons/arrow-right.svg'
import Link from 'next/link'
import SuccessPopup from '@/components/Modals/SuccessPopup'
import ErrorPopup from '@/components/Modals/ErrorPopup'
import { useTranslation } from "next-i18next";
import i18n from '@/services/i18n'

const AuctionSingleModal = dynamic(() => import('@/components/Modals/AuctionSingleModal'), {ssr: false})

const Auction = () => {
    const [errorStatus, setErrorStatus] = useState(false);
    const [swiperRef, setSwiperRef] = useState(null);
    const [formSucces, setFormSucces] = useState(false);
    const [responseMessage, setResponseMessage] = useState({});
    const {t} = useTranslation('translation');

	const prevHandler = () => {
        swiperRef.slidePrev();
    };
    
    const nextHandler = () => {
        swiperRef.slideNext();
    };

    return (
        <section className="section auction">
            {formSucces?.message && <SuccessPopup responseMessage={responseMessage} />}
            {errorStatus && <ErrorPopup />}

            <ContainerAll
                url={'/auction/active-auction/'}
                name='/auction/active-auction/'
            >
                {({items, isLoading}) => {
                    return (
                        <>
                            {items?.ads?.length === 0 && !isLoading ? <NoDataUI /> : ""}
                            {isLoading && <PageLoader />}
                            <div className="container section-container">
                                {items?.ads?.length > 0 ? (
                                    <>
                                        <div className="section-head">
                                            <h2 className="section-title" suppressHydrationWarning={true}>
                                                {t("auksion")}
                                            </h2>
                                            <div className="section-wrap">
                                                <Link href="/auction" className="section-link">
                                                {t("all")}
                                                </Link>
                                                <div className="section-arrows">
                                                    <span className="arrow-left" onClick={prevHandler}>
                                                        <Image src={ArrowLeft} width={40} height={40} alt="ico" />
                                                    </span>
                                                    <span className="arrow-right" onClick={nextHandler}>
                                                        <Image src={ArrowRight} width={40} height={40} alt="ico" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Swiper
                                            className="shop-carousel owl-carousel"
                                            spaceBetween={30}
                                            loop={true}
                                            speed={2000}
                                            // slidesPerView={1}
                                            onSwiper={swiper => setSwiperRef(swiper)}
                                            modules={[Autoplay, Pagination]}
                                            autoplay={{
                                                delay: 2500,
                                                disableOnInteraction: false
                                            }}
                                            breakpoints={{
                                                380: {
                                                    slidesPerView: 2,
                                                    spaceBetween: 20
                                                },
                                                640: {
                                                    slidesPerView: 2,
                                                    spaceBetween: 20
                                                },
                                                768: {
                                                    slidesPerView: 2,
                                                    spaceBetween: 20
                                                },
                                                992: {
                                                    slidesPerView: 4,
                                                    spaceBetween: 20
                                                },
                                                1024: {
                                                    slidesPerView: 4,
                                                    spaceBetween: 20
                                                }
                                            }}
                                        >
                                            {(items?.ads || []).map((item, idx) => (
                                                <SwiperSlide key={idx}>
                                                    <AuctionCard item={item} />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </>
                                ): (
                                    <p className='no-active-auction'>{i18n.language == 'uz' ? 'Hozirda faol kim oshdi savdolari mavjud emas.' : 'На данный момент активных аукционов нет.'}</p>
                                )}
                            </div>
                            <AuctionSingleModal setFormSucces={setFormSucces} setResponseMessage={setResponseMessage} setErrorStatus={setErrorStatus} />
                        </>
                    )
                }}
            </ContainerAll>
        </section>
    )
}

export default Auction
