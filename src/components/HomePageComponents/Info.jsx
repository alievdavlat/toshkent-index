import React, {useState} from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import InfoCard from './InfoCard';
import helpers from '@/services/helpers';
import { Autoplay } from "swiper/modules";
import NoDataUI from '@/components/NoDataUI';
import { useTranslation } from "next-i18next";
import PageLoader from '@/components/PageLoader';
import { ContainerAll } from '@/modules/container';
import { Swiper, SwiperSlide } from "swiper/react";
import ArrowLeft from '@/../../img/icons/arrow-left.svg';
import ArrowRight from '@/../../img/icons/arrow-right.svg';
const InfoItemPreviewModal = dynamic(() => import('@/components/Modals/InfoItemPreviewModal'), { ssr: false });

const Info = () => {
    const [swiperRef, setSwiperRef] = useState(null);
    const {t} = useTranslation('translation');

    const prevHandler = () => {
        swiperRef.slidePrev();
    };
    
    const nextHandler = () => {
        swiperRef.slideNext();
    };

    return (
        <section className='section info'>
            <ContainerAll
                url={'/world/list/'}
                name='/world/list/'
            >
                {({items, isLoading}) => {
                    return (
                        <>
                            {items?.length <= 0 && !isLoading ? <NoDataUI /> : ""}
                            {isLoading && <PageLoader />}
                            {items?.length > 0 && (
                                <>
                                    <div className="container section-container">
                                        <div className="section-head">
                                            <h2 className="section-title">
                                                {t("autoMir")}
                                            </h2>
                                            <div className="section-wrap">
                                                {/* <a href="#" className="section-link">
                                                    Barchasi
                                                </a> */}
                                                <div className="section-arrows">
                                                    <span className="arrow-left" onClick={prevHandler}>
                                                        <Image src={ArrowLeft} width={40} height={40} alt="ico"/>
                                                    </span>
                                                    <span className="arrow-right" onClick={nextHandler}>
                                                        <Image src={ArrowRight} width={40} height={40} alt="ico"/>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="info-carousel owl-carousel info-desktop">
                                            <Swiper
                                                className="info-wrap"
                                                spaceBetween={30}
                                                loop={true}
                                                speed={2000}
                                                slidesPerView={1}
                                                onSwiper={swiper => setSwiperRef(swiper)}
                                                modules={[Autoplay]}
                                                autoplay={{
                                                    delay: 2500,
                                                    disableOnInteraction: false
                                                }}
                                            >
                                                {helpers.chunk((items || []), 0, 4).map((item, idx) => (
                                                    <SwiperSlide key={idx}>
                                                        <InfoCard item={item} />
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        </div>
                                    </div>
                                </>
                            )}
                            <InfoItemPreviewModal />
                        </>
                    )
                }}
            </ContainerAll>
        </section>
    )
}

export default Info
