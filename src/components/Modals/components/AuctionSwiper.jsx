import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import ArrowLeft from '@/../../img/icons/arrow-left.svg'
import ArrowRight from '@/../../img/icons/arrow-right.svg'
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from 'swiper/modules';
import {get} from 'lodash'

const AuctionSwiper = ({ data, auctionItemDetailVisible }) => {
    const [swiperRef, setSwiperRef] = useState(null);
    const [key, setKey] = useState(1);
    const swiperReference = useRef(null);

    useEffect(() => {
        if (swiperRef && auctionItemDetailVisible) {
            swiperRef.update();
            setKey(prevKey => prevKey + 1);
        }
    }, [auctionItemDetailVisible])

    const prevHandler = () => {
        swiperRef.slidePrev();
    };
    
    const nextHandler = () => {
        swiperRef.slideNext()
    };

    return (
        <Swiper
            key={key}
            className="auction-popup__images owl-carousel"
            spaceBetween={0}
            loop={true}
            speed={2000}
            slidesPerView={1}
            ref={swiperReference}
            onSwiper={swiper => setSwiperRef(swiper)}
            // afterinit={swiper => setSwiperRef(swiper)}
            modules={[Pagination, Autoplay]}
            autoplay={{
                delay: 2500, 
                disableOnInteraction: true
            }}
            navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }}
        >
            {get(data, 'images', []).map((imgItem, idx) => {
                return (
                    <SwiperSlide style={{width: '100%'}} key={idx}>
                        <Image src={imgItem} width={413} height={309} alt="product" />
                    </SwiperSlide>
                )
            })}
            <div className="section-arrows">
                <span className="arrow-left swiper-button-prev" onClick={prevHandler}>
                    <Image src={ArrowLeft} width={40} height={40} alt="ico" />
                </span>
                <span className="arrow-right swiper-button-next" onClick={nextHandler}>
                    <Image src={ArrowRight} width={40} height={40} alt="ico" />
                </span>
            </div>
        </Swiper>
    )
}

export default AuctionSwiper;
